// BuildSignal D1 Schema — SQLite edition
// Drizzle ORM table definitions for Cloudflare D1

import { sqliteTable, integer, text, real, index, uniqueIndex } from "drizzle-orm/sqlite-core";

// ─── Users ───
export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("passwordHash"),
  role: text("role").default("user"),
  status: text("status").default("active"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  lastLoginAt: integer("lastLoginAt", { mode: "timestamp" }),
  stripeCustomerId: text("stripeCustomerId"),
  stripeSubscriptionId: text("stripeSubscriptionId"),
  stripePriceId: text("stripePriceId"),
  subscriptionStatus: text("subscriptionStatus"),
  subscriptionTier: text("subscriptionTier"),
  currentPeriodEnd: integer("currentPeriodEnd", { mode: "timestamp" }),
  plan: text("plan").default("free"),
  isAdmin: integer("isAdmin", { mode: "boolean" }).default(false),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  name: text("name"),
  company: text("company"),
  phone: text("phone"),
  avatarUrl: text("avatarUrl"),
  industry: text("industry"),
  jobTitle: text("jobTitle"),
  emailVerified: integer("emailVerified", { mode: "boolean" }).default(false),
  onboardingCompleted: integer("onboardingCompleted", { mode: "boolean" }).default(false),
  onboardedAt: integer("onboardedAt", { mode: "timestamp" }),
  referralCode: text("referralCode"),
  referredBy: text("referredBy"),
  metadata: text("metadata"),
  settings: text("settings"),
  activityStatus: text("activityStatus").default("active"),
  loginCount: integer("loginCount").default(0),
  lastActivityAt: integer("lastActivityAt", { mode: "timestamp" }),
  lastActiveAt: integer("lastActiveAt", { mode: "timestamp" }),
  usageCounts: text("usageCounts"),
  dataSource: text("dataSource"),
  region: text("region"),
  timezone: text("timezone"),
  language: text("language"),
  mfaEnabled: integer("mfaEnabled", { mode: "boolean" }).default(false),
  mfaSecret: text("mfaSecret"),
  provenance: text("provenance").default("SEED"),
});

// ─── Sessions ───
export const sessions = sqliteTable("sessions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  revokedAt: integer("revokedAt", { mode: "timestamp" }),
  provenance: text("provenance").default("SEED"),
});

// ─── Organizations ───
export const organizations = sqliteTable("organizations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logoUrl: text("logoUrl"),
  website: text("website"),
  industry: text("industry"),
  size: text("size"),
  status: text("status").default("active"),
  plan: text("plan").default("free"),
  stripeCustomerId: text("stripeCustomerId"),
  stripeSubscriptionId: text("stripeSubscriptionId"),
  subscriptionStatus: text("subscriptionStatus"),
  currentPeriodEnd: integer("currentPeriodEnd", { mode: "timestamp" }),
  settings: text("settings"),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  billingEmail: text("billingEmail"),
  billingAddress: text("billingAddress"),
  usageQuota: integer("usageQuota").default(0),
  usageCount: integer("usageCount").default(0),
  provenance: text("provenance").default("SEED"),
});

// ─── Organization Members ───
export const organizationMembers = sqliteTable("organization_members", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  organizationId: integer("organizationId").notNull(),
  userId: integer("userId").notNull(),
  role: text("role").default("member"),
  invitedBy: integer("invitedBy"),
  invitedAt: integer("invitedAt", { mode: "timestamp" }),
  joinedAt: integer("joinedAt", { mode: "timestamp" }),
  status: text("status").default("active"),
  permissions: text("permissions"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── Ingestion Sources ───
export const ingestionSources = sqliteTable("ingestion_sources", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  sourceType: text("sourceType").notNull(),
  endpointUrl: text("endpointUrl"),
  apiKey: text("apiKey"),
  config: text("config"),
  schedule: text("schedule"),
  lastRunAt: integer("lastRunAt", { mode: "timestamp" }),
  nextRunAt: integer("nextRunAt", { mode: "timestamp" }),
  status: text("status").default("active"),
  healthStatus: text("healthStatus").default("healthy"),
  errorCount: integer("errorCount").default(0),
  successCount: integer("successCount").default(0),
  metadata: text("metadata"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── Raw Records (Ingestion Pipeline) ───
export const rawRecords = sqliteTable("raw_records", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  providerId: text("providerId"),
  sourceRecordId: text("sourceRecordId"),
  sourceUrl: text("sourceUrl"),
  observedAt: integer("observedAt", { mode: "timestamp" }),
  ingestedAt: integer("ingestedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  rawPayload: text("rawPayload"),
  rawTitle: text("rawTitle"),
  rawDescription: text("rawDescription"),
  rawLocation: text("rawLocation"),
  rawStatus: text("rawStatus"),
  rawDates: text("rawDates"),
  rawMetadata: text("rawMetadata"),
  ingestionRunId: integer("ingestionRunId"),
  resolvedEntityId: integer("resolvedEntityId"),
  resolvedEntityType: text("resolvedEntityType"),
  resolvedAt: integer("resolvedAt", { mode: "timestamp" }),
  provenance: text("provenance").default("LIVE"),
  isDeleted: integer("isDeleted", { mode: "boolean" }).default(false),
});

// ─── Ingestion Runs ───
export const ingestionRuns = sqliteTable("ingestion_runs", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  providerId: text("providerId"),
  startedAt: integer("startedAt", { mode: "timestamp" }),
  completedAt: integer("completedAt", { mode: "timestamp" }),
  status: text("status").default("running"),
  triggerType: text("triggerType").default("manual"),
  recordsObserved: integer("recordsObserved").default(0),
  recordsCreated: integer("recordsCreated").default(0),
  recordsResolved: integer("recordsResolved").default(0),
  recordsFailed: integer("recordsFailed").default(0),
  fetchLatencyMs: integer("fetchLatencyMs"),
  parseLatencyMs: integer("parseLatencyMs"),
  resolveLatencyMs: integer("resolveLatencyMs"),
  totalLatencyMs: integer("totalLatencyMs"),
  sourceRecordCount: integer("sourceRecordCount").default(0),
  error: text("error"),
  errorCode: text("errorCode"),
  metadata: text("metadata"),
  provenance: text("provenance").default("LIVE"),
});

// ─── Provider Registry ───
export const providerRegistry = sqliteTable("provider_registry", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  providerId: text("providerId").notNull().unique(),
  providerName: text("providerName").notNull(),
  providerType: text("providerType").default("arcgis"),
  endpointUrl: text("endpointUrl"),
  jurisdiction: text("jurisdiction"),
  state: text("state"),
  county: text("county"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  lastIngestedAt: integer("lastIngestedAt", { mode: "timestamp" }),
  totalRecords: integer("totalRecords").default(0),
  config: text("config"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── Entity Resolution Log ───
export const entityResolutionLog = sqliteTable("entity_resolution_log", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  rawRecordId: integer("rawRecordId").notNull(),
  entityType: text("entityType").notNull(),
  entityId: integer("entityId"),
  confidence: integer("confidence").default(0),
  method: text("method"),
  status: text("status").default("pending"),
  error: text("error"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("LIVE"),
});

// ─── SignalCore Events (LEGACY — read-only) ───
export const signalcoreEvents = sqliteTable("signalcore_events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  providerId: text("providerId"),
  externalId: text("externalId"),
  eventType: text("eventType").notNull(),
  title: text("title").notNull(),
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
  confidence: real("confidence").default(0.5),
  contentHash: text("contentHash"),
  rawData: text("rawData"),
  normalizedData: text("normalizedData"),
  status: text("status").default("active"),
  value: real("value"),
  contractorName: text("contractorName"),
  contractorPhone: text("contractorPhone"),
  contractorEmail: text("contractorEmail"),
  ownerName: text("ownerName"),
  permitType: text("permitType"),
  permitClass: text("permitClass"),
  workClass: text("workClass"),
  applicationDate: integer("applicationDate", { mode: "timestamp" }),
  issueDate: integer("issueDate", { mode: "timestamp" }),
  parcelId: text("parcelId"),
  sourceUrl: text("sourceUrl"),
  sourceUpdatedAt: integer("sourceUpdatedAt", { mode: "timestamp" }),
  provenance: text("provenance").default("LIVE"),
});

// ─── SignalCore Patterns ───
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

// ─── SignalCore Opportunities ───
export const signalcoreOpportunities = sqliteTable("signalcore_opportunities", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  signalId: text("signalId").notNull(),
  userId: integer("userId"),
  title: text("title"),
  description: text("description"),
  estimatedValue: real("estimatedValue"),
  confidenceScore: real("confidenceScore").default(0.5),
  status: text("status").default("open"),
  priority: text("priority").default("medium"),
  assignedTo: text("assignedTo"),
  notes: text("notes"),
  tags: text("tags"),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  closedAt: integer("closedAt", { mode: "timestamp" }),
  closedReason: text("closedReason"),
  source: text("source").default("ai"),
  provenance: text("provenance").default("LIVE"),
});

// ─── SignalCore Recommendations ───
export const signalcoreRecommendations = sqliteTable("signalcore_recommendations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  signalId: text("signalId"),
  recommendationType: text("recommendationType").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  reason: text("reason"),
  confidence: real("confidence").default(0.5),
  isRead: integer("isRead", { mode: "boolean" }).default(false),
  isActioned: integer("isActioned", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  expiresAt: integer("expiresAt", { mode: "timestamp" }),
  metadata: text("metadata"),
  provenance: text("provenance").default("LIVE"),
});

// ─── SignalCore Alerts ───
export const signalcoreAlerts = sqliteTable("signalcore_alerts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  alertType: text("alertType").notNull(),
  name: text("name").notNull(),
  filters: text("filters"),
  frequency: text("frequency").default("daily"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  lastSentAt: integer("lastSentAt", { mode: "timestamp" }),
  nextSendAt: integer("nextSendAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("LIVE"),
});

// ─── SignalCore Daily Briefs ───
export const signalcoreDailyBriefs = sqliteTable("signalcore_daily_briefs", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  briefDate: integer("briefDate", { mode: "timestamp" }).notNull(),
  signalCount: integer("signalCount").default(0),
  opportunityCount: integer("opportunityCount").default(0),
  summary: text("summary"),
  insights: text("insights"),
  highlights: text("highlights"),
  isSent: integer("isSent", { mode: "boolean" }).default(false),
  sentAt: integer("sentAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("LIVE"),
});

// ─── Watchlists ───
export const watchlists = sqliteTable("watchlists", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  filters: text("filters"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("LIVE"),
});

// ─── Notifications ───
export const notifications = sqliteTable("notifications", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message"),
  isRead: integer("isRead", { mode: "boolean" }).default(false),
  data: text("data"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  readAt: integer("readAt", { mode: "timestamp" }),
  provenance: text("provenance").default("LIVE"),
});

// ─── Search History ───
export const searchHistory = sqliteTable("search_history", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId"),
  query: text("query").notNull(),
  filters: text("filters"),
  resultCount: integer("resultCount").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("LIVE"),
});

// ─── Analytics Events ───
export const analyticsEvents = sqliteTable("analytics_events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  eventType: text("eventType").notNull(),
  userId: integer("userId"),
  properties: text("properties"),
  sessionId: text("sessionId"),
  ipHash: text("ipHash"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("LIVE"),
});

// ─── Audit Log ───
export const auditLog = sqliteTable("audit_log", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId"),
  action: text("action").notNull(),
  entityType: text("entityType"),
  entityId: text("entityId"),
  changes: text("changes"),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("LIVE"),
});

// ─── Subscriptions ───
export const subscriptions = sqliteTable("subscriptions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
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
  provenance: text("provenance").default("SEED"),
});

// ─── Invoices ───
export const invoices = sqliteTable("invoices", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  subscriptionId: text("subscriptionId").notNull(),
  stripeInvoiceId: text("stripeInvoiceId"),
  amount: integer("amount"),
  currency: text("currency").default("usd"),
  status: text("status", { enum: ["draft", "open", "paid", "uncollectible", "void"] }).default("open"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── Feature Flags ───
export const featureFlags = sqliteTable("feature_flags", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  enabled: integer("enabled", { mode: "boolean" }).default(false),
  rolloutPercentage: integer("rolloutPercentage").default(0),
  allowedPlans: text("allowedPlans"),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── Counties ───
export const counties = sqliteTable("counties", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  state: text("state").notNull(),
  fipsCode: text("fipsCode"),
  population: integer("population"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  providerCount: integer("providerCount").default(0),
  signalCount: integer("signalCount").default(0),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── Kestovar Canonical Events (CANONICAL — all new writes go here) ───
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

// ─── Learning Models ───
export const learningModels = sqliteTable("learning_models", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  modelName: text("modelName").notNull(),
  modelType: text("modelType").notNull(),
  version: text("version").notNull(),
  description: text("description"),
  accuracy: real("accuracy"),
  precision: real("precision"),
  recall: real("recall"),
  f1Score: real("f1Score"),
  trainingDataSize: integer("trainingDataSize"),
  hyperparameters: text("hyperparameters"),
  featureImportance: text("featureImportance"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  deployedAt: integer("deployedAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});
