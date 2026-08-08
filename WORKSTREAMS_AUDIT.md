# BuildSignal — Real Intelligence Certification: Workstream Details

## Phase 1: Audit (Workstreams 1-7)

### Workstream 1: Real Data Inventory — DONE (P0)

**Status:** FAILED

**Evidence:**
- 59 tables inventoried in production D1 database (`buildsignal-db`, 0.54 MB)
- `signalcore_events` (60 records): ALL ingested at identical timestamp `1784249461` (2026-07-17 06:11:01 UTC) — impossible for organic ingestion
- `opportunities` (5 records): ALL created at `2026-08-03 22:19:57` — identical second. All Colorado projects in system configured for NC/SC counties
- `signalcore_patterns` (12 records): ALL `firstDetectedAt` = `1781657461`, ALL `lastDetectedAt` = `1784249461` — identical timestamps
- `signalcore_recommendations` (12 records): ALL `generatedAt` = `1784249461` — identical timestamp, all `status` = `pending`
- `signalcore_providers` (10 records): ALL `totalPolls` = 0, `totalSuccesses` = 0, `totalFailures` = 0, `avgLatencyMs` = 0, `lastPollAt` = null — NEVER POLLED
- `data_providers` (8 records): ALL `last_sync_at` = null — NEVER SYNCED
- `ingestion_sources` (1 record): Named "Test Source"
- `pipeline_metrics` (10 records): ALL `lastRunAt` = null — pipeline has never executed
- `provider_history` (21 records): Artificial daily history for only utilities and DOT from 2026-07-11 to 2026-07-17
- `providers` (12 records): `lastSync` dates all from 2026-07-17, over 3 weeks stale
- `counties` (25 records): `lastDataRefresh` all from 2026-07-14 to 2026-07-17
- `users` table: 0 records (cleaned after Build 127)
- `organizations` table: 3 records (seed)

**Verdict:** All production data exhibits batch-seed characteristics. Zero live records detected.

**Next Action:** Activate provider polling and establish live ingestion before re-audit.

---

### Workstream 2: Strict Provenance (P0)

**Status:** FAILED

**Evidence:**
- The `provenance` column required by this workstream does not exist in the majority of production tables
- Tables WITH provenance/source tracking:
  - `signalcore_events`: has `dataSource` column (10 distinct source names)
  - `data_providers`: has `source_type` column (transportation, permits, planning, demographics, environmental)
  - `providers`: has `providerType` column (12 provider type categories)
- Tables WITHOUT provenance/source tracking:
  - `opportunities`: No provenance, no `source_record_id`, no `ingested_at` — cannot distinguish real from seed
  - `providers`: No provenance, no `source_url` — cannot verify source authenticity
  - `data_providers`: No provenance — cannot verify source authenticity
  - `counties`: No provenance — cannot verify source authenticity
  - `signalcore_patterns`: No provenance — cannot verify detection origin
  - `signalcore_recommendations`: No provenance — cannot verify generation origin
  - `knowledge_graph_nodes`: No provenance — cannot verify node origin
  - `pipeline_metrics`: No provenance — cannot verify metric origin

**Verdict:** The strict provenance taxonomy required for Real Intelligence Certification does not exist in production. 8 of 9 key tables lack any provenance tracking.

**Next Action:** Add `provenance`, `source_record_id`, `ingested_at`, and `pipeline_version` columns to all data tables. Backfill existing seed data with `provenance = 'SEED'` classification.

---

### Workstream 3: Production Seed Data Isolation (P0)

**Status:** FAILED

**Evidence:**
- **Identical timestamps:** `signalcore_events` (60 records, same second), `opportunities` (5 records, same second), `signalcore_patterns` (12 records, same `firstDetectedAt`), `signalcore_recommendations` (12 records, same `generatedAt`) — all match seed data pattern
- **Zero counters:** `signalcore_providers`: all `totalPolls` = 0, `totalSuccesses` = 0, `totalFailures` = 0, `avgLatencyMs` = 0
- **Null syncs:** `data_providers`: all `last_sync_at` = null
- **Uniform refresh:** `counties`: all `lastDataRefresh` within 2026-07-14 to 2026-07-17 (4-day window)
- **Round numbers:** `pipeline_metrics`: 11,687 processed, 0 failed, 234 duplicates — round fabricated figures
- **Geographic mismatch:** `opportunities`: 5 Colorado projects in NC/SC-configured system
- **Never-ran pipeline:** `pipeline_metrics`: all `lastRunAt` = null
- **Empty poll table:** `signalcore_providers`: `lastPollAt` = null for all 10 records
- **Named test source:** `ingestion_sources`: single record named "Test Source"

**Verdict:** Every production table examined exhibits one or more seed data characteristics. No table contains verifiably live-ingested records. Seed data isolation has completely failed — there is no mechanism to distinguish seed from live data, and no live data exists to compare against.

**Next Action:** Implement seed data isolation: tag all existing data with `provenance = 'SEED'`, add `provenance` column to all tables, and establish live ingestion to create `provenance = 'LIVE'` records.

---

### Workstream 4: Real Permit Ingestion for Counties (P0)

**Status:** BLOCKED

**Evidence:**
- `signalcore_providers` table has 10 providers configured for NC/SC but zero polls (all counters = 0, all `lastPollAt` = null)
- `data_providers` table has 8 Colorado providers (geographic mismatch) with zero syncs (all `last_sync_at` = null)
- `ingestion_sources` table has 1 record named "Test Source"
- `pipeline_metrics` table shows all stages as "running" but `lastRunAt` = null for all 10 stages
- `provider_history` table has 21 artificial records — no real ingestion history
- The `ingestion.status` endpoint returns 404 — no ingestion API is deployed

**Verdict:** No real permit ingestion has ever occurred. No ingestion infrastructure is active in production. Attempting real ingestion is blocked because the ingestion pipeline does not exist.

**Next Action:** Deploy the ingestion pipeline (source code exists in `api/router.ts` but is not deployed). Configure provider polling for at least one real source. Verify ingestion creates records with `provenance = 'LIVE'`.

---

### Workstream 5: Normalization Integrity (P0)

**Status:** BLOCKED

**Evidence:**
- No raw data has been ingested, so normalization cannot be tested against real inputs
- `pipeline_metrics` table shows normalization stage as "running" with 11,687 processed and 0 failed, but `lastRunAt` = null — the metrics are fabricated
- The `enrichment.status` endpoint returns 404 — no enrichment API is deployed
- No raw records exist to validate normalization against
- The `data_validation_queue` table has 0 records

**Verdict:** Normalization integrity cannot be verified because no raw data exists to normalize. The pipeline metrics are seed data.

**Next Action:** Ingest real raw records. Verify normalization produces consistent output. Run validation suite against normalized records.

---

### Workstream 6: Entity Resolution Accuracy (P0)

**Status:** BLOCKED

**Evidence:**
- No duplicate records exist because no real ingestion has occurred
- `pipeline_metrics` table claims 234 duplicates removed from 11,687 records in the deduplication stage, but these are fabricated metrics (`lastRunAt` = null)
- No `entity_resolution_log` table exists in the database
- The `validation.status` endpoint returns 404 — no validation API is deployed
- All records in the database are unique seed data with no duplicates to resolve

**Verdict:** Entity resolution accuracy cannot be tested. No duplicate records exist. No entity resolution pipeline is active.

**Next Action:** Ingest real data from multiple sources. Allow duplicates to form naturally. Test deduplication logic against real duplicates. Create `entity_resolution_log` table.

---

### Workstream 7: Canonical Opportunity Creation (P0)

**Status:** FAILED

**Evidence:**
- `opportunities` table has 5 records:
  - I-25 Expansion Phase 2 (Larimer, CO, score 92)
  - Denver Light Rail Extension (Denver, CO, score 88)
  - Boulder Reservoir Dam (Boulder, CO, score 85)
  - Weld County Solar Farm (Weld, CO, score 78)
  - Pueblo Riverwalk Phase 3 (Pueblo, CO, score 78)
- All 5 opportunities are Colorado projects — system is configured for NC/SC counties
- All 5 created at exact same second: 2026-08-03 22:19:57
- All 5 have `org_id` = null (unassigned)
- No `provenance` column exists
- The `recommendationV2.status` endpoint returns 404

**Verdict:** The 5 opportunities are seed/demo data, not canonical opportunities derived from real ingestion. Geographic mismatch (Colorado in NC/SC system) confirms they are not real. No canonical opportunity creation pipeline exists.

**Next Action:** Create canonical opportunities from real ingested data. Assign `org_id` based on customer ownership. Add `provenance` tracking.

---

*Phase 1 Audit complete. All workstreams FAILED or BLOCKED.*
