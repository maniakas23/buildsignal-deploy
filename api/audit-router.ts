/**
 * Audit Router — Gate 13 Section 12
 */

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

function getD1(ctx: any): D1Database | null {
  return (ctx.env?.DB as D1Database) || null;
}

export const auditRouter = createRouter({
  log: publicQuery
    .input(z.object({ userId: z.number().optional(), userEmail: z.string().optional(), orgId: z.number().optional(), action: z.string(), resource: z.string().optional(), resourceId: z.string().optional(), details: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { success: false };
      try {
        await d1.prepare(`INSERT INTO audit_logs (userId, userEmail, orgId, action, resource, resourceId, details) VALUES (?, ?, ?, ?, ?, ?, ?)`)
          .bind(input.userId || null, input.userEmail || null, input.orgId || null, input.action, input.resource || null, input.resourceId || null, input.details || null).run();
        return { success: true };
      } catch { return { success: false }; }
    }),

  query: publicQuery
    .input(z.object({ userId: z.number().optional(), orgId: z.number().optional(), action: z.string().optional(), limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { logs: [], total: 0 };
      try {
        let sql = `SELECT * FROM audit_logs WHERE 1=1`; const params: (string | number)[] = [];
        if (input?.userId) { sql += ` AND userId = ?`; params.push(input.userId); }
        if (input?.orgId) { sql += ` AND orgId = ?`; params.push(input.orgId); }
        if (input?.action) { sql += ` AND action = ?`; params.push(input.action); }
        sql += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`; params.push(input?.limit || 50, input?.offset || 0);
        const { results } = await d1.prepare(sql).bind(...params).all();
        let countSql = `SELECT COUNT(*) as c FROM audit_logs WHERE 1=1`; const countParams: (string | number)[] = [];
        if (input?.userId) { countSql += ` AND userId = ?`; countParams.push(input.userId); }
        if (input?.orgId) { countSql += ` AND orgId = ?`; countParams.push(input.orgId); }
        if (input?.action) { countSql += ` AND action = ?`; countParams.push(input.action); }
        const countRow = await d1.prepare(countSql).bind(...countParams).first<{ c: number }>();
        return { logs: results || [], total: countRow?.c || 0 };
      } catch { return { logs: [], total: 0 }; }
    }),

  summary: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { totalEvents: 0, todayEvents: 0, uniqueUsers: 0, topActions: [] };
    try {
      const totalRow = await d1.prepare(`SELECT COUNT(*) as c FROM audit_logs`).first<{ c: number }>();
      const todayRow = await d1.prepare(`SELECT COUNT(*) as c FROM audit_logs WHERE createdAt >= date('now')`).first<{ c: number }>();
      const userRow = await d1.prepare(`SELECT COUNT(DISTINCT userId) as c FROM audit_logs`).first<{ c: number }>();
      const { results: topActions } = await d1.prepare(`SELECT action, COUNT(*) as count FROM audit_logs GROUP BY action ORDER BY count DESC LIMIT 6`).all<{ action: string; count: number }>();
      return { totalEvents: totalRow?.c || 0, todayEvents: todayRow?.c || 0, uniqueUsers: userRow?.c || 0, topActions: topActions || [] };
    } catch { return { totalEvents: 0, todayEvents: 0, uniqueUsers: 0, topActions: [] }; }
  }),
});

export const feedbackQueueRouter = createRouter({
  list: publicQuery
    .input(z.object({ status: z.enum(["open", "closed", "all"]).default("all"), limit: z.number().default(50) }).optional())
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { items: [] };
      try {
        let sql = `SELECT * FROM feedback_queue`;
        if (input?.status && input.status !== "all") sql += ` WHERE status = '${input.status}'`;
        sql += ` ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END, createdAt DESC LIMIT ?`;
        const { results } = await d1.prepare(sql).bind(input?.limit || 50).all();
        return { items: results || [] };
      } catch { return { items: [] }; }
    }),

  updateStatus: publicQuery
    .input(z.object({ id: z.number(), status: z.enum(["open", "in_progress", "closed"]), adminNotes: z.string().optional(), assignedTo: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { success: false };
      try {
        await d1.prepare(`UPDATE feedback_queue SET status = ?, adminNotes = COALESCE(?, adminNotes), assignedTo = COALESCE(?, assignedTo), updatedAt = datetime('now') WHERE id = ?`)
          .bind(input.status, input.adminNotes || null, input.assignedTo || null, input.id).run();
        return { success: true };
      } catch { return { success: false }; }
    }),

  stats: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { total: 0, open: 0, closed: 0, byType: [] };
    try {
      const totalRow = await d1.prepare(`SELECT COUNT(*) as c FROM feedback_queue`).first<{ c: number }>();
      const openRow = await d1.prepare(`SELECT COUNT(*) as c FROM feedback_queue WHERE status = 'open'`).first<{ c: number }>();
      const { results: byType } = await d1.prepare(`SELECT type, COUNT(*) as count FROM feedback_queue GROUP BY type`).all<{ type: string; count: number }>();
      return { total: totalRow?.c || 0, open: openRow?.c || 0, closed: (totalRow?.c || 0) - (openRow?.c || 0), byType: byType || [] };
    } catch { return { total: 0, open: 0, closed: 0, byType: [] }; }
  }),
});
