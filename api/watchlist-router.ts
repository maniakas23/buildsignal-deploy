import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery } from "./middleware";
import { eq, and, gte, inArray } from "drizzle-orm";
import { savedAreas, signalcoreEvents } from "../db/schema";

/** Safely parse a JSON string; returns fallback on any error */
function safeJsonParse<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

export const watchlistRouter = createRouter({
  // List user's watchlists
  list: authedQuery.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(savedAreas)
      .where(eq(savedAreas.userId, ctx.user.id))
      .all();

    // Deserialize JSON fields for the response
    return rows.map((wl) => ({
      ...wl,
      states: safeJsonParse<string[]>(wl.states, []),
      counties: safeJsonParse<string[]>(wl.counties, []),
      eventTypes: safeJsonParse<string[]>(wl.eventTypes, []),
    }));
  }),

  // Create a new watchlist
  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(100),
        states: z.array(z.string()).min(1).max(10),
        counties: z.array(z.string()).optional(),
        eventTypes: z.array(z.string()).optional(),
        alertEnabled: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .insert(savedAreas)
        .values({
          userId: ctx.user.id,
          name: input.name,
          states: JSON.stringify(input.states),
          counties: input.counties ? JSON.stringify(input.counties) : null,
          eventTypes: input.eventTypes ? JSON.stringify(input.eventTypes) : null,
          alertEnabled: input.alertEnabled,
        })
        .returning()
        .get();

      return {
        ...result,
        states: safeJsonParse<string[]>(result.states, []),
        counties: safeJsonParse<string[]>(result.counties, []),
        eventTypes: safeJsonParse<string[]>(result.eventTypes, []),
      };
    }),

  // Update an existing watchlist
  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(100).optional(),
        states: z.array(z.string()).min(1).max(10).optional(),
        counties: z.array(z.string()).optional(),
        eventTypes: z.array(z.string()).optional(),
        alertEnabled: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await ctx.db
        .select()
        .from(savedAreas)
        .where(eq(savedAreas.id, input.id))
        .get();

      if (!existing || existing.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Watchlist not found",
        });
      }

      const updateData: Record<string, unknown> = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.states !== undefined) updateData.states = JSON.stringify(input.states);
      if (input.counties !== undefined)
        updateData.counties = input.counties ? JSON.stringify(input.counties) : null;
      if (input.eventTypes !== undefined)
        updateData.eventTypes = input.eventTypes ? JSON.stringify(input.eventTypes) : null;
      if (input.alertEnabled !== undefined) updateData.alertEnabled = input.alertEnabled;

      await ctx.db
        .update(savedAreas)
        .set(updateData)
        .where(eq(savedAreas.id, input.id))
        .run();

      return { success: true };
    }),

  // Delete a watchlist
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const existing = await ctx.db
        .select()
        .from(savedAreas)
        .where(eq(savedAreas.id, input.id))
        .get();

      if (!existing || existing.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Watchlist not found",
        });
      }

      await ctx.db
        .delete(savedAreas)
        .where(eq(savedAreas.id, input.id))
        .run();

      return { success: true };
    }),

  // Get a single watchlist with matching events
  getWithEvents: authedQuery
    .input(
      z.object({
        id: z.number(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ input, ctx }) => {
      const watchlist = await ctx.db
        .select()
        .from(savedAreas)
        .where(eq(savedAreas.id, input.id))
        .get();

      if (!watchlist || watchlist.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Watchlist not found",
        });
      }

      const states = safeJsonParse<string[]>(watchlist.states, []);
      const counties = safeJsonParse<string[]>(watchlist.counties, []);
      const eventTypes = safeJsonParse<string[]>(watchlist.eventTypes, []);

      if (states.length === 0) {
        return {
          watchlist: {
            ...watchlist,
            states,
            counties,
            eventTypes,
          },
          events: [],
        };
      }

      const conditions = [inArray(signalcoreEvents.state, states)];
      if (counties.length > 0) {
        conditions.push(inArray(signalcoreEvents.county, counties));
      }
      if (eventTypes.length > 0) {
        conditions.push(inArray(signalcoreEvents.eventType, eventTypes));
      }

      const events = await ctx.db
        .select()
        .from(signalcoreEvents)
        .where(and(...conditions))
        .limit(input.limit)
        .all();

      return {
        watchlist: {
          ...watchlist,
          states,
          counties,
          eventTypes,
        },
        events,
      };
    }),

  // Check all watchlists for new events (last 24h)
  checkAlerts: authedQuery.query(async ({ ctx }) => {
    const watchlists = await ctx.db
      .select()
      .from(savedAreas)
      .where(eq(savedAreas.userId, ctx.user.id))
      .all();

    const alerts: Array<{
      watchlist: Record<string, unknown>;
      events: unknown[];
      alertCount: number;
    }> = [];

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    for (const wl of watchlists) {
      if (!wl.alertEnabled) continue;

      const states = safeJsonParse<string[]>(wl.states, []);
      const counties = safeJsonParse<string[]>(wl.counties, []);
      const eventTypes = safeJsonParse<string[]>(wl.eventTypes, []);

      if (states.length === 0) continue;

      const conditions = [
        inArray(signalcoreEvents.state, states),
        gte(signalcoreEvents.createdAt, oneDayAgo),
      ];
      if (counties.length > 0) {
        conditions.push(inArray(signalcoreEvents.county, counties));
      }
      if (eventTypes.length > 0) {
        conditions.push(inArray(signalcoreEvents.eventType, eventTypes));
      }

      const events = await ctx.db
        .select()
        .from(signalcoreEvents)
        .where(and(...conditions))
        .all();

      if (events.length > 0) {
        alerts.push({
          watchlist: {
            ...wl,
            states,
            counties,
            eventTypes,
          },
          events,
          alertCount: events.length,
        });
      }
    }

    return alerts;
  }),
});
