import { createRouter, publicQuery } from "./middleware";
import { authRouter } from "./auth-router";
import { mapRouter } from "./map-router";
import { notificationsRouter } from "./notifications-router";
import { feedbackRouter } from "./feedback-router";
import { billingRouter } from "./billing-router";
import { stripeRouter } from "./stripe-router";
import { monitoringRouter } from "./monitoring-router";
import { operationsRouter } from "./operations-router";
import { pipelineRouter } from "./pipeline-router";
import { betaFeedbackRouter } from "./beta-feedback-router";
import { searchRouter } from "./search-router";
import { watchlistRouter } from "./watchlist-router";
import { providerRouter } from "./provider-router";
import { countyRouter } from "./county-router";
import { briefRouter } from "./brief-router";
import { organizationRouter } from "./organization-router";
import { notificationRouter } from "./notification-router";
import { auditRouter, feedbackQueueRouter } from "./audit-router";
import { analyticsRouter } from "./analytics-router";
import { learningRouter } from "./learning-router";
import { pipelineMetricsRouter } from "./pipeline-metrics-router";
import { geographicRouter } from "./geographic-router";
import { knowledgeGraphRouter } from "./knowledge-graph-router";
import { historicalValidationRouter } from "./historical-validation-router";
// Gate 19
import { historicalRouter } from "./historical-router";
import { confidenceRouter } from "./confidence-router";
import { patternRouter } from "./pattern-router";
import { learningLoopRouter } from "./learning-loop-router";
import { dailyOpsRouter } from "./daily-ops-router";

export const appRouter = createRouter({
  health: publicQuery.query(() => ({ status: "ok", service: "buildsignal", version: "1.0.0" })),
  auth: authRouter,
  map: mapRouter,
  notifications: notificationsRouter,
  feedback: feedbackRouter,
  billing: billingRouter,
  stripe: stripeRouter,
  monitoring: monitoringRouter,
  operations: operationsRouter,
  pipeline: pipelineRouter,
  betaFeedback: betaFeedbackRouter,
  search: searchRouter,
  watchlist: watchlistRouter,
  provider: providerRouter,
  county: countyRouter,
  brief: briefRouter,
  organization: organizationRouter,
  notification: notificationRouter,
  audit: auditRouter,
  feedbackQueue: feedbackQueueRouter,
  analytics: analyticsRouter,
  learning: learningRouter,
  pipelineMetrics: pipelineMetricsRouter,
  geographic: geographicRouter,
  knowledgeGraph: knowledgeGraphRouter,
  historicalValidation: historicalValidationRouter,
  // Gate 19
  historical: historicalRouter,
  confidence: confidenceRouter,
  pattern: patternRouter,
  learningLoop: learningLoopRouter,
  dailyOps: dailyOpsRouter,
});

export type AppRouter = typeof appRouter;
