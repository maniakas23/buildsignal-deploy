import { sqliteTable, integer, text, real, uniqueIndex } from "drizzle-orm/sqlite-core";

// Users
export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  unionId: text("unionId").notNull(),
  name: text("name"),
  email: text("email"),
  avatar: text("avatar"),
  plan: text("plan").notNull().default("starter"),
  isAdmin: integer("isAdmin", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (t) => [uniqueIndex("users_union_idx").on(t.unionId)]);
export type InsertUser = typeof users.$inferInsert;

// Saved Areas
export const savedAreas = sqliteTable("saved_areas", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  name: text("name").notNull(),
  county: text("county").notNull(),
  state: text("state").notNull(),
  city: text("city"),
  zipCode: text("zipCode"),
  lat: text("lat"),
  lng: text("lng"),
  alertRadius: integer("alertRadius").default(25),
  alertEnabled: integer("alertEnabled", { mode: "boolean" }).default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Notifications
export const notifications = sqliteTable("notifications", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: integer("read", { mode: "boolean" }).default(false),
  actionUrl: text("actionUrl"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Feedback
export const feedback = sqliteTable("feedback", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  rating: integer("rating"),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// SignalCore Recommendations
export const signalcoreRecommendations = sqliteTable("signalcore_recommendations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  recommendationId: text("recommendationId").notNull().unique(),
  sourceProduct: text("sourceProduct").notNull().default("buildsignal"),
  targetProduct: text("targetProduct").notNull().default("all"),
  status: text("status").notNull().default("active"),
  priority: integer("priority").default(50),
  title: text("title").notNull(),
  county: text("county"),
  state: text("state"),
  eventTypes: text("eventTypes"),
  patternIds: text("patternIds"),
  evidenceSummary: text("evidenceSummary"),
  confidenceScore: integer("confidenceScore").default(0),
  actionRequired: text("actionRequired"),
  timelineEstimate: text("timelineEstimate"),
  generatedAt: integer("generatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  deliveredAt: integer("deliveredAt", { mode: "timestamp" }),
  deliveryResult: text("deliveryResult"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
export type SignalCoreRecommendation = typeof signalcoreRecommendations.$inferSelect;

// SignalCore Recommendation Evidence
export const signalcoreRecommendationEvidence = sqliteTable("signalcore_recommendation_evidence", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  recommendationId: integer("recommendationId").notNull(),
  evidenceType: text("evidenceType").notNull(),
  source: text("source").notNull(),
  detail: text("detail"),
  weight: integer("weight").default(1),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// SignalCore Deliveries
export const signalcoreDeliveries = sqliteTable("signalcore_deliveries", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  recommendationId: integer("recommendationId").notNull(),
  product: text("product").notNull(),
  status: text("status").notNull().default("queued"),
  deliveryMethod: text("deliveryMethod").default("api"),
  payload: text("payload"),
  response: text("response"),
  deliveredAt: integer("deliveredAt", { mode: "timestamp" }),
  confirmedAt: integer("confirmedAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// SignalCore Telemetry
export const signalcoreTelemetry = sqliteTable("signalcore_telemetry", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  component: text("component").notNull(),
  metricName: text("metricName").notNull(),
  metricValue: integer("metricValue").notNull(),
  unit: text("unit").default("count"),
  recordedAt: integer("recordedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// SignalCore Feedback
export const signalcoreFeedback = sqliteTable("signalcore_feedback", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  recommendationId: integer("recommendationId").notNull(),
  feedbackType: text("feedbackType").notNull(),
  comment: text("comment"),
  userId: integer("userId"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Beta Feedback Events
export const betaFeedbackEvents = sqliteTable("beta_feedback_events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId"),
  eventType: text("eventType").notNull(),
  entityId: text("entityId"),
  entityType: text("entityType"),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================================
// GATE 19 — PROPRIETARY INTELLIGENCE SCHEMA
// ============================================================

export const providerRegistry = sqliteTable("provider_registry", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  providerName: text("providerName").notNull(),
  providerType: text("providerType").notNull(),
  jurisdictionLevel: text("jurisdictionLevel").notNull().default("county"),
  coverageArea: text("coverageArea").notNull(),
  dataCategories: text("dataCategories").notNull(),
  apiAvailable: integer("apiAvailable", { mode: "boolean" }).default(false),
  apiEndpoint: text("apiEndpoint"),
  apiAuthType: text("apiAuthType"),
  importMethod: text("importMethod").notNull().default("api"),
  refreshSchedule: text("refreshSchedule").notNull().default("daily"),
  healthScore: integer("healthScore").default(100),
  historicalReliability: integer("historicalReliability").default(100),
  validationStatus: text("validationStatus").notNull().default("pending"),
  recordsTotal: integer("recordsTotal").default(0),
  recordsLast30Days: integer("recordsLast30Days").default(0),
  avgLatencyMs: integer("avgLatencyMs").default(0),
  lastSyncAt: integer("lastSyncAt", { mode: "timestamp" }),
  nextSyncAt: integer("nextSyncAt", { mode: "timestamp" }),
  errorCount30d: integer("errorCount30d").default(0),
  onboardedAt: integer("onboardedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const historicalEvents = sqliteTable("historical_events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  externalId: text("externalId"),
  providerId: integer("providerId").notNull(),
  eventType: text("eventType").notNull(),
  eventCategory: text("eventCategory").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  county: text("county"),
  state: text("state").notNull(),
  city: text("city"),
  zipCode: text("zipCode"),
  address: text("address"),
  lat: text("lat"),
  lng: text("lng"),
  value: integer("value"),
  confidence: integer("confidence").default(50),
  status: text("status").notNull().default("recorded"),
  rawData: text("rawData"),
  normalizedData: text("normalizedData"),
  publishedAt: integer("publishedAt", { mode: "timestamp" }),
  ingestedAt: integer("ingestedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const kgRelationships = sqliteTable("kg_relationships", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  sourceNodeId: integer("sourceNodeId").notNull(),
  targetNodeId: integer("targetNodeId").notNull(),
  relationType: text("relationType").notNull(),
  strength: integer("strength").default(50),
  evidenceCount: integer("evidenceCount").default(1),
  firstObservedAt: integer("firstObservedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  lastObservedAt: integer("lastObservedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const confidenceScores = sqliteTable("confidence_scores", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  entityType: text("entityType").notNull(),
  entityId: integer("entityId").notNull(),
  overallScore: integer("overallScore").notNull(),
  providerReliability: integer("providerReliability").default(0),
  historicalAccuracy: integer("historicalAccuracy").default(0),
  crossSourceAgreement: integer("crossSourceAgreement").default(0),
  dataFreshness: integer("dataFreshness").default(0),
  patternMatch: integer("patternMatch").default(0),
  geographicContext: integer("geographicContext").default(0),
  eventCorrelation: integer("eventCorrelation").default(0),
  historicalOutcomes: integer("historicalOutcomes").default(0),
  explanation: text("explanation"),
  calculatedAt: integer("calculatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const patternLibrary = sqliteTable("pattern_library", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  patternName: text("patternName").notNull(),
  patternType: text("patternType").notNull(),
  description: text("description"),
  signalIndicators: text("signalIndicators"),
  requiredEventTypes: text("requiredEventTypes"),
  minConfidenceThreshold: integer("minConfidenceThreshold").default(70),
  historicalSuccessRate: integer("historicalSuccessRate").default(0),
  totalApplications: integer("totalApplications").default(0),
  successfulPredictions: integer("successfulPredictions").default(0),
  avgTimeToDevelopment: integer("avgTimeToDevelopment").default(0),
  avgReturnScore: integer("avgReturnScore").default(0),
  applicableStates: text("applicableStates"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const recommendationOutcomes = sqliteTable("recommendation_outcomes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  recommendationId: integer("recommendationId").notNull(),
  patternId: integer("patternId"),
  county: text("county"),
  state: text("state"),
  predictedEventTypes: text("predictedEventTypes"),
  actualEventTypes: text("actualEventTypes"),
  outcomeStatus: text("outcomeStatus").notNull().default("pending"),
  accuracyScore: integer("accuracyScore"),
  timeToDevelopmentDays: integer("timeToDevelopmentDays"),
  infrastructureCompleted: integer("infrastructureCompleted", { mode: "boolean" }).default(false),
  confidenceAtPrediction: integer("confidenceAtPrediction"),
  confidenceActualized: integer("confidenceActualized"),
  returnScore: integer("returnScore"),
  patternSuccessRate: integer("patternSuccessRate"),
  lessonsLearned: text("lessonsLearned"),
  validatedAt: integer("validatedAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const learningEvents = sqliteTable("learning_events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  eventType: text("eventType").notNull(),
  recommendationId: integer("recommendationId"),
  patternId: integer("patternId"),
  previousValue: text("previousValue"),
  newValue: text("newValue"),
  userId: integer("userId"),
  feedback: text("feedback"),
  adjustmentReason: text("adjustmentReason"),
  impactScore: integer("impactScore").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const dailySummaries = sqliteTable("daily_summaries", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  summaryType: text("summaryType").notNull(),
  scopeId: text("scopeId"),
  summaryDate: text("summaryDate").notNull(),
  totalEvents: integer("totalEvents").default(0),
  newPermits: integer("newPermits").default(0),
  newRezonings: integer("newRezonings").default(0),
  newPlanningMeetings: integer("newPlanningMeetings").default(0),
  newUtilityProjects: integer("newUtilityProjects").default(0),
  newRoadProjects: integer("newRoadProjects").default(0),
  priorityOpportunities: text("priorityOpportunities"),
  providerHealthChanges: text("providerHealthChanges"),
  watchlistMatches: integer("watchlistMatches").default(0),
  recommendationChanges: integer("recommendationChanges").default(0),
  topPatterns: text("topPatterns"),
  confidenceTrend: text("confidenceTrend").default("stable"),
  insights: text("insights"),
  generatedAt: integer("generatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================================
// GATE 20 — GOVERNANCE & COMPLIANCE AUDIT TABLES
// ============================================================

export const aiGovernanceAudit = sqliteTable("ai_governance_audit", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  recommendationId: integer("recommendationId").notNull(),
  passed: integer("passed", { mode: "boolean" }).default(false),
  score: integer("score").default(0),
  version: text("version").default("v1.0"),
  checkedAt: integer("checkedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const dataAuditLog = sqliteTable("data_audit_log", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  entityType: text("entityType").notNull(),
  entityId: integer("entityId").notNull(),
  action: text("action").notNull(),
  userId: integer("userId"),
  details: text("details"),
  timestamp: integer("timestamp", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const securityEvents = sqliteTable("security_events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  eventType: text("eventType").notNull(),
  severity: text("severity").notNull().default("info"),
  source: text("source").notNull(),
  details: text("details"),
  userId: integer("userId"),
  timestamp: integer("timestamp", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================================
// GATE 21 — PRODUCTION INTELLIGENCE NETWORK
// ============================================================

export const ingestionSources = sqliteTable("ingestion_sources", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  sourceName: text("sourceName").notNull(),
  sourceType: text("sourceType").notNull(),
  jurisdictionLevel: text("jurisdictionLevel").notNull().default("county"),
  coverageArea: text("coverageArea").notNull(),
  endpointUrl: text("endpointUrl"),
  importMethod: text("importMethod").notNull().default("api"),
  authType: text("authType").default("none"),
  schedule: text("schedule").notNull().default("daily"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  healthScore: integer("healthScore").default(100),
  recordsTotal: integer("recordsTotal").default(0),
  recordsLast30Days: integer("recordsLast30Days").default(0),
  avgLatencyMs: integer("avgLatencyMs").default(0),
  errorCount30d: integer("errorCount30d").default(0),
  lastSyncAt: integer("lastSyncAt", { mode: "timestamp" }),
  nextSyncAt: integer("nextSyncAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const dataValidationQueue = sqliteTable("data_validation_queue", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  sourceId: integer("sourceId").notNull(),
  externalRecordId: text("externalRecordId").notNull(),
  recordType: text("recordType").notNull(),
  rawPayload: text("rawPayload").notNull(),
  validationStatus: text("validationStatus").notNull().default("pending"),
  requiredFieldsCheck: integer("requiredFieldsCheck", { mode: "boolean" }).default(false),
  dateValidationCheck: integer("dateValidationCheck", { mode: "boolean" }).default(false),
  addressValidationCheck: integer("addressValidationCheck", { mode: "boolean" }).default(false),
  coordinateValidationCheck: integer("coordinateValidationCheck", { mode: "boolean" }).default(false),
  duplicateCheck: integer("duplicateCheck", { mode: "boolean" }).default(false),
  schemaComplianceCheck: integer("schemaComplianceCheck", { mode: "boolean" }).default(false),
  providerIntegrityCheck: integer("providerIntegrityCheck", { mode: "boolean" }).default(false),
  confidenceScore: integer("confidenceScore").default(0),
  validationErrors: text("validationErrors"),
  reviewerNotes: text("reviewerNotes"),
  reviewedBy: integer("reviewedBy"),
  reviewedAt: integer("reviewedAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const enrichmentLog = sqliteTable("enrichment_log", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  eventId: integer("eventId").notNull(),
  enrichmentType: text("enrichmentType").notNull(),
  enrichmentData: text("enrichmentData").notNull(),
  confidence: integer("confidence").default(80),
  source: text("source").notNull(),
  processedAt: integer("processedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const historicalWarehouse = sqliteTable("historical_warehouse", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  eventId: integer("eventId").notNull(),
  archiveDate: text("archiveDate").notNull(),
  eventType: text("eventType").notNull(),
  eventCategory: text("eventCategory").notNull(),
  county: text("county"),
  state: text("state").notNull(),
  city: text("city"),
  year: integer("year").notNull(),
  quarter: integer("quarter").notNull(),
  month: integer("month").notNull(),
  value: integer("value"),
  confidence: integer("confidence").default(50),
  trendDirection: text("trendDirection").default("stable"),
  seasonalFactor: real("seasonalFactor").default(1.0),
  comparableEvents: text("comparableEvents"),
  enrichedContext: text("enrichedContext"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const expansionRegistry = sqliteTable("expansion_registry", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  state: text("state").notNull(),
  county: text("county").notNull(),
  city: text("city"),
  planningAuthority: text("planningAuthority"),
  utilityProviders: text("utilityProviders"),
  population: integer("population").default(0),
  coveragePercent: integer("coveragePercent").default(0),
  activeProviders: integer("activeProviders").default(0),
  providerHealth: integer("providerHealth").default(0),
  expansionStatus: text("expansionStatus").notNull().default("queued"),
  dataSourcesAvailable: integer("dataSourcesAvailable").default(0),
  dataSourcesActive: integer("dataSourcesActive").default(0),
  lastAssessmentAt: integer("lastAssessmentAt", { mode: "timestamp" }),
  onboardedAt: integer("onboardedAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const qualityMetrics = sqliteTable("quality_metrics", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  metricDate: text("metricDate").notNull(),
  recommendationPrecision: real("recommendationPrecision").default(0),
  recommendationRecall: real("recommendationRecall").default(0),
  falsePositiveRate: real("falsePositiveRate").default(0),
  falseNegativeRate: real("falseNegativeRate").default(0),
  acceptanceRate: real("acceptanceRate").default(0),
  providerReliabilityAvg: real("providerReliabilityAvg").default(0),
  coverageCompleteness: real("coverageCompleteness").default(0),
  confidenceAccuracy: real("confidenceAccuracy").default(0),
  totalRecommendations: integer("totalRecommendations").default(0),
  acceptedRecommendations: integer("acceptedRecommendations").default(0),
  rejectedRecommendations: integer("rejectedRecommendations").default(0),
  correctedRecommendations: integer("correctedRecommendations").default(0),
  trendDirection: text("trendDirection").default("stable"),
  recordedAt: integer("recordedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const dailyBriefings = sqliteTable("daily_briefings", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  briefingDate: text("briefingDate").notNull(),
  scope: text("scope").notNull().default("national"),
  scopeId: text("scopeId"),
  topOpportunities: text("topOpportunities"),
  newActivity: text("newActivity"),
  priorityCounties: text("priorityCounties"),
  recommendationChanges: text("recommendationChanges"),
  providerHealth: text("providerHealth"),
  coverageGrowth: text("coverageGrowth"),
  operationalSummary: text("operationalSummary"),
  executiveActions: text("executiveActions"),
  narrative: text("narrative"),
  generatedAt: integer("generatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  deliveredAt: integer("deliveredAt", { mode: "timestamp" }),
  deliveryStatus: text("deliveryStatus").default("draft"),
});

export const learningModels = sqliteTable("learning_models", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  modelName: text("modelName").notNull(),
  modelType: text("modelType").notNull(),
  version: text("version").notNull(),
  accuracy: real("accuracy").default(0),
  precision: real("precision").default(0),
  recall: real("recall").default(0),
  f1Score: real("f1Score").default(0),
  trainingDataSize: integer("trainingDataSize").default(0),
  validationDataSize: integer("validationDataSize").default(0),
  hyperparameters: text("hyperparameters"),
  featureImportance: text("featureImportance"),
  deploymentStatus: text("deploymentStatus").default("experimental"),
  deployedAt: integer("deployedAt", { mode: "timestamp" }),
  retiredAt: integer("retiredAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});