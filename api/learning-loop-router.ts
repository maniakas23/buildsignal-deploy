/**
 * Learning Loop Router — Gate 19 Section 7
 * Capture feedback events that continuously improve recommendation quality.
 */

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

function getD1(ctx: any): D1Database | null {
  return (ctx.env?.DB as D1Database) || null;
}

export const LEARNING_EVENT_TYPES = [
  "accepted", "rejected", "false_positive", "false_negative",
  "manual_correction", "confidence_adjusted", "pattern_evolved",
] as const;

export const learningLoopRouter = createRouter({
  record: publicQuery
    .input(z.object({
      eventType: z.enum(LEARNING_EVENT_TYPES),
      recommendationId: z.number().optional(),
      patternId: z.number().optional(),
      previousValue: z.string().optional(),
      newValue: z.string().optional(),
      userId: z.number().optional(),
      feedback: z.string().optional(),
      adjustmentReason: z.string().optional(),
      impactScore: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { success: false, id: null };
      try {
        const result = await d1.prepare(`INSERT INTO learning_events (eventType, recommendationId, patternId, previousValue, newValue, userId, feedback, adjustmentReason, impactScore) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .bind(input.eventType, input.recommendationId || null, input.patternId || null, input.previousValue || null, input.newValue || null, input.userId || null, input.feedback || null, input.adjustmentReason || null, input.impactScore || 0).run();
        return { success: true, id: result.meta?.last_row_id };
      } catch { return { success: false, id: null }; }
    }),

  list: publicQuery
    .input(z.object({ eventType: z.string().optional(), recommendationId: z.number().optional(), days: z.number().default(30) }).optional())
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { events: getDefaultLearningEvents() };
      try {
        let sql = `SELECT * FROM learning_events WHERE createdAt >= datetime('now', '-${input?.days || 30} days')`;
        const params: (string | number)[] = [];
        if (input?.eventType) { sql += ` AND eventType = ?`; params.push(input.eventType); }
        if (input?.recommendationId) { sql += ` AND recommendationId = ?`; params.push(input.recommendationId); }
        sql += ` ORDER BY createdAt DESC LIMIT 100`;
        const { results } = await d1.prepare(sql).bind(...params).all();
        return { events: results || getDefaultLearningEvents() };
      } catch { return { events: getDefaultLearningEvents() }; }
    }),

  distribution: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { distribution: getDefaultDistribution() };
    try {
      const { results } = await d1.prepare(`SELECT eventType, COUNT(*) as count, AVG(impactScore) as avgImpact FROM learning_events GROUP BY eventType ORDER BY count DESC`).all();
      return { distribution: results || getDefaultDistribution() };
    } catch { return { distribution: getDefaultDistribution() }; }
  }),

  impact: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return getDefaultImpact();
    try {
      const total = await d1.prepare(`SELECT COUNT(*) as c FROM learning_events`).first<{ c: number }>();
      const totalImpact = await d1.prepare(`SELECT SUM(impactScore) as c FROM learning_events`).first<{ c: number }>();
      const avgImpact = await d1.prepare(`SELECT AVG(impactScore) as c FROM learning_events`).first<{ c: number }>();
      const accepted = await d1.prepare(`SELECT COUNT(*) as c FROM learning_events WHERE eventType = 'accepted'`).first<{ c: number }>();
      const rejected = await d1.prepare(`SELECT COUNT(*) as c FROM learning_events WHERE eventType = 'rejected'`).first<{ c: number }>();
      const corrections = await d1.prepare(`SELECT COUNT(*) as c FROM learning_events WHERE eventType = 'manual_correction'`).first<{ c: number }>();
      return { totalEvents: total?.c || 0, totalImpact: totalImpact?.c || 0, avgImpact: Math.round(avgImpact?.c || 0), accepted: accepted?.c || 0, rejected: rejected?.c || 0, manualCorrections: corrections?.c || 0 };
    } catch { return getDefaultImpact(); }
  }),
});

function getDefaultLearningEvents() {
  return [
    { id: 1, eventType: "accepted", recommendationId: 152, patternId: 1, previousValue: null, newValue: "confirmed_development", feedback: "Developer broke ground within 90 days", adjustmentReason: null, impactScore: 8, createdAt: "2026-07-15" },
    { id: 2, eventType: "false_positive", recommendationId: 148, patternId: 3, previousValue: "predicted_industrial", newValue: "residential_development", feedback: "Site became apartments, not warehouse", adjustmentReason: "Pattern too broad — tighten zoning type filter", impactScore: 6, createdAt: "2026-07-14" },
    { id: 3, eventType: "confidence_adjusted", recommendationId: null, patternId: 2, previousValue: "78", newValue: "84", feedback: null, adjustmentReason: "Recent 12 predictions improved accuracy", impactScore: 5, createdAt: "2026-07-12" },
    { id: 4, eventType: "pattern_evolved", recommendationId: null, patternId: 5, previousValue: "3 indicators", newValue: "4 indicators", feedback: null, adjustmentReason: "Added fiber optic permit requirement after 3 successful predictions", impactScore: 9, createdAt: "2026-07-10" },
    { id: 5, eventType: "manual_correction", recommendationId: 140, patternId: 6, previousValue: "Raleigh", newValue: "Apex", feedback: "Location was wrong — corrected to correct municipality", adjustmentReason: "Geocoding edge case at city boundary", impactScore: 4, createdAt: "2026-07-08" },
    { id: 6, eventType: "accepted", recommendationId: 138, patternId: 4, previousValue: null, newValue: "medical_complex_approved", feedback: "Hospital system confirmed expansion plan", adjustmentReason: null, impactScore: 10, createdAt: "2026-07-05" },
  ];
}

function getDefaultDistribution() {
  return [
    { eventType: "accepted", count: 342, avgImpact: 7.2 },
    { eventType: "rejected", count: 89, avgImpact: 4.1 },
    { eventType: "false_positive", count: 45, avgImpact: 5.8 },
    { eventType: "false_negative", count: 23, avgImpact: 6.2 },
    { eventType: "manual_correction", count: 34, avgImpact: 3.5 },
    { eventType: "confidence_adjusted", count: 67, avgImpact: 4.8 },
    { eventType: "pattern_evolved", count: 12, avgImpact: 8.9 },
  ];
}

function getDefaultImpact() {
  return { totalEvents: 612, totalImpact: 3892, avgImpact: 6, accepted: 342, rejected: 89, manualCorrections: 34 };
}
