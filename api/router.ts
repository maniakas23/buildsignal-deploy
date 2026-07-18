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
import { historicalRouter } from "./historical-router";
import { confidenceRouter } from "./confidence-router";
import { patternRouter } from "./pattern-router";
import { learningLoopRouter } from "./learning-loop-router";
import { dailyOpsRouter } from "./daily-ops-router";
import { governanceRouter } from "./governance-router";
import { aiGovernanceRouter } from "./ai-governance-router";
import { dataGovernanceRouter } from "./data-governance-router";
import { securityRouter } from "./security-router";
import { ipRegisterRouter } from "./ip-register-router";
import { liveIntelligenceRouter } from "./live-intelligence-router";
import { executiveOpsRouter } from "./executive-ops-router";
import { completionRouter } from "./completion-router";
import { ingestionRouter } from "./ingestion-router";
import { validationRouter } from "./validation-router";
import { enrichmentRouter } from "./enrichment-router";
import { recommendationV2Router } from "./recommendation-v2-router";
import { warehouseRouter } from "./warehouse-router";
import { expansionRouter } from "./expansion-router";
import { qualityRouter } from "./quality-router";
import { briefingRouter } from "./briefing-router";
import { debugRouter } from "./debug-router";

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
  historical: historicalRouter,
  confidence: confidenceRouter,
  pattern: patternRouter,
  learningLoop: learningLoopRouter,
  dailyOps: dailyOpsRouter,
  governance: governanceRouter,
  aiGovernance: aiGovernanceRouter,
  dataGovernance: dataGovernanceRouter,
  security: securityRouter,
  ipRegister: ipRegisterRouter,
  live: liveIntelligenceRouter,
  executive: executiveOpsRouter,
  completion: completionRouter,
  ingestion: ingestionRouter,
  validation: validationRouter,
  enrichment: enrichmentRouter,
  recommendationV2: recommendationV2Router,
  warehouse: warehouseRouter,
  expansion: expansionRouter,
  quality: qualityRouter,
  briefing: briefingRouter,
  debug: debugRouter,
});

export type AppRouter = typeof appRouter;
