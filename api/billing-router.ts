import { z } from "zod";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { createRouter, authedQuery } from "./middleware";
import { users, subscriptionEvents } from "../db/schema";
import { eq, desc } from "drizzle-orm";

function getStripe(secretKey: string | unknown): Stripe {
  if (!secretKey || typeof secretKey !== "string") {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Stripe secret key not configured",
    });
  }
  return new Stripe(secretKey, { apiVersion: "2025-06-30.basil" });
}

export const billingRouter = createRouter({
  // Get billing history
  history: authedQuery.query(async ({ ctx }) => {
    const userId = (ctx.user as any).id as number;
    const rows = await ctx.db
      .select()
      .from(subscriptionEvents)
      .where(eq(subscriptionEvents.userId, userId))
      .orderBy(desc(subscriptionEvents.createdAt))
      .all();

    const invoices = rows.map((row) => ({
      id: row.id,
      event: row.event,
      plan: row.plan,
      amount: row.amount,
      stripeEventId: row.stripeEventId,
      createdAt: row.createdAt,
    }));

    return { invoices };
  }),

  // Get current usage
  usage: authedQuery.query(async ({ ctx }) => {
    const userId = (ctx.user as any).id as number;
    const user = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    const plan = user?.plan || "starter";

    const limits: Record<string, { counties: number; searches: number; reports: number; teamMembers: number }> = {
      starter: { counties: 1, searches: 10, reports: 1, teamMembers: 1 },
      scout: { counties: 5, searches: 100, reports: 10, teamMembers: 1 },
      professional: { counties: 20, searches: 500, reports: 50, teamMembers: 3 },
      business: { counties: 9999, searches: 9999, reports: 9999, teamMembers: 10 },
      enterprise: { counties: 9999, searches: 9999, reports: 9999, teamMembers: 9999 },
    };

    const limit = limits[plan] || limits.starter;

    return {
      plan,
      counties: { used: 0, limit: limit.counties },
      searches: { used: 0, limit: limit.searches },
      reports: { used: 0, limit: limit.reports },
      teamMembers: { used: 0, limit: limit.teamMembers },
    };
  }),

  // Update billing info
  updateBillingInfo: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(200).optional(),
        email: z.string().email().optional(),
        address: z
          .object({
            line1: z.string().optional(),
            line2: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            postal_code: z.string().optional(),
            country: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = (ctx.user as any).id as number;
      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .get();

      if (!user?.stripeCustomerId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No Stripe customer found",
        });
      }

      const stripeSecretKey = ctx.env.STRIPE_SECRET_KEY;
      const stripe = getStripe(stripeSecretKey);

      const updateParams: Stripe.CustomerUpdateParams = {};
      if (input.name) updateParams.name = input.name;
      if (input.email) updateParams.email = input.email;
      if (input.address) updateParams.address = input.address;

      await stripe.customers.update(user.stripeCustomerId, updateParams);

      return { success: true };
    }),
});
