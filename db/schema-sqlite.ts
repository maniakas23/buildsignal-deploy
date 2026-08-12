import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ============================================================
// Core Tables
// ============================================================

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash"),
  plan: text("plan", { enum: ["free", "starter", "pro", "business", "enterprise"] }).default("free"),
  isAdmin: integer("is_admin", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  avatarUrl: text("avatar_url"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  ownerId: text("owner_id").notNull(),
  plan: text("plan", { enum: ["free", "starter", "pro", "business", "enterprise"] }).default("free"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const orgMembers = sqliteTable("org_members", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  userId: text("user_id").notNull(),
  role: text("role", { enum: ["owner", "admin", "member"] }).default("member"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================================
// Signals & Events
// ============================================================

// LEGACY: Do not write new data here. Use kestovar_canonical_events instead.
export const signalcoreEvents = sqliteTable("signalcore_events", {
  id: text("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  sourceUrl: text("source_url"),
  title: text("title"),
  description: text("description"),
  location: text("location"),
  county: text("county"),
  state: text("state"),
  zipCode: text("zip_code"),
  address: text("address"),
  lat: real("lat"),
  lng: real("lng"),
  permitType: text("permit_type"),
  permitClass: text("permit_class"),
  value: real("value"),
  contractorName: text("contractor_name"),
  contractorPhone: text("contractor_phone"),
  contractorEmail: text("contractor_email"),
  ownerName: text("owner_name"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  rawData: text("raw_data"),
  normalizedData: text("normalized_data"),
  contentHash: text("content_hash"),
  status: text("status"),
  eventType: text("event_type"),
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

// ============================================================
// Patterns & Opportunities
// ============================================================

export const signalcorePatterns = sqliteTable("signalcore_patterns", {
  id: text("id").primaryKey(),
  patternName: text("pattern_name").notNull(),
  patternType: text("pattern_type").notNull(),
  description: text("description"),
  query: text("query"),
  filters: text("filters"),
  confidence: real("confidence").default(0.5),
  signalCount: integer("signal_count").default(0),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("LIVE"),
});

export const opportunities = sqliteTable("opportunities", {
  id: text("id").primaryKey(),
  signalId: text("signal_id").notNull(),
  title: text("title"),
  description: text("description"),
  confidenceScore: real("confidence_score").default(0.5),
  estimatedValue: real("estimated_value"),
  status: text("status").default("open"),
  assignedTo: text("assigned_to"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================================
// Providers & Polling
// ============================================================

export const providerRegistry = sqliteTable("provider_registry", {
  providerId: text("provider_id").primaryKey(),
  providerName: text("provider_name").notNull(),
  sourceType: text("source_type").notNull(),
  sourceUrl: text("source_url"),
  apiEndpoint: text("api_endpoint"),
  apiKeyEnv: text("api_key_env"),
  cronExpression: text("cron_expression").default("0 6 * * *"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  healthStatus: text("health_status").default("healthy"),
  lastRunAt: integer("last_run_at", { mode: "timestamp" }),
  nextRunAt: integer("next_run_at", { mode: "timestamp" }),
  recordsFetchedTotal: integer("records_fetched_total").default(0),
  recordsIngestedTotal: integer("records_ingested_total").default(0),
  failureCount: integer("failure_count").default(0),
  successRate: real("success_rate").default(1.0),
  avgLatencyMs: integer("avg_latency_ms").default(0),
  metadata: text("metadata"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const providerPollingSchedule = sqliteTable("provider_polling_schedule", {
  id: text("id").primaryKey(),
  providerId: text("provider_id").notNull(),
  cronExpression: text("cron_expression").default("0 6 * * *"),
  timezone: text("timezone").default("America/New_York"),
  isEnabled: integer("is_enabled", { mode: "boolean" }).default(true),
  lastTriggeredAt: integer("last_triggered_at", { mode: "timestamp" }),
  nextTriggerAt: integer("next_trigger_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const circuitBreaker = sqliteTable("circuit_breaker", {
  id: text("id").primaryKey(),
  providerId: text("provider_id").notNull(),
  failureCount: integer("failure_count").default(0),
  lastFailureAt: integer("last_failure_at", { mode: "timestamp" }),
  isOpen: integer("is_open", { mode: "boolean" }).default(false),
  openedAt: integer("opened_at", { mode: "timestamp" }),
  cooldownMs: integer("cooldown_ms").default(300000),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const ingestionRuns = sqliteTable("ingestion_runs", {
  id: text("id").primaryKey(),
  providerId: text("provider_id").notNull(),
  startedAt: integer("started_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  endedAt: integer("ended_at", { mode: "timestamp" }),
  recordsFetched: integer("records_fetched").default(0),
  recordsCreated: integer("records_created").default(0),
  recordsUpdated: integer("records_updated").default(0),
  recordsSkipped: integer("records_skipped").default(0),
  recordsFailed: integer("records_failed").default(0),
  totalLatencyMs: integer("total_latency_ms").default(0),
  status: text("status", { enum: ["running", "success", "partial", "failed"] }).default("running"),
  errorMessage: text("error_message"),
  logOutput: text("log_output"),
});

// ============================================================
// Watchlists
// ============================================================

export const watchlists = sqliteTable("watchlists", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  filters: text("filters"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const watchlistItems = sqliteTable("watchlist_items", {
  id: text("id").primaryKey(),
  watchlistId: text("watchlist_id").notNull(),
  signalId: text("signal_id").notNull(),
  notes: text("notes"),
  status: text("status").default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================================
// Billing & Subscriptions
// ============================================================

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  orgId: text("org_id"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  plan: text("plan", { enum: ["free", "starter", "pro", "business", "enterprise"] }).default("free"),
  status: text("status", { enum: ["active", "canceled", "past_due", "trialing"] }).default("active"),
  currentPeriodStart: integer("current_period_start", { mode: "timestamp" }),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
  cancelAtPeriodEnd: integer("cancel_at_period_end", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const invoices = sqliteTable("invoices", {
  id: text("id").primaryKey(),
  subscriptionId: text("subscription_id").notNull(),
  stripeInvoiceId: text("stripe_invoice_id"),
  amount: integer("amount"),
  currency: text("currency").default("usd"),
  status: text("status", { enum: ["draft", "open", "paid", "uncollectible", "void"] }).default("open"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================================
// Telemetry
// ============================================================

export const telemetryEvents = sqliteTable("telemetry_events", {
  id: text("id").primaryKey(),
  eventType: text("event_type").notNull(),
  endpoint: text("endpoint"),
  durationMs: integer("duration_ms"),
  error: integer("error", { mode: "boolean" }).default(false),
  userId: text("user_id"),
  metadata: text("metadata"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
