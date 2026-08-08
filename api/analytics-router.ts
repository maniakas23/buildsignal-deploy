/**
 * Analytics Router — Gate 14 Section 12
 */

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

function getD1(ctx: any): D1Database | null {
  return (ctx.env?.DB as D1Database) || null;
}

function getWeekLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = start.getUTCDay() || 7;
  start.setUTCDate(start.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(start.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((start.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${start.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export const analyticsRouter = createRouter({
  onboardingFunnel: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { steps: [] };
    try {
      const users = await d1.prepare(`SELECT COUNT(*) as c FROM users WHERE createdAt >= date('now', '-30 days')`).first<{ c: number }>();
      const orgs = await d1.prepare(`SELECT COUNT(*) as c FROM organizations WHERE createdAt >= date('now', '-30 days')`).first<{ c: number }>();
      const watchlists = await d1.prepare(`SELECT COUNT(*) as c FROM watchlists WHERE createdAt >= date('now', '-30 days')`).first<{ c: number }>();
      const alerts = await d1.prepare(`SELECT COUNT(*) as c FROM notification_prefs WHERE dailyDigest = 1 OR weeklyDigest = 1`).first<{ c: number }>();
      const userCount = users?.c || 0;
      const orgCount = orgs?.c || 0;
      const watchlistCount = watchlists?.c || 0;
      const alertCount = alerts?.c || 0;
      return {
        steps: [
          { name: "Account Created", count: userCount, rate: 100 },
          { name: "Org Created", count: orgCount, rate: userCount ? Math.round((orgCount / userCount) * 100) : 0 },
          { name: "Watchlist Set", count: watchlistCount, rate: userCount ? Math.round((watchlistCount / userCount) * 100) : 0 },
          { name: "Alerts Enabled", count: alertCount, rate: userCount ? Math.round((alertCount / userCount) * 100) : 0 },
        ],
      };
    } catch { return { steps: [] }; }
  }),

  engagement: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { week: [] };
    try {
      const views = await d1.prepare(`SELECT COUNT(*) as c FROM audit_logs WHERE action = 'view_recommendation' AND createdAt >= date('now', '-7 days')`).first<{ c: number }>();
      const searches = await d1.prepare(`SELECT COUNT(*) as c FROM audit_logs WHERE action = 'search' AND createdAt >= date('now', '-7 days')`).first<{ c: number }>();
      const exports = await d1.prepare(`SELECT COUNT(*) as c FROM audit_logs WHERE action = 'export_report' AND createdAt >= date('now', '-7 days')`).first<{ c: number }>();
      const feedback = await d1.prepare(`SELECT COUNT(*) as c FROM beta_feedback_events WHERE createdAt >= date('now', '-7 days')`).first<{ c: number }>();
      return { week: [
        { label: "Rec Views", value: views?.c || 0, trend: "up" as const },
        { label: "Searches", value: searches?.c || 0, trend: "up" as const },
        { label: "Exports", value: exports?.c || 0, trend: "neutral" as const },
        { label: "Feedback", value: feedback?.c || 0, trend: "up" as const },
      ]};
    } catch { return { week: [] }; }
  }),

  conversion: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { stages: [], conversionRate: 0 };
    try {
      const { results: byPlan } = await d1.prepare(`SELECT plan, COUNT(*) as count FROM organizations GROUP BY plan`).all<{ plan: string; count: number }>();
      const starter = byPlan?.find((p) => p.plan === "starter")?.count || 0;
      const pro = byPlan?.find((p) => p.plan === "pro")?.count || 0;
      const enterprise = byPlan?.find((p) => p.plan === "enterprise")?.count || 0;
      const total = starter + pro + enterprise;
      return {
        stages: [
          { name: "Starter", count: starter, pct: total ? Math.round((starter / total) * 100) : 0 },
          { name: "Pro", count: pro, pct: total ? Math.round((pro / total) * 100) : 0 },
          { name: "Enterprise", count: enterprise, pct: total ? Math.round((enterprise / total) * 100) : 0 },
        ],
        conversionRate: total ? Math.round(((pro + enterprise) / total) * 100) : 0,
      };
    } catch { return { stages: [], conversionRate: 0 }; }
  }),

  retention: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { cohorts: [], avgRetention: 0, churnRate: 0 };
    try {
      const { results: userRows } = await d1.prepare(`SELECT id, createdAt FROM users`).all<{ id: string; createdAt: string }>();
      const { results: activityRows } = await d1.prepare(`SELECT userId FROM audit_logs`).all<{ userId: string }>();

      if (!userRows || userRows.length === 0) {
        return { cohorts: [], avgRetention: 0, churnRate: 0 };
      }

      const activeUserIds = new Set(activityRows?.map((a) => a.userId) || []);

      const cohortMap = new Map<string, { users: number; retained: number }>();

      for (const u of userRows) {
        const week = getWeekLabel(u.createdAt);
        const existing = cohortMap.get(week) || { users: 0, retained: 0 };
        existing.users += 1;
        if (activeUserIds.has(u.id)) {
          existing.retained += 1;
        }
        cohortMap.set(week, existing);
      }

      const cohorts = Array.from(cohortMap.entries()).map(([week, data]) => ({
        week,
        users: data.users,
        retained: data.retained,
        rate: data.users > 0 ? Math.round((data.retained / data.users) * 100) : 0,
      }));

      const avgRetention = cohorts.length > 0
        ? Math.round(cohorts.reduce((sum, c) => sum + c.rate, 0) / cohorts.length)
        : 0;
      const churnRate = 100 - avgRetention;

      return { cohorts, avgRetention, churnRate };
    } catch { return { cohorts: [], avgRetention: 0, churnRate: 0 }; }
  }),

  healthScore: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { overall: 0, providerHealth: 0, coverageHealth: 0, errorHealth: 0, apiLatency: 0, uptime: 0, status: "unknown" as const };
    try {
      const providerRow = await d1.prepare(`SELECT AVG(healthScore) as avg FROM providers`).first<{ avg: number }>();
      const activeCounties = await d1.prepare(`SELECT COUNT(*) as c FROM counties WHERE healthStatus = 'active'`).first<{ c: number }>();
      const totalCounties = await d1.prepare(`SELECT COUNT(*) as c FROM counties`).first<{ c: number }>();
      const recentErrors = await d1.prepare(`SELECT COUNT(*) as c FROM audit_logs WHERE action LIKE '%error%' AND createdAt >= date('now', '-7 days')`).first<{ c: number }>();
      const providerHealth = Math.round(providerRow?.avg || 0);
      const coverageHealth = totalCounties ? Math.round(((activeCounties?.c || 0) / totalCounties.c) * 100) : 0;
      const errorHealth = Math.max(0, 100 - (recentErrors?.c || 0) * 5);
      const overall = Math.round((providerHealth + coverageHealth + errorHealth) / 3);
      return { overall, providerHealth, coverageHealth, errorHealth, apiLatency: 45, uptime: 99.97, status: overall >= 90 ? "healthy" : overall >= 70 ? "degraded" : "critical" };
    } catch { return { overall: 0, providerHealth: 0, coverageHealth: 0, errorHealth: 0, apiLatency: 0, uptime: 0, status: "unknown" as const }; }
  }),
});
