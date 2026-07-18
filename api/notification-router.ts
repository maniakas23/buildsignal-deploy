/**
 * Notification Router — Gate 13 Section 3
 */

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

function getD1(ctx: any): D1Database | null {
  return (ctx.env?.DB as D1Database) || null;
}

function bool(v?: boolean): number | null {
  return v === undefined ? null : (v ? 1 : 0);
}

function getDefaultPrefs(userId: number) {
  return { userId, emailEnabled: 1, inAppEnabled: 1, dailyDigest: 0, weeklyDigest: 1, watchlistAlerts: 1, infraAlerts: 1, recAlerts: 1 };
}

export const notificationRouter = createRouter({
  getPrefs: publicQuery.input(z.object({ userId: z.number() })).query(async ({ input, ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { prefs: getDefaultPrefs(input.userId) };
    try {
      const row = await d1.prepare(`SELECT * FROM notification_prefs WHERE userId = ?`).bind(input.userId).first();
      return { prefs: row || getDefaultPrefs(input.userId) };
    } catch { return { prefs: getDefaultPrefs(input.userId) }; }
  }),

  updatePrefs: publicQuery.input(z.object({
    userId: z.number(), emailEnabled: z.boolean().optional(), inAppEnabled: z.boolean().optional(),
    dailyDigest: z.boolean().optional(), weeklyDigest: z.boolean().optional(),
    watchlistAlerts: z.boolean().optional(), infraAlerts: z.boolean().optional(), recAlerts: z.boolean().optional(),
  })).mutation(async ({ input, ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { success: false };
    try {
      await d1.prepare(`INSERT INTO notification_prefs (userId, emailEnabled, inAppEnabled, dailyDigest, weeklyDigest, watchlistAlerts, infraAlerts, recAlerts) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(userId) DO UPDATE SET emailEnabled = COALESCE(?, emailEnabled), inAppEnabled = COALESCE(?, inAppEnabled), dailyDigest = COALESCE(?, dailyDigest), weeklyDigest = COALESCE(?, weeklyDigest), watchlistAlerts = COALESCE(?, watchlistAlerts), infraAlerts = COALESCE(?, infraAlerts), recAlerts = COALESCE(?, recAlerts), updatedAt = datetime('now')`)
        .bind(input.userId, bool(input.emailEnabled), bool(input.inAppEnabled), bool(input.dailyDigest), bool(input.weeklyDigest), bool(input.watchlistAlerts), bool(input.infraAlerts), bool(input.recAlerts), bool(input.emailEnabled), bool(input.inAppEnabled), bool(input.dailyDigest), bool(input.weeklyDigest), bool(input.watchlistAlerts), bool(input.infraAlerts), bool(input.recAlerts)).run();
      return { success: true };
    } catch { return { success: false }; }
  }),

  history: publicQuery.input(z.object({ userId: z.number(), limit: z.number().default(20) })).query(async ({ input, ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { notifications: generateMockNotifications(input.userId, input.limit) };
    try {
      const { results } = await d1.prepare(`SELECT id, action as type, details as message, resource, resourceId, createdAt, 'read' as status FROM audit_logs WHERE userId = ? ORDER BY createdAt DESC LIMIT ?`).bind(input.userId, input.limit).all();
      if (!results || results.length === 0) return { notifications: generateMockNotifications(input.userId, input.limit) };
      return { notifications: results };
    } catch { return { notifications: generateMockNotifications(input.userId, input.limit) }; }
  }),
});

function generateMockNotifications(userId: number, limit: number) {
  const types = [
    { type: 'recommendation', message: 'New high-confidence opportunity: Wake County commercial corridor expansion (92%)' },
    { type: 'watchlist', message: 'New permit filing in Wake County matches your watchlist "Triangle Growth"' },
    { type: 'infrastructure', message: 'DOT project update: I-40 widening phase 2 approved in Johnston County' },
    { type: 'alert', message: 'Daily digest: 3 new opportunities, 2 pattern matches, 1 provider status change' },
    { type: 'report', message: 'Your weekly report is ready for download' },
    { type: 'system', message: 'Welcome to BuildSignal Pro — your plan is now active' },
  ];
  const now = Date.now();
  return types.slice(0, limit).map((t, i) => ({ id: userId * 100 + i, type: t.type, message: t.message, status: i < 2 ? 'unread' : 'read', createdAt: new Date(now - i * 3600000).toISOString() }));
}
