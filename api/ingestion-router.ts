import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  ingestionSources,
  rawRecords,
  ingestionRuns,
  kestovarCanonicalEvents,
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

// ─── Canonical ID generator ───
function generateCanonicalId(): string {
  return "kev-" + crypto.randomUUID();
}

// ─── Timestamp normalization helper ───
function toTimestamp(input: unknown): Date | null {
  if (!input) return null;
  if (input instanceof Date) return input;
  if (typeof input === "number") return new Date(input > 1e10 ? input : input * 1000);
  if (typeof input === "string") {
    const n = Number(input);
    if (!isNaN(n)) return new Date(n > 1e10 ? n : n * 1000);
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export const ingestionRouter = createRouter({
  // ── List ingestion sources ─────────────────────────────
  list: publicQuery
    .input(
      z.object({
        sourceType: z.string().optional(),
        jurisdictionLevel: z.string().optional(),
        isActive: z.boolean().optional(),
        status: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDbFromContext();
      const conditions = [];
      if (input?.sourceType) conditions.push(eq(ingestionSources.sourceType, input.sourceType));
      if (input?.jurisdictionLevel) conditions.push(eq(ingestionSources.jurisdictionLevel, input.jurisdictionLevel));
      if (input?.isActive !== undefined) conditions.push(eq(ingestionSources.isActive, input.isActive));
      if (input?.status && input.status !== "all") conditions.push(eq(ingestionSources.status, input.status));

      const sources = await db
        .select()
        .from(ingestionSources)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(ingestionSources.createdAt))
        .all();

      return { sources, total: sources.length };
    }),

  // ── Get a single ingestion source ──────────────────────
  get: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDbFromContext();
      const source = await db
        .select()
        .from(ingestionSources)
        .where(eq(ingestionSources.id, input.id))
        .get();
      if (!source) throw new Error("Source not found");
      return source;
    }),

  // ── Create a new ingestion source ──────────────────────
  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        sourceType: z.string().min(1),
        endpointUrl: z.string().url().optional(),
        apiKey: z.string().optional(),
        config: z.string().optional(),
        schedule: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDbFromContext();
      const result = await db
        .insert(ingestionSources)
        .values({
          ...input,
          status: "active",
          healthStatus: "healthy",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return result[0];
    }),

  // ── Update an ingestion source ─────────────────────────
  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        sourceType: z.string().optional(),
        endpointUrl: z.string().url().optional(),
        apiKey: z.string().optional(),
        config: z.string().optional(),
        schedule: z.string().optional(),
        status: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDbFromContext();
      const { id, ...updates } = input;
      const result = await db
        .update(ingestionSources)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(ingestionSources.id, id))
        .returning();
      return result[0];
    }),

  // ── Delete an ingestion source ─────────────────────────
  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDbFromContext();
      await db.delete(ingestionSources).where(eq(ingestionSources.id, input.id));
      return { success: true };
    }),

  // ── Toggle ingestion source active state ───────────────
  toggle: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDbFromContext();
      const source = await db
        .select()
        .from(ingestionSources)
        .where(eq(ingestionSources.id, input.id))
        .get();
      if (!source) throw new Error("Source not found");
      const result = await db
        .update(ingestionSources)
        .set({ isActive: !source.isActive, updatedAt: new Date() })
        .where(eq(ingestionSources.id, input.id))
        .returning();
      return result[0];
    }),

  // ── Normalize raw records to canonical events ──────────
  normalize: publicQuery
    .input(
      z.object({
        runId: z.number(),
        providerId: z.string(),
        records: z.array(
          z.object({
            sourceRecordId: z.string().optional(),
            sourceUrl: z.string().optional(),
            eventType: z.string().optional(),
            title: z.string().optional(),
            description: z.string().optional(),
            permitType: z.string().optional(),
            permitClass: z.string().optional(),
            workClass: z.string().optional(),
            county: z.string().optional(),
            state: z.string().optional(),
            city: z.string().optional(),
            zipCode: z.string().optional(),
            address: z.string().optional(),
            lat: z.number().optional(),
            lng: z.number().optional(),
            parcelId: z.string().optional(),
            applicationDate: z.string().or(z.number()).optional(),
            issueDate: z.string().or(z.number()).optional(),
            status: z.string().optional(),
            statusMapped: z.string().optional(),
            value: z.number().optional(),
            contractorName: z.string().optional(),
            contractorPhone: z.string().optional(),
            contractorEmail: z.string().optional(),
            ownerName: z.string().optional(),
            rawData: z.string().optional(),
            publishedAt: z.string().or(z.number()).optional(),
            confidence: z.number().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDbFromContext();
      const created = [];
      const skipped = [];

      for (const record of input.records) {
        const rawPayload = JSON.stringify(record);
        const contentHash = cyrb53(rawPayload);

        // Deduplication: check if raw record already exists
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
          // Update existing raw record
          await db
            .update(rawRecords)
            .set({ resolvedAt: new Date(), ingestionRunId: input.runId })
            .where(eq(rawRecords.id, existing[0].id));
          skipped.push(existing[0].id);
          continue;
        }

        // Insert raw record
        const rawResult = await db
          .insert(rawRecords)
          .values({
            providerId: input.providerId,
            sourceRecordId: record.sourceRecordId,
            sourceUrl: record.sourceUrl,
            rawPayload,
            rawTitle: record.title,
            rawDescription: record.description,
            rawLocation: record.address,
            rawStatus: record.status,
            ingestionRunId: input.runId,
            observedAt: new Date(),
            resolvedAt: new Date(),
            provenance: "LIVE",
            isDeleted: false,
          })
          .returning();
        const rawRecord = rawResult[0];

        // ── Write to kestovar_canonical_events (NOT signalcore_events) ──
        const canonicalId = generateCanonicalId();
        await db.insert(kestovarCanonicalEvents).values({
          canonicalId,
          providerId: input.providerId,
          sourceRecordId: record.sourceRecordId || null,
          sourceUrl: record.sourceUrl || null,
          eventType: record.eventType || "permit",
          title: record.title || "Untitled",
          description: record.description || null,
          permitType: record.permitType || null,
          permitClass: record.permitClass || null,
          workClass: record.workClass || null,
          county: record.county || null,
          state: record.state || null,
          city: record.city || null,
          zipCode: record.zipCode || null,
          address: record.address || null,
          lat: record.lat || null,
          lng: record.lng || null,
          parcelId: record.parcelId || null,
          applicationDate: toTimestamp(record.applicationDate),
          issueDate: toTimestamp(record.issueDate),
          status: record.status || null,
          statusMapped: record.statusMapped || null,
          value: record.value || null,
          contractorName: record.contractorName || null,
          contractorPhone: record.contractorPhone || null,
          contractorEmail: record.contractorEmail || null,
          ownerName: record.ownerName || null,
          rawData: record.rawData || rawPayload,
          normalizedData: JSON.stringify(record),
          contentHash,
          publishedAt: toTimestamp(record.publishedAt),
          ingestedAt: new Date(),
          updatedAt: new Date(),
          confidence: record.confidence || 0.5,
          statusCanonical: "active",
          provenance: "LIVE",
          lineageVersion: 1,
        });

        created.push({ rawId: rawRecord.id, canonicalId });
      }

      return { created, skipped, total: input.records.length };
    }),

  // ── Run a full ingestion cycle ─────────────────────────
  run: publicQuery
    .input(
      z.object({
        providerId: z.string(),
        rawRecords: z.array(
          z.object({
            sourceRecordId: z.string().optional(),
            sourceUrl: z.string().optional(),
            eventType: z.string().optional(),
            title: z.string().optional(),
            description: z.string().optional(),
            permitType: z.string().optional(),
            permitClass: z.string().optional(),
            workClass: z.string().optional(),
            county: z.string().optional(),
            state: z.string().optional(),
            city: z.string().optional(),
            zipCode: z.string().optional(),
            address: z.string().optional(),
            lat: z.number().optional(),
            lng: z.number().optional(),
            parcelId: z.string().optional(),
            applicationDate: z.string().or(z.number()).optional(),
            issueDate: z.string().or(z.number()).optional(),
            status: z.string().optional(),
            statusMapped: z.string().optional(),
            value: z.number().optional(),
            contractorName: z.string().optional(),
            contractorPhone: z.string().optional(),
            contractorEmail: z.string().optional(),
            ownerName: z.string().optional(),
            rawData: z.string().optional(),
            publishedAt: z.string().or(z.number()).optional(),
            confidence: z.number().optional(),
          })
        ),
        metadata: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDbFromContext();
      const start = Date.now();

      // Create ingestion run record
      const runResult = await db
        .insert(ingestionRuns)
        .values({
          providerId: input.providerId,
          startedAt: new Date(),
          status: "running",
          triggerType: "api",
          recordsObserved: input.rawRecords.length,
          provenance: "LIVE",
        })
        .returning();
      const run = runResult[0];

      let recordsCreated = 0;
      let recordsSkipped = 0;
      let recordsFailed = 0;

      for (const record of input.rawRecords) {
        try {
          const rawPayload = JSON.stringify(record);
          const contentHash = cyrb53(rawPayload);

          // Deduplication
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
              .set({ resolvedAt: new Date(), ingestionRunId: run.id })
              .where(eq(rawRecords.id, existing[0].id));
            recordsSkipped++;
            continue;
          }

          // Insert raw record
          const rawResult = await db
            .insert(rawRecords)
            .values({
              providerId: input.providerId,
              sourceRecordId: record.sourceRecordId,
              sourceUrl: record.sourceUrl,
              rawPayload,
              rawTitle: record.title,
              rawDescription: record.description,
              rawLocation: record.address,
              rawStatus: record.status,
              ingestionRunId: run.id,
              observedAt: new Date(),
              resolvedAt: new Date(),
              provenance: "LIVE",
              isDeleted: false,
            })
            .returning();
          const rawRecord = rawResult[0];

          // ── Write to kestovar_canonical_events (CANONICAL) ──
          const canonicalId = generateCanonicalId();
          await db.insert(kestovarCanonicalEvents).values({
            canonicalId,
            providerId: input.providerId,
            sourceRecordId: record.sourceRecordId || null,
            sourceUrl: record.sourceUrl || null,
            eventType: record.eventType || "permit",
            title: record.title || "Untitled",
            description: record.description || null,
            permitType: record.permitType || null,
            permitClass: record.permitClass || null,
            workClass: record.workClass || null,
            county: record.county || null,
            state: record.state || null,
            city: record.city || null,
            zipCode: record.zipCode || null,
            address: record.address || null,
            lat: record.lat || null,
            lng: record.lng || null,
            parcelId: record.parcelId || null,
            applicationDate: toTimestamp(record.applicationDate),
            issueDate: toTimestamp(record.issueDate),
            status: record.status || null,
            statusMapped: record.statusMapped || null,
            value: record.value || null,
            contractorName: record.contractorName || null,
            contractorPhone: record.contractorPhone || null,
            contractorEmail: record.contractorEmail || null,
            ownerName: record.ownerName || null,
            rawData: record.rawData || rawPayload,
            normalizedData: JSON.stringify(record),
            contentHash,
            publishedAt: toTimestamp(record.publishedAt),
            ingestedAt: new Date(),
            updatedAt: new Date(),
            confidence: record.confidence || 0.5,
            statusCanonical: "active",
            provenance: "LIVE",
            lineageVersion: 1,
          });

          recordsCreated++;
        } catch (e) {
          recordsFailed++;
          console.error(`[Ingestion] Failed to process record: ${e}`);
        }
      }

      // Update ingestion run
      await db
        .update(ingestionRuns)
        .set({
          completedAt: new Date(),
          status: recordsFailed > 0 ? "partial" : "success",
          recordsCreated,
          recordsResolved: recordsCreated,
          recordsFailed,
          totalLatencyMs: Date.now() - start,
          metadata: JSON.stringify(input.metadata || {}),
        })
        .where(eq(ingestionRuns.id, run.id));

      return {
        runId: run.id,
        recordsObserved: input.rawRecords.length,
        recordsCreated,
        recordsSkipped,
        recordsFailed,
        durationMs: Date.now() - start,
      };
    }),

  // ── Get ingestion runs ─────────────────────────────────
  runs: publicQuery
    .input(
      z.object({
        providerId: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDbFromContext();
      const conditions = [];
      if (input?.providerId) conditions.push(eq(ingestionRuns.providerId, input.providerId));

      const runs = await db
        .select()
        .from(ingestionRuns)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(ingestionRuns.startedAt))
        .limit(input?.limit || 50)
        .offset(input?.offset || 0);

      return { runs, total: runs.length };
    }),

  // ── Get ingestion stats ────────────────────────────────
  stats: publicQuery.query(async () => {
    const db = getDbFromContext();
    const totalRuns = await db
      .select({ count: sql<number>`count(*)` })
      .from(ingestionRuns)
      .get();
    const totalSources = await db
      .select({ count: sql<number>`count(*)` })
      .from(ingestionSources)
      .get();
    const totalRecords = await db
      .select({ count: sql<number>`count(*)` })
      .from(rawRecords)
      .get();
    const totalCanonical = await db
      .select({ count: sql<number>`count(*)` })
      .from(kestovarCanonicalEvents)
      .get();

    return {
      totalRuns: totalRuns?.count || 0,
      totalSources: totalSources?.count || 0,
      totalRawRecords: totalRecords?.count || 0,
      totalCanonicalRecords: totalCanonical?.count || 0,
    };
  }),
});
