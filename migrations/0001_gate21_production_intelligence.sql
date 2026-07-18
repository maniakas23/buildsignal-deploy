-- Gate 21 — Production Intelligence Network Schema
-- Created: 2026-07-19

-- Section 1: Ingestion Sources
CREATE TABLE IF NOT EXISTS ingestion_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sourceName TEXT NOT NULL,
  sourceType TEXT NOT NULL,
  jurisdictionLevel TEXT NOT NULL DEFAULT 'county',
  coverageArea TEXT NOT NULL,
  endpointUrl TEXT,
  importMethod TEXT NOT NULL DEFAULT 'api',
  authType TEXT DEFAULT 'none',
  schedule TEXT NOT NULL DEFAULT 'daily',
  isActive INTEGER DEFAULT 1,
  healthScore INTEGER DEFAULT 100,
  recordsLast30Days INTEGER DEFAULT 0,
  avgLatencyMs INTEGER DEFAULT 0,
  errorCount30d INTEGER DEFAULT 0,
  lastSyncAt TIMESTAMP,
  nextSyncAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ingestion_sources_type ON ingestion_sources(sourceType);
CREATE INDEX IF NOT EXISTS idx_ingestion_sources_active ON ingestion_sources(isActive);
CREATE INDEX IF NOT EXISTS idx_ingestion_sources_health ON ingestion_sources(healthScore);

-- Section 2: Data Validation Queue
CREATE TABLE IF NOT EXISTS data_validation_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sourceId INTEGER NOT NULL,
  externalRecordId TEXT NOT NULL,
  recordType TEXT NOT NULL,
  rawPayload TEXT NOT NULL,
  requiredFieldsCheck INTEGER DEFAULT 0,
  dateValidationCheck INTEGER DEFAULT 0,
  addressValidationCheck INTEGER DEFAULT 0,
  coordinateValidationCheck INTEGER DEFAULT 0,
  schemaComplianceCheck INTEGER DEFAULT 0,
  providerIntegrityCheck INTEGER DEFAULT 0,
  confidenceScore INTEGER DEFAULT 0,
  validationStatus TEXT NOT NULL DEFAULT 'pending',
  validationErrors TEXT,
  reviewedBy INTEGER,
  reviewerNotes TEXT,
  reviewedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_validation_status ON data_validation_queue(validationStatus);
CREATE INDEX IF NOT EXISTS idx_validation_confidence ON data_validation_queue(confidenceScore);

-- Section 3: Enrichment Log
CREATE TABLE IF NOT EXISTS enrichment_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  eventId INTEGER NOT NULL,
  enrichmentType TEXT NOT NULL,
  enrichmentData TEXT NOT NULL,
  source TEXT NOT NULL,
  confidence INTEGER DEFAULT 80,
  processedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_enrichment_event ON enrichment_log(eventId);
CREATE INDEX IF NOT EXISTS idx_enrichment_type ON enrichment_log(enrichmentType);

-- Section 4: Historical Warehouse
CREATE TABLE IF NOT EXISTS historical_warehouse (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entityType TEXT NOT NULL,
  entityId INTEGER NOT NULL,
  eventType TEXT NOT NULL,
  county TEXT NOT NULL,
  state TEXT NOT NULL,
  snapshotData TEXT NOT NULL,
  eventDate TIMESTAMP,
  confidence INTEGER DEFAULT 50,
  snapshotDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_warehouse_entity ON historical_warehouse(entityType, entityId);
CREATE INDEX IF NOT EXISTS idx_warehouse_county ON historical_warehouse(county, state);
CREATE INDEX IF NOT EXISTS idx_warehouse_date ON historical_warehouse(snapshotDate);

-- Section 5: Expansion Registry
CREATE TABLE IF NOT EXISTS expansion_registry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  state TEXT NOT NULL,
  county TEXT NOT NULL,
  city TEXT,
  planningAuthority TEXT,
  utilityProviders TEXT,
  population INTEGER DEFAULT 0,
  coveragePercent INTEGER DEFAULT 0,
  activeProviders INTEGER DEFAULT 0,
  providerHealth INTEGER DEFAULT 0,
  expansionStatus TEXT NOT NULL DEFAULT 'queued',
  dataSourcesAvailable INTEGER DEFAULT 0,
  dataSourcesActive INTEGER DEFAULT 0,
  lastAssessmentAt TIMESTAMP,
  onboardedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_expansion_status ON expansion_registry(expansionStatus);
CREATE INDEX IF NOT EXISTS idx_expansion_state ON expansion_registry(state);

-- Section 6: Quality Metrics
CREATE TABLE IF NOT EXISTS quality_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metricDate TEXT NOT NULL,
  recommendationPrecision REAL DEFAULT 0,
  recommendationRecall REAL DEFAULT 0,
  falsePositiveRate REAL DEFAULT 0,
  falseNegativeRate REAL DEFAULT 0,
  acceptanceRate REAL DEFAULT 0,
  providerReliabilityAvg REAL DEFAULT 0,
  coverageCompleteness REAL DEFAULT 0,
  confidenceAccuracy REAL DEFAULT 0,
  totalRecommendations INTEGER DEFAULT 0,
  acceptedRecommendations INTEGER DEFAULT 0,
  rejectedRecommendations INTEGER DEFAULT 0,
  correctedRecommendations INTEGER DEFAULT 0,
  trendDirection TEXT DEFAULT 'stable',
  recordedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_quality_date ON quality_metrics(metricDate);

-- Section 7: Daily Briefings
CREATE TABLE IF NOT EXISTS daily_briefings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  briefingDate TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'national',
  scopeId TEXT,
  topOpportunities TEXT,
  newActivity TEXT,
  priorityCounties TEXT,
  recommendationChanges TEXT,
  providerHealth TEXT,
  coverageGrowth TEXT,
  operationalSummary TEXT,
  executiveActions TEXT,
  narrative TEXT,
  generatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deliveredAt TIMESTAMP,
  deliveryStatus TEXT DEFAULT 'draft'
);
CREATE INDEX IF NOT EXISTS idx_briefings_date ON daily_briefings(briefingDate);
CREATE INDEX IF NOT EXISTS idx_briefings_scope ON daily_briefings(scope, scopeId);

-- Section 8: Learning Models
CREATE TABLE IF NOT EXISTS learning_models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  modelName TEXT NOT NULL,
  modelType TEXT NOT NULL,
  version TEXT NOT NULL,
  accuracy REAL DEFAULT 0,
  precision REAL DEFAULT 0,
  recall REAL DEFAULT 0,
  f1Score REAL DEFAULT 0,
  trainingDataSize INTEGER DEFAULT 0,
  validationDataSize INTEGER DEFAULT 0,
  hyperparameters TEXT,
  featureImportance TEXT,
  deploymentStatus TEXT DEFAULT 'experimental',
  deployedAt TIMESTAMP,
  retiredAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_learning_status ON learning_models(deploymentStatus);
