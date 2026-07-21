/**
 * SQLite/D1-compatible schema — mirrors db/schema.ts exactly.
 * All column names match the MySQL schema for code compatibility.
 */

import { sqliteTable, integer, text, real, uniqueIndex } from "drizzle-orm/sqlite-core";

// ─── Users ───
export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name"),
  plan: text("plan", { enum: ["starter", "pro", "enterprise"] }).default("starter"),
  role: text("role", { enum: ["admin", "user"] }).default("user"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Kestovar Providers ───
export const signalcoreProviders = sqliteTable("signalcore_providers", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  providerId: text("provider_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status", { enum: ["active", "inactive", "degraded"] }).default("active"),
  healthScore: integer("health_score").default(100),
  signalCount: integer("signal_count").default(0),
  coverageArea: text("coverage_area"),
  lastPolledAt: integer("last_polled_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Kestovar Provider Polls ───
export const signalcoreProviderPolls = sqliteTable("signalcore_provider_polls", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  providerId: text("provider_id").notNull(),
  status: text("status").notNull(),
  recordsReceived: integer("records_received").default(0),
  latencyMs: integer("latency_ms").default(0),
  errors: text("errors"),
  startedAt: integer("started_at", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

// ─── Kestovar Events ───
export const signalcoreEvents = sqliteTable("signalcore_events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  eventId: text("event_id").notNull(),
  providerId: text("provider_id").notNull(),
  county: text("county").notNull(),
  city: text("city"),
  state: text("state").default("NC"),
  title: text("title").notNull(),
  description: text("description"),
  eventType: text("event_type").notNull(),
  dataSource: text("data_source"),
  confidence: integer("confidence").default(50),
  ingestedAt: integer("ingested_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  sourceUrl: text("source_url"),
  rawData: text("raw_data"),
});

export type KestovarEvent = typeof signalcoreEvents.$inferSelect;

// ─── Kestovar Patterns ───
export const signalcorePatterns = sqliteTable("signalcore_patterns", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  patternId: text("pattern_id").notNull(),
  county: text("county").notNull(),
  state: text("state").default("NC"),
  name: text("name").notNull(),
  description: text("description"),
  patternType: text("pattern_type").notNull(),
  confidence: integer("confidence").default(50),
  matchedEvents: integer("matched_events").default(0),
  firstSeenAt: integer("first_seen_at", { mode: "timestamp" }),
  lastMatchedAt: integer("last_matched_at", { mode: "timestamp" }),
});

export type KestovarPattern = typeof signalcorePatterns.$inferSelect;

// ─── Kestovar Pattern Evidence ───
export const signalcorePatternEvidence = sqliteTable("signalcore_pattern_evidence", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  patternId: text("pattern_id").notNull(),
  eventId: text("event_id").notNull(),
  evidenceType: text("evidence_type").notNull(),
  weight: real("weight").default(1.0),
});

// ─── Kestovar Recommendations ───
export const signalcoreRecommendations = sqliteTable("signalcore_recommendations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  recommendationId: text("recommendation_id").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  summary: text("summary").notNull(),
  rationale: text("rationale"),
  confidence: integer("confidence").default(50),
  trustScore: integer("trust_score").default(50),
  category: text("category"),
  actionType: text("action_type"),
  deliverableType: text("deliverable_type"),
  generatedAt: integer("generated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type KestovarRecommendation = typeof signalcoreRecommendations.$inferSelect;

// ─── Kestovar Recommendation Evidence ───
export const signalcoreRecommendationEvidence = sqliteTable("signalcore_recommendation_evidence", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  recommendationId: text("recommendation_id").notNull(),
  eventId: text("event_id").notNull(),
  patternId: text("pattern_id"),
  evidenceType: text("evidence_type").notNull(),
  weight: real("weight").default(1.0),
});

// ─── Kestovar Deliveries ───
export const signalcoreDeliveries = sqliteTable("signalcore_deliveries", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  deliveryId: text("delivery_id").notNull(),
  recommendationId: text("recommendation_id").notNull(),
  channel: text("channel").notNull(),
  status: text("status").notNull(),
  sentAt: integer("sent_at", { mode: "timestamp" }),
  openedAt: integer("opened_at", { mode: "timestamp" }),
});

// ─── Kestovar Telemetry ───
export const signalcoreTelemetry = sqliteTable("signalcore_telemetry", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  metricName: text("metric_name").notNull(),
  metricValue: real("metric_value").default(0),
  labels: text("labels"),
  recordedAt: integer("recorded_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Kestovar Feedback ───
export const signalcoreFeedback = sqliteTable("signalcore_feedback", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  feedbackId: text("feedback_id").notNull(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  rating: integer("rating"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Subscription Events ───
export const subscriptionEvents = sqliteTable("subscription_events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  event: text("event").notNull(),
  plan: text("plan"),
  stripeEventId: text("stripe_event_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Audit Logs ───
export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  action: text("action").notNull(),
  entity: text("entity"),
  entityId: text("entity_id"),
  userId: integer("user_id"),
  metadata: text("metadata"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Ingestion Sources ───
export const ingestionSources = sqliteTable("ingestion_sources", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  sourceName: text("source_name").notNull(),
  sourceType: text("source_type").notNull(),
  jurisdictionLevel: text("jurisdiction_level").default("county"),
  coverageArea: text("coverage_area"),
  endpointUrl: text("endpoint_url"),
  importMethod: text("import_method").default("api"),
  authType: text("auth_type").default("none"),
  schedule: text("schedule").default("daily"),
  healthScore: integer("health_score").default(100),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  recordsLast30Days: integer("records_last_30_days").default(0),
  avgLatencyMs: integer("avg_latency_ms").default(0),
  errorCount30d: integer("error_count_30d").default(0),
  lastSyncAt: integer("last_sync_at", { mode: "timestamp" }),
  nextSyncAt: integer("next_sync_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});