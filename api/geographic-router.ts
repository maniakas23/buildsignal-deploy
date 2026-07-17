/**
 * Geographic Router — Gate 17 Section 5
 * Multi-level geographic expansion: states, counties, cities, regions, utility districts.
 */

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

function getD1(ctx: any): D1Database | null {
  return (ctx.env?.DB as D1Database) || null;
}

export const geographicRouter = createRouter({
  list: publicQuery
    .input(z.object({ type: z.string().optional(), state: z.string().optional() }).optional())
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { zones: getDefaultZones() };
      try {
        let sql = `SELECT * FROM geographic_zones WHERE 1=1`;
        const params: (string | number)[] = [];
        if (input?.type) { sql += ` AND type = ?`; params.push(input.type); }
        if (input?.state) { sql += ` AND state = ?`; params.push(input.state); }
        sql += ` ORDER BY type, name`;
        const { results } = await d1.prepare(sql).bind(...params).all();
        return { zones: results || getDefaultZones() };
      } catch { return { zones: getDefaultZones() }; }
    }),

  summary: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return getDefaultSummary();
    try {
      const { results: byType } = await d1.prepare(`SELECT type, COUNT(*) as count, SUM(population) as pop, AVG(coveragePercentage) as avgCoverage FROM geographic_zones GROUP BY type`).all<{ type: string; count: number; pop: number; avgCoverage: number }>();
      const states = byType?.find((t) => t.type === "state");
      const regions = byType?.find((t) => t.type === "region");
      return {
        totalStates: states?.count || 0,
        totalRegions: regions?.count || 0,
        totalPopulation: states?.pop || 0,
        avgCoverage: Math.round(states?.avgCoverage || 0),
        activeZones: await d1.prepare(`SELECT COUNT(*) as c FROM geographic_zones WHERE healthStatus = 'active'`).first<{ c: number }>().then((r) => r?.c || 0),
        plannedZones: await d1.prepare(`SELECT COUNT(*) as c FROM geographic_zones WHERE healthStatus = 'planned'`).first<{ c: number }>().then((r) => r?.c || 0),
      };
    } catch { return getDefaultSummary(); }
  }),
});

function getDefaultZones() {
  return [
    { id: 1, name: "North Carolina", type: "state", parentId: null, state: "NC", population: 10600000, providerCount: 12, coveragePercentage: 86, healthStatus: "active", onboardingProgress: 100, totalEvents: 45200, totalPatterns: 89 },
    { id: 2, name: "South Carolina", type: "state", parentId: null, state: "SC", population: 5300000, providerCount: 11, coveragePercentage: 82, healthStatus: "active", onboardingProgress: 100, totalEvents: 28900, totalPatterns: 56 },
    { id: 3, name: "Virginia", type: "state", parentId: null, state: "VA", population: 8700000, providerCount: 8, coveragePercentage: 45, healthStatus: "partial", onboardingProgress: 60, totalEvents: 12300, totalPatterns: 28 },
    { id: 4, name: "Tennessee", type: "state", parentId: null, state: "TN", population: 7000000, providerCount: 6, coveragePercentage: 32, healthStatus: "limited", onboardingProgress: 40, totalEvents: 8400, totalPatterns: 19 },
    { id: 5, name: "Georgia", type: "state", parentId: null, state: "GA", population: 11000000, providerCount: 5, coveragePercentage: 22, healthStatus: "planned", onboardingProgress: 25, totalEvents: 5200, totalPatterns: 12 },
    { id: 6, name: "Florida", type: "state", parentId: null, state: "FL", population: 22000000, providerCount: 3, coveragePercentage: 12, healthStatus: "planned", onboardingProgress: 15, totalEvents: 3100, totalPatterns: 8 },
    { id: 7, name: "Research Triangle", type: "region", parentId: 1, state: "NC", population: 2100000, providerCount: 12, coveragePercentage: 96, healthStatus: "active", onboardingProgress: 100, totalEvents: 18500, totalPatterns: 42 },
    { id: 8, name: "Charlotte Metro", type: "region", parentId: 1, state: "NC", population: 2800000, providerCount: 11, coveragePercentage: 94, healthStatus: "active", onboardingProgress: 100, totalEvents: 15600, totalPatterns: 35 },
    { id: 9, name: "Upstate SC", type: "region", parentId: 2, state: "SC", population: 1500000, providerCount: 10, coveragePercentage: 87, healthStatus: "active", onboardingProgress: 90, totalEvents: 9800, totalPatterns: 22 },
  ];
}

function getDefaultSummary() {
  return { totalStates: 6, totalRegions: 3, totalPopulation: 64600000, avgCoverage: 47, activeZones: 6, plannedZones: 3 };
}
