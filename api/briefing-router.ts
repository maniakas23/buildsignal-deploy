import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { dailyBriefings } from "@db/schema-sqlite";
import { eq, desc, and } from "drizzle-orm";
import { getDbFromContext } from "./queries/connection";

export const briefingRouter = createRouter({
  list: publicQuery.input(z.object({
    category: z.string().optional(),
    limit: z.number().min(1).max(100).optional().default(30),
  }).optional()).query(async ({ ctx, input }) => {
    const db = getDbFromContext(ctx.env);
    const conditions = [];
    if (input?.category) conditions.push(eq(dailyBriefings.category, input.category));
    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const rows = await db.select().from(dailyBriefings).where(where).orderBy(desc(dailyBriefings.briefingDate)).limit(input?.limit || 30);
    return { briefings: rows, total: rows.length };
  }),

  create: publicQuery.input(z.object({
    title: z.string().min(1), category: z.enum(["new_opportunities","validation_alerts","enrichment_updates","confidence_changes","provider_health","expansion_progress","system_metrics","quality_scores","executive_summary"]),
    summary: z.string(), details: z.string().optional(), actionItems: z.string().optional(),
    priority: z.enum(["low","medium","high","critical"]).default("medium"),
    county: z.string().optional(), state: z.string().optional(),
    tags: z.string().optional(),
  })).mutation(async ({ ctx, input }) => {
    const db = getDbFromContext(ctx.env);
    const result = await db.insert(dailyBriefings).values({ ...input, briefingDate: new Date() }).returning();
    return { success: true, briefing: result[0] };
  }),

  markRead: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const db = getDbFromContext(ctx.env);
    await db.update(dailyBriefings).set({ isRead: true }).where(eq(dailyBriefings.id, input.id));
    return { success: true };
  }),

  today: publicQuery.query(async ({ ctx }) => {
    const db = getDbFromContext(ctx.env);
    const today = new Date().toISOString().slice(0, 10);
    // Fetch recent briefings and filter in JS (D1-compatible, avoids sql template literal)
    const rows = await db.select().from(dailyBriefings).orderBy(desc(dailyBriefings.briefingDate)).limit(200);
    const filtered = rows.filter((r: any) => {
      const d = r.briefingDate ? new Date(r.briefingDate).toISOString().slice(0, 10) : "";
      return d === today;
    });
    const unread = filtered.filter((r: any) => !r.isRead);
    const critical = filtered.filter((r: any) => r.priority === "critical");
    const high = filtered.filter((r: any) => r.priority === "high");
    return { briefings: filtered, total: filtered.length, unreadCount: unread.length, criticalCount: critical.length, highPriorityCount: high.length };
  }),

  dashboard: publicQuery.query(async ({ ctx }) => {
    const db = getDbFromContext(ctx.env);
    const last7 = await db.select().from(dailyBriefings).orderBy(desc(dailyBriefings.briefingDate)).limit(100);
    const catMap = new Map(); const trendMap = new Map();
    for (const b of last7) {
      catMap.set(b.category, (catMap.get(b.category) || 0) + 1);
      const d = new Date(b.briefingDate).toISOString().slice(0, 10);
      if (!trendMap.has(d)) trendMap.set(d, { date: d, count: 0, critical: 0, high: 0 });
      const td = trendMap.get(d); td.count++; if (b.priority === "critical") td.critical++; if (b.priority === "high") td.high++;
    }
    return { totalBriefings: last7.length, byCategory: Array.from(catMap.entries()).map(([c, n]) => ({ category: c, count: n })), unreadCount: last7.filter((b: any) => !b.isRead).length, dailyTrend: Array.from(trendMap.values()).sort((a: any, b: any) => a.date.localeCompare(b.date)).slice(-7) };
  }),

  categories: publicQuery.query(() => ({
    categories: [
      { id: "new_opportunities", label: "New Opportunities", description: "Fresh intelligence on construction and development opportunities" },
      { id: "validation_alerts", label: "Validation Alerts", description: "Data quality issues requiring attention" },
      { id: "enrichment_updates", label: "Enrichment Updates", description: "New context data added to existing events" },
      { id: "confidence_changes", label: "Confidence Changes", description: "Significant shifts in recommendation confidence" },
      { id: "provider_health", label: "Provider Health", description: "Data source status and performance" },
      { id: "expansion_progress", label: "Expansion Progress", description: "New jurisdictions and coverage updates" },
      { id: "system_metrics", label: "System Metrics", description: "Platform performance and reliability" },
      { id: "quality_scores", label: "Quality Scores", description: "Accuracy and precision tracking" },
      { id: "executive_summary", label: "Executive Summary", description: "High-level daily overview for leadership" },
    ],
  })),
});
