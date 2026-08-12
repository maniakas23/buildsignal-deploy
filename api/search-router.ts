import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { kestovarCanonicalEvents, searchHistory } from "@db/schema-sqlite";
import { eq, like, and, desc, sql, gte, lte } from "drizzle-orm";
import { getDbFromContext } from "./queries/connection";

export const searchRouter = createRouter({
  search: publicQuery
    .input(
      z.object({
        q: z.string().min(1).max(200),
        county: z.string().optional(),
        state: z.string().optional(),
        city: z.string().optional(),
        eventType: z.string().optional(),
        permitType: z.string().optional(),
        status: z.string().optional(),
        minValue: z.number().optional(),
        maxValue: z.number().optional(),
        contractorName: z.string().optional(),
        ownerName: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
        radiusMiles: z.number().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        sortBy: z.enum(["relevance", "date", "value"]).default("relevance"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = getDbFromContext();
      const conditions = [eq(kestovarCanonicalEvents.statusCanonical, "active")];

      if (input.q) {
        const query = `%${input.q}%`;
        conditions.push(
          sql`(${kestovarCanonicalEvents.title} LIKE ${query} OR ${kestovarCanonicalEvents.description} LIKE ${query} OR ${kestovarCanonicalEvents.address} LIKE ${query} OR ${kestovarCanonicalEvents.contractorName} LIKE ${query} OR ${kestovarCanonicalEvents.ownerName} LIKE ${query})`
        );
      }
      if (input.county) conditions.push(like(kestovarCanonicalEvents.county, `%${input.county}%`));
      if (input.state) conditions.push(eq(kestovarCanonicalEvents.state, input.state));
      if (input.city) conditions.push(like(kestovarCanonicalEvents.city, `%${input.city}%`));
      if (input.eventType) conditions.push(eq(kestovarCanonicalEvents.eventType, input.eventType));
      if (input.permitType) conditions.push(eq(kestovarCanonicalEvents.permitType, input.permitType));
      if (input.status) conditions.push(eq(kestovarCanonicalEvents.status, input.status));
      if (input.minValue) conditions.push(gte(kestovarCanonicalEvents.value, input.minValue));
      if (input.maxValue) conditions.push(lte(kestovarCanonicalEvents.value, input.maxValue));
      if (input.contractorName) conditions.push(like(kestovarCanonicalEvents.contractorName, `%${input.contractorName}%`));
      if (input.ownerName) conditions.push(like(kestovarCanonicalEvents.ownerName, `%${input.ownerName}%`));

      // Date range filter
      if (input.dateFrom) {
        const fromDate = new Date(input.dateFrom);
        if (!isNaN(fromDate.getTime())) {
          conditions.push(gte(kestovarCanonicalEvents.publishedAt, fromDate));
        }
      }
      if (input.dateTo) {
        const toDate = new Date(input.dateTo);
        if (!isNaN(toDate.getTime())) {
          conditions.push(lte(kestovarCanonicalEvents.publishedAt, toDate));
        }
      }

      // Build order by
      let orderBy;
      switch (input.sortBy) {
        case "date":
          orderBy = input.sortOrder === "asc" ? kestovarCanonicalEvents.publishedAt : desc(kestovarCanonicalEvents.publishedAt);
          break;
        case "value":
          orderBy = input.sortOrder === "asc" ? kestovarCanonicalEvents.value : desc(kestovarCanonicalEvents.value);
          break;
        default:
          orderBy = desc(kestovarCanonicalEvents.confidence);
      }

      const results = await db
        .select()
        .from(kestovarCanonicalEvents)
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(input.limit)
        .offset(input.offset);

      // Log search history
      try {
        await db.insert(searchHistory).values({
          query: input.q,
          filters: JSON.stringify({
            county: input.county,
            state: input.state,
            city: input.city,
            eventType: input.eventType,
            permitType: input.permitType,
            status: input.status,
            minValue: input.minValue,
            maxValue: input.maxValue,
          }),
          resultCount: results.length,
          createdAt: new Date(),
          provenance: "LIVE",
        });
      } catch {
        // Non-critical: don't fail search if history logging fails
      }

      return {
        results,
        total: results.length,
        query: input.q,
        filters: {
          county: input.county,
          state: input.state,
          city: input.city,
          eventType: input.eventType,
          permitType: input.permitType,
          status: input.status,
        },
      };
    }),

  // ── Get search suggestions ─────────────────────────────
  suggestions: publicQuery
    .input(z.object({ q: z.string().min(1).max(100) }))
    .query(async ({ input }) => {
      const db = getDbFromContext();
      const query = `%${input.q}%`;

      const results = await db
        .selectDistinct({
          county: kestovarCanonicalEvents.county,
          city: kestovarCanonicalEvents.city,
          contractorName: kestovarCanonicalEvents.contractorName,
        })
        .from(kestovarCanonicalEvents)
        .where(
          and(
            eq(kestovarCanonicalEvents.statusCanonical, "active"),
            sql`(${kestovarCanonicalEvents.county} LIKE ${query} OR ${kestovarCanonicalEvents.city} LIKE ${query} OR ${kestovarCanonicalEvents.contractorName} LIKE ${query})`
          )
        )
        .limit(10);

      return {
        suggestions: results
          .filter((r) => r.county || r.city || r.contractorName)
          .map((r) => r.county || r.city || r.contractorName),
      };
    }),

  // ── Recent searches ────────────────────────────────────
  recent: publicQuery
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }).optional())
    .query(async ({ input }) => {
      const db = getDbFromContext();
      const searches = await db
        .select()
        .from(searchHistory)
        .orderBy(desc(searchHistory.createdAt))
        .limit(input?.limit || 10);

      return { searches, total: searches.length };
    }),

  // ── Search by ID ───────────────────────────────────────
  byId: publicQuery
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = getDbFromContext();
      const result = await db
        .select()
        .from(kestovarCanonicalEvents)
        .where(eq(kestovarCanonicalEvents.canonicalId, input.id))
        .get();

      if (!result) throw new Error("Signal not found");
      return result;
    }),

  // ── Similar signals ────────────────────────────────────
  similar: publicQuery
    .input(z.object({ id: z.string(), limit: z.number().min(1).max(20).default(5) }))
    .query(async ({ input }) => {
      const db = getDbFromContext();
      const source = await db
        .select()
        .from(kestovarCanonicalEvents)
        .where(eq(kestovarCanonicalEvents.canonicalId, input.id))
        .get();

      if (!source) throw new Error("Signal not found");

      const conditions = [eq(kestovarCanonicalEvents.statusCanonical, "active")];
      if (source.county) conditions.push(eq(kestovarCanonicalEvents.county, source.county));
      if (source.eventType) conditions.push(eq(kestovarCanonicalEvents.eventType, source.eventType));

      const results = await db
        .select()
        .from(kestovarCanonicalEvents)
        .where(and(...conditions))
        .orderBy(desc(kestovarCanonicalEvents.publishedAt))
        .limit(input.limit);

      return {
        results: results.filter((r) => r.canonicalId !== input.id),
        source: {
          id: source.canonicalId,
          title: source.title,
          county: source.county,
          eventType: source.eventType,
        },
      };
    }),
});
