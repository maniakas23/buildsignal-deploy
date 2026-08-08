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
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
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

function resolveEndpoint(provider: typeof providerRegistry.$inferSelect | undefined, providerId: string): string | null {
  if (provider?.apiEndpoint) return provider.apiEndpoint;
  return KNOWN_ENDPOINTS[providerId] || null;
}

// ─── ArcGIS fetch helper ───
interface ArcGISFeature {
  attributes: Record<string, unknown>;
  geometry?: { x?: number; y?: number } | null;
}

interface ArcGISResponse {
  features?: ArcGISFeature[];
  exceededTransferLimit?: boolean;
  error?: { message?: string; code?: number };
}

async function fetchArcGIS(url: string, limit: number): Promise<ArcGISResponse> {
  const params = new URLSearchParams({
    where: "1=1",
    outFields: "*",
    outSR: "4326",
    f: "json",
    resultRecordCount: String(limit),
  });
  const fetchStart = Date.now();
  const res = await fetch(`${url}?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`ArcGIS HTTP ${res.status}: ${res.statusText}`);
  }
  const data = (await res.json()) as ArcGISResponse;
  if (data.error) {
    throw new Error(`ArcGIS Error ${data.error.code}: ${data.error.message}`);
  }
  return data;
}

// ─── Attribute helpers ───
function getAttr(attrs: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = attrs[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return String(v);
    }
  }
  return undefined;
}

function msToDate(ms: unknown): Date | undefined {
  if (typeof ms === "number" && ms > 0) {
    return new Date(ms);
  }
  if (typeof ms === "string") {
    const n = Number(ms);
    if (!isNaN(n) && n > 0) return new Date(n);
  }
  return undefined;
}

function msToSeconds(ms: unknown): number | undefined {
  const d = msToDate(ms);
  return d ? Math.floor(d.getTime() / 1000) : undefined;
}

// ─── Ingestion Router ───
export const ingestionRouter = createRouter({
  // ─── Existing endpoints ───
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
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const rows = await db.select().from(ingestionSources).where(where).orderBy(desc(ingestionSources.updatedAt));
      let filtered = rows;
      if (input?.status && input.status !== "all") {
        filtered = rows.filter((r: any) => {
          if (input.status === "healthy") return (r.healthScore || 0) >= 80;
          if (input.status === "degraded") return (r.healthScore || 0) >= 40 && (r.healthScore || 0) < 80;
          if (input.status === "error") return (r.healthScore || 0) < 40;
          return true;
        });
      }
      return { sources: filtered, total: filtered.length };
    }),

  getById: publicQuery.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const db = getDbFromContext(ctx.env);
    const rows = await db.select().from(ingestionSources).where(eq(ingestionSources.id, input.id));
    return rows[0] || null;
  }),

  register: publicQuery
    .input(
      z.object({
        sourceName: z.string().min(1),
        sourceType: z.enum([
          "building_permits",
          "planning_agendas",
          "rezoning",
          "dot_projects",
          "utilities",
          "capital_improvement",
          "economic_dev",
          "government_spending",
          "public_meetings",
          "school_construction",
          "environmental_notices",
          "federal_infrastructure",
        ]),
        jurisdictionLevel: z.enum(["federal", "state", "county", "city", "utility_district"]).default("county"),
        coverageArea: z.string(),
        endpointUrl: z.string().optional(),
        importMethod: z.enum(["api", "webhook", "scraper", "manual", "ftp", "sftp", "email"]).default("api"),
        authType: z.enum(["none", "api_key", "oauth2", "basic_auth", "custom"]).default("none"),
        schedule: z.enum(["realtime", "hourly", "daily", "weekly", "monthly"]).default("daily"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDbFromContext(ctx.env);
      const result = await db
        .insert(ingestionSources)
        .values({ ...input, healthScore: 100, isActive: true })
        .returning();
      return { success: true, source: result[0] };
    }),

  updateHealth: publicQuery
    .input(
      z.object({
        id: z.number(),
        healthScore: z.number().min(0).max(100),
        recordsLast30Days: z.number().optional(),
        avgLatencyMs: z.number().optional(),
        errorCount30d: z.number().optional(),
        lastSyncAt: z.string().optional(),
        nextSyncAt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDbFromContext(ctx.env);
      const { id, ...data } = input;
      await db
        .update(ingestionSources)
        .set({
          ...data,
          lastSyncAt: data.lastSyncAt ? new Date(data.lastSyncAt) : undefined,
          nextSyncAt: data.nextSyncAt ? new Date(data.nextSyncAt) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(ingestionSources.id, id));
      return { success: true };
    }),

  toggleActive: publicQuery
    .input(z.object({ id: z.number(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDbFromContext(ctx.env);
      await db
        .update(ingestionSources)
        .set({ isActive: input.isActive, updatedAt: new Date() })
        .where(eq(ingestionSources.id, input.id));
      return { success: true };
    }),

  stats: publicQuery.query(async ({ ctx }) => {
    const db = getDbFromContext(ctx.env);
    const all = await db.select().from(ingestionSources);
    const active = all.filter((s: any) => s.isActive);
    const healthy = active.filter((s: any) => (s.healthScore || 0) >= 80);
    const degraded = active.filter((s: any) => {
      const h = s.healthScore || 0;
      return h >= 40 && h < 80;
    });
    const error = active.filter((s: any) => (s.healthScore || 0) < 40);
    const totalRecords30d = active.reduce((sum: number, s: any) => sum + (s.recordsLast30Days || 0), 0);
    const avgHealth =
      active.length > 0
        ? Math.round(active.reduce((sum: number, s: any) => sum + (s.healthScore || 0), 0) / active.length)
        : 0;
    const typeMap = new Map(),
      scheduleMap = new Map();
    for (const s of active) {
      typeMap.set(s.sourceType, (typeMap.get(s.sourceType) || 0) + 1);
      scheduleMap.set(s.schedule, (scheduleMap.get(s.schedule) || 0) + 1);
    }
    return {
      totalSources: all.length,
      activeSources: active.length,
      healthySources: healthy.length,
      degradedSources: degraded.length,
      errorSources: error.length,
      totalRecords30d,
      avgHealthScore: avgHealth,
      byType: Array.from(typeMap.entries()).map(([t, c]) => ({ type: t, count: c })),
      bySchedule: Array.from(scheduleMap.entries()).map(([s, c]) => ({ schedule: s, count: c })),
    };
  }),

  sourceTypes: publicQuery.query(() => ({
    types: [
      { id: "building_permits", label: "Building Permits", category: "permits" },
      { id: "planning_agendas", label: "Planning Agendas", category: "planning" },
      { id: "rezoning", label: "Rezoning", category: "zoning" },
      { id: "dot_projects", label: "DOT Projects", category: "transportation" },
      { id: "utilities", label: "Utilities", category: "infrastructure" },
      { id: "capital_improvement", label: "Capital Improvement Plans", category: "planning" },
      { id: "economic_dev", label: "Economic Development", category: "economic" },
      { id: "government_spending", label: "Government Spending", category: "financial" },
      { id: "public_meetings", label: "Public Meetings", category: "governance" },
      { id: "school_construction", label: "School Construction", category: "education" },
      { id: "environmental_notices", label: "Environmental Notices", category: "environmental" },
      { id: "federal_infrastructure", label: "Federal Infrastructure Programs", category: "federal" },
    ],
  })),

  // ─── NEW: ingestion.fetch ───
  fetch: publicQuery
    .input(
      z.object({
        providerId: z.string(),
        limit: z.number().min(1).max(500).optional().default(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDbFromContext(ctx.env);
      const overallStart = Date.now();
      let runId: number | undefined;
      let recordsObserved = 0;
      let recordsCreated = 0;
      let errorMsg: string | undefined;

      try {
        // 1. Look up provider
        const providers = await db
          .select()
          .from(providerRegistry)
          .where(eq(providerRegistry.providerName, input.providerId));
        const provider = providers[0];

        // 2. Resolve endpoint
        const endpoint = resolveEndpoint(provider, input.providerId);
        if (!endpoint) {
          throw new Error(`No endpoint configured for providerId: ${input.providerId}`);
        }

        // 3. Create ingestion run record
        const [run] = await db
          .insert(ingestionRuns)
          .values({
            providerId: input.providerId,
            status: "running",
            triggerType: "manual",
          })
          .returning();
        runId = run.id;

        // 4. Fetch from ArcGIS
        const fetchStart = Date.now();
        const data = await fetchArcGIS(endpoint, input.limit);
        const fetchLatency = Date.now() - fetchStart;
        const features = data.features || [];
        recordsObserved = features.length;

        // 5. Parse and store raw records
        const parseStart = Date.now();
        for (const feature of features) {
          const attrs = feature.attributes || {};
          const rawPayload = JSON.stringify(attrs);
          const contentHash = cyrb53(rawPayload);

          // Extract key fields for indexing
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

          // Check for duplicates by contentHash + providerId
          const existing = await db
            .select()
            .from(rawRecords)
            .where(
              and(
                eq(rawRecords.providerId, input.providerId),
                sql`${rawRecords.rawPayload} = ${rawPayload}`
              )
            )
            .limit(1);

          if (existing.length > 0) {
            // Duplicate found — update observedAt but don't create new record
            await db
              .update(rawRecords)
              .set({ observedAt: new Date() })
              .where(eq(rawRecords.id, existing[0].id));
            continue;
          }

          // Extract geometry if available
          let rawMetadata: string | undefined;
          if (feature.geometry) {
            rawMetadata = JSON.stringify({ geometry: feature.geometry });
          }

          const sourceRecordId = getAttr(attrs, "permitnum", "permitnumber", "id", "objectid") || String(attrs["OBJECTID"] || attrs["objectid"] || "");

          await db.insert(rawRecords).values({
            providerId: input.providerId,
            sourceRecordId,
            sourceUrl: endpoint,
            observedAt: new Date(),
            ingestedAt: new Date(),
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

        // 6. Update ingestion run as completed
        await db
          .update(ingestionRuns)
          .set({
            status: "completed",
            completedAt: new Date(),
            recordsObserved,
            recordsCreated,
            fetchLatencyMs: fetchLatency,
            parseLatencyMs: parseLatency,
            totalLatencyMs: totalLatency,
            sourceRecordCount: recordsObserved,
          })
          .where(eq(ingestionRuns.id, runId));

        return {
          success: true,
          runId,
          recordsObserved,
          recordsCreated,
        };
      } catch (err: any) {
        errorMsg = err?.message || String(err);
        if (runId) {
          await db
            .update(ingestionRuns)
            .set({
              status: "failed",
              completedAt: new Date(),
              recordsObserved,
              recordsCreated,
              error: errorMsg,
              errorCode: err?.code || "FETCH_ERROR",
              totalLatencyMs: Date.now() - overallStart,
            })
            .where(eq(ingestionRuns.id, runId));
        }
        return {
          success: false,
          runId: runId ?? 0,
          recordsObserved,
          recordsCreated,
          error: errorMsg,
        };
      }
    }),

  // ─── NEW: ingestion.normalize ───
  normalize: publicQuery
    .input(
      z.object({
        runId: z.number(),
        providerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDbFromContext(ctx.env);
      const normalizeStart = Date.now();
      let recordsNormalized = 0;
      let recordsSkipped = 0;

      try {
        // 1. Get raw records for this run
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

        // 2. Get provider info for dataSource name
        const providers = await db
          .select()
          .from(providerRegistry)
          .where(eq(providerRegistry.providerName, input.providerId));
        const providerName = providers[0]?.providerName || input.providerId;

        for (const row of rows) {
          if (!row.rawPayload) continue;

          const attrs: Record<string, unknown> = JSON.parse(row.rawPayload);
          const rawPayload = row.rawPayload;
          const contentHash = cyrb53(rawPayload);

          // Check for duplicate by contentHash
          const dupCheck = await db
            .select()
            .from(signalcoreEvents)
            .where(eq(signalcoreEvents.contentHash, contentHash))
            .limit(1);
          if (dupCheck.length > 0) {
            recordsSkipped++;
            continue;
          }

          // Derive fields
          const workClass = getAttr(attrs, "workclass", "permitclass", "type", "permit_type");
          const workDesc = getAttr(attrs, "proposedworkdescription", "description", "workdescription", "comments");
          const title = row.rawTitle || (workClass && workDesc ? `${workClass}: ${workDesc}` : workClass || workDesc || "Building Permit");
          const description = row.rawDescription || workDesc || "";

          // Location
          const address = row.rawLocation || getAttr(attrs, "siteaddress", "address", "fulladdress", "location") || "";
          let lat: string | undefined;
          let lng: string | undefined;

          // Try geometry first
          if (row.rawMetadata) {
            try {
              const meta = JSON.parse(row.rawMetadata);
              if (meta.geometry?.y) lat = String(meta.geometry.y);
              if (meta.geometry?.x) lng = String(meta.geometry.x);
            } catch {
              // ignore
            }
          }

          // Fallback to lat/lng attributes
          if (!lat) lat = getAttr(attrs, "latitude", "lat", "y");
          if (!lng) lng = getAttr(attrs, "longitude", "lng", "long", "x");

          // Dates
          const appliedDateMs = attrs["applieddate"] || attrs["applied_date"] || attrs["dateapplied"];
          const publishedAt = msToDate(appliedDateMs);

          // City extraction from address or attributes
          let city = getAttr(attrs, "city", "sitecity", "jurisdiction");
          if (!city && address) {
            const match = address.match(/,\s*([A-Za-z\s]+),?\s*(?:NC|North Carolina)?/i);
            if (match) city = match[1].trim();
          }
          if (!city) city = "Raleigh";

          const county = getAttr(attrs, "county", "sitecounty") || "Wake";
          const state = getAttr(attrs, "state", "sitestate") || "NC";
          const zipCode = getAttr(attrs, "zip", "zipcode", "postalcode", "sitezip");

          await db.insert(signalcoreEvents).values({
            providerId: Number(providers[0]?.id) || 0,
            externalId: row.sourceRecordId || undefined,
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
            contentHash,
            rawData: rawPayload,
            dataSource: providerName,
            provenance: "LIVE",
          });
          recordsNormalized++;
        }

        // Update ingestion run
        await db
          .update(ingestionRuns)
          .set({
            recordsResolved: recordsNormalized,
            resolveLatencyMs: Date.now() - normalizeStart,
          })
          .where(eq(ingestionRuns.id, input.runId));

        return {
          success: true,
          recordsNormalized,
          recordsSkipped,
        };
      } catch (err: any) {
        return {
          success: false,
          recordsNormalized,
          recordsSkipped,
          error: err?.message || String(err),
        };
      }
    }),

  // ─── NEW: ingestion.run ───
  run: publicQuery
    .input(
      z.object({
        providerId: z.string(),
        limit: z.number().min(1).max(500).optional().default(50),
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
      let fetchError: string | undefined;

      try {
        // ── FETCH PHASE ──
        const providers = await db
          .select()
          .from(providerRegistry)
          .where(eq(providerRegistry.providerName, input.providerId));
        const provider = providers[0];
        const endpoint = resolveEndpoint(provider, input.providerId);
        if (!endpoint) {
          throw new Error(`No endpoint configured for providerId: ${input.providerId}`);
        }

        const [run] = await db
          .insert(ingestionRuns)
          .values({
            providerId: input.providerId,
            status: "running",
            triggerType: "manual",
          })
          .returning();
        runId = run.id;

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
                sql`${rawRecords.rawPayload} = ${rawPayload}`
              )
            )
            .limit(1);

          if (existing.length > 0) {
            await db
              .update(rawRecords)
              .set({ observedAt: new Date() })
              .where(eq(rawRecords.id, existing[0].id));
            continue;
          }

          let rawMetadata: string | undefined;
          if (feature.geometry) {
            rawMetadata = JSON.stringify({ geometry: feature.geometry });
          }

          const sourceRecordId = getAttr(attrs, "permitnum", "permitnumber", "id", "objectid") || String(attrs["OBJECTID"] || attrs["objectid"] || "");

          await db.insert(rawRecords).values({
            providerId: input.providerId,
            sourceRecordId,
            sourceUrl: endpoint,
            observedAt: new Date(),
            ingestedAt: new Date(),
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

        // ── NORMALIZE PHASE ──
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

        const providerName = provider?.providerName || input.providerId;

        for (const row of rawRows) {
          if (!row.rawPayload) continue;
          const attrs: Record<string, unknown> = JSON.parse(row.rawPayload);
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
          const title = row.rawTitle || (workClass && workDesc ? `${workClass}: ${workDesc}` : workClass || workDesc || "Building Permit");
          const description = row.rawDescription || workDesc || "";

          const address = row.rawLocation || getAttr(attrs, "siteaddress", "address", "fulladdress", "location") || "";
          let lat: string | undefined;
          let lng: string | undefined;

          if (row.rawMetadata) {
            try {
              const meta = JSON.parse(row.rawMetadata);
              if (meta.geometry?.y) lat = String(meta.geometry.y);
              if (meta.geometry?.x) lng = String(meta.geometry.x);
            } catch {
              // ignore
            }
          }
          if (!lat) lat = getAttr(attrs, "latitude", "lat", "y");
          if (!lng) lng = getAttr(attrs, "longitude", "lng", "long", "x");

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
          const zipCode = getAttr(attrs, "zip", "zipcode", "postalcode", "sitezip");

          await db.insert(signalcoreEvents).values({
            providerId: Number(provider?.id) || 0,
            externalId: row.sourceRecordId || undefined,
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

        // Update run as completed
        await db
          .update(ingestionRuns)
          .set({
            status: "completed",
            completedAt: new Date(),
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
        fetchError = err?.message || String(err);
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
              errorCode: err?.code || "RUN_ERROR",
              totalLatencyMs: Date.now() - overallStart,
            })
            .where(eq(ingestionRuns.id, runId));
        }
        return {
          success: false,
          runId: runId ?? 0,
          recordsObserved,
          recordsCreated,
          recordsNormalized,
          recordsSkipped,
          error: fetchError,
        };
      }
    }),

  // ─── NEW/EXTENDED: ingestion.status ───
  status: publicQuery
    .input(z.object({ runId: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = getDbFromContext(ctx.env);

      if (input?.runId) {
        const runs = await db
          .select()
          .from(ingestionRuns)
          .where(eq(ingestionRuns.id, input.runId))
          .limit(1);
        const run = runs[0];
        if (!run) return { found: false, run: null };
        return {
          found: true,
          run,
        };
      }

      // Return latest runs summary
      const latestRuns = await db
        .select()
        .from(ingestionRuns)
        .orderBy(desc(ingestionRuns.startedAt))
        .limit(20);

      const totalRuns = latestRuns.length;
      const completed = latestRuns.filter((r: any) => r.status === "completed").length;
      const failed = latestRuns.filter((r: any) => r.status === "failed").length;
      const running = latestRuns.filter((r: any) => r.status === "running").length;
      const totalObserved = latestRuns.reduce((sum: number, r: any) => sum + (r.recordsObserved || 0), 0);
      const totalCreated = latestRuns.reduce((sum: number, r: any) => sum + (r.recordsCreated || 0), 0);
      const totalResolved = latestRuns.reduce((sum: number, r: any) => sum + (r.recordsResolved || 0), 0);

      return {
        summary: {
          totalRuns,
          completed,
          failed,
          running,
          totalObserved,
          totalCreated,
          totalResolved,
        },
        latestRuns,
      };
    }),
});
