import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  ingestionSources,
  rawRecords,
  ingestionRuns,
  signalcoreEvents,
  providerRegistry,
} from "@db/schema-sqlite";
import { eq, desc, and, sql } from "drizzle-orm";
import { getDbFromContext } from "./queries/connection";

// ─── Hash function for content deduplication ───
function cyrb53(str: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

// ─── ArcGIS endpoint resolver ───
const KNOWN_ENDPOINTS: Record<string, string> = {
  raleigh_building_permits:
    "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Building_Permits_Pending/FeatureServer/0/query",
  wake_county_building_permits:
    "https://maps.wake.gov/arcgis/rest/services/Inspections/Building_Permits/MapServer/0/query",
};

function resolveEndpoint(providerId: string): string | null {
  return KNOWN_ENDPOINTS[providerId] || null;
}

// ─── Attribute helpers ───
function getAttr(attrs: Record<string, any>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = attrs[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return String(v);
    }
  }
  return undefined;
}

function msToDate(ms: any): Date | undefined {
  if (typeof ms === "number" && ms > 0) {
    return new Date(ms);
  }
  if (typeof ms === "string") {
    const n = Number(ms);
    if (!isNaN(n) && n > 0) return new Date(n);
  }
  return undefined;
}

// ─── Fetch ArcGIS data ───
async function fetchArcGIS(url: string, limit: number) {
  const params = new URLSearchParams({
    where: "1=1",
    outFields: "*",
    outSR: "4326",
    f: "json",
    resultRecordCount: String(limit),
  });
  const res = await fetch(`${url}?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`ArcGIS HTTP ${res.status}: ${res.statusText}`);
  }
  const data = await res.json();
  if (data.error) {
    throw new Error(`ArcGIS Error ${data.error.code}: ${data.error.message}`);
  }
  return data;
}

export const ingestionRouter = createRouter({
  // ─── List ingestion sources ───
  list: publicQuery
    .input(
      z
        .object({
          sourceType: z.string().optional(),
          jurisdictionLevel: z.string().optional(),
          isActive: z.boolean().optional(),
          status: z.enum(["healthy", "degraded", "error", "all"]).optional().default("all"),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDbFromContext(ctx.env);
      const conditions = [];
      if (input?.sourceType) conditions.push(eq(ingestionSources.sourceType, input.sourceType));
      if (input?.jurisdictionLevel) conditions.push(eq(ingestionSources.jurisdictionLevel, input.jurisdictionLevel));
      if (input?.isActive !== undefined) conditions.push(eq(ingestionSources.isActive, input.isActive));
      if (input?.status && input.status !== "all") conditions.push(eq(ingestionSources.status, input.status));

      const results = await db
        .select()
        .from(ingestionSources)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(ingestionSources.createdAt))
        .limit(100);

      return { sources: results };
    }),

  // ─── Fetch raw data from ArcGIS ───
  fetch: publicQuery
    .input(
      z.object({
        providerId: z.string().default("raleigh_building_permits"),
        limit: z.number().min(1).max(500).default(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDbFromContext(ctx.env);
      const overallStart = Date.now();
      let runId: number | undefined;
      let recordsObserved = 0;
      let recordsCreated = 0;

      try {
        const endpoint = resolveEndpoint(input.providerId);
        if (!endpoint) {
          throw new Error(`No endpoint configured for providerId: ${input.providerId}`);
        }

        // Create ingestion run
        const now = new Date();
        const runResult = await db
          .insert(ingestionRuns)
          .values({
            providerId: input.providerId,
            startedAt: now,
            status: "running",
            triggerType: "manual",
          })
          .returning();
        runId = runResult[0]?.id;

        // Fetch from ArcGIS
        const fetchStart = Date.now();
        const data = await fetchArcGIS(endpoint, input.limit);
        const fetchLatency = Date.now() - fetchStart;
        const features = data.features || [];
        recordsObserved = features.length;

        // Parse and store raw records
        const parseStart = Date.now();
        for (const feature of features) {
          const attrs = feature.attributes || {};
          const rawPayload = JSON.stringify(attrs);
          const contentHash = cyrb53(rawPayload);

          const rawTitle =
            getAttr(attrs, "workclass", "permitclass", "type", "permit_type") ||
            `Permit ${getAttr(attrs, "permitnum", "permitnumber", "id", "objectid") || "unknown"}`;
          const rawDescription = getAttr(attrs, "proposedworkdescription", "description", "workdescription", "comments");
          const rawLocation = getAttr(attrs, "siteaddress", "address", "fulladdress", "location");
          const rawStatus = getAttr(attrs, "status", "permitstatus", "permit_status");
          const rawDates = JSON.stringify({
            applied: getAttr(attrs, "applieddate", "applied_date", "dateapplied"),
            issued: getAttr(attrs, "issueddate", "issued_date", "dateissued"),
            completed: getAttr(attrs, "completeddate", "completed_date", "datecompleted"),
            expires: getAttr(attrs, "expirationdate", "expiration_date", "expires"),
          });

          // Check for duplicates
          const existing = await db
            .select()
            .from(rawRecords)
            .where(
              and(
                eq(rawRecords.providerId, input.providerId),
                eq(rawRecords.rawPayload, rawPayload)
              )
            )
            .limit(1);
          if (existing.length > 0) {
            await db
              .update(rawRecords)
              .set({ observedAt: now })
              .where(eq(rawRecords.id, existing[0].id));
            continue;
          }

          let rawMetadata: string | undefined;
          if (feature.geometry) {
            rawMetadata = JSON.stringify({ geometry: feature.geometry });
          }

          const sourceRecordId =
            getAttr(attrs, "permitnum", "permitnumber", "id", "objectid") ||
            String(attrs["OBJECTID"] || attrs["objectid"] || "");

          await db.insert(rawRecords).values({
            providerId: input.providerId,
            sourceRecordId,
            sourceUrl: endpoint,
            observedAt: now,
            ingestedAt: now,
            rawPayload,
            rawTitle,
            rawDescription,
            rawLocation,
            rawStatus,
            rawDates,
            rawMetadata,
            ingestionRunId: runId,
            provenance: "LIVE",
          });
          recordsCreated++;
        }
        const parseLatency = Date.now() - parseStart;
        const totalLatency = Date.now() - overallStart;

        // Update run as completed
        await db
          .update(ingestionRuns)
          .set({
            status: "completed",
            completedAt: now,
            recordsObserved,
            recordsCreated,
            fetchLatencyMs: fetchLatency,
            parseLatencyMs: parseLatency,
            totalLatencyMs: totalLatency,
            sourceRecordCount: recordsObserved,
          })
          .where(eq(ingestionRuns.id, runId));

        return { success: true, runId, recordsObserved, recordsCreated };
      } catch (err: any) {
        const errorMsg = err?.message || String(err);
        if (runId) {
          await db
            .update(ingestionRuns)
            .set({
              status: "failed",
              completedAt: new Date(),
              recordsObserved,
              recordsCreated,
              error: errorMsg,
              errorCode: "FETCH_ERROR",
              totalLatencyMs: Date.now() - overallStart,
            })
            .where(eq(ingestionRuns.id, runId));
        }
        return { success: false, runId: runId || 0, recordsObserved, recordsCreated, error: errorMsg };
      }
    }),

  // ─── Normalize raw records to signalcore_events ───
  normalize: publicQuery
    .input(
      z.object({
        runId: z.number(),
        providerId: z.string().default("raleigh_building_permits"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDbFromContext(ctx.env);
      const normalizeStart = Date.now();
      let recordsNormalized = 0;
      let recordsSkipped = 0;

      try {
        // Get raw records for this run
        const rows = await db
          .select()
          .from(rawRecords)
          .where(
            and(
              eq(rawRecords.ingestionRunId, input.runId),
              eq(rawRecords.providerId, input.providerId),
              eq(rawRecords.isDeleted, false)
            )
          );

        // Get provider name
        const providers = await db
          .select()
          .from(providerRegistry)
          .where(
            sql`${providerRegistry.providerId} = ${input.providerId} OR ${providerRegistry.providerName} = ${input.providerId}`
          )
          .limit(1);
        const providerName = providers[0]?.providerName || input.providerId;

        for (const row of rows) {
          if (!row.rawPayload) continue;
          const attrs = JSON.parse(row.rawPayload);
          const rawPayload = row.rawPayload;
          const hash = cyrb53(rawPayload);

          // Check for duplicate
          const dupCheck = await db
            .select()
            .from(signalcoreEvents)
            .where(eq(signalcoreEvents.contentHash, hash))
            .limit(1);
          if (dupCheck.length > 0) {
            recordsSkipped++;
            continue;
          }

          const workClass = getAttr(attrs, "workclass", "permitclass", "type", "permit_type");
          const workDesc = getAttr(attrs, "proposedworkdescription", "description", "workdescription", "comments");
          const title =
            row.rawTitle ||
            (workClass && workDesc
              ? `${workClass}: ${workDesc}`
              : workClass || workDesc || "Building Permit");
          const description = row.rawDescription || workDesc || "";

          const address = row.rawLocation || getAttr(attrs, "siteaddress", "address", "fulladdress", "location") || "";
          let lat: string | null = null;
          let lng: string | null = null;

          if (row.rawMetadata) {
            try {
              const meta = JSON.parse(row.rawMetadata);
              if (meta.geometry?.y) lat = String(meta.geometry.y);
              if (meta.geometry?.x) lng = String(meta.geometry.x);
            } catch {
              // ignore
            }
          }
          if (!lat) lat = getAttr(attrs, "latitude", "lat", "y") || null;
          if (!lng) lng = getAttr(attrs, "longitude", "lng", "long", "x") || null;

          const appliedDateMs = attrs["applieddate"] || attrs["applied_date"] || attrs["dateapplied"];
          const publishedAt = msToDate(appliedDateMs);

          let city = getAttr(attrs, "city", "sitecity", "jurisdiction");
          if (!city && address) {
            const match = address.match(/,\s*([A-Za-z\s]+),?\s*(?:NC|North Carolina)?/i);
            if (match) city = match[1].trim();
          }
          if (!city) city = "Raleigh";

          const county = getAttr(attrs, "county", "sitecounty") || "Wake";
          const state = getAttr(attrs, "state", "sitestate") || "NC";
          const zipCode = getAttr(attrs, "zip", "zipcode", "postalcode", "sitezip") || null;

          await db.insert(signalcoreEvents).values({
            providerId: row.providerId,
            externalId: row.sourceRecordId || null,
            eventType: "building_permit",
            title,
            description,
            county,
            state,
            city,
            zipCode,
            lat,
            lng,
            address,
            publishedAt,
            ingestedAt: new Date(),
            confidence: 70,
            status: "active",
            contentHash: hash,
            rawData: rawPayload,
            dataSource: providerName,
            provenance: "LIVE",
          });
          recordsNormalized++;
        }

        // Update run
        await db
          .update(ingestionRuns)
          .set({
            recordsResolved: recordsNormalized,
            resolveLatencyMs: Date.now() - normalizeStart,
          })
          .where(eq(ingestionRuns.id, input.runId));

        return { success: true, recordsNormalized, recordsSkipped };
      } catch (err: any) {
        return {
          success: false,
          recordsNormalized,
          recordsSkipped,
          error: err?.message || String(err),
        };
      }
    }),

  // ─── Combined fetch + normalize ───
  run: publicQuery
    .input(
      z.object({
        providerId: z.string().default("raleigh_building_permits"),
        limit: z.number().min(1).max(500).default(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDbFromContext(ctx.env);
      const overallStart = Date.now();
      let runId: number | undefined;
      let recordsObserved = 0;
      let recordsCreated = 0;
      let recordsNormalized = 0;
      let recordsSkipped = 0;

      try {
        // FETCH PHASE
        const endpoint = resolveEndpoint(input.providerId);
        if (!endpoint) {
          throw new Error(`No endpoint configured for providerId: ${input.providerId}`);
        }

        const now = new Date();
        const runResult = await db
          .insert(ingestionRuns)
          .values({
            providerId: input.providerId,
            startedAt: now,
            status: "running",
            triggerType: "manual",
          })
          .returning();
        runId = runResult[0]?.id;

        const fetchStart = Date.now();
        const data = await fetchArcGIS(endpoint, input.limit);
        const fetchLatency = Date.now() - fetchStart;
        const features = data.features || [];
        recordsObserved = features.length;

        const parseStart = Date.now();
        for (const feature of features) {
          const attrs = feature.attributes || {};
          const rawPayload = JSON.stringify(attrs);
          const contentHash = cyrb53(rawPayload);

          const rawTitle =
            getAttr(attrs, "workclass", "permitclass", "type", "permit_type") ||
            `Permit ${getAttr(attrs, "permitnum", "permitnumber", "id", "objectid") || "unknown"}`;
          const rawDescription = getAttr(attrs, "proposedworkdescription", "description", "workdescription", "comments");
          const rawLocation = getAttr(attrs, "siteaddress", "address", "fulladdress", "location");
          const rawStatus = getAttr(attrs, "status", "permitstatus", "permit_status");
          const rawDates = JSON.stringify({
            applied: getAttr(attrs, "applieddate", "applied_date", "dateapplied"),
            issued: getAttr(attrs, "issueddate", "issued_date", "dateissued"),
            completed: getAttr(attrs, "completeddate", "completed_date", "datecompleted"),
            expires: getAttr(attrs, "expirationdate", "expiration_date", "expires"),
          });

          const existing = await db
            .select()
            .from(rawRecords)
            .where(
              and(
                eq(rawRecords.providerId, input.providerId),
                eq(rawRecords.rawPayload, rawPayload)
              )
            )
            .limit(1);
          if (existing.length > 0) {
            await db
              .update(rawRecords)
              .set({ observedAt: now })
              .where(eq(rawRecords.id, existing[0].id));
            continue;
          }

          let rawMetadata: string | undefined;
          if (feature.geometry) {
            rawMetadata = JSON.stringify({ geometry: feature.geometry });
          }

          const sourceRecordId =
            getAttr(attrs, "permitnum", "permitnumber", "id", "objectid") ||
            String(attrs["OBJECTID"] || attrs["objectid"] || "");

          await db.insert(rawRecords).values({
            providerId: input.providerId,
            sourceRecordId,
            sourceUrl: endpoint,
            observedAt: now,
            ingestedAt: now,
            rawPayload,
            rawTitle,
            rawDescription,
            rawLocation,
            rawStatus,
            rawDates,
            rawMetadata,
            ingestionRunId: runId,
            provenance: "LIVE",
          });
          recordsCreated++;
        }
        const parseLatency = Date.now() - parseStart;

        // NORMALIZE PHASE
        const normalizeStart = Date.now();
        const rawRows = await db
          .select()
          .from(rawRecords)
          .where(
            and(
              eq(rawRecords.ingestionRunId, runId),
              eq(rawRecords.providerId, input.providerId),
              eq(rawRecords.isDeleted, false)
            )
          );

        const providers = await db
          .select()
          .from(providerRegistry)
          .where(
            sql`${providerRegistry.providerId} = ${input.providerId} OR ${providerRegistry.providerName} = ${input.providerId}`
          )
          .limit(1);
        const providerName = providers[0]?.providerName || input.providerId;

        for (const row of rawRows) {
          if (!row.rawPayload) continue;
          const attrs = JSON.parse(row.rawPayload);
          const rawPayload = row.rawPayload;
          const hash = cyrb53(rawPayload);

          const dupCheck = await db
            .select()
            .from(signalcoreEvents)
            .where(eq(signalcoreEvents.contentHash, hash))
            .limit(1);
          if (dupCheck.length > 0) {
            recordsSkipped++;
            continue;
          }

          const workClass = getAttr(attrs, "workclass", "permitclass", "type", "permit_type");
          const workDesc = getAttr(attrs, "proposedworkdescription", "description", "workdescription", "comments");
          const title =
            row.rawTitle ||
            (workClass && workDesc
              ? `${workClass}: ${workDesc}`
              : workClass || workDesc || "Building Permit");
          const description = row.rawDescription || workDesc || "";

          const address = row.rawLocation || getAttr(attrs, "siteaddress", "address", "fulladdress", "location") || "";
          let lat: string | null = null;
          let lng: string | null = null;

          if (row.rawMetadata) {
            try {
              const meta = JSON.parse(row.rawMetadata);
              if (meta.geometry?.y) lat = String(meta.geometry.y);
              if (meta.geometry?.x) lng = String(meta.geometry.x);
            } catch {
              // ignore
            }
          }
          if (!lat) lat = getAttr(attrs, "latitude", "lat", "y") || null;
          if (!lng) lng = getAttr(attrs, "longitude", "lng", "long", "x") || null;

          const appliedDateMs = attrs["applieddate"] || attrs["applied_date"] || attrs["dateapplied"];
          const publishedAt = msToDate(appliedDateMs);

          let city = getAttr(attrs, "city", "sitecity", "jurisdiction");
          if (!city && address) {
            const match = address.match(/,\s*([A-Za-z\s]+),?\s*(?:NC|North Carolina)?/i);
            if (match) city = match[1].trim();
          }
          if (!city) city = "Raleigh";

          const county = getAttr(attrs, "county", "sitecounty") || "Wake";
          const state = getAttr(attrs, "state", "sitestate") || "NC";
          const zipCode = getAttr(attrs, "zip", "zipcode", "postalcode", "sitezip") || null;

          await db.insert(signalcoreEvents).values({
            providerId: row.providerId,
            externalId: row.sourceRecordId || null,
            eventType: "building_permit",
            title,
            description,
            county,
            state,
            city,
            zipCode,
            lat,
            lng,
            address,
            publishedAt,
            ingestedAt: new Date(),
            confidence: 70,
            status: "active",
            contentHash: hash,
            rawData: rawPayload,
            dataSource: providerName,
            provenance: "LIVE",
          });
          recordsNormalized++;
        }
        const resolveLatency = Date.now() - normalizeStart;
        const totalLatency = Date.now() - overallStart;

        // Update run
        await db
          .update(ingestionRuns)
          .set({
            status: "completed",
            completedAt: now,
            recordsObserved,
            recordsCreated,
            recordsResolved: recordsNormalized,
            fetchLatencyMs: fetchLatency,
            parseLatencyMs: parseLatency,
            resolveLatencyMs: resolveLatency,
            totalLatencyMs: totalLatency,
            sourceRecordCount: recordsObserved,
          })
          .where(eq(ingestionRuns.id, runId));

        return {
          success: true,
          runId,
          recordsObserved,
          recordsCreated,
          recordsNormalized,
          recordsSkipped,
          totalLatencyMs: totalLatency,
        };
      } catch (err: any) {
        const fetchError = err?.message || String(err);
        if (runId) {
          await db
            .update(ingestionRuns)
            .set({
              status: "failed",
              completedAt: new Date(),
              recordsObserved,
              recordsCreated,
              recordsResolved: recordsNormalized,
              error: fetchError,
              errorCode: "RUN_ERROR",
              totalLatencyMs: Date.now() - overallStart,
            })
            .where(eq(ingestionRuns.id, runId));
        }
        return {
          success: false,
          runId: runId || 0,
          recordsObserved,
          recordsCreated,
          recordsNormalized,
          recordsSkipped,
          error: fetchError,
        };
      }
    }),

  // ─── Get ingestion status ───
  status: publicQuery
    .input(
      z
        .object({
          runId: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDbFromContext(ctx.env);

      if (input?.runId) {
        const runs = await db
          .select()
          .from(ingestionRuns)
          .where(eq(ingestionRuns.id, input.runId))
          .limit(1);
        if (runs.length === 0) {
          return { found: false, run: null };
        }
        return { found: true, run: runs[0] };
      }

      // Return latest runs summary
      const latestRuns = await db
        .select()
        .from(ingestionRuns)
        .orderBy(desc(ingestionRuns.startedAt))
        .limit(20);

      const totalRuns = latestRuns.length;
      const completed = latestRuns.filter((r) => r.status === "completed").length;
      const failed = latestRuns.filter((r) => r.status === "failed").length;
      const running = latestRuns.filter((r) => r.status === "running").length;
      const totalObserved = latestRuns.reduce((sum, r) => sum + (r.recordsObserved || 0), 0);
      const totalCreated = latestRuns.reduce((sum, r) => sum + (r.recordsCreated || 0), 0);
      const totalResolved = latestRuns.reduce((sum, r) => sum + (r.recordsResolved || 0), 0);

      return {
        summary: { totalRuns, completed, failed, running, totalObserved, totalCreated, totalResolved },
        latestRuns,
      };
    }),
});
