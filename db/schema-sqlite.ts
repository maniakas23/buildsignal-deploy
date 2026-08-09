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

// ─── SignalCore Events ───
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
  confidence: integer("confidence").default(70),
  status: text("status").default("active"),
  contentHash: text("contentHash"),
  rawData: text("rawData"),
  dataSource: text("dataSource"),
  metadata: text("metadata"),
  tags: text("tags"),
  searchVector: text("searchVector"),
  clusterId: integer("clusterId"),
  provenance: text("provenance").default("SEED"),
});

// ─── SignalCore Patterns ───
export const signalcorePatterns = sqliteTable("signalcore_patterns", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  patternType: text("patternType").notNull(),
  patternName: text("patternName").notNull(),
  description: text("description"),
  county: text("county"),
  state: text("state"),
  city: text("city"),
  zipCode: text("zipCode"),
  eventCount: integer("eventCount").default(0),
  firstSeenAt: integer("firstSeenAt", { mode: "timestamp" }),
  lastSeenAt: integer("lastSeenAt", { mode: "timestamp" }),
  confidence: integer("confidence").default(0),
  status: text("status").default("active"),
  evidence: text("evidence"),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── SignalCore Opportunities ───
export const signalcoreOpportunities = sqliteTable("signalcore_opportunities", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  patternId: integer("patternId"),
  title: text("title").notNull(),
  description: text("description"),
  opportunityType: text("opportunityType").default("contracting"),
  estimatedValue: real("estimatedValue"),
  confidence: integer("confidence").default(0),
  status: text("status").default("open"),
  priority: text("priority").default("medium"),
  county: text("county"),
  state: text("state"),
  city: text("city"),
  zipCode: text("zipCode"),
  address: text("address"),
  lat: text("lat"),
  lng: text("lng"),
  contactName: text("contactName"),
  contactEmail: text("contactEmail"),
  contactPhone: text("contactPhone"),
  deadlineAt: integer("deadlineAt", { mode: "timestamp" }),
  awardedTo: text("awardedTo"),
  awardedAt: integer("awardedAt", { mode: "timestamp" }),
  estimatedValueMin: real("estimatedValueMin"),
  estimatedValueMax: real("estimatedValueMax"),
  tags: text("tags"),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── SignalCore Recommendations ───
export const signalcoreRecommendations = sqliteTable("signalcore_recommendations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId"),
  opportunityId: integer("opportunityId"),
  patternId: integer("patternId"),
  title: text("title").notNull(),
  description: text("description"),
  recommendationType: text("recommendationType").default("opportunity"),
  confidence: integer("confidence").default(0),
  status: text("status").default("pending"),
  reason: text("reason"),
  actionTaken: text("actionTaken"),
  actionTakenAt: integer("actionTakenAt", { mode: "timestamp" }),
  dismissedAt: integer("dismissedAt", { mode: "timestamp" }),
  dismissedReason: text("dismissedReason"),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── SignalCore Alerts ───
export const signalcoreAlerts = sqliteTable("signalcore_alerts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId"),
  patternId: integer("patternId"),
  opportunityId: integer("opportunityId"),
  title: text("title").notNull(),
  description: text("description"),
  alertType: text("alertType").default("pattern_match"),
  severity: text("severity").default("info"),
  status: text("status").default("unread"),
  dismissedAt: integer("dismissedAt", { mode: "timestamp" }),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── SignalCore Daily Briefs ───
export const signalcoreDailyBriefs = sqliteTable("signalcore_daily_briefs", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId"),
  date: text("date").notNull(),
  summary: text("summary"),
  eventCount: integer("eventCount").default(0),
  patternCount: integer("patternCount").default(0),
  opportunityCount: integer("opportunityCount").default(0),
  alertCount: integer("alertCount").default(0),
  recommendationCount: integer("recommendationCount").default(0),
  content: text("content"),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── Watchlists ───
export const watchlists = sqliteTable("watchlists", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  query: text("query"),
  filters: text("filters"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  alertEnabled: integer("alertEnabled", { mode: "boolean" }).default(false),
  lastMatchAt: integer("lastMatchAt", { mode: "timestamp" }),
  matchCount: integer("matchCount").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── Notifications ───
export const notifications = sqliteTable("notifications", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message"),
  data: text("data"),
  isRead: integer("isRead", { mode: "boolean" }).default(false),
  readAt: integer("readAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── Search History ───
export const searchHistory = sqliteTable("search_history", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId"),
  query: text("query").notNull(),
  filters: text("filters"),
  resultCount: integer("resultCount").default(0),
  clickedResults: text("clickedResults"),
  sessionId: text("sessionId"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── Analytics Events ───
export const analyticsEvents = sqliteTable("analytics_events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId"),
  eventType: text("eventType").notNull(),
  eventData: text("eventData"),
  pageUrl: text("pageUrl"),
  sessionId: text("sessionId"),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── Audit Log ───
export const auditLog = sqliteTable("audit_log", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId"),
  action: text("action").notNull(),
  resourceType: text("resourceType"),
  resourceId: text("resourceId"),
  details: text("details"),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── Subscriptions ───
export const subscriptions = sqliteTable("subscriptions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  stripeSubscriptionId: text("stripeSubscriptionId").notNull().unique(),
  stripePriceId: text("stripePriceId").notNull(),
  stripeCustomerId: text("stripeCustomerId").notNull(),
  status: text("status").notNull(),
  currentPeriodStart: integer("currentPeriodStart", { mode: "timestamp" }),
  currentPeriodEnd: integer("currentPeriodEnd", { mode: "timestamp" }),
  cancelAtPeriodEnd: integer("cancelAtPeriodEnd", { mode: "boolean" }).default(false),
  canceledAt: integer("canceledAt", { mode: "timestamp" }),
  plan: text("plan").default("starter"),
  quantity: integer("quantity").default(1),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── Invoices ───
export const invoices = sqliteTable("invoices", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  stripeInvoiceId: text("stripeInvoiceId").notNull().unique(),
  stripeSubscriptionId: text("stripeSubscriptionId"),
  amount: real("amount").notNull(),
  currency: text("currency").default("usd"),
  status: text("status").notNull(),
  pdfUrl: text("pdfUrl"),
  hostedInvoiceUrl: text("hostedInvoiceUrl"),
  invoiceNumber: text("invoiceNumber"),
  description: text("description"),
  periodStart: integer("periodStart", { mode: "timestamp" }),
  periodEnd: integer("periodEnd", { mode: "timestamp" }),
  metadata: text("metadata"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── Feature Flags ───
export const featureFlags = sqliteTable("feature_flags", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
  enabled: integer("enabled", { mode: "boolean" }).default(false),
  rolloutPercentage: integer("rolloutPercentage").default(0),
  allowedUsers: text("allowedUsers"),
  allowedOrgs: text("allowedOrgs"),
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
  fipsCode: text("fipsCode").unique(),
  population: integer("population"),
  medianIncome: real("medianIncome"),
  lat: real("lat"),
  lng: real("lng"),
  boundaryGeojson: text("boundaryGeojson"),
  metadata: text("metadata"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  provenance: text("provenance").default("SEED"),
});

// ─── Learning Models ───
export const learningModels = sqliteTable("learning_models", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  modelType: text("modelType").notNull(),
  version: text("version").notNull(),
  description: text("description"),
  trainingDataSize: integer("trainingDataSize"),
  accuracy: real("accuracy"),
  precision: real("precision"),
  recall: real("recall"),
  f1Score: real("f1Score"),
  trainingStartedAt: integer("trainingStartedAt", { mode: "timestamp" }),
  trainingCompletedAt: integer("trainingCompletedAt", { mode: "timestamp" }),
  deploymentStatus: text("deploymentStatus").default("draft"),
  deployedAt: integer("deployedAt", { mode: "timestamp" }),
  retiredAt: integer("retiredAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
