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
export const feedbackItems = sqliteTable("feedback", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId"),
  category: text("category").notNull(),
  message: text("message").notNull(),
  rating: integer("rating"),
  status: text("status").default("open"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Watchlist ───
export const watchlist = sqliteTable("watchlist", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  opportunityId: text("opportunityId").notNull(),
  county: text("county"),
  state: text("state"),
  notes: text("notes"),
  alertEnabled: integer("alertEnabled", { mode: "boolean" }).default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Pipeline Events ───
export const pipelineEvents = sqliteTable("pipeline_events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  eventId: text("eventId").notNull(),
  eventType: text("eventType").notNull(),
  county: text("county").notNull(),
  state: text("state").notNull(),
  city: text("city"),
  lat: text("lat"),
  lng: text("lng"),
  eventDate: text("eventDate"),
  source: text("source").notNull(),
  sourceUrl: text("sourceUrl"),
  description: text("description"),
  value: integer("value"),
  stage: text("stage").default("identification"),
  confidence: integer("confidence").default(50),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Event Classifications ───
export const eventClassifications = sqliteTable("event_classifications", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  eventId: text("eventId").notNull(),
  classifierName: text("classifier_name").notNull(),
  category: text("category"),
  label: text("label"),
  confidence: integer("confidence").default(50),
  classifiedAt: integer("classified_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Provider Sources ───
export const providerSources = sqliteTable("provider_sources", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  providerName: text("provider_name").notNull(),
  sourceType: text("source_type").notNull(),
  endpointUrl: text("endpoint_url"),
  updateFrequency: text("update_frequency").default("daily"),
  coverageArea: text("coverage_area"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  reliability: integer("reliability").default(80),
  lastUpdated: integer("last_updated", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── County Cache ───
export const countyCache = sqliteTable("county_cache", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  county: text("county").notNull(),
  state: text("state").notNull(),
  totalEvents: integer("total_events").default(0),
  lastEventAt: integer("last_event_at", { mode: "timestamp" }),
  avgConfidence: integer("avg_confidence").default(0),
  topSources: text("top_sources"),
  demographics: text("demographics"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Intelligence Briefs ───
export const intelligenceBriefs = sqliteTable("intelligence_briefs", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  briefId: text("brief_id").notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  county: text("county"),
  state: text("state"),
  eventTypes: text("event_types"),
  confidenceLevel: text("confidence_level").default("medium"),
  generatedAt: integer("generated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
});

// ─── User Activity ───
export const userActivity = sqliteTable("user_activity", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  action: text("action").notNull(),
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),
  metadata: text("metadata"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Learning Entries ───
export const learningEntries = sqliteTable("learning_entries", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  pattern: text("pattern").notNull(),
  category: text("category").notNull(),
  confidence: integer("confidence").default(50),
  occurrences: integer("occurrences").default(1),
  lastSeen: text("last_seen"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Saved Searches ───
export const savedSearches = sqliteTable("saved_searches", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  query: text("query").notNull(),
  filters: text("filters"),
  alertEnabled: integer("alertEnabled", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Audit Log ───
export const auditLog = sqliteTable("audit_log", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  actorId: text("actor_id"),
  actorType: text("actor_type").default("user"),
  action: text("action").notNull(),
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),
  details: text("details"),
  ipAddress: text("ip_address"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Beta Feedback ───
export const betaFeedback = sqliteTable("beta_feedback", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId"),
  category: text("category").notNull(),
  priority: text("priority").default("medium"),
  message: text("message").notNull(),
  screenshotUrl: text("screenshot_url"),
  status: text("status").default("open"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Organizations ───
export const organizations = sqliteTable("organizations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plan: text("plan").default("starter"),
  settings: text("settings"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Organization Members ───
export const organizationMembers = sqliteTable("organization_members", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role").default("member"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Notification Preferences ───
export const notificationPreferences = sqliteTable("notification_preferences", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  channel: text("channel").notNull(),
  eventType: text("event_type").notNull(),
  enabled: integer("enabled", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Coverage Areas ───
export const coverageAreas = sqliteTable("coverage_areas", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  state: text("state").notNull(),
  county: text("county").notNull(),
  city: text("city"),
  status: text("status").default("active"),
  providerCount: integer("provider_count").default(0),
  lastUpdated: integer("last_updated", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Feedback Queue ───
export const feedbackQueue = sqliteTable("feedback_queue", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  itemType: text("item_type").notNull(),
  itemId: text("item_id").notNull(),
  feedbackType: text("feedback_type").notNull(),
  feedbackText: text("feedback_text"),
  userId: integer("user_id"),
  status: text("status").default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Pipeline Metrics ───
export const pipelineMetrics = sqliteTable("pipeline_metrics", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  county: text("county").notNull(),
  state: text("state").notNull(),
  permitsThisMonth: integer("permits_this_month").default(0),
  avgProjectValue: integer("avg_project_value").default(0),
  topContractor: text("top_contractor"),
  growthRate: integer("growth_rate").default(0),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Confidence Scores ───
export const confidenceScores = sqliteTable("confidence_scores", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  overallScore: integer("overall_score").default(0),
  providerReliability: integer("provider_reliability").default(0),
  historicalAccuracy: integer("historical_accuracy").default(0),
  crossSourceAgreement: integer("cross_source_agreement").default(0),
  dataFreshness: integer("data_freshness").default(0),
  patternMatch: integer("pattern_match").default(0),
  geographicContext: integer("geographic_context").default(0),
  eventCorrelation: integer("event_correlation").default(0),
  historicalOutcomes: integer("historical_outcomes").default(0),
  explanation: text("explanation"),
  calculatedAt: integer("calculated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Pattern Library ───
export const patternLibrary = sqliteTable("pattern_library", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  patternType: text("pattern_type").notNull(),
  patternName: text("pattern_name").notNull(),
  description: text("description"),
  conditions: text("conditions"),
  historicalSuccessRate: integer("historical_success_rate").default(0),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Recommendation Outcomes ───
export const recommendationOutcomes = sqliteTable("recommendation_outcomes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  recommendationId: integer("recommendation_id").notNull(),
  patternId: integer("pattern_id"),
  county: text("county"),
  state: text("state"),
  predictedEventTypes: text("predicted_event_types"),
  actualEventTypes: text("actual_event_types"),
  outcomeStatus: text("outcome_status").default("pending"),
  accuracyScore: integer("accuracy_score"),
  timeToDevelopmentDays: integer("time_to_development_days"),
  confidenceAtPrediction: integer("confidence_at_prediction"),
  lessonsLearned: text("lessons_learned"),
  validatedAt: integer("validated_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Historical Snapshots ───
export const historicalSnapshots = sqliteTable("historical_snapshots", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  county: text("county").notNull(),
  state: text("state").notNull(),
  year: integer("year").notNull(),
  permitsIssued: integer("permits_issued").default(0),
  projectsCompleted: integer("projects_completed").default(0),
  totalValue: integer("total_value").default(0),
  topEventType: text("top_event_type"),
  data: text("data"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Knowledge Graph ───
export const knowledgeGraph = sqliteTable("knowledge_graph", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  sourceEntity: text("source_entity").notNull(),
  sourceType: text("source_type").notNull(),
  relationType: text("relation_type").notNull(),
  targetEntity: text("target_entity").notNull(),
  targetType: text("target_type").notNull(),
  confidence: integer("confidence").default(50),
  evidence: text("evidence"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Historical Validation ───
export const historicalValidation = sqliteTable("historical_validation", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  eventId: text("event_id").notNull(),
  backtestDate: text("backtest_date").notNull(),
  actualOutcome: text("actual_outcome"),
  predictedOutcome: text("predicted_outcome"),
  accuracy: integer("accuracy"),
  deviation: text("deviation"),
  validatedAt: integer("validated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── AI Governance Audit ───
export const aiGovernanceAudit = sqliteTable("ai_governance_audit", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  modelVersion: text("model_version").notNull(),
  decisionType: text("decision_type").notNull(),
  inputFeatures: text("input_features"),
  outputDecision: text("output_decision"),
  confidence: integer("confidence"),
  humanReviewed: integer("human_reviewed", { mode: "boolean" }).default(false),
  reviewerId: integer("reviewer_id"),
  reviewNotes: text("review_notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Data Audit Log ───
export const dataAuditLog = sqliteTable("data_audit_log", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  tableName: text("table_name").notNull(),
  recordId: text("record_id").notNull(),
  action: text("action").notNull(),
  oldValues: text("old_values"),
  newValues: text("new_values"),
  actorId: text("actor_id"),
  actorType: text("actor_type").default("system"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Security Events ───
export const securityEvents = sqliteTable("security_events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  eventType: text("event_type").notNull(),
  severity: text("severity").default("low"),
  description: text("description"),
  sourceIp: text("source_ip"),
  userAgent: text("user_agent"),
  actorId: text("actor_id"),
  metadata: text("metadata"),
  resolvedAt: integer("resolved_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Live Intelligence ───
export const liveIntelligence = sqliteTable("live_intelligence", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  signalId: text("signal_id").notNull(),
  signalType: text("signal_type").notNull(),
  county: text("county").notNull(),
  state: text("state").notNull(),
  description: text("description"),
  confidence: integer("confidence").default(50),
  status: text("status").default("active"),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Daily Ops ───
export const dailyOps = sqliteTable("daily_ops", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  reportDate: text("report_date").notNull(),
  recordsProcessed: integer("records_processed").default(0),
  eventsIdentified: integer("events_identified").default(0),
  countiesScanned: integer("counties_scanned").default(0),
  newProviders: integer("new_providers").default(0),
  alertsTriggered: integer("alerts_triggered").default(0),
  avgProcessingLatencyMs: integer("avg_processing_latency_ms").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Section 1: Ingestion Sources ───
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
  recordsLast30Days: integer("recordsLast30Days").default(0),
  avgLatencyMs: integer("avgLatencyMs").default(0),
  errorCount30d: integer("errorCount30d").default(0),
  lastSyncAt: integer("lastSyncAt", { mode: "timestamp" }),
  nextSyncAt: integer("nextSyncAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Section 2: Data Validation Queue ───
export const dataValidationQueue = sqliteTable("data_validation_queue", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  sourceId: integer("sourceId").notNull(),
  externalRecordId: text("externalRecordId").notNull(),
  recordType: text("recordType").notNull(),
  rawPayload: text("rawPayload").notNull(),
  requiredFieldsCheck: integer("requiredFieldsCheck", { mode: "boolean" }).default(false),
  dateValidationCheck: integer("dateValidationCheck", { mode: "boolean" }).default(false),
  addressValidationCheck: integer("addressValidationCheck", { mode: "boolean" }).default(false),
  coordinateValidationCheck: integer("coordinateValidationCheck", { mode: "boolean" }).default(false),
  schemaComplianceCheck: integer("schemaComplianceCheck", { mode: "boolean" }).default(false),
  providerIntegrityCheck: integer("providerIntegrityCheck", { mode: "boolean" }).default(false),
  confidenceScore: integer("confidenceScore").default(0),
  validationStatus: text("validationStatus").notNull().default("pending"),
  validationErrors: text("validationErrors"),
  reviewedBy: integer("reviewedBy"),
  reviewerNotes: text("reviewerNotes"),
  reviewedAt: integer("reviewedAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Section 3: Enrichment Log ───
export const enrichmentLog = sqliteTable("enrichment_log", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  eventId: integer("eventId").notNull(),
  enrichmentType: text("enrichmentType").notNull(),
  enrichmentData: text("enrichmentData").notNull(),
  source: text("source").notNull(),
  confidence: integer("confidence").default(80),
  processedAt: integer("processedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Section 4: Historical Warehouse ───
export const historicalWarehouse = sqliteTable("historical_warehouse", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  entityType: text("entityType").notNull(),
  entityId: integer("entityId").notNull(),
  eventType: text("eventType").notNull(),
  county: text("county").notNull(),
  state: text("state").notNull(),
  snapshotData: text("snapshotData").notNull(),
  eventDate: integer("eventDate", { mode: "timestamp" }),
  confidence: integer("confidence").default(50),
  snapshotDate: integer("snapshotDate", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Section 5: Expansion Registry ───
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

// ─── Section 6: Quality Metrics ───
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

// ─── Section 7: Daily Briefings ───
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

// ─── Section 8: Learning Models ───
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
