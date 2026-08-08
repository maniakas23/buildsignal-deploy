import { z } from "zod";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { users, subscriptionEvents } from "../db/schema";
import { eq } from "drizzle-orm";

// Stripe plan configuration
const PLAN_CONFIG = {
  scout: {
    name: "Scout",
    price: 9900,
    interval: "month" as const,
    stripePriceId: null as string | null,
    features: [
      "5 counties",
      "Basic search",
      "Email alerts",
      "Standard reports",
    ],
  },
  professional: {
    name: "Professional",
    price: 24900,
    interval: "month" as const,
    stripePriceId: null as string | null,
    features: [
      "20 counties",
      "Advanced search & filters",
      "Priority alerts",
      "Custom reports",
      "Team collaboration (3 seats)",
    ],
  },
  business: {
    name: "Business",
    price: 59900,
    interval: "month" as const,
    stripePriceId: null as string | null,
    features: [
      "Unlimited counties",
      "AI-powered insights",
      "Real-time alerts",
      "White-label reports",
      "Team collaboration (10 seats)",
      "API access",
      "Dedicated support",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: null,
    interval: null,
    stripePriceId: null as string | null,
    features: [
      "Everything in Business",
      "Custom integrations",
      "Unlimited team seats",
      "SLA guarantee",
      "Dedicated account manager",
    ],
  },
};

function getPlanFeatures(planKey: string): string[] {
  return PLAN_CONFIG[planKey as keyof typeof PLAN_CONFIG]?.features ?? [];
}

function getStripe(secretKey: string | unknown): Stripe {
  if (!secretKey || typeof secretKey !== "string") {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Stripe secret key not configured",
    });
  }
  return new Stripe(secretKey, { apiVersion: "2025-06-30.basil" });
}

function createPriceId(plan: keyof typeof PLAN_CONFIG): string {
  // Placeholder: in production, these are real Stripe Price IDs from environment variables
  const placeholders: Record<string, string> = {
    scout: "price_scout_placeholder",
    professional: "price_professional_placeholder",
    business: "price_business_placeholder",
  };
  const id = placeholders[plan];
  if (!id) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `No price configured for plan: ${plan}`,
    });
  }
  return id;
}

export const stripeRouter = createRouter({
  // Get available plans
  plans: publicQuery.query(() => {
    return Object.entries(PLAN_CONFIG).map(([key, config]) => ({
      id: key,
      name: config.name,
      price: config.price,
      interval: config.interval,
      features: getPlanFeatures(key),
    }));
  }),

  // Create Stripe Checkout session
  createCheckoutSession: authedQuery
    .input(
      z.object({
        plan: z.enum(["scout", "professional", "business"]),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const stripeSecretKey = ctx.env.STRIPE_SECRET_KEY;
      const stripe = getStripe(stripeSecretKey);

      const userId = (ctx.user as any).id as number;
      const userEmail = (ctx.user as any).email as string;
      const userName = (ctx.user as any).name as string | undefined;

      // Get or create Stripe customer
      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .get();

      let customerId = user?.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: userEmail,
          name: userName || undefined,
          metadata: { userId: String(userId) },
        });
        customerId = customer.id;
        await ctx.db
          .update(users)
          .set({ stripeCustomerId: customerId })
          .where(eq(users.id, userId))
          .run();
      }

      const priceId =
        PLAN_CONFIG[input.plan].stripePriceId || createPriceId(input.plan);

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        metadata: { userId: String(userId), plan: input.plan },
        subscription_data: {
          metadata: { userId: String(userId), plan: input.plan },
        },
      });

      return { sessionId: session.id, url: session.url };
    }),

  // Create billing portal session
  createBillingPortalSession: authedQuery
    .input(z.object({ returnUrl: z.string().url() }))
    .mutation(async ({ input, ctx }) => {
      const stripeSecretKey = ctx.env.STRIPE_SECRET_KEY;
      const stripe = getStripe(stripeSecretKey);

      const userId = (ctx.user as any).id as number;
      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .get();

      if (!user?.stripeCustomerId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No subscription found",
        });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: input.returnUrl,
      });

      return { url: session.url };
    }),

  // Get current subscription
  getSubscription: authedQuery.query(async ({ ctx }) => {
    const userId = (ctx.user as any).id as number;
    const user = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!user?.stripeSubscriptionId) {
      return {
        status: "none" as const,
        plan: user?.plan || "starter",
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    const stripeSecretKey = ctx.env.STRIPE_SECRET_KEY;
    const stripe = getStripe(stripeSecretKey);
    const subscription = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId
    );

    return {
      status: subscription.status,
      plan: user.plan,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };
  }),

  // Change plan (upgrade/downgrade)
  changePlan: authedQuery
    .input(z.object({ plan: z.enum(["scout", "professional", "business"]) }))
    .mutation(async ({ input, ctx }) => {
      const userId = (ctx.user as any).id as number;
      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .get();

      if (!user?.stripeSubscriptionId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No active subscription",
        });
      }

      const stripeSecretKey = ctx.env.STRIPE_SECRET_KEY;
      const stripe = getStripe(stripeSecretKey);

      const subscription = await stripe.subscriptions.retrieve(
        user.stripeSubscriptionId
      );
      const itemId = subscription.items.data[0]?.id;
      if (!itemId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Subscription has no items",
        });
      }

      const priceId =
        PLAN_CONFIG[input.plan].stripePriceId || createPriceId(input.plan);

      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        items: [{ id: itemId, price: priceId }],
        proration_behavior: "create_prorations",
      });

      await ctx.db
        .update(users)
        .set({ plan: input.plan })
        .where(eq(users.id, userId))
        .run();

      return { success: true };
    }),

  // Cancel subscription
  cancelSubscription: authedQuery.mutation(async ({ ctx }) => {
    const userId = (ctx.user as any).id as number;
    const user = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!user?.stripeSubscriptionId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No active subscription",
      });
    }

    const stripeSecretKey = ctx.env.STRIPE_SECRET_KEY;
    const stripe = getStripe(stripeSecretKey);

    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await ctx.db
      .update(users)
      .set({ cancelAtPeriodEnd: true })
      .where(eq(users.id, userId))
      .run();

    return { success: true };
  }),
});

// Webhook handler (export separately for Workers route)
export async function handleStripeWebhook(
  request: Request,
  env: Record<string, unknown>,
  db: any
): Promise<Response> {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || typeof webhookSecret !== "string") {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const stripe = getStripe(env.STRIPE_SECRET_KEY);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature || "",
      webhookSecret
    );
  } catch (err: any) {
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  // Idempotency: check if we've already processed this event
  const existingEvents = await db
    .select()
    .from(subscriptionEvents)
    .where(eq(subscriptionEvents.stripeEventId, event.id))
    .all();

  if (existingEvents.length > 0) {
    return new Response("OK", { status: 200 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId
        ? parseInt(session.metadata.userId, 10)
        : NaN;
      const plan = session.metadata?.plan;

      if (!Number.isNaN(userId) && plan) {
        await db
          .update(users)
          .set({
            plan,
            stripeCustomerId:
              typeof session.customer === "string" ? session.customer : null,
            stripeSubscriptionId:
              typeof session.subscription === "string"
                ? session.subscription
                : null,
            subscriptionStatus: "active",
          })
          .where(eq(users.id, userId))
          .run();

        await db
          .insert(subscriptionEvents)
          .values({
            userId,
            event: "checkout_completed",
            plan,
            amount: session.amount_total,
            stripeEventId: event.id,
          })
          .run();
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === "string" ? invoice.customer : null;
      if (customerId) {
        const userRows = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .all();
        const user = userRows[0];
        if (user) {
          await db
            .insert(subscriptionEvents)
            .values({
              userId: user.id,
              event: "invoice_paid",
              plan: user.plan,
              amount: invoice.amount_paid,
              stripeEventId: event.id,
            })
            .run();
        }
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === "string" ? invoice.customer : null;
      if (customerId) {
        const userRows = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .all();
        const user = userRows[0];
        if (user) {
          await db
            .update(users)
            .set({ subscriptionStatus: "past_due" })
            .where(eq(users.id, user.id))
            .run();

          await db
            .insert(subscriptionEvents)
            .values({
              userId: user.id,
              event: "invoice_payment_failed",
              plan: user.plan,
              amount: invoice.amount_due,
              stripeEventId: event.id,
            })
            .run();
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : null;
      if (customerId) {
        await db
          .update(users)
          .set({
            subscriptionStatus: subscription.status,
            subscriptionCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          })
          .where(eq(users.stripeCustomerId, customerId))
          .run();
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : null;
      if (customerId) {
        await db
          .update(users)
          .set({
            plan: "starter",
            subscriptionStatus: "canceled",
            stripeSubscriptionId: null,
            cancelAtPeriodEnd: false,
          })
          .where(eq(users.stripeCustomerId, customerId))
          .run();

        const userRows = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .all();
        const user = userRows[0];
        if (user) {
          await db
            .insert(subscriptionEvents)
            .values({
              userId: user.id,
              event: "subscription_deleted",
              plan: user.plan,
              stripeEventId: event.id,
            })
            .run();
        }
      }
      break;
    }

    default: {
      // Unhandled event type
      break;
    }
  }

  return new Response("OK", { status: 200 });
}
