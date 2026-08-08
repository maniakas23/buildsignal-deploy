/**
 * County Router — County Expansion Engine (Gate 12, Section 2)
 */

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

export interface CountyCoverage {
  id: number; county: string; state: string; population: number;
  parcelCount: number; providerCount: number; availableDataTypes: string;
  infrastructureSources: string; healthStatus: "active" | "partial" | "limited" | "planned";
  coveragePercentage: number; expansionPriority: number; lastDataRefresh: string | null;
  totalEvents: number; totalPatterns: number; totalRecommendations: number;
  createdAt: string; updatedAt: string;
}

function getD1(ctx: any): D1Database | null {
  return (ctx.env?.DB as D1Database) || null;
}

export const countyRouter = createRouter({
  list: publicQuery
    .input(z.object({ state: z.string().optional(), healthStatus: z.enum(["active", "partial", "limited", "planned"]).optional(), minCoverage: z.number().optional(), sortBy: z.enum(["coverage", "population", "priority", "events"]).default("coverage") }).optional())
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { counties: [] as CountyCoverage[], count: 0, page: (input as any)?.page || 1, totalPages: 0 };
      try {
        let sql = `SELECT * FROM counties WHERE 1=1`; const params: (string | number)[] = [];
        if (input?.state) { sql += ` AND state = ?`; params.push(input.state); }
        if (input?.healthStatus) { sql += ` AND healthStatus = ?`; params.push(input.healthStatus); }
        if (input?.minCoverage) { sql += ` AND coveragePercentage >= ?`; params.push(input.minCoverage); }
        const sortMap = { coverage: "coveragePercentage DESC", population: "population DESC", priority: "expansionPriority ASC", events: "totalEvents DESC" };
        sql += ` ORDER BY ${sortMap[input?.sortBy || "coverage"]}`;
        const { results } = await d1.prepare(sql).bind(...params).all<CountyCoverage>();
        if (!results || results.length === 0) return { counties: [] as CountyCoverage[], count: 0, page: (input as any)?.page || 1, totalPages: 0 };
        return { counties: results };
      } catch { return { counties: [] as CountyCoverage[], count: 0, page: (input as any)?.page || 1, totalPages: 0 }; }
    }),

  summary: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { total: 0, active: 0, partial: 0, limited: 0, planned: 0, avgCoverage: 0, totalPopulation: 0, totalEvents: 0, totalPatterns: 0, totalRecommendations: 0 };
    try {
      const { results } = await d1.prepare(`SELECT * FROM counties`).all<CountyCoverage>();
      if (!results || results.length === 0) return { total: 0, active: 0, partial: 0, limited: 0, planned: 0, avgCoverage: 0, totalPopulation: 0, totalEvents: 0, totalPatterns: 0, totalRecommendations: 0 };
      return computeSummary(results);
    } catch { return { total: 0, active: 0, partial: 0, limited: 0, planned: 0, avgCoverage: 0, totalPopulation: 0, totalEvents: 0, totalPatterns: 0, totalRecommendations: 0 }; }
  }),

  detail: publicQuery
    .input(z.object({ county: z.string(), state: z.string() }))
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { county: null };
      try {
        const row = await d1.prepare(`SELECT * FROM counties WHERE county = ? AND state = ?`).bind(input.county, input.state).first<CountyCoverage>();
        return { county: row };
      } catch { return { county: null }; }
    }),
});

function computeSummary(counties: CountyCoverage[]) {
  const total = counties.length;
  const active = counties.filter((c) => c.healthStatus === "active").length;
  const partial = counties.filter((c) => c.healthStatus === "partial").length;
  const limited = counties.filter((c) => c.healthStatus === "limited").length;
  const planned = counties.filter((c) => c.healthStatus === "planned").length;
  const avgCoverage = Math.round(counties.reduce((s, c) => s + c.coveragePercentage, 0) / (total || 1));
  const totalPopulation = counties.reduce((s, c) => s + c.population, 0);
  const totalEvents = counties.reduce((s, c) => s + c.totalEvents, 0);
  const totalPatterns = counties.reduce((s, c) => s + c.totalPatterns, 0);
  const totalRecommendations = counties.reduce((s, c) => s + c.totalRecommendations, 0);
  return { total, active, partial, limited, planned, avgCoverage, totalPopulation, totalEvents, totalPatterns, totalRecommendations };
}
