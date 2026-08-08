import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { like, eq, and, or, gte, lte, sql, desc } from "drizzle-orm";
import {
  signalcoreEvents,
  signalcorePatterns,
  signalcoreRecommendations,
  searchHistory,
} from "../db/schema";

/** Enforce plan-based search limits */
function getSearchLimits(plan: string) {
  switch (plan) {
    case "starter":
      return { maxLimit: 20, allowedTypes: ["events"] as const };
    case "basic":
      return { maxLimit: 50, allowedTypes: ["events", "patterns"] as const };
    case "advanced":
    case "pro":
    case "enterprise":
      return {
        maxLimit: 100,
        allowedTypes: ["events", "patterns", "recommendations", "counties"] as const,
      };
    default:
      return { maxLimit: 20, allowedTypes: ["events"] as const };
  }
}

export const searchRouter = createRouter({
  // Global search across all content types
  search: authedQuery
    .input(
      z.object({
        query: z.string().min(1).max(200),
        types: z
          .array(z.enum(["events", "patterns", "recommendations", "counties"]))
          .optional(),
        state: z.string().optional(),
        county: z.string().optional(),
        sector: z.string().optional(),
        dateFrom: z.string().optional(), // ISO date
        dateTo: z.string().optional(),
        confidenceMin: z.number().min(0).max(100).optional(),
        sortBy: z.enum(["relevance", "date", "confidence"]).default("relevance"),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const limits = getSearchLimits(ctx.user.plan);
      const effectiveLimit = Math.min(input.limit, limits.maxLimit);
      const requestedTypes = input.types || ["events", "patterns", "recommendations"];
      const searchTypes = requestedTypes.filter((t) =>
        limits.allowedTypes.includes(t as (typeof limits.allowedTypes)[number])
      );

      if (searchTypes.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Your plan (${ctx.user.plan}) does not allow the requested search types`,
        });
      }

      const results: Array<Record<string, unknown> & { _type: string }> = [];
      const queryPattern = `%${input.query}%`;

      // ── Search events ──
      if (searchTypes.includes("events")) {
        const conditions: Array<ReturnType<typeof eq> | ReturnType<typeof like> | ReturnType<typeof gte> | ReturnType<typeof lte>> = [];
        if (input.state) conditions.push(eq(signalcoreEvents.state, input.state));
        if (input.county) conditions.push(like(signalcoreEvents.county, `%${input.county}%`));
        if (input.sector) conditions.push(like(signalcoreEvents.eventType, `%${input.sector}%`));
        if (input.confidenceMin !== undefined)
          conditions.push(gte(signalcoreEvents.confidence, input.confidenceMin));
        if (input.dateFrom)
          conditions.push(gte(signalcoreEvents.createdAt, new Date(input.dateFrom)));
        if (input.dateTo)
          conditions.push(lte(signalcoreEvents.createdAt, new Date(input.dateTo)));

        const textConditions = [
          like(signalcoreEvents.eventType, queryPattern),
          like(signalcoreEvents.county, queryPattern),
          like(signalcoreEvents.description, queryPattern),
          like(signalcoreEvents.title, queryPattern),
        ];

        const eventResults = await ctx.db
          .select()
          .from(signalcoreEvents)
          .where(and(...conditions, or(...textConditions)))
          .limit(effectiveLimit)
          .all();

        results.push(...eventResults.map((r) => ({ ...r, _type: "event" as const })));
      }

      // ── Search patterns ──
      if (searchTypes.includes("patterns")) {
        const conditions: Array<ReturnType<typeof eq> | ReturnType<typeof like> | ReturnType<typeof gte> | ReturnType<typeof lte>> = [];
        if (input.state) conditions.push(eq(signalcorePatterns.state, input.state));
        if (input.county) conditions.push(like(signalcorePatterns.county, `%${input.county}%`));
        if (input.confidenceMin !== undefined)
          conditions.push(gte(signalcorePatterns.confidence, input.confidenceMin));
        if (input.dateFrom)
          conditions.push(gte(signalcorePatterns.createdAt, new Date(input.dateFrom)));
        if (input.dateTo)
          conditions.push(lte(signalcorePatterns.createdAt, new Date(input.dateTo)));

        const textConditions = [
          like(signalcorePatterns.patternType, queryPattern),
          like(signalcorePatterns.county, queryPattern),
          like(signalcorePatterns.description, queryPattern),
          like(signalcorePatterns.name, queryPattern),
        ];

        const patternResults = await ctx.db
          .select()
          .from(signalcorePatterns)
          .where(and(...conditions, or(...textConditions)))
          .limit(effectiveLimit)
          .all();

        results.push(...patternResults.map((r) => ({ ...r, _type: "pattern" as const })));
      }

      // ── Search recommendations ──
      if (searchTypes.includes("recommendations")) {
        const conditions: Array<ReturnType<typeof eq> | ReturnType<typeof like> | ReturnType<typeof gte> | ReturnType<typeof lte>> = [];
        if (input.state)
          conditions.push(like(signalcoreRecommendations.jurisdiction, `%${input.state}%`));
        if (input.county)
          conditions.push(like(signalcoreRecommendations.jurisdiction, `%${input.county}%`));
        if (input.confidenceMin !== undefined)
          conditions.push(gte(signalcoreRecommendations.confidenceScore, input.confidenceMin));
        if (input.dateFrom)
          conditions.push(gte(signalcoreRecommendations.createdAt, new Date(input.dateFrom)));
        if (input.dateTo)
          conditions.push(lte(signalcoreRecommendations.createdAt, new Date(input.dateTo)));

        const textConditions = [
          like(signalcoreRecommendations.targetProduct, queryPattern),
          like(signalcoreRecommendations.jurisdiction, queryPattern),
          like(signalcoreRecommendations.summary, queryPattern),
          like(signalcoreRecommendations.rationale, queryPattern),
        ];

        const recResults = await ctx.db
          .select()
          .from(signalcoreRecommendations)
          .where(and(...conditions, or(...textConditions)))
          .limit(effectiveLimit)
          .all();

        results.push(
          ...recResults.map((r) => ({ ...r, _type: "recommendation" as const }))
        );
      }

      // ── Sort results ──
      if (input.sortBy === "date") {
        results.sort(
          (a, b) =>
            new Date((b.createdAt as string | Date) || 0).getTime() -
            new Date((a.createdAt as string | Date) || 0).getTime()
        );
      } else if (input.sortBy === "confidence") {
        results.sort(
          (a, b) =>
            ((b.confidence as number) || (b.confidenceScore as number) || 0) -
            ((a.confidence as number) || (a.confidenceScore as number) || 0)
        );
      }
      // relevance: keep as-is (interleaved by type)

      // ── Save to search history ──
      await ctx.db
        .insert(searchHistory)
        .values({
          userId: ctx.user.id,
          query: input.query,
          filters: JSON.stringify({
            types: searchTypes,
            state: input.state,
            county: input.county,
            sector: input.sector,
          }),
          resultCount: results.length,
        })
        .run()
        .catch(() => {
          // Swallow history-save errors so they don't break search
        });

      return {
        results: results.slice(input.offset, input.offset + effectiveLimit),
        total: results.length,
        query: input.query,
        types: searchTypes,
      };
    }),

  // Auto-complete suggestions
  suggestions: authedQuery
    .input(
      z.object({
        query: z.string().min(1).max(100),
        limit: z.number().min(1).max(10).default(5),
      })
    )
    .query(async ({ input, ctx }) => {
      const suggestions: string[] = [];
      const pattern = `%${input.query}%`;

      // Unique event types matching query
      const events = await ctx.db
        .selectDistinct({ eventType: signalcoreEvents.eventType })
        .from(signalcoreEvents)
        .where(like(signalcoreEvents.eventType, pattern))
        .limit(input.limit)
        .all();
      suggestions.push(...events.map((e) => e.eventType).filter(Boolean));

      // Unique county names matching query
      const counties = await ctx.db
        .selectDistinct({ county: signalcoreEvents.county })
        .from(signalcoreEvents)
        .where(like(signalcoreEvents.county, pattern))
        .limit(input.limit)
        .all();
      suggestions.push(...counties.map((c) => c.county).filter(Boolean));

      // Unique pattern types matching query
      const patterns = await ctx.db
        .selectDistinct({ patternType: signalcorePatterns.patternType })
        .from(signalcorePatterns)
        .where(like(signalcorePatterns.patternType, pattern))
        .limit(input.limit)
        .all();
      suggestions.push(...patterns.map((p) => p.patternType).filter(Boolean));

      // Unique target products matching query
      const products = await ctx.db
        .selectDistinct({ targetProduct: signalcoreRecommendations.targetProduct })
        .from(signalcoreRecommendations)
        .where(like(signalcoreRecommendations.targetProduct, pattern))
        .limit(input.limit)
        .all();
      suggestions.push(...products.map((p) => p.targetProduct).filter(Boolean));

      return [...new Set(suggestions)].slice(0, input.limit);
    }),

  // Recent searches for the authenticated user
  recentSearches: authedQuery
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      return ctx.db
        .select()
        .from(searchHistory)
        .where(eq(searchHistory.userId, ctx.user.id))
        .orderBy(desc(searchHistory.createdAt))
        .limit(input.limit)
        .all();
    }),

  // Clear search history
  clearHistory: authedQuery.mutation(async ({ ctx }) => {
    await ctx.db
      .delete(searchHistory)
      .where(eq(searchHistory.userId, ctx.user.id))
      .run();
    return { success: true };
  }),

  // Facet counts for filters (public, no auth required)
  facets: publicQuery.query(async ({ ctx }) => {
    // Count by state
    const stateCounts = await ctx.db
      .select({
        state: signalcoreEvents.state,
        count: sql<number>`count(*)`,
      })
      .from(signalcoreEvents)
      .groupBy(signalcoreEvents.state)
      .all();

    // Count by event type
    const typeCounts = await ctx.db
      .select({
        type: signalcoreEvents.eventType,
        count: sql<number>`count(*)`,
      })
      .from(signalcoreEvents)
      .groupBy(signalcoreEvents.eventType)
      .all();

    // Count by pattern type
    const patternTypeCounts = await ctx.db
      .select({
        type: signalcorePatterns.patternType,
        count: sql<number>`count(*)`,
      })
      .from(signalcorePatterns)
      .groupBy(signalcorePatterns.patternType)
      .all();

    return {
      states: stateCounts,
      eventTypes: typeCounts,
      patternTypes: patternTypeCounts,
    };
  }),
});
