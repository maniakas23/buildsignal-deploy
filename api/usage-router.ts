import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { usageTracking } from "../db/schema";
import { and, eq, gte } from "drizzle-orm";

export const usageRouter = createRouter({
  // Get current usage
  getUsage: authedQuery.query(async ({ ctx }) => {
    const now = new Date();
    const periodDate = now.toISOString().split('T')[0];
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

    const dailyUsage = await ctx.db.select().from(usageTracking)
      .where(and(eq(usageTracking.userId, ctx.user.id), eq(usageTracking.periodDate, periodDate)))
      .all();

    const monthlyUsage = await ctx.db.select().from(usageTracking)
      .where(and(eq(usageTracking.userId, ctx.user.id), gte(usageTracking.periodDate, monthStart)))
      .all();

    return { daily: dailyUsage, monthly: monthlyUsage };
  }),
});

// Helper function for other routers to track usage
export async function trackUsage(db: any, userId: number, feature: string, count: number = 1) {
  const now = new Date();
  const periodDate = now.toISOString().split('T')[0];
  // Upsert usage record
  try {
    await db.insert(usageTracking).values({ userId, feature, count, period: "daily", periodDate }).run();
  } catch {
    // If insert fails (duplicate), ignore for now. In production, use ON CONFLICT.
  }
}
