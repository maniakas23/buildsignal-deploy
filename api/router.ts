import { router } from "@trpc/server";
import { authRouter } from "./auth-router";
import { mapRouter } from "./map-router";
import { notificationsRouter } from "./notifications-router";
import { feedbackRouter } from "./feedback-router";
import { billingRouter } from "./billing-router";
import { stripeRouter } from "./stripe-router";
import { monitoringRouter } from "./monitoring-router";

export const appRouter = router({
  auth: authRouter,
  map: mapRouter,
  notifications: notificationsRouter,
  feedback: feedbackRouter,
  billing: billingRouter,
  stripe: stripeRouter,
  monitoring: monitoringRouter,
});

export type AppRouter = typeof appRouter;
