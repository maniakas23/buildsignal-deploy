/**
 * Pattern Library Router — Gate 19 Section 5
 * Reusable infrastructure signal patterns with historical success metrics.
 */

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

function getD1(ctx: any): D1Database | null {
  return (ctx.env?.DB as D1Database) || null;
}

export const PATTERN_TYPES = [
  "residential_growth", "commercial_growth", "industrial_growth", "mixed_use",
  "healthcare", "school", "retail", "logistics", "manufacturing",
  "data_center", "utility_expansion", "transportation",
] as const;

export const patternRouter = createRouter({
  list: publicQuery
    .input(z.object({ patternType: z.string().optional(), isActive: z.boolean().optional(), minSuccessRate: z.number().optional() }).optional())
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { patterns: [] as any[], total: 0 };
      try {
        let sql = `SELECT * FROM pattern_library WHERE 1=1`;
        const params: (string | number)[] = [];
        if (input?.patternType) { sql += ` AND patternType = ?`; params.push(input.patternType); }
        if (input?.isActive !== undefined) { sql += ` AND isActive = ?`; params.push(input.isActive ? 1 : 0); }
        if (input?.minSuccessRate) { sql += ` AND historicalSuccessRate >= ?`; params.push(input.minSuccessRate); }
        sql += ` ORDER BY historicalSuccessRate DESC`;
        const { results } = await d1.prepare(sql).bind(...params).all();
        if (!results || results.length === 0) return { patterns: [] as any[], total: 0 };
        return { patterns: results };
      } catch { return { patterns: [] as any[], total: 0 }; }
    }),

  detail: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { pattern: null };
      try {
        const row = await d1.prepare(`SELECT * FROM pattern_library WHERE id = ?`).bind(input.id).first();
        return { pattern: row };
      } catch { return { pattern: null }; }
    }),

  match: publicQuery
    .input(z.object({ state: z.string(), county: z.string().optional(), eventTypes: z.array(z.string()).optional() }))
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { patterns: [] as any[], total: 0, confidence: null as number | null };
      try {
        const { results } = await d1.prepare(`SELECT * FROM pattern_library WHERE isActive = 1 AND (applicableStates LIKE ? OR applicableStates IS NULL) ORDER BY historicalSuccessRate DESC`).bind(`%${input.state}%`).all();
        if (!results || results.length === 0) return { patterns: [] as any[], total: 0, confidence: null as number | null };
        return { matches: results };
      } catch { return { patterns: [] as any[], total: 0, confidence: null as number | null }; }
    }),

  performance: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { totalPatterns: 0, matchedPatterns: 0, avgConfidence: 0, avgTrustScore: 0, patterns: [] as any[] };
    try {
      const { results } = await d1.prepare(`SELECT patternType, AVG(historicalSuccessRate) as avgSuccess, SUM(totalApplications) as totalApps, SUM(successfulPredictions) as totalSuccess, AVG(avgTimeToDevelopment) as avgTime, AVG(avgReturnScore) as avgReturn FROM pattern_library GROUP BY patternType ORDER BY avgSuccess DESC`).all();
      if (!results || results.length === 0) return { totalPatterns: 0, matchedPatterns: 0, avgConfidence: 0, avgTrustScore: 0, patterns: [] as any[] };
      return { byType: results };
    } catch { return { totalPatterns: 0, matchedPatterns: 0, avgConfidence: 0, avgTrustScore: 0, patterns: [] as any[] }; }
  }),

  create: publicQuery
    .input(z.object({
      patternName: z.string(),
      patternType: z.enum(PATTERN_TYPES),
      description: z.string().optional(),
      signalIndicators: z.array(z.string()).optional(),
      requiredEventTypes: z.array(z.string()).optional(),
      minConfidenceThreshold: z.number().min(0).max(100).optional(),
      applicableStates: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { success: false, id: null };
      try {
        const result = await d1.prepare(`INSERT INTO pattern_library (patternName, patternType, description, signalIndicators, requiredEventTypes, minConfidenceThreshold, applicableStates) VALUES (?, ?, ?, ?, ?, ?, ?)`)
          .bind(input.patternName, input.patternType, input.description || null, JSON.stringify(input.signalIndicators || []), JSON.stringify(input.requiredEventTypes || []), input.minConfidenceThreshold || 70, JSON.stringify(input.applicableStates || [])).run();
        return { success: true, id: result.meta?.last_row_id };
      } catch { return { success: false, id: null }; }
    }),
});
