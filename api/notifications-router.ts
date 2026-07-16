import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { notifications } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const notificationsRouter = createRouter({
  list: publicQuery
    .input(z.object({ userId: z.number() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const uid = input?.userId ?? 1;
      return db.select().from(notifications).where(eq(notifications.userId, uid)).orderBy(desc(notifications.createdAt)).limit(50);
    }),

  unreadCount: publicQuery
    .input(z.object({ userId: z.number() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const uid = input?.userId ?? 1;
      const all = await db.select().from(notifications).where(eq(notifications.userId, uid));
      return all.filter((n) => !n.read).length;
    }),

  markRead: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(notifications).set({ read: true }).where(eq(notifications.id, input.id));
      return { success: true };
    }),

  markAllRead: publicQuery
    .input(z.object({ userId: z.number() }).optional())
    .mutation(async ({ input }) => {
      const db = getDb();
      const uid = input?.userId ?? 1;
      const unread = await db.select().from(notifications).where(eq(notifications.userId, uid));
      for (const n of unread.filter((n) => !n.read)) {
        await db.update(notifications).set({ read: true }).where(eq(notifications.id, n.id));
      }
      return { success: true };
    }),

  create: publicQuery
    .input(z.object({
      userId: z.number(),
      type: z.enum(["alert", "recommendation", "growth_story", "system", "billing"]),
      title: z.string(),
      message: z.string(),
      link: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(notifications).values(input);
      return { success: true };
    }),
});
