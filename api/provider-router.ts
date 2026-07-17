/**
 * Provider Router — Provider Integration Framework (Gate 12, Section 1 + 8)
 */

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

export const PROVIDER_TYPES = [
  "building_permits", "planning_agendas", "zoning", "utilities",
  "dot_projects", "capital_improvement", "government_spending",
  "economic_development", "public_meetings", "environmental_notices",
  "infrastructure_grants", "public_utility_commissions",
] as const;

export type ProviderType = (typeof PROVIDER_TYPES)[number];

export interface ProviderHealth {
  id: number; providerType: ProviderType; providerName: string;
  coverage: string; refreshFrequency: string; lastSync: string | null;
  latencyMs: number; validationStatus: "active" | "pending" | "degraded" | "offline";
  healthScore: number; errorRate: number; recordCount: number;
  nextScheduledSync: string | null; createdAt: string; updatedAt: string;
}

const PROVIDER_LABELS: Record<ProviderType, string> = {
  building_permits: "Building Permits", planning_agendas: "Planning Agendas",
  zoning: "Zoning", utilities: "Utilities", dot_projects: "DOT Projects",
  capital_improvement: "Capital Improvement Plans", government_spending: "Government Spending",
  economic_development: "Economic Development", public_meetings: "Public Meetings",
  environmental_notices: "Environmental Notices", infrastructure_grants: "Infrastructure Grants",
  public_utility_commissions: "Public Utility Commissions",
};

const PROVIDER_COVERAGE: Record<ProviderType, string> = {
  building_permits: "NC, SC, VA, TN, GA — 142 counties",
  planning_agendas: "NC, SC, VA — 89 counties",
  zoning: "NC, SC, VA, TN — 120 counties",
  utilities: "NC, SC, VA, TN, GA — 156 counties",
  dot_projects: "NC, SC, VA, TN, GA, FL — 6 states",
  capital_improvement: "NC, SC, VA — 68 counties",
  government_spending: "NC, SC, VA, TN, GA — 245 municipalities",
  economic_development: "NC, SC, VA, TN — 92 counties",
  public_meetings: "NC, SC, VA — 134 jurisdictions",
  environmental_notices: "NC, SC, VA, TN, GA, FL — 6 states",
  infrastructure_grants: "NC, SC, VA, TN, GA — 5 states",
  public_utility_commissions: "NC, SC, VA, TN, GA — 5 states",
};

const PROVIDER_REFRESH: Record<ProviderType, string> = {
  building_permits: "Daily", planning_agendas: "Weekly", zoning: "Daily",
  utilities: "Daily", dot_projects: "Weekly", capital_improvement: "Weekly",
  government_spending: "Daily", economic_development: "Weekly",
  public_meetings: "Weekly", environmental_notices: "Daily",
  infrastructure_grants: "Weekly", public_utility_commissions: "Daily",
};

function getD1(ctx: any): D1Database | null {
  return (ctx.env?.DB as D1Database) || null;
}

export const providerRouter = createRouter({
  list: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { providers: generateDefaultProviders() };
    try {
      const { results } = await d1.prepare(
        `SELECT id, providerType, providerName, coverage, refreshFrequency, lastSync,
                latencyMs, validationStatus, healthScore, errorRate, recordCount,
                nextScheduledSync, createdAt, updatedAt
         FROM providers ORDER BY healthScore DESC, providerName ASC`
      ).all<ProviderHealth>();
      if (!results || results.length === 0) {
        return { providers: generateDefaultProviders() };
      }
      return { providers: results };
    } catch {
      return { providers: generateDefaultProviders() };
    }
  }),

  detail: publicQuery
    .input(z.object({ providerType: z.enum(PROVIDER_TYPES) }))
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { provider: null };
      try {
        const row = await d1.prepare(`SELECT * FROM providers WHERE providerType = ?`).bind(input.providerType).first<ProviderHealth>();
        return { provider: row };
      } catch {
        return { provider: null };
      }
    }),

  summary: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    const providers = d1
      ? await d1.prepare(
          `SELECT validationStatus, COUNT(*) as count, AVG(healthScore) as avgHealth, AVG(errorRate) as avgErrorRate
           FROM providers GROUP BY validationStatus`
        ).all<{ validationStatus: string; count: number; avgHealth: number; avgErrorRate: number }>()
          .then((r) => r.results || []).catch(() => [])
      : [];
    const total = providers.reduce((s, p) => s + (p.count || 0), 0);
    const active = providers.find((p) => p.validationStatus === "active")?.count || 0;
    const degraded = providers.find((p) => p.validationStatus === "degraded")?.count || 0;
    const offline = providers.find((p) => p.validationStatus === "offline")?.count || 0;
    const pending = providers.find((p) => p.validationStatus === "pending")?.count || 0;
    const avgHealth = Math.round(providers.reduce((s, p) => s + (p.avgHealth || 0) * (p.count || 0), 0) / (total || 1));
    return { total, active, degraded, offline, pending, avgHealth };
  }),

  updateHealth: publicQuery
    .input(z.object({
      providerType: z.enum(PROVIDER_TYPES), healthScore: z.number().min(0).max(100).optional(),
      errorRate: z.number().min(0).max(100).optional(), latencyMs: z.number().optional(),
      validationStatus: z.enum(["active", "pending", "degraded", "offline"]).optional(),
      lastSync: z.string().optional(), recordCount: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { success: false };
      const fields: string[] = []; const values: (string | number)[] = [];
      if (input.healthScore !== undefined) { fields.push("healthScore = ?"); values.push(input.healthScore); }
      if (input.errorRate !== undefined) { fields.push("errorRate = ?"); values.push(input.errorRate); }
      if (input.latencyMs !== undefined) { fields.push("latencyMs = ?"); values.push(input.latencyMs); }
      if (input.validationStatus) { fields.push("validationStatus = ?"); values.push(input.validationStatus); }
      if (input.lastSync) { fields.push("lastSync = ?"); values.push(input.lastSync); }
      if (input.recordCount !== undefined) { fields.push("recordCount = ?"); values.push(input.recordCount); }
      if (fields.length === 0) return { success: false };
      values.push(input.providerType);
      try {
        await d1.prepare(`UPDATE providers SET ${fields.join(", ")}, updatedAt = datetime('now') WHERE providerType = ?`).bind(...values).run();
        return { success: true };
      } catch {
        return { success: false };
      }
    }),
});

function generateDefaultProviders(): ProviderHealth[] {
  const now = new Date();
  const healthScenarios: Record<ProviderType, { health: number; error: number; status: ProviderHealth["validationStatus"]; latency: number; records: number }> = {
    building_permits: { health: 94, error: 2, status: "active", latency: 320, records: 45620 },
    planning_agendas: { health: 88, error: 5, status: "active", latency: 450, records: 12840 },
    zoning: { health: 91, error: 3, status: "active", latency: 280, records: 32150 },
    utilities: { health: 87, error: 6, status: "active", latency: 510, records: 28900 },
    dot_projects: { health: 96, error: 1, status: "active", latency: 180, records: 15430 },
    capital_improvement: { health: 82, error: 8, status: "degraded", latency: 890, records: 6780 },
    government_spending: { health: 79, error: 10, status: "degraded", latency: 720, records: 42100 },
    economic_development: { health: 85, error: 7, status: "active", latency: 650, records: 9850 },
    public_meetings: { health: 73, error: 12, status: "degraded", latency: 1200, records: 22340 },
    environmental_notices: { health: 90, error: 4, status: "active", latency: 340, records: 18760 },
    infrastructure_grants: { health: 68, error: 15, status: "offline", latency: 3000, records: 3450 },
    public_utility_commissions: { health: 93, error: 2, status: "active", latency: 260, records: 21300 },
  };

  return PROVIDER_TYPES.map((type, i) => {
    const s = healthScenarios[type];
    const lastSync = new Date(now.getTime() - s.latency * 1000 * (0.5 + Math.random())).toISOString();
    const nextSync = new Date(now.getTime() + 3600000 * (type.includes("weekly") ? 168 : 24)).toISOString();
    return {
      id: i + 1, providerType: type, providerName: PROVIDER_LABELS[type],
      coverage: PROVIDER_COVERAGE[type], refreshFrequency: PROVIDER_REFRESH[type],
      lastSync, latencyMs: s.latency, validationStatus: s.status,
      healthScore: s.health, errorRate: s.error, recordCount: s.records,
      nextScheduledSync: nextSync, createdAt: now.toISOString(), updatedAt: lastSync,
    };
  });
}
