import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { subscriptionEvents, users } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const billingRouter = createRouter({
  getPlan: publicQuery
    .input(z.object({ userId: z.number() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const uid = input?.userId ?? 1;
      const results = await db.select().from(users).where(eq(users.id, uid)).limit(1);
      const user = results[0];
      return {
        plan: user?.plan ?? "starter",
        trialDaysLeft: 14,
        isTrial: true,
        features: getPlanFeatures(user?.plan ?? "starter"),
      };
    }),

  recordEvent: publicQuery
    .input(z.object({
      userId: z.number(),
      event: z.enum(["trial_started", "trial_expired", "subscribed", "upgraded", "downgraded", "cancelled", "payment_failed", "payment_succeeded"]),
      plan: z.enum(["starter", "pro", "enterprise"]),
      amount: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(subscriptionEvents).values(input);
      if (["subscribed", "upgraded", "downgraded"].includes(input.event)) {
        await db.update(users).set({ plan: input.plan }).where(eq(users.id, input.userId));
      }
      return { success: true };
    }),

  history: publicQuery
    .input(z.object({ userId: z.number() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const uid = input?.userId ?? 1;
      return db.select().from(subscriptionEvents).where(eq(subscriptionEvents.userId, uid)).orderBy(desc(subscriptionEvents.createdAt)).limit(50);
    }),
});

function getPlanFeatures(plan: string) {
  const plans: Record<string, { zones: number | string; alerts: number | string; stories: number | string; exports: number | string; patterns: string; api: boolean; team: number | string }> = {
    starter: { zones: 3, alerts: 50, stories: 10, exports: 5, patterns: "3 basic", api: false, team: 1 },
    pro: { zones: "Unlimited", alerts: "Unlimited", stories: "Unlimited", exports: "Unlimited", patterns: "All", api: true, team: 5 },
    enterprise: { zones: "Unlimited", alerts: "Unlimited", stories: "Unlimited", exports: "Unlimited", patterns: "All + custom", api: true, team: "Unlimited" },
  };
  return plans[plan] ?? plans.starter;
}
