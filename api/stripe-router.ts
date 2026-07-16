import { z } from "zod";
import Stripe from "stripe";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import { env } from "./lib/env";

const stripe = env.stripeSecretKey
  ? new Stripe(env.stripeSecretKey, { apiVersion: "2026-06-24.dahlia" as Stripe.LatestApiVersion })
  : null;

export const stripeRouter = createRouter({
  getPlan: publicQuery
    .input(z.object({ userId: z.number() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const uid = input?.userId ?? 1;
      const results = await db.select().from(users).where(eq(users.id, uid)).limit(1);
      return { plan: results[0]?.plan ?? "starter", stripeEnabled: !!stripe };
    }),

  createCheckoutSession: publicQuery
    .input(z.object({ priceId: z.string(), userId: z.number(), successUrl: z.string(), cancelUrl: z.string() }))
    .mutation(async ({ input }) => {
      if (!stripe) throw new Error("Stripe not configured");
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: input.priceId, quantity: 1 }],
        mode: "subscription",
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        metadata: { userId: String(input.userId) },
      });
      return { sessionId: session.id, url: session.url };
    }),

  createPortalSession: publicQuery
    .input(z.object({ customerId: z.string(), returnUrl: z.string() }))
    .mutation(async ({ input }) => {
      if (!stripe) throw new Error("Stripe not configured");
      const session = await stripe.billingPortal.sessions.create({
        customer: input.customerId,
        return_url: input.returnUrl,
      });
      return { url: session.url };
    }),

  history: publicQuery
    .input(z.object({ customerId: z.string() }))
    .query(async ({ input }) => {
      if (!stripe) return [];
      const { data } = await stripe.invoices.list({ customer: input.customerId, limit: 50 });
      return data.map((inv) => ({
        id: inv.id,
        status: inv.status,
        amount: inv.amount_due,
        date: inv.created,
      }));
    }),
});

export async function handleStripeWebhook(body: string, signature: string) {
  if (!stripe || !env.stripeWebhookSecret) {
    throw new Error("Stripe not configured");
  }
  const event = stripe.webhooks.constructEvent(body, signature, env.stripeWebhookSecret);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId) {
        const db = getDb();
        await db.update(users).set({ plan: "pro" }).where(eq(users.id, Number(userId)));
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId) {
        const db = getDb();
        await db.update(users).set({ plan: "starter" }).where(eq(users.id, Number(userId)));
      }
      break;
    }
  }

  return { received: true, type: event.type };
}
