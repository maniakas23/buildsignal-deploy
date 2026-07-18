/**
 * SQLite/D1-compatible schema — mirrors db/schema.ts exactly.
 * All column names match the MySQL schema for code compatibility.
 */

import { sqliteTable, integer, text, real, uniqueIndex } from "drizzle-orm/sqlite-core";

// ─── Users ───
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

// ─── Saved Areas ───
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

// ─── Notifications ───
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

// ─── Feedback ───
export const feedback = sqliteTable("feedback", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId"),
  type: text("type").notNull(),
  message: text("message").notNull(),
  rating: integer("rating"),
  page: text("page"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Subscription Events ───
export const subscriptionEvents = sqliteTable("subscription_events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  event: text("event").notNull(),
  plan: text("plan").notNull(),
  amount: integer("amount"),
  stripeEventId: text("stripeEventId"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Map Markers ───
export const mapMarkers = sqliteTable("map_markers", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  projectId: text("projectId"),
  county: text("county"),
  state: text("state"),
  city: text("city"),
  lat: real("lat"),
  lng: real("lng"),
  type: text("type"),
  score: integer("score").default(0),
  projectName: text("projectName"),
  description: text("description"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── SignalCore Providers ───
export const signalcoreProviders = sqliteTable("signalcore_providers", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("active"),
  config: text("config"),
  pollIntervalMinutes: integer("pollIntervalMinutes").default(60),
  circuitState: text("circuitState").default("closed"),
  circuitFailures: integer("circuitFailures").default(0),
  circuitLastFailure: integer("circuitLastFailure", { mode: "timestamp" }),
  totalPolls: integer("totalPolls").default(0),
  totalSuccesses: integer("totalSuccesses").default(0),
  totalFailures: integer("totalFailures").default(0),
  avgLatencyMs: integer("avgLatencyMs").default(0),
  lastPollAt: integer("lastPollAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── SignalCore Provider Polls ───
export const signalcoreProviderPolls = sqliteTable("signalcore_provider_polls", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  providerId: integer("providerId").notNull(),
  status: text("status").notNull(),
  startedAt: integer("startedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  completedAt: integer("completedAt", { mode: "timestamp" }),
  recordsRetrieved: integer("recordsRetrieved").default(0),
  recordsAccepted: integer("recordsAccepted").default(0),
  recordsRejected: integer("recordsRejected").default(0),
  recordsDuplicated: integer("recordsDuplicated").default(0),
  latencyMs: integer("latencyMs").default(0),
  retryCount: integer("retryCount").default(0),
  errorMessage: text("errorMessage"),
});

// ─── SignalCore Events ───
export const signalcoreEvents = sqliteTable("signalcore_events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  providerId: integer("providerId").notNull(),
  externalId: text("externalId"),
  eventType: text("eventType").notNull(),
  title: text("title"),
  description: text("description"),
  county: text("county"),
  state: text("state"),
  city: text("city"),
  zipCode: text("zipCode"),
  lat: text("lat"),
  lng: text("lng"),
  address: text("address"),
  publishedAt: integer("publishedAt", { mode: "timestamp" }),
  ingestedAt: integer("ingestedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  confidence: integer("confidence").default(50).notNull(),
  status: text("status").notNull().default("ingested"),
  validationErrors: text("validationErrors"),
  contentHash: text("contentHash"),
  rawData: text("rawData"),
  normalizedData: text("normalizedData"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
export type SignalCoreEvent = typeof signalcoreEvents.$inferSelect;

// ─── SignalCore Patterns ───
export const signalcorePatterns = sqliteTable("signalcore_patterns", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  patternType: text("patternType").notNull(),
  description: text("description"),
  county: text("county"),
  state: text("state"),
  lat: text("lat"),
  lng: text("lng"),
  confidence: integer("confidence").default(0).notNull(),
  evidenceCount: integer("evidenceCount").default(0).notNull(),
  status: text("status").notNull().default("active"),
  firstDetectedAt: integer("firstDetectedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  lastDetectedAt: integer("lastDetectedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  summary: text("summary"),
  recommendedAction: text("recommendedAction"),
  impactScore: integer("impactScore"),
  geographicReach: text("geographicReach"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
export type SignalCorePattern = typeof signalcorePatterns.$inferSelect;

// ─── SignalCore Pattern Evidence ───
export const signalcorePatternEvidence = sqliteTable("signalcore_pattern_evidence", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  patternId: integer("patternId").notNull(),
  eventId: integer("eventId").notNull(),
  evidenceType: text("evidenceType").default("supporting"),
  weight: integer("weight").default(1),
  notes: text("notes"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── SignalCore Recommendations ───
export const signalcoreRecommendations = sqliteTable("signalcore_recommendations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  patternId: integer("patternId").notNull(),
  status: text("status").notNull().default("pending"),
  priority: integer("priority").default(50),
  confidenceScore: integer("confidenceScore").notNull(),
  trustScore: integer("trustScore").notNull(),
  targetProduct: text("targetProduct").notNull(),
  jurisdiction: text("jurisdiction"),
  summary: text("summary").notNull(),
  rationale: text("rationale"),
  suggestedActions: text("suggestedActions"),
  marketSizeEstimate: integer("marketSizeEstimate"),
  competitiveLandscape: text("competitiveLandscape"),
  timelineEstimate: text("timelineEstimate"),
  generatedAt: integer("generatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  deliveredAt: integer("deliveredAt", { mode: "timestamp" }),
  deliveryResult: text("deliveryResult"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
export type SignalCoreRecommendation = typeof signalcoreRecommendations.$inferSelect;

// ─── SignalCore Recommendation Evidence ───
export const signalcoreRecommendationEvidence = sqliteTable("signalcore_recommendation_evidence", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  recommendationId: integer("recommendationId").notNull(),
  evidenceType: text("evidenceType").notNull(),
  source: text("source").notNull(),
  detail: text("detail"),
  weight: integer("weight").default(1),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── SignalCore Deliveries ───
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

// ─── SignalCore Telemetry ───
export const signalcoreTelemetry = sqliteTable("signalcore_telemetry", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  component: text("component").notNull(),
  metricName: text("metricName").notNull(),
  metricValue: integer("metricValue").notNull(),
  unit: text("unit").default("count"),
  recordedAt: integer("recordedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── SignalCore Feedback ───
export const signalcoreFeedback = sqliteTable("signalcore_feedback", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  recommendationId: integer("recommendationId").notNull(),
  feedbackType: text("feedbackType").notNull(),
  comment: text("comment"),
  userId: integer("userId"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Beta Feedback Events ───
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
