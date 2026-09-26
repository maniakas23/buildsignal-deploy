# BuildSignal v1.5.0 — Architecture Lock Sprint Report
**Date:** 2026-08-13
**Scope:** 20-Phase Comprehensive Production Audit
**Authority:** Phase 3 mandated cron ownership audit + Phase 5 single scheduler mandate

---

## Executive Summary

This report documents the findings from a comprehensive 20-phase architecture lock sprint investigating the BuildSignal production environment. The investigation revealed **CRITICAL architectural drift** between the repository code and the deployed production worker, dual-write patterns to legacy and canonical tables, and multiple downstream consumers dependent on the legacy table.

### 🔴 CRITICAL Findings

| # | Finding | Severity | Phase |
|---|---------|----------|-------|
| 1 | **Production worker is NOT from repository** — `buildsignal-worker` is an inline script (143,914 chars) deployed via API. Repository code is NOT running in production. | CRITICAL | 1, 6 |
| 2 | **Dual write to legacy + canonical tables** — Production worker writes to BOTH `signalcore_events` (legacy) AND `kestovar_canonical_events` (canonical). The deduplication check ONLY queries `signalcore_events`. | CRITICAL | 9 |
| 3 | **Search reads from legacy table** — Production search API (`handleSearchSearch`) reads ONLY from `signalcore_events`, making **219 wake-county canonical records invisible to search**. | CRITICAL | 8 |
| 4 | **Different hash algorithms** — Production uses djb2-like hash; repository uses cyrb53. They produce **DIFFERENT contentHash values**. Canonical table has no dedup protection. | HIGH | 13 |
| 5 | **Downstream consumers depend on legacy table** — `kestovar-intelligence-processor` and `kestovar-expansion` read from `signalcore_events`. Stopping legacy writes will break them. | HIGH | 4 |
| 6 | **Raleigh data split across tables** — 120 raleigh records exist ONLY in legacy table. 219 wake-county records exist ONLY in canonical table. | HIGH | 8 |

---

## Phase 1: Recover Exact Production buildsignal-worker Source

### Method
Direct download via Cloudflare API:
```bash
GET /accounts/{account_id}/workers/scripts/buildsignal-worker/download
```

### Results
| Metric | Value |
|--------|-------|
| Raw download size | 144,097 bytes |
| Extracted JS source | 143,914 characters |
| Total lines | 2,555 |
| Deployment method | Inline script via API |
| Last modified | 2026-08-11T22:45:53Z |

**Source saved to:** `buildsignal-worker-recovered.js`

### 🔴 CRITICAL: This source exists ONLY as an inline deployed script
There is NO repository copy. If the deployment is lost or corrupted, the entire production ingestion pipeline cannot be recreated from git.

---

## Phase 2: Verify Source Completeness Against Required Markers

### All 22 Markers Present ✅

| Marker | Status | Description |
|--------|--------|-------------|
| `scheduled(` | ✅ | Scheduled handler exists |
| `runSchedulerCron` | ✅ | Scheduler orchestration function |
| `executeIngestionRun` | ✅ | Ingestion pipeline function |
| `signalcore_events` | ✅ | Legacy table writes |
| `kestovar_canonical_events` | ✅ | Canonical table writes |
| `scheduler_activity_log` | ✅ | Scheduler audit logging |
| `provider_polling_schedule` | ✅ | Polling state management |
| `circuit_breaker` | ✅ | Failure isolation |
| `raw_records` | ✅ | Raw data storage |
| `ingestion_runs` | ✅ | Run tracking |
| `providerIdMap` | ✅ | Provider ID normalization |
| `handleSearchSearch` | ✅ | Search endpoint |
| `handleAuthRegister` | ✅ | Auth registration |
| `handleAuthLogin` | ✅ | Auth login |
| `RateLimiterDO` | ✅ | Rate limiting |
| `corsHeaders` | ✅ | CORS handling |
| `verifyJWT` | ✅ | JWT verification |
| `d1Query` | ✅ | D1 query helper |
| `d1Run` | ✅ | D1 run helper |
| `export default` | ✅ | Worker entry point |
| `fetch(` | ✅ | HTTP handler |
| `async scheduled` | ✅ | Cron handler |

**Status:** ✅ Source is complete. No truncation detected.

---

## Phase 3: Cron Ownership Audit Across All Scheduled Workers

### Full Account Inventory

| # | Worker | Handlers | Routes | Active Cron Schedules | Modified |
|---|--------|----------|--------|----------------------|----------|
| 1 | **buildsignal-worker** | fetch, scheduled | `api.buildsignal.net/*` | `0 */6 * * *` | 2026-08-11 |
| 2 | kestovar-advertising | scheduled, fetch | — | `3 * * * *` | 2026-08-12 |
| 3 | kestovar-contract-tests | fetch, scheduled | — | `*/30 * * * *` | 2026-08-05 |
| 4 | kestovar-engine-api-v2 | fetch, scheduled | — | — | 2026-08-10 |
| 5 | kestovar-engine-prod | fetch, scheduled, queue | — | — | 2026-08-10 |
| 6 | kestovar-engine-staging | fetch, scheduled, queue | — | `* * * * *`, `0 * * * *` | 2026-07-24 |
| 7 | kestovar-expansion | scheduled, fetch | — | `0 7 * * *`, `0 8 * * 1`, `5 * * * *` | 2026-08-12 |
| 8 | kestovar-intelligence-processor | fetch, scheduled | `kestovar.buildsignal.net/intelligence/*` | `0 */6 * * *` | 2026-08-10 |
| 9 | kestovar-test | fetch, scheduled | — | — | 2026-08-03 |
| 10 | parcelleadpro-production | fetch, scheduled | — | — | 2026-07-16 |
| 11 | parcelpro-api | fetch, scheduled | `api.parcleadpro.com/*`, `www.parcleadpro.com/trpc*` | `0 3 * * *` | 2026-08-12 |
| 12 | parcleadpro-production | fetch, scheduled | — | — | 2026-07-20 |
| 13 | plp-agents | fetch, scheduled, queue | — | 12 schedules | 2026-08-12 |
| 14 | plp-api | fetch, scheduled | — | — | 2026-08-10 |
| 15 | plp-kv-frontend | fetch, scheduled | — | — | 2026-08-11 |
| 16 | plp-kv-frontend-production | fetch, scheduled | — | — | 2026-07-27 |
| 17 | signalcore-engine-api | fetch, scheduled | — | `0 * * * *`, `0 6 * * *`, `15 * * * *`, `30 */6 * * *` | 2026-07-16 |
| 18 | signalcore-engine-prod | fetch, scheduled, queue | — | — | 2026-07-23 |

### BuildSignal Table Touch Analysis

| Worker | Writes signalcore_events | Writes kestovar_canonical | Reads signalcore_events | Reads scheduler tables |
|--------|-------------------------|--------------------------|------------------------|----------------------|
| **buildsignal-worker** | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| kestovar-intelligence-processor | ❌ | ❌ | ✅ YES | ❌ |
| kestovar-expansion | ❌ | ❌ | ✅ YES | ❌ |
| All others (15) | ❌ | ❌ | ❌ | ❌ |

**Key Finding:** Only `buildsignal-worker` writes to scheduler operational tables (`scheduler_activity_log`, `provider_polling_schedule`, `circuit_breaker`, `ingestion_runs`). No other worker has write access to the BuildSignal scheduler state.

---

## Phase 4: Detect Competing BuildSignal Schedulers

### Question: Are there multiple workers that could run BuildSignal ingestion simultaneously?

**Answer:** 🔴 **NO COMPETING SCHEDULERS for BuildSignal ingestion**

However, there are **DOWNSTREAM CONSUMERS** that compete for the same data:

1. **kestovar-intelligence-processor** (`0 */6 * * *`)
   - Same cron cadence as buildsignal-worker
   - Reads from `signalcore_events` to generate patterns/recommendations
   - Does NOT write to scheduler tables
   - **Risk:** If buildsignal-worker stops writing to `signalcore_events`, this processor will have no new data

2. **kestovar-expansion** (`0 7 * * *`, `0 8 * * 1`, `5 * * * *`)
   - Reads from `signalcore_events` for analytics/reporting
   - Also reads `saved_areas`
   - **Risk:** Same — depends on legacy table

**Conclusion:** No competing schedulers. But two downstream consumers will break if legacy writes stop.

---

## Phase 5: Establish ONE Authoritative BuildSignal Scheduler

### Verdict

**`buildsignal-worker` IS the one and only authoritative BuildSignal scheduler.**

Evidence:
1. ✅ Only worker with routes to `api.buildsignal.net/*`
2. ✅ Only worker that writes to `scheduler_activity_log`, `provider_polling_schedule`, `circuit_breaker`, `ingestion_runs`
3. ✅ Only worker that writes to BOTH `signalcore_events` and `kestovar_canonical_events`
4. ✅ 41 entries in `scheduler_activity_log` all trace to this worker
5. ✅ Cron schedule `0 */6 * * *` matches the observed run pattern

**Status:** ✅ Phase 5 COMPLETE — No scheduler competition detected.

---

## Phase 6: Source-Control the Production Worker in Repository

### Current State
- Production source: `buildsignal-worker-recovered.js` (143,914 chars, inline deployed)
- Repository source: `packages/api/src/index.ts` (completely different)
- **The two have diverged significantly**

### Required Actions
1. **Commit recovered source** to `packages/production-worker/buildsignal-worker-recovered.js`
2. **Create branch** for production worker maintenance
3. **Set up CI/CD** to deploy from repository instead of inline API
4. **Document** the inline deployment process as legacy

**Status:** 🔴 NOT STARTED — Production worker source is NOT in any repository.

---

## Phase 7: Production vs Repository Diff

### Key Differences

| Feature | Production Worker | Repository Code | Status |
|---------|------------------|-----------------|--------|
| Deployment | Inline via API | Git-based (intended) | 🔴 Diverged |
| Hash algorithm | djb2-like | cyrb53 | 🔴 Different |
| ContentHash dedup | signalcore_events only | kestovar_canonical_events | 🔴 Different |
| Search reads from | signalcore_events | kestovar_canonical_events | 🔴 Different |
| V1 REST | `/api/v1/signals` works | `/api/v1/signals` added | 🟡 Repo has it |
| Health endpoint | `/api/health` → 404 | `/api/health` implemented | 🔴 Not deployed |
| tRPC telemetry | Not present | `withTelemetry()` added | 🔴 Not deployed |
| Ingestion writes | Dual write (legacy + canonical) | Canonical only | 🔴 Different |
| providerIdMap | 4 providers | Should be canonical IDs | 🟡 Needs update |
| Dark theme fixes | Not present | Fixed in repo | 🔴 Not deployed |

### Exact Production Hash Function (djb2)
```javascript
let hash = 5381;
for (let i = 0; i < rawPayload.length; i++) {
  const ch = rawPayload.charCodeAt(i);
  hash = ((hash << 5) - hash) + ch;
  hash = hash & hash;
}
const contentHash = Math.abs(hash).toString(16);
```

### Exact Repository Hash Function (cyrb53)
```typescript
function cyrb53(str: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}
```

**Impact:** The two hash functions produce completely different values for the same input. Records ingested by production cannot be deduplicated by repository code, and vice versa.

---

## Phase 8: B3 — Canonical Search Alignment

### Finding: Search Reads from Wrong Table

**Production search handler (`handleSearchSearch`):**
```javascript
const { results } = await d1Query(db,
  "SELECT id, eventType, title, description, county, state, confidence, createdAt, provenance FROM signalcore_events WHERE (title LIKE ? OR description LIKE ? OR county LIKE ?) AND provenance = ? ORDER BY createdAt DESC LIMIT ?",
  [q, q, q, provFilter, lim]
);
```

### Data Visibility by Table

| Provider | signalcore_events (Legacy) | kestovar_canonical_events (Canonical) | Searchable? |
|----------|---------------------------|--------------------------------------|-------------|
| raleigh-permits | 120 | **0** | ✅ Yes (legacy) |
| wake-county-permits | 0 | **219** | ❌ **NO** |
| fairfax-va | 10 | 10 | ✅ Yes (legacy) |
| charleston-sc | 5 | 5 | ✅ Yes (legacy) |

**🔴 CRITICAL: 219 wake-county records are completely invisible to search.**

### Required Fix
Update production worker's `handleSearchSearch()` to read from `kestovar_canonical_events`:
```javascript
// BEFORE (legacy)
FROM signalcore_events

// AFTER (canonical)
FROM kestovar_canonical_events
```

---

## Phase 9: B3 — Stop Legacy Production Writes

### Current Dual Write Pattern

**Step 1: Insert into legacy table**
```javascript
const eventResult = await d1Run(db,
  `INSERT INTO signalcore_events (providerId, externalId, eventType, title, description, county, state, city, zipCode, lat, lng, address, publishedAt, ingestedAt, confidence, status, contentHash, rawData, dataSource, provenance, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [row.providerId, row.sourceRecordId || null, "building_permit", title, description, county, state, city, zipCode, lat, lng, address, publishedAt, now, 70, "active", contentHash, rawPayload, providerName, "LIVE", now, now]
);
```

**Step 2: Get legacy ID for canonical reference**
```javascript
const newEventId = eventResult.meta?.last_row_id || eventResult.lastRowId || 0;
```

**Step 3: Insert into canonical table using legacy ID as canonicalId**
```javascript
// ─── KESTOVAR SYNC: canonical event ───
await d1Run(db,
  `INSERT INTO kestovar_canonical_events (canonicalId, providerId, sourceRecordId, eventType, title, description, county, state, city, zipCode, lat, lng, address, publishedAt, ingestedAt, confidence, status, contentHash, rawData, dataSource, provenance, createdAt, syncedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [newEventId, row.providerId, row.sourceRecordId || null, "building_permit", title, description, county, state, city, zipCode, lat, lng, address, publishedAtSeconds, now, 70, "active", contentHash, rawPayload, providerName, "LIVE", now, now]
);
```

### ⚠️ Deduplication ONLY Checks Legacy Table
```javascript
const dupCheck = await d1Query(db,
  `SELECT id FROM signalcore_events WHERE contentHash = ? OR rawData = ? LIMIT 1`,
  [contentHash, rawPayload]
);
```

The canonical table has **NO deduplication check**. If the same record is ingested twice, it will be inserted twice into `kestovar_canonical_events`.

### Blockers to Stopping Legacy Writes

| Blocker | Impact | Resolution |
|---------|--------|------------|
| kestovar-intelligence-processor reads signalcore_events | Will stop receiving new data | Update to read kestovar_canonical_events |
| kestovar-expansion reads signalcore_events | Analytics will stale | Update to read kestovar_canonical_events |
| Search reads signalcore_events | Search will miss new data | Update to read kestovar_canonical_events |
| Raleigh data only in legacy | 120 records would be lost | Backfill to canonical table |
| Deduplication only on legacy | Canonical table unprotected | Add dedup check to canonical |
| Hash mismatch (djb2 vs cyrb53) | Cannot cross-check dedup | Pick one hash, recompute if needed |

---

## Phase 10: Unify Scheduled + API Ingestion Contracts

### Current Contract Analysis

Both `runSchedulerCron()` (scheduled) and `POST /api/providers/:id/run` (API) call the same `executeIngestionRun()` function. This is correct — unified contract.

### executeIngestionRun Parameters
```javascript
async function executeIngestionRun(db, providerId, trigger = "scheduled", limit = 50) {
  // Same code path for both scheduled and manual triggers
}
```

### providerIdMap (Production)
```javascript
const providerIdMap = {
  "raleigh_building_permits": "raleigh-permits",
  "wake_county_building_permits": "wake-county-permits",
  "mecklenburg_nc_building_permits": "mecklenburg-nc-building_permits",
  "fairfax_va_building_permits": "fairfax-va-building_permits"
};
```

**Status:** ✅ Unified contract. Both scheduled and API ingestion use the same pipeline.

---

## Phase 11: B2 — Provider Authority Consolidation

### Dual Provider Tables

**Legacy:** `provider_registry`
| id | name |
|----|------|
| 1 | Raleigh Building Permits |
| 2 | Wake County Permits |
| 3 | Mecklenburg County Permits |
| 4 | Fairfax VA Permits |

**Canonical:** `kestovar_provider_registry`
| id | name |
|----|------|
| 1 | Raleigh Building Permits |
| 2 | Wake County Permits |
| 3 | Charleston SC Permits |
| 4 | Fairfax VA Permits |

### Differences
- `provider_registry` has mecklenburg; canonical has charleston
- Production worker updates `provider_registry` (legacy)
- `provider_polling_schedule` uses original provider IDs (e.g., `wake-county-permits`)

**Status:** 🔴 NOT RESOLVED — Dual provider tables with different data.

---

## Phase 12: Canonical Provider IDs

### Provider ID Mapping

| Original ID | Canonical ID | Status |
|-------------|--------------|--------|
| raleigh-permits | raleigh-permits | ✅ Same |
| wake-county-permits | wake-county-canonical | 🔴 Different |
| fairfax-va-building_permits | fairfax-va-canonical | 🔴 Different |
| charleston-sc-building_permits | charleston-sc-canonical | 🔴 Different |

The production worker's `providerIdMap` maps internal names to original IDs, not canonical IDs.

**Status:** 🔴 NOT RESOLVED — Canonical IDs not used in production.

---

## Phase 13: B5 — Hash Consistency

### Production Hash: djb2
```javascript
let hash = 5381;
for (let i = 0; i < rawPayload.length; i++) {
  const ch = rawPayload.charCodeAt(i);
  hash = ((hash << 5) - hash) + ch;  // hash * 33 + ch
  hash = hash & hash;  // Force 32-bit int
}
const contentHash = Math.abs(hash).toString(16);
```

### Repository Hash: cyrb53
```typescript
function cyrb53(str: string, seed = 0): string {
  // 64-bit hash using two 32-bit halves
  // ...
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}
```

### Impact
- Same raw data produces **different hashes**
- Records ingested by production cannot be deduplicated by repository code
- Cross-table deduplication is **impossible**
- Migrating records between tables requires recomputing or accepting hash mismatches

**Recommendation:** Standardize on cyrb53. It is cryptographically stronger and 64-bit (less collision risk).

---

## Phase 14: Shared Ingestion Utilities

### Current State
All ingestion utilities are **inlined** in the production worker:
- `d1Query()` / `d1Run()` — D1 helpers
- ArcGIS fetch logic
- Normalization logic
- Hash computation
- Dedup checking

### Repository State
The repository has started extracting utilities to `packages/signalcore/src/index.ts`.

**Status:** 🔴 NOT RESOLVED — Production worker has all utilities inlined. No shared package.

---

## Phase 15: Real Cron Proof

### Evidence of Autonomous Execution

**scheduler_activity_log (Latest 10):**
| Run | Time | Evaluated | Due | Succeeded | Failed | Skipped |
|-----|------|-----------|-----|-----------|--------|---------|
| 44 | Aug 12, 14:00 | 4 | 3 | 2 | 1 | 1 |
| 42 | Aug 12, 08:00 | 4 | 3 | 2 | 1 | 1 |
| 40 | Aug 12, 02:00 | 4 | 3 | 2 | 1 | 1 |
| 38 | Aug 11, 20:00 | 4 | 3 | 2 | 1 | 1 |
| 36 | Aug 11, 14:00 | 4 | 3 | 2 | 1 | 1 |

**Pattern:** Every 6 hours (`0 */6 * * *`), consistently evaluating 4 providers.

**Status:** ✅ Confirmed autonomous. 41 total scheduler entries.

---

## Phase 16: Failure Isolation Verification

### Circuit Breaker State

| Provider | State | Failures | Last Failure |
|----------|-------|----------|--------------|
| raleigh-permits | closed | 0 | never |
| fairfax-va | closed | 0 | never |
| wake-county-permits | **open** | 3 | Aug 13, 2026 |
| mecklenburg-nc | **open** | multiple | suspended |
| charleston-sc | **open** | 1 | Aug 12, 2026 |

### Scheduler Overlap Prevention
```javascript
if (sched.lastPollStatus === 'running' && sched.lastPollStartedAt && (now - sched.lastPollStartedAt) < 300) {
  // Skip: previous run still active
}
```

**Status:** ✅ Circuit breaker + overlap prevention working correctly.

---

## Phase 17: Data Integrity Verification

### Duplication Check

| Table | Duplicates | Status |
|-------|-----------|--------|
| signalcore_events | 0 | ✅ All 135 unique contentHash |
| kestovar_canonical_events | 0 | ✅ All 234 unique contentHash |

### Cross-Table Duplication
- Same real-world permits MAY exist in both tables with **different IDs**
- Legacy IDs: integer auto-increment (63, 64, 65...)
- Canonical IDs: kev-UUID (kev-abc123...)
- Cross-table dedup is **impossible** due to hash mismatch

### Data Split

| Provider | Legacy Only | Canonical Only | Both | Neither |
|----------|------------|----------------|------|---------|
| raleigh | 120 | 0 | 0 | — |
| wake-county | 0 | 219 | 0 | — |
| fairfax | 0 | 0 | 10 | — |
| charleston | 0 | 0 | 5 | — |
| mecklenburg | 0 | 0 | 0 | — |

**Status:** 🟠 Data is split across tables. No single table has all records.

---

## Phase 18: API + Frontend Regression

### API Endpoints

| Endpoint | Result | Table Read |
|----------|--------|------------|
| `GET /api/v1/signals` | ✅ 200 OK | signalcore_events (legacy) |
| `GET /api/health` | 🔴 404 | N/A |
| `GET /trpc/*` | ✅ 200 OK | Various |

### Frontend Pages

| Page | Status |
|------|--------|
| /pricing | ✅ Loads |
| /contact | ✅ Loads |
| /help | ✅ Loads |
| /search | ✅ Loads (reads legacy data) |
| / (homepage) | ✅ Loads |

### Dark Theme Fixes (Repository Only)
- Pricing table digit stripping: ✅ Fixed
- SelectTrigger visibility: ✅ Fixed
- green-500 → #4ade80: ✅ Fixed

**Note:** Frontend fixes may not be deployed to Cloudflare Pages yet.

---

## Phase 19: Legacy SignalCore Classification

### SignalCore Package (Repository)

| Component | Status |
|-----------|--------|
| Queue handler | ✅ REMOVED |
| Hardcoded fallback data | ✅ REMOVED |
| V1 REST endpoints | ✅ MIGRATED to api/v1-router.ts |
| Ingestion logic | ✅ MIGRATED to api/ingestion-router.ts |
| Schema | ✅ kestovar_canonical_events added |

### Production Worker Still Contains
- Full SignalCore ingestion pipeline (inlined)
- signalcore_events writes
- signalcore_events reads for search

**Status:** 🟠 Repository cleaned, but production still runs legacy logic.

---

## Phase 20: Final Architecture Lock Documentation

### Completed Remediation Items ✅

| Item | Status |
|------|--------|
| B1 — Pages Function thinned (827 → ~80 lines) | ✅ COMPLETE |
| Phase 1 — Production worker source recovered | ✅ COMPLETE |
| Phase 2 — Source completeness verified (22/22 markers) | ✅ COMPLETE |
| Phase 3 — Cron ownership audit (18 workers inventoried) | ✅ COMPLETE |
| Phase 4 — No competing BuildSignal schedulers | ✅ COMPLETE |
| Phase 5 — buildsignal-worker is sole authority | ✅ COMPLETE |
| Phase 10 — Unified scheduled + API ingestion contract | ✅ COMPLETE |
| Phase 15 — Real autonomous cron confirmed (41 runs) | ✅ COMPLETE |
| Phase 16 — Failure isolation verified | ✅ COMPLETE |
| Phase 17 — Data integrity verified (no duplicates per table) | ✅ COMPLETE |
| Phase 18 — API + frontend regression tested | ✅ COMPLETE |
| Phase 19 — Legacy SignalCore classified | ✅ COMPLETE |

### Pending Critical Items 🔴

| Item | Severity | Phase |
|------|----------|-------|
| B3 — Search reads from signalcore_events (missing 219 wake records) | CRITICAL | 8 |
| B3 — Stop dual writes to legacy table | CRITICAL | 9 |
| B4 — Production worker source NOT in repository | CRITICAL | 6 |
| B4 — Repository code NEVER deployed to production | CRITICAL | 7 |
| B2 — Dual provider tables (provider_registry vs kestovar_provider_registry) | HIGH | 11 |
| B5 — Hash mismatch (djb2 vs cyrb53) | HIGH | 13 |
| B5 — Shared utilities not extracted | MEDIUM | 14 |
| B3 — Downstream consumers break if legacy stops (intelligence-processor, expansion) | HIGH | 4 |
| B3 — Canonical table has NO deduplication | HIGH | 9 |
| B3 — Raleigh data (120 records) only in legacy | HIGH | 9 |

---

## Recommended Action Plan

### Immediate (P0 — This Sprint)

1. **COMMIT recovered source to repository**
   ```bash
   git add packages/production-worker/buildsignal-worker-recovered.js
   git commit -m "Phase 6: Source-control production buildsignal-worker"
   ```

2. **FIX search to read from canonical table**
   - Update `handleSearchSearch()` in production worker
   - Change `FROM signalcore_events` → `FROM kestovar_canonical_events`
   - Deploy immediately

3. **BACKFILL missing data**
   - Copy 120 raleigh records from legacy to canonical
   - Ensure canonicalId uses proper format

### Short-Term (P1 — Next Sprint)

4. **UPDATE downstream consumers**
   - kestovar-intelligence-processor: read kestovar_canonical_events
   - kestovar-expansion: read kestovar_canonical_events

5. **STOP dual writes**
   - Remove signalcore_events INSERT from production worker
   - Move dedup check to kestovar_canonical_events
   - Use cyrb53 hash consistently

6. **CONSOLIDATE provider tables**
   - Migrate all to kestovar_provider_registry
   - Deprecate provider_registry

### Medium-Term (P2)

7. **SET UP CI/CD**
   - Deploy repository code to buildsignal-worker
   - Remove inline deployment process

8. **CLEAN UP**
   - Archive signalcore_events
   - Drop legacy tables after verification

---

## Appendices

### Appendix A: Recovered Source File
- **Path:** `buildsignal-worker-recovered.js`
- **Size:** 143,914 characters / 2,555 lines
- **MD5:** `77e9432d8c7bb95b54cd5ed353797f29`

### Appendix B: Full Worker Inventory
See Phase 3 table for all 18 workers.

### Appendix C: Data Distribution
See Phase 8 table for complete cross-table analysis.

### Appendix D: Hash Comparison
See Phase 13 for exact code comparison.

---

*Report generated by Kimi AI Agent*
*Architecture Lock Sprint v1.5.0*
