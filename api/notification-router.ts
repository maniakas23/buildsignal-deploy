import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { notifications, notificationPrefs } from "../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export const notificationRouter = createRouter({
  // Get notification preferences
  getPrefs: authedQuery.query(async ({ ctx }) => {
    const prefs = await ctx.db
      .select()
      .from(notificationPrefs)
      .where(eq(notificationPrefs.userId, ctx.user.id))
      .get();

    return (
      prefs || {
        userId: ctx.user.id,
        emailEnabled: true,
        inAppEnabled: true,
        alertFrequency: "daily",
        alertTypes: '["opportunities","system"]',
      }
    );
  }),

  // Update notification preferences
  updatePrefs: authedQuery
    .input(
      z.object({
        emailEnabled: z.boolean().optional(),
        inAppEnabled: z.boolean().optional(),
        alertFrequency: z.enum(["realtime", "daily", "weekly"]).optional(),
        alertTypes: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await ctx.db
        .select()
        .from(notificationPrefs)
        .where(eq(notificationPrefs.userId, ctx.user.id))
        .get();

      const updateData: Record<string, unknown> = {};
      if (input.emailEnabled !== undefined)
        updateData.emailEnabled = input.emailEnabled;
      if (input.inAppEnabled !== undefined)
        updateData.inAppEnabled = input.inAppEnabled;
      if (input.alertFrequency) updateData.alertFrequency = input.alertFrequency;
      if (input.alertTypes) updateData.alertTypes = JSON.stringify(input.alertTypes);

      if (existing) {
        await ctx.db
          .update(notificationPrefs)
          .set({ ...updateData, updatedAt: new Date() })
          .where(eq(notificationPrefs.userId, ctx.user.id))
          .run();
      } else {
        await ctx.db
          .insert(notificationPrefs)
          .values({
            userId: ctx.user.id,
            emailEnabled: updateData.emailEnabled ?? true,
            inAppEnabled: updateData.inAppEnabled ?? true,
            alertFrequency: (updateData.alertFrequency as string) ?? "daily",
            alertTypes: (updateData.alertTypes as string) ?? '["opportunities","system"]',
          })
          .run();
      }

      return { success: true };
    }),

  // Get notification history with unread count
  history: authedQuery
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const items = await ctx.db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, ctx.user.id))
        .orderBy(desc(notifications.createdAt))
        .limit(input.limit)
        .offset(input.offset)
        .all();

      const totalResult = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(notifications)
        .where(eq(notifications.userId, ctx.user.id))
        .get();

      const unreadResult = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, ctx.user.id),
            eq(notifications.read, false)
          )
        )
        .get();

      return {
        items,
        unreadCount: unreadResult?.count ?? 0,
        total: totalResult?.count ?? 0,
      };
    }),

  // Mark a single notification as read
  markRead: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(notifications)
        .set({ read: true })
        .where(
          and(
            eq(notifications.id, input.id),
            eq(notifications.userId, ctx.user.id)
          )
        )
        .run();

      return { success: true };
    }),

  // Mark all notifications as read
  markAllRead: authedQuery.mutation(async ({ ctx }) => {
    await ctx.db
      .update(notifications)
      .set({ read: true })
      .where(
        and(
          eq(notifications.userId, ctx.user.id),
          eq(notifications.read, false)
        )
      )
      .run();

    return { success: true };
  }),

  // Delete a notification
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .delete(notifications)
        .where(
          and(
            eq(notifications.id, input.id),
            eq(notifications.userId, ctx.user.id)
          )
        )
        .run();

      return { success: true };
    }),
});

// Helper to create notifications (called by watchlist alerts, system events, etc.)
export async function createNotification(
  db: unknown,
  userId: number,
  title: string,
  message: string,
  type: string,
  link?: string
) {
  const drizzleDb = db as ReturnType<typeof import("../db/drizzle").getDrizzle>;
  return drizzleDb
    .insert(notifications)
    .values({
      userId,
      title,
      message,
      type,
      link,
      read: false,
    })
    .run();
}
