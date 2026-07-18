/**
 * Beta Feedback Instrumentation Router
 */

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";

export const betaFeedbackRouter = createRouter({
  record: publicQuery.input(z.object({
    eventType: z.enum([
      "opportunity_viewed", "opportunity_saved", "opportunity_dismissed",
      "recommendation_acted_upon", "recommendation_ignored",
      "alert_subscribed", "alert_unsubscribed",
      "county_followed", "county_unfollowed",
      "search_performed", "growth_story_viewed", "growth_story_shared",
      "timeline_viewed", "explainability_viewed", "filter_applied",
      "sort_changed", "page_viewed",
    ]),
    entityId: z.string().optional(), entityType: z.string().optional(), metadata: z.record(z.unknown()).optional(),
  })).mutation(async ({ input, ctx }) => {
    const db = getDb();
    await db.insert(schema.betaFeedbackEvents).values({
      userId: ctx.user?.id ?? null, eventType: input.eventType,
      entityId: input.entityId ?? null, entityType: input.entityType ?? null,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    });
    return { success: true };
  }),

  stats: publicQuery.input(z.object({ userId: z.number() }).optional()).query(async ({ input, ctx }) => {
    const db = getDb();
    const userId = input?.userId ?? ctx.user?.id;
    if (!userId) return { events: [], count: 0 };
    const events = await db.select().from(schema.betaFeedbackEvents).where(schema.betaFeedbackEvents.userId === userId).limit(1000);
    return { events, count: events.length };
  }),

  popularOpportunities: publicQuery.query(async () => {
    const db = getDb();
    const events = await db.select().from(schema.betaFeedbackEvents).where(schema.betaFeedbackEvents.eventType === "opportunity_viewed").limit(1000);
    const counts: Record<string, number> = {};
    for (const e of events) { if (e.entityId) counts[e.entityId] = (counts[e.entityId] || 0) + 1; }
    return Object.entries(counts).map(([id, count]) => ({ id, count })).sort((a, b) => b.count - a.count).slice(0, 20);
  }),
});
