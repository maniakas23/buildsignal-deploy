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
  passwordHash: text("passwordHash"),
  salt: text("salt"),
  plan: text("plan", { enum: ["free", "starter", "pro", "business", "enterprise"] }).default("free"),
  stripeCustomerId: text("stripeCustomerId"),
  stripeSubscriptionId: text("stripeSubscriptionId"),
  stripePriceId: text("stripePriceId"),
  stripeSubscriptionStatus: text("stripeSubscriptionStatus"),
  stripeCurrentPeriodEnd: integer("stripeCurrentPeriodEnd", { mode: "timestamp" }),
  isAdmin: integer("isAdmin", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Organizations ───
export const organizations = sqliteTable("organizations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  ownerId: text("ownerId").notNull(),
  plan: text("plan", { enum: ["free", "starter", "pro", "business", "enterprise"] }).default("free"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const orgMembers = sqliteTable("org_members", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  orgId: text("orgId").notNull(),
  userId: text("userId").notNull(),
  role: text("role", { enum: ["owner", "admin", "member"] }).default("member"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Signals ───

// LEGACY: Do not write new data here. Use kestovar_canonical_events instead.
export const signalcoreEvents = sqliteTable("signalcore_events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  providerId: integer("providerId").notNull(),
  sourceUrl: text("sourceUrl"),
  title: text("title"),
  description: text("description"),
  location: text("location"),
  county: text("county"),
  state: text("state"),
  zipCode: text("zipCode"),
  address: text("address"),
  lat: real("lat"),
  lng: real("lng"),
  permitType: text("permitType"),
  permitClass: text("permitClass"),
  value: real("value"),
  contractorName: text("contractorName"),
  contractorPhone: text("contractorPhone"),
  contractorEmail: text("contractorEmail"),
  ownerName: text("ownerName"),
  publishedAt: integer("publishedAt", { mode: "timestamp" }),
  ingestedAt: integer("ingestedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  rawData: text("rawData"),
  normalizedData: text("normalizedData"),
  contentHash: text("contentHash"),
  status: text("status"),
  eventType: text("eventType"),
});

// CANONICAL: All new ingestion writes go to this table.
export const kestovarCanonicalEvents = sqliteTable("kestovar_canonical_events", {
  canonicalId: text("canonical_id").primaryKey(),
  providerId: text("provider_id").notNull(),
  sourceRecordId: text("source_record_id"),
  sourceUrl: text("source_url"),
  eventType: text("event_type"),
  title: text("title"),
  description: text("description"),
  permitType: text("permit_type"),
  permitClass: text("permit_class"),
  workClass: text("work_class"),
  county: text("county"),
  state: text("state"),
  city: text("city"),
  zipCode: text("zip_code"),
  address: text("address"),
  lat: real("lat"),
  lng: real("lng"),
  parcelId: text("parcel_id"),
  applicationDate: integer("application_date", { mode: "timestamp" }),
  issueDate: integer("issue_date", { mode: "timestamp" }),
  status: text("status"),
  statusMapped: text("status_mapped"),
  value: real("value"),
  contractorName: text("contractor_name"),
  contractorPhone: text("contractor_phone"),
  contractorEmail: text("contractor_email"),
  ownerName: text("owner_name"),
  rawData: text("raw_data"),
  normalizedData: text("normalized_data"),
  contentHash: text("content_hash"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  ingestedAt: integer("ingested_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  sourceUpdatedAt: integer("source_updated_at", { mode: "timestamp" }),
  validationErrors: text("validation_errors"),
  confidence: real("confidence").default(0.5),
  statusCanonical: text("status_canonical").default("active"),
  provenance: text("provenance").default("LIVE"),
  lineageVersion: integer("lineage_version").default(1),
});

// ─── Patterns ───
export const signalcorePatterns = sqliteTable("signalcore_patterns", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  patternName: text("patternName").notNull(),
  patternType: text("patternType").notNull(),
  description: text("description"),
  query: text("query"),
  filters: text("filters"),
  confidence: real("confidence").default(0.5),
  signalCount: integer("signalCount").default(0),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("LIVE"),
});

// ─── Opportunities ───
export const opportunities = sqliteTable("opportunities", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  signalId: text("signalId").notNull(),
  title: text("title"),
  description: text("description"),
  confidenceScore: real("confidenceScore").default(0.5),
  estimatedValue: real("estimatedValue"),
  status: text("status").default("open"),
  assignedTo: text("assignedTo"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Provider Registry ───
export const providerRegistry = sqliteTable("provider_registry", {
  providerId: text("providerId").primaryKey(),
  providerName: text("providerName").notNull(),
  sourceType: text("sourceType").notNull(),
  sourceUrl: text("sourceUrl"),
  apiEndpoint: text("apiEndpoint"),
  apiKeyEnv: text("apiKeyEnv"),
  cronExpression: text("cronExpression").default("0 6 * * *"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  healthStatus: text("healthStatus").default("healthy"),
  lastRunAt: integer("lastRunAt", { mode: "timestamp" }),
  nextRunAt: integer("nextRunAt", { mode: "timestamp" }),
  recordsFetchedTotal: integer("recordsFetchedTotal").default(0),
  recordsIngestedTotal: integer("recordsIngestedTotal").default(0),
  failureCount: integer("failureCount").default(0),
  successRate: real("successRate").default(1.0),
  avgLatencyMs: integer("avgLatencyMs").default(0),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Provider Polling Schedule ───
export const providerPollingSchedule = sqliteTable("provider_polling_schedule", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  providerId: text("providerId").notNull(),
  cronExpression: text("cronExpression").default("0 6 * * *"),
  timezone: text("timezone").default("America/New_York"),
  isEnabled: integer("isEnabled", { mode: "boolean" }).default(true),
  lastTriggeredAt: integer("lastTriggeredAt", { mode: "timestamp" }),
  nextTriggerAt: integer("nextTriggerAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Circuit Breaker ───
export const circuitBreaker = sqliteTable("circuit_breaker", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  providerId: text("providerId").notNull(),
  failureCount: integer("failureCount").default(0),
  lastFailureAt: integer("lastFailureAt", { mode: "timestamp" }),
  isOpen: integer("isOpen", { mode: "boolean" }).default(false),
  openedAt: integer("openedAt", { mode: "timestamp" }),
  cooldownMs: integer("cooldownMs").default(300000),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Ingestion Runs ───
export const ingestionRuns = sqliteTable("ingestion_runs", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  providerId: text("providerId").notNull(),
  startedAt: integer("startedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  endedAt: integer("endedAt", { mode: "timestamp" }),
  recordsFetched: integer("recordsFetched").default(0),
  recordsCreated: integer("recordsCreated").default(0),
  recordsUpdated: integer("recordsUpdated").default(0),
  recordsSkipped: integer("recordsSkipped").default(0),
  recordsFailed: integer("recordsFailed").default(0),
  totalLatencyMs: integer("totalLatencyMs").default(0),
  status: text("status", { enum: ["running", "success", "partial", "failed"] }).default("running"),
  errorMessage: text("errorMessage"),
  logOutput: text("logOutput"),
});

// ─── Watchlists ───
export const watchlists = sqliteTable("watchlists", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  filters: text("filters"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const watchlistItems = sqliteTable("watchlist_items", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  watchlistId: text("watchlistId").notNull(),
  signalId: text("signalId").notNull(),
  notes: text("notes"),
  status: text("status").default("active"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Subscriptions ───
export const subscriptions = sqliteTable("subscriptions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("userId").notNull(),
  orgId: text("orgId"),
  stripeCustomerId: text("stripeCustomerId"),
  stripeSubscriptionId: text("stripeSubscriptionId"),
  stripePriceId: text("stripePriceId"),
  plan: text("plan", { enum: ["free", "starter", "pro", "business", "enterprise"] }).default("free"),
  status: text("status", { enum: ["active", "canceled", "past_due", "trialing"] }).default("active"),
  currentPeriodStart: integer("currentPeriodStart", { mode: "timestamp" }),
  currentPeriodEnd: integer("currentPeriodEnd", { mode: "timestamp" }),
  cancelAtPeriodEnd: integer("cancelAtPeriodEnd", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const invoices = sqliteTable("invoices", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  subscriptionId: text("subscriptionId").notNull(),
  stripeInvoiceId: text("stripeInvoiceId"),
  amount: integer("amount"),
  currency: text("currency").default("usd"),
  status: text("status", { enum: ["draft", "open", "paid", "uncollectible", "void"] }).default("open"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Telemetry ───
export const telemetryEvents = sqliteTable("telemetry_events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  eventType: text("eventType").notNull(),
  endpoint: text("endpoint"),
  durationMs: integer("durationMs"),
  error: integer("error", { mode: "boolean" }).default(false),
  userId: text("userId"),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
