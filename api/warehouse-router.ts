import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { historicalWarehouse } from "@db/schema-sqlite";
import { eq, desc, and } from "drizzle-orm";
import { getDbFromContext } from "./queries/connection";

export const warehouseRouter = createRouter({
  list: publicQuery.input(z.object({
    entityType: z.string().optional(), entityId: z.number().optional(),
    eventType: z.string().optional(), county: z.string().optional(), state: z.string().optional(),
    year: z.number().optional(), limit: z.number().min(1).max(1000).optional().default(100),
  }).optional()).query(async ({ ctx, input }) => {
    const db = getDbFromContext(ctx.env);
    const conditions = [];
    if (input?.entityType) conditions.push(eq(historicalWarehouse.entityType, input.entityType));
    if (input?.entityId) conditions.push(eq(historicalWarehouse.entityId, input.entityId));
    if (input?.eventType) conditions.push(eq(historicalWarehouse.eventType, input.eventType));
    if (input?.county) conditions.push(eq(historicalWarehouse.county, input.county));
    if (input?.state) conditions.push(eq(historicalWarehouse.state, input.state));
    if (input?.year) {
      const y = String(input.year);
      const all = await db.select().from(historicalWarehouse).orderBy(desc(historicalWarehouse.snapshotDate));
      const filtered = all.filter((r: any) => {
        const d = r.snapshotDate ? new Date(r.snapshotDate).getFullYear() : 0;
        return d === input.year;
      });
      return { snapshots: filtered.slice(0, input?.limit || 100), total: filtered.length };
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const rows = await db.select().from(historicalWarehouse).where(where).orderBy(desc(historicalWarehouse.snapshotDate)).limit(input?.limit || 100);
    return { snapshots: rows, total: rows.length };
  }),

  store: publicQuery.input(z.object({
    entityType: z.string(), entityId: z.number(), eventType: z.string(),
    county: z.string(), state: z.string(), snapshotData: z.string(),
    eventDate: z.string().optional(), confidence: z.number().optional(),
  })).mutation(async ({ ctx, input }) => {
    const db = getDbFromContext(ctx.env);
    const result = await db.insert(historicalWarehouse).values({
      ...input, eventDate: input.eventDate ? new Date(input.eventDate) : undefined,
      snapshotDate: new Date(),
    }).returning();
    return { success: true, snapshot: result[0] };
  }),

  compare: publicQuery.input(z.object({ entityType: z.string(), entityId: z.number(), startDate: z.string(), endDate: z.string() })).query(async ({ ctx, input }) => {
    const db = getDbFromContext(ctx.env);
    const rows = await db.select().from(historicalWarehouse)
      .where(and(eq(historicalWarehouse.entityType, input.entityType), eq(historicalWarehouse.entityId, input.entityId)))
      .orderBy(desc(historicalWarehouse.snapshotDate));
    const filtered = rows.filter((r: any) => { const d = (r as any).snapshotDate as string; return d >= input.startDate && d <= input.endDate; });
    return { snapshots: filtered, entityType: input.entityType, entityId: input.entityId, period: `${input.startDate} to ${input.endDate}` };
  }),

  trends: publicQuery.input(z.object({ county: z.string().optional(), state: z.string().optional(), years: z.number().optional().default(3) })).query(async ({ ctx, input }) => {
    const db = getDbFromContext(ctx.env);
    const since = new Date(); since.setFullYear(since.getFullYear() - (input.years || 3));
    const rows = await db.select().from(historicalWarehouse).orderBy(desc(historicalWarehouse.snapshotDate));
    let filtered = rows;
    if (input?.county) filtered = filtered.filter((r: any) => r.county === input.county);
    if (input?.state) filtered = filtered.filter((r: any) => r.state === input.state);
    filtered = filtered.filter((r: any) => { const d = new Date((r as any).snapshotDate); return d >= since; });
    const yearMap = new Map();
    for (const r of filtered) { const y = new Date((r as any).snapshotDate).getFullYear(); if (!yearMap.has(y)) yearMap.set(y, []); yearMap.get(y).push(r); }
    const yearlyTrends = Array.from(yearMap.entries()).sort(([a]: [any, any], [b]: [any, any]) => a - b).map(([year, records]: [any, any]) => ({ year, count: records.length }));
    const typeMap = new Map(); for (const r of filtered) { typeMap.set(r.eventType, (typeMap.get(r.eventType) || 0) + 1); }
    return { totalSnapshots: filtered.length, yearlyTrends, byEventType: Array.from(typeMap.entries()).map(([t, c]) => ({ type: t, count: c })), periodYears: input.years || 3 };
  }),

  stats: publicQuery.query(async ({ ctx }) => {
    const db = getDbFromContext(ctx.env);
    // Use JS count instead of sql template literal for D1 compatibility
    const rows = await db.select().from(historicalWarehouse).orderBy(desc(historicalWarehouse.snapshotDate));
    const count = rows.length;
    const earliest = count > 0 ? rows[count - 1] : null;
    const latest = count > 0 ? rows[0] : null;
    return {
      totalSnapshots: count,
      dateRange: {
        earliest: earliest?.snapshotDate ?? null,
        latest: latest?.snapshotDate ?? null,
      },
    };
  }),
});
