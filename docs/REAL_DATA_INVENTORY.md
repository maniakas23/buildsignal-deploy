# BuildSignal — Real Data Inventory

**Date:** 2026-08-09  
**Build:** 130 (Certification Phase)  
**Database:** buildsignal-db (D1)  
**Environment:** Production  

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total Tables | 59 |
| Database Size | 0.54 MB |
| Live Users | 0 (purged after Build 127) |
| Organizations | 3 (seed) |
| Counties Configured | 25 |
| Providers Configured | 12 (meta) + 10 (signalcore) + 8 (data_providers) |
| Signalcore Events | 60 |
| Signalcore Patterns | 12 |
| Signalcore Recommendations | 12 |
| Opportunities | 5 |
| Knowledge Graph Nodes | 10 |
| Knowledge Graph Edges | 10 |
| Learning Events | 12 |
| Historical Validations | 10 |
| Provider Polls (Actual) | 0 |

**Critical Finding:** All production data exhibits batch-seed characteristics. No live ingestion has occurred.

---

## Provider Inventory

### Meta Providers (`providers` table — 12 records)

| ID | Name | Type | Coverage | Records | Health | Status | Last Sync | Assessment |
|----|------|------|----------|---------|--------|--------|-----------|------------|
| 1 | Building Permits | building_permits | NC,SC,VA,TN,GA — 142 counties | 45,620 | 94% | active | 2026-07-17 | **SEED** — stale (>3 weeks) |
| 2 | Planning Agendas | planning_agendas | NC,SC,VA — 89 counties | 12,840 | 88% | active | 2026-07-15 | **SEED** — stale |
| 3 | Zoning | zoning | NC,SC,VA,TN — 120 counties | 32,150 | 91% | active | 2026-07-17 | **SEED** — stale |
| 4 | Utilities | utilities | NC,SC,VA,TN,GA — 156 counties | 28,900 | 87% | active | 2026-07-17 | **SEED** — stale |
| 5 | DOT Projects | dot_projects | NC,SC,VA,TN,GA,FL — 6 states | 15,430 | 96% | active | 2026-07-16 | **SEED** — stale |
| 6 | Capital Improvement Plans | capital_improvement | NC,SC,VA — 68 counties | 6,780 | 82% | degraded | 2026-07-14 | **SEED** — stale |
| 7 | Government Spending | government_spending | NC,SC,VA,TN,GA — 245 munis | 42,100 | 79% | degraded | 2026-07-17 | **SEED** — stale |
| 8 | Economic Development | economic_development | NC,SC,VA,TN — 92 counties | 9,850 | 85% | active | 2026-07-15 | **SEED** — stale |
| 9 | Public Meetings | public_meetings | NC,SC,VA — 134 jurisdictions | 22,340 | 73% | degraded | 2026-07-13 | **SEED** — stale |
| 10 | Environmental Notices | environmental_notices | NC,SC,VA,TN,GA,FL — 6 states | 18,760 | 90% | active | 2026-07-17 | **SEED** — stale |
| 11 | Infrastructure Grants | infrastructure_grants | NC,SC,VA,TN,GA — 5 states | 3,450 | 68% | offline | 2026-07-10 | **SEED** — stale, offline |
| 12 | Public Utility Commissions | public_utility_commissions | NC,SC,VA,TN,GA — 5 states | 21,300 | 93% | active | 2026-07-17 | **SEED** — stale |

**Total Meta Provider Records Claimed:** 255,520  
**Provenance Column:** Does not exist  
**Assessment:** All records are seed data with artificial timestamps and round-number counts.

### Data Providers (`data_providers` table — 8 records)

| ID | Name | Type | Source Type | Status | Records | Coverage | Last Sync | Assessment |
|----|------|------|-------------|--------|---------|----------|-----------|------------|
| 1 | Colorado DOT | api | transportation | active | 125,000 | 95% | null | **SEED** — never synced |
| 2 | Larimer County | scraper | permits | active | 45,000 | 88% | null | **SEED** — never synced |
| 3 | Weld County | scraper | permits | active | 38,000 | 82% | null | **SEED** — never synced |
| 4 | Jefferson County | scraper | permits | active | 52,000 | 90% | null | **SEED** — never synced |
| 5 | City of Denver | api | planning | active | 67,000 | 85% | null | **SEED** — never synced |
| 6 | CDOT | api | transportation | active | 210,000 | 98% | null | **SEED** — never synced |
| 7 | US Census | api | demographics | active | 3,200,000 | 100% | null | **SEED** — never synced |
| 8 | EPA | api | environmental | active | 89,000 | 75% | null | **SEED** — never synced |

**Note:** Colorado-focused providers are disconnected from the NC/SC county and opportunity data. Geographic inconsistency indicates seed data mismatch.

### Signalcore Providers (`signalcore_providers` table — 10 records)

| ID | Name | Type | Status | Total Polls | Successes | Failures | Avg Latency | Last Poll | Assessment |
|----|------|------|--------|-------------|-----------|----------|-------------|-----------|------------|
| 1 | NC Permitting Portal | building_permits | active | 0 | 0 | 0 | 0ms | null | **NEVER POLLED** |
| 2 | Raleigh Planning | planning_agendas | active | 0 | 0 | 0 | 0ms | null | **NEVER POLLED** |
| 3 | Charlotte Planning | planning_agendas | active | 0 | 0 | 0 | 0ms | null | **NEVER POLLED** |
| 4 | NCDOT Projects | dot_projects | active | 0 | 0 | 0 | 0ms | null | **NEVER POLLED** |
| 5 | SCDOT Projects | dot_projects | active | 0 | 0 | 0 | 0ms | null | **NEVER POLLED** |
| 6 | Duke Energy | utilities | active | 0 | 0 | 0 | 0ms | null | **NEVER POLLED** |
| 7 | USASpending.gov | usaspending | active | 0 | 0 | 0 | 0ms | null | **NEVER POLLED** |
| 8 | Durham Planning | planning_agendas | active | 0 | 0 | 0 | 0ms | null | **NEVER POLLED** |
| 9 | Mecklenburg Permits | building_permits | active | 0 | 0 | 0 | 0ms | null | **NEVER POLLED** |
| 10 | Wake County Permits | building_permits | active | 0 | 0 | 0 | 0ms | null | **NEVER POLLED** |

**Critical Finding:** Not a single provider has ever been polled. All counters are zero.

### Ingestion Sources (`ingestion_sources` table — 1 record)

| ID | Name | Type | Level | Area | Active | Health | Records Total | Records 30d | Last Sync | Assessment |
|----|------|------|-------|------|--------|--------|---------------|-------------|-----------|------------|
| 1 | Test Source | building_permits | county | NC | Yes | 95% | 0 | 0 | null | **EXPLICITLY TEST** |

---

## County Inventory (`counties` table — 25 records)

### North Carolina (15 counties)

| County | State | Population | Health | Coverage | Events | Patterns | Recommendations | Last Refresh | Assessment |
|--------|-------|------------|--------|----------|--------|----------|-----------------|--------------|------------|
| Mecklenburg | NC | 1,110,300 | active | 96% | 8,420 | 24 | 18 | 2026-07-17 | **SEED** |
| Wake | NC | 1,162,900 | active | 98% | 9,650 | 31 | 22 | 2026-07-17 | **SEED** |
| Durham | NC | 324,930 | active | 92% | 4,320 | 15 | 11 | 2026-07-17 | **SEED** |
| Guilford | NC | 541,160 | active | 90% | 5,890 | 18 | 13 | 2026-07-17 | **SEED** |
| Forsyth | NC | 382,600 | active | 87% | 4,210 | 12 | 9 | 2026-07-17 | **SEED** |
| Union | NC | 240,000 | active | 85% | 3,150 | 10 | 8 | 2026-07-17 | **SEED** |
| Cabarrus | NC | 225,100 | active | 82% | 2,890 | 9 | 7 | 2026-07-17 | **SEED** |
| Cumberland | NC | 335,500 | partial | 78% | 3,540 | 8 | 6 | 2026-07-16 | **SEED** |
| Buncombe | NC | 269,450 | active | 88% | 3,780 | 11 | 8 | 2026-07-17 | **SEED** |
| New Hanover | NC | 235,850 | active | 86% | 3,420 | 10 | 7 | 2026-07-17 | **SEED** |
| Orange | NC | 148,800 | active | 84% | 2,150 | 8 | 6 | 2026-07-17 | **SEED** |
| Iredell | NC | 186,500 | partial | 72% | 1,870 | 6 | 5 | 2026-07-16 | **SEED** |
| Gaston | NC | 226,600 | partial | 70% | 1,980 | 6 | 4 | 2026-07-16 | **SEED** |
| Johnston | NC | 215,500 | partial | 68% | 1,760 | 5 | 4 | 2026-07-16 | **SEED** |
| Brunswick | NC | 152,800 | partial | 65% | 1,420 | 5 | 3 | 2026-07-15 | **SEED** |

### South Carolina (10 counties)

| County | State | Population | Health | Coverage | Events | Patterns | Recommendations | Last Refresh | Assessment |
|--------|-------|------------|--------|----------|--------|----------|-----------------|--------------|------------|
| Richland | SC | 419,600 | active | 91% | 5,120 | 16 | 12 | 2026-07-17 | **SEED** |
| Greenville | SC | 533,200 | active | 93% | 6,340 | 19 | 14 | 2026-07-17 | **SEED** |
| Charleston | SC | 413,500 | active | 90% | 4,890 | 15 | 11 | 2026-07-17 | **SEED** |
| Horry | SC | 365,200 | partial | 76% | 3,210 | 9 | 6 | 2026-07-16 | **SEED** |
| Spartanburg | SC | 335,500 | active | 85% | 3,890 | 12 | 9 | 2026-07-17 | **SEED** |
| Lexington | SC | 310,100 | partial | 80% | 2,980 | 9 | 7 | 2026-07-16 | **SEED** |
| York | SC | 289,400 | partial | 78% | 2,650 | 8 | 6 | 2026-07-16 | **SEED** |
| Berkeley | SC | 236,800 | partial | 70% | 1,890 | 6 | 4 | 2026-07-16 | **SEED** |
| Beaufort | SC | 196,500 | partial | 62% | 1,430 | 5 | 3 | 2026-07-15 | **SEED** |
| Anderson | SC | 203,600 | limited | 58% | 1,120 | 4 | 3 | 2026-07-14 | **SEED** |

**Total Events Claimed:** 96,330  
**Provenance Column:** Does not exist  
**Assessment:** County statistics are internally consistent but match seed data generation patterns (round numbers, uniform refresh times).

---

## Opportunities (`opportunities` table — 5 records)

| ID | Title | County | State | Score | Org ID | Created At | Assessment |
|----|-------|--------|-------|-------|--------|------------|------------|
| 1 | I-25 Expansion Phase 2 | Larimer | CO | 92 | null | 2026-08-03 22:19:57 | **SEED** — Colorado, not NC/SC |
| 2 | Denver Light Rail Extension | Denver | CO | 88 | null | 2026-08-03 22:19:57 | **SEED** — Colorado |
| 3 | Boulder Reservoir Dam | Boulder | CO | 85 | null | 2026-08-03 22:19:57 | **SEED** — Colorado |
| 4 | Weld County Solar Farm | Weld | CO | 78 | null | 2026-08-03 22:19:57 | **SEED** — Colorado |
| 5 | Pueblo Riverwalk Phase 3 | Pueblo | CO | 78 | null | 2026-08-03 22:19:57 | **SEED** — Colorado |

**Critical Finding:** All 5 opportunities are Colorado projects. All created at the exact same second. No `org_id` (unassigned). No `provenance` column. Colorado opportunities in a system configured for NC/SC counties indicate seed data mismatch.

---

## Signalcore Events (`signalcore_events` table — 60 records)

| Data Source | Count | Assessment |
|-------------|-------|------------|
| Charlotte Planning | 7 | SEED |
| Duke Energy | 6 | SEED |
| Durham Planning | 5 | SEED |
| Mecklenburg Permits | 5 | SEED |
| NC Permitting Portal | 6 | SEED |
| NCDOT Projects | 7 | SEED |
| Raleigh Planning | 7 | SEED |
| SCDOT Projects | 7 | SEED |
| USASpending.gov | 5 | SEED |
| Wake County Permits | 5 | SEED |

**Critical Finding:** All 60 events share the exact same `ingestedAt` timestamp: `1784249461` (2026-07-17 06:11:01 UTC). This is definitive batch-seed evidence.

---

## Signalcore Patterns (`signalcore_patterns` table — 12 records)

| ID | Name | Type | County | State | Confidence | Evidence | Impact | First Detected | Last Detected | Assessment |
|----|------|------|--------|-------|------------|----------|--------|--------------|---------------|------------|
| 1 | geographic cluster — Mecklenburg | geographic_cluster | Mecklenburg | NC | 84 | 8 | 91 | 1781657461 | 1784249461 | **SEED** |
| 2 | infrastructure correlation — Wake | infrastructure_correlation | Wake | NC | 88 | 10 | 64 | 1781657461 | 1784249461 | **SEED** |
| 3 | utility expansion — Durham | utility_expansion | Durham | NC | 87 | 7 | 85 | 1781657461 | 1784249461 | **SEED** |
| 4 | permit acceleration — Guilford | permit_acceleration | Guilford | NC | 83 | 11 | 74 | 1781657461 | 1784249461 | **SEED** |
| 5 | spending correlation — Forsyth | spending_correlation | Forsyth | NC | 92 | 8 | 64 | 1781657461 | 1784249461 | **SEED** |
| 6 | multi provider evidence — Richland | multi_provider_evidence | Richland | SC | 90 | 9 | 72 | 1781657461 | 1784249461 | **SEED** |
| 7 | historical comparison — Greenville | historical_comparison | Greenville | SC | 88 | 8 | 66 | 1781657461 | 1784249461 | **SEED** |
| 8 | geographic cluster — Buncombe | geographic_cluster | Buncombe | NC | 72 | 4 | 88 | 1781657461 | 1784249461 | **SEED** |
| 9 | infrastructure correlation — New Hanover | infrastructure_correlation | New Hanover | NC | 78 | 10 | 90 | 1781657461 | 1784249461 | **SEED** |
| 10 | utility expansion — Union | utility_expansion | Union | NC | 74 | 9 | 95 | 1781657461 | 1784249461 | **SEED** |
| 11 | permit acceleration — Cumberland | permit_acceleration | Cumberland | NC | 66 | 10 | 92 | 1781657461 | 1784249461 | **SEED** |
| 12 | spending correlation — Cabarrus | spending_correlation | Cabarrus | NC | 68 | 6 | 62 | 1781657461 | 1784249461 | **SEED** |

**Critical Finding:** All 12 patterns share identical `firstDetectedAt` (1781657461 = 2026-06-17 06:11:01 UTC) and identical `lastDetectedAt` (1784249461 = 2026-07-17 06:11:01 UTC). This is impossible for organically detected patterns.

---

## Signalcore Recommendations (`signalcore_recommendations` table — 12 records)

All 12 recommendations have `generatedAt: 1784249461` (2026-07-17 06:11:01 UTC) — exact same second. All status: `pending`. All targetProduct: `buildsignal`.

**Assessment:** Batch seed. Never delivered.

---

## Knowledge Graph

### Nodes (`knowledge_graph_nodes` — 10 records)

| ID | Type | Label | County | State | Confidence |
|----|------|-------|--------|-------|------------|
| 1 | permit | Wake County Commercial Corridor | Wake | NC | 92 |
| 2 | permit | Durham Mixed-Use Development | Durham | NC | 88 |
| 3 | road | I-40 Widening Phase 2 | Wake | NC | 95 |
| 4 | road | I-85 Interchange Improvement | Durham | NC | 91 |
| 5 | utility | Duke Energy Substation Expansion | Wake | NC | 89 |
| 6 | utility | Charlotte Water Main Extension | Mecklenburg | NC | 87 |
| 7 | school | Wake County High School Campus | Wake | NC | 93 |
| 8 | planning | Greenville Zoning Amendment | Greenville | SC | 86 |
| 9 | hospital | Atrium Health Expansion | Mecklenburg | NC | 90 |
| 10 | retail | Costco Distribution Center | Spartanburg | SC | 88 |

### Edges (`knowledge_graph_edges` — 10 records)

Connect nodes with relationship types: geographic_proximity, infrastructure_correlation, development_correlation, utility_correlation, sector_correlation, logistics_correlation.

**Assessment:** Seed data. No provenance column.

---

## Pipeline Metrics (`pipeline_metrics` — 10 records)

| Stage | Status | Processed | Failed | Avg Duration | Last Run | Error Rate | Assessment |
|-------|--------|-----------|--------|--------------|----------|------------|------------|
| provider_discovery | running | 1,240 | 12 | 450ms | null | 0.97% | **FAKE** — never ran |
| data_collection | running | 11,850 | 45 | 3,200ms | null | 1.00% | **FAKE** — never ran |
| validation | running | 11,805 | 118 | 890ms | null | 1.00% | **FAKE** — never ran |
| normalization | running | 11,687 | 0 | 340ms | null | 0% | **FAKE** — never ran |
| deduplication | running | 11,687 | 234 | 520ms | null | 2.00% | **FAKE** — never ran |
| correlation | running | 11,453 | 0 | 1,200ms | null | 0% | **FAKE** — never ran |
| pattern_detection | running | 11,453 | 0 | 2,800ms | null | 0% | **FAKE** — never ran |
| recommendation_generation | running | 142 | 0 | 180ms | null | 0% | **FAKE** — never ran |
| notification_delivery | running | 142 | 8 | 95ms | null | 5.63% | **FAKE** — never ran |
| archive | running | 114 | 0 | 220ms | null | 0% | **FAKE** — never ran |

**Critical Finding:** All stages show `lastRunAt: null`. Status is "running" but no execution has ever been recorded. Metrics are seed data.

---

## Provider History (`provider_history` — 21 records)

| ID | Type | Date | Health | Error Rate | Latency | Records | Success | Assessment |
|----|------|------|--------|------------|---------|---------|---------|------------|
| 21 | utilities | 2026-07-17 | 87 | 6% | 510ms | 255 | 1 | **SEED** |
| 20 | utilities | 2026-07-16 | 87 | 6% | 510ms | 260 | 1 | **SEED** |
| 19 | utilities | 2026-07-15 | 87 | 6% | 500ms | 240 | 1 | **SEED** |
| 18 | utilities | 2026-07-14 | 86 | 7% | 540ms | 250 | 1 | **SEED** |
| 17 | utilities | 2026-07-13 | 87 | 6% | 510ms | 230 | 1 | **SEED** |
| 16 | utilities | 2026-07-12 | 86 | 6% | 520ms | 245 | 1 | **SEED** |
| 15 | utilities | 2026-07-11 | 85 | 7% | 550ms | 220 | 1 | **SEED** |
| 14 | dot_projects | 2026-07-17 | 96 | 1% | 180ms | 102 | 1 | **SEED** |
| 13 | dot_projects | 2026-07-16 | 96 | 1% | 175ms | 98 | 1 | **SEED** |
| 12 | dot_projects | 2026-07-15 | 96 | 1% | 180ms | 90 | 1 | **SEED** |

**Assessment:** Artificial daily history for only two provider types. No variation in health scores beyond minor drift. Seed data.

---

## Provenance Audit

### Tables WITH Provenance/Source Tracking

| Table | Column | Values Found |
|-------|--------|--------------|
| signalcore_events | dataSource | 10 distinct source names |
| data_providers | source_type | transportation, permits, planning, demographics, environmental |
| providers | providerType | 12 provider type categories |

### Tables WITHOUT Provenance/Source Tracking

| Table | Missing | Impact |
|-------|---------|--------|
| opportunities | No provenance, no source_record_id, no ingested_at | Cannot distinguish real from seed |
| providers | No provenance, no source_url | Cannot verify source authenticity |
| data_providers | No provenance | Cannot verify source authenticity |
| counties | No provenance | Cannot verify source authenticity |
| signalcore_patterns | No provenance | Cannot verify detection origin |
| signalcore_recommendations | No provenance | Cannot verify generation origin |
| knowledge_graph_nodes | No provenance | Cannot verify node origin |
| pipeline_metrics | No provenance | Cannot verify metric origin |

**Gap:** The `provenance` column required by Workstream 2 does not exist in the majority of production tables.

---

## Seed Data Isolation Audit

### Records by Assessment Category

| Category | Tables Affected | Record Count | Customer Visible Risk |
|----------|----------------|--------------|---------------------|
| **SEED** | All signalcore tables, providers, counties, opportunities, patterns, recommendations, knowledge graph, learning events, pipeline metrics, provider history | ~260,000+ claimed | **HIGH** — no isolation mechanism |
| **DEMO** | opportunities (5 Colorado projects) | 5 | **HIGH** — mismatched geography |
| **TEST** | ingestion_sources ("Test Source") | 1 | **LOW** — explicitly named |
| **LIVE** | None | 0 | N/A |
| **REAL** | None | 0 | N/A |

### Seed Data Detection Criteria Applied

1. **Identical timestamps:** `signalcore_events` (60 records, same second), `opportunities` (5 records, same second), `signalcore_patterns` (12 records, same `firstDetectedAt`), `signalcore_recommendations` (12 records, same `generatedAt`) ✓
2. **Zero counters:** `signalcore_providers`: all `totalPolls` = 0, `totalSuccesses` = 0, `totalFailures` = 0, `avgLatencyMs` = 0 ✓
3. **Null syncs:** `data_providers`: all `last_sync_at` = null ✓
4. **Uniform refresh:** `counties`: all `lastDataRefresh` within 2026-07-14 to 2026-07-17 (4-day window) ✓
5. **Round numbers:** `pipeline_metrics`: 11,687 processed, 0 failed, 234 duplicates — round fabricated figures ✓
6. **Geographic mismatch:** `opportunities`: 5 Colorado projects in NC/SC-configured system ✓
7. **Never-ran pipeline:** `pipeline_metrics`: all `lastRunAt` = null ✓
8. **Empty poll table:** `signalcore_providers`: `lastPollAt` = null for all 10 records ✓
9. **Named test source:** `ingestion_sources`: single record named "Test Source" ✓

**Conclusion:** Every production table examined exhibits one or more seed data characteristics. No table contains verifiably live-ingested records.

---

## Data Freshness

| Table | Most Recent Timestamp | Age (as of 2026-08-09) | Assessment |
|-------|----------------------|------------------------|------------|
| signalcore_events | 2026-07-17 06:11:01 | 23 days | **STALE** |
| opportunities | 2026-08-03 22:19:57 | 6 days | **STALE** |
| signalcore_patterns | 2026-07-17 06:11:01 | 23 days | **STALE** |
| signalcore_recommendations | 2026-07-17 06:11:01 | 23 days | **STALE** |
| counties | 2026-07-17 08:00:00 | 23 days | **STALE** |
| providers | 2026-07-17 10:30:00 | 23 days | **STALE** |
| learning_events | 2026-07-17 23:11:48 | 23 days | **STALE** |
| provider_history | 2026-07-17 | 23 days | **STALE** |
| pipeline_metrics | null | N/A | **NEVER RAN** |
| data_providers | null | N/A | **NEVER SYNCED** |
| ingestion_sources | null | N/A | **NEVER SYNCED** |

---

## Summary Classification

| Classification | Count | Description |
|----------------|-------|-------------|
| **LIVE** | 0 | Real-time ingested data from active sources |
| **LIVE_DEGRADED** | 0 | Live data with recent failures |
| **STALE** | ~260,000 claimed | Data that was once live but is now outdated |
| **SEED** | ~260,000 claimed | Artificially generated development/test data |
| **DEMO** | 5 | Demonstration data (Colorado opportunities) |
| **TEST** | 1 | Explicitly labeled test data |
| **SIMULATED** | 0 | Simulated/synthetic data |
| **UNAVAILABLE** | 0 | Data that should exist but does not |

**Honest Assessment:** BuildSignal production database contains **zero live records**. All data is seed/demo/test data generated during development. No real permit ingestion has ever occurred.

---

*Inventory generated: 2026-08-09*  
*BuildSignal Real Intelligence Certification — Phase 1 Audit*
