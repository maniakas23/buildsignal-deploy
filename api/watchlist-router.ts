import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { watchlists, watchlistItems, kestovarCanonicalEvents } from "@db/schema-sqlite";
import { eq, and, desc, sql } from "drizzle-orm";
import { getDbFromContext } from "./queries/connection";

export const watchlistRouter = createRouter({
  // ── List user's watchlists ─────────────────────────────
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDbFromContext();
    const userId = ctx.user.id;

    const lists = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, userId))
      .orderBy(desc(watchlists.updatedAt))
      .all();

    return { watchlists: lists, total: lists.length };
  }),

  // ── Get a single watchlist with items ──────────────────
  get: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDbFromContext();
      const userId = ctx.user.id;

      const watchlist = await db
        .select()
        .from(watchlists)
        .where(and(eq(watchlists.id, input.id), eq(watchlists.userId, userId)))
        .get();

      if (!watchlist) throw new Error("Watchlist not found");

      const items = await db
        .select()
        .from(watchlistItems)
        .where(eq(watchlistItems.watchlistId, input.id))
        .orderBy(desc(watchlistItems.createdAt))
        .all();

      // Fetch signal details for each item
      const signalIds = items.map((item) => item.signalId).filter(Boolean);
      const signals = signalIds.length > 0
        ? await db
            .select()
            .from(kestovarCanonicalEvents)
            .where(sql`${kestovarCanonicalEvents.canonicalId} IN (${signalIds.map(() => "?").join(", ")})`, ...signalIds)
            .all()
        : [];

      const signalMap = new Map(signals.map((s) => [s.canonicalId, s]));

      return {
        watchlist,
        items: items.map((item) => ({
          ...item,
          signal: signalMap.get(item.signalId) || null,
        })),
      };
    }),

  // ── Create a new watchlist ─────────────────────────────
  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        filters: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDbFromContext();
      const userId = ctx.user.id;

      const result = await db
        .insert(watchlists)
        .values({
          userId,
          name: input.name,
          description: input.description,
          filters: input.filters ? JSON.stringify(input.filters) : null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          provenance: "LIVE",
        })
        .returning();

      return result[0];
    }),

  // ── Update a watchlist ─────────────────────────────────
  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
        filters: z.record(z.unknown()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDbFromContext();
      const userId = ctx.user.id;
      const { id, ...updates } = input;

      const watchlist = await db
        .select()
        .from(watchlists)
        .where(and(eq(watchlists.id, id), eq(watchlists.userId, userId)))
        .get();

      if (!watchlist) throw new Error("Watchlist not found");

      const result = await db
        .update(watchlists)
        .set({
          ...updates,
          filters: updates.filters ? JSON.stringify(updates.filters) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(watchlists.id, id))
        .returning();

      return result[0];
    }),

  // ── Delete a watchlist ─────────────────────────────────
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDbFromContext();
      const userId = ctx.user.id;

      const watchlist = await db
        .select()
        .from(watchlists)
        .where(and(eq(watchlists.id, input.id), eq(watchlists.userId, userId)))
        .get();

      if (!watchlist) throw new Error("Watchlist not found");

      // Delete items first
      await db.delete(watchlistItems).where(eq(watchlistItems.watchlistId, input.id));
      // Delete watchlist
      await db.delete(watchlists).where(eq(watchlists.id, input.id));

      return { success: true };
    }),

  // ── Add item to watchlist ──────────────────────────────
  addItem: authedQuery
    .input(
      z.object({
        watchlistId: z.number(),
        signalId: z.string(),
        notes: z.string().max(1000).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDbFromContext();
      const userId = ctx.user.id;

      const watchlist = await db
        .select()
        .from(watchlists)
        .where(and(eq(watchlists.id, input.watchlistId), eq(watchlists.userId, userId)))
        .get();

      if (!watchlist) throw new Error("Watchlist not found");

      // Verify signal exists
      const signal = await db
        .select()
        .from(kestovarCanonicalEvents)
        .where(eq(kestovarCanonicalEvents.canonicalId, input.signalId))
        .get();

      if (!signal) throw new Error("Signal not found");

      const result = await db
        .insert(watchlistItems)
        .values({
          watchlistId: input.watchlistId,
          signalId: input.signalId,
          notes: input.notes,
          status: "active",
          createdAt: new Date(),
        })
        .returning();

      return result[0];
    }),

  // ── Remove item from watchlist ─────────────────────────
  removeItem: authedQuery
    .input(z.object({ watchlistId: z.number(), itemId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDbFromContext();
      const userId = ctx.user.id;

      const watchlist = await db
        .select()
        .from(watchlists)
        .where(and(eq(watchlists.id, input.watchlistId), eq(watchlists.userId, userId)))
        .get();

      if (!watchlist) throw new Error("Watchlist not found");

      await db
        .delete(watchlistItems)
        .where(and(eq(watchlistItems.id, input.itemId), eq(watchlistItems.watchlistId, input.watchlistId)));

      return { success: true };
    }),

  // ── Update item notes ──────────────────────────────────
  updateItem: authedQuery
    .input(
      z.object({
        watchlistId: z.number(),
        itemId: z.number(),
        notes: z.string().max(1000).optional(),
        status: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDbFromContext();
      const userId = ctx.user.id;
      const { watchlistId, itemId, ...updates } = input;

      const watchlist = await db
        .select()
        .from(watchlists)
        .where(and(eq(watchlists.id, watchlistId), eq(watchlists.userId, userId)))
        .get();

      if (!watchlist) throw new Error("Watchlist not found");

      const result = await db
        .update(watchlistItems)
        .set(updates)
        .where(and(eq(watchlistItems.id, itemId), eq(watchlistItems.watchlistId, watchlistId)))
        .returning();

      return result[0];
    }),
});
