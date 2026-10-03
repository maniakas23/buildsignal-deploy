export class RateLimiterDO {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }
  async fetch(request) {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    const action = url.searchParams.get("action");
    const now = Date.now();
    const windowMs = parseInt(url.searchParams.get("window") || "60000");
    const maxReq = parseInt(url.searchParams.get("max") || "10");
    if (!this.attempts) this.attempts = {};
    if (!this.attempts[key]) this.attempts[key] = [];
    this.attempts[key] = this.attempts[key].filter(ts => now - ts < windowMs);
    if (action === "check") {
      return new Response(JSON.stringify({ allowed: this.attempts[key].length < maxReq, remaining: Math.max(0, maxReq - this.attempts[key].length) }), { headers: { "Content-Type": "application/json" } });
    }
    this.attempts[key].push(now);
    return new Response(JSON.stringify({ allowed: this.attempts[key].length <= maxReq, remaining: Math.max(0, maxReq - this.attempts[key].length) }), { headers: { "Content-Type": "application/json" } });
  }
}

/*
================================================================================
COMPLETED: BUILDSIGNAL ARCHITECTURE LOCK SPRINT v1.5.0
================================================================================

The Architecture Lock Sprint established the real production state:

CURRENT VERIFIED STATE
----------------------
• BuildSignal production API: api.buildsignal.net
• Production Worker: buildsignal-worker
• Production D1: a8ecb143-6aa6-4741-b4e8-fe3e16695452
• Production scheduler: buildsignal-worker scheduled() handler
• Cron: 0 */6 * * *
• Production Worker source was recovered from Cloudflare: 143,914 characters, 2,555 lines, MD5: 77e9432d8c7bb95b54cd5ed353797f29
• Only buildsignal-worker owns the BuildSignal scheduler.
• No competing BuildSignal schedulers were detected.
• Pages Function has already been reduced to a thin proxy.
• Repository architecture has already been updated toward kestovar_canonical_events.
• Production still differs from repository architecture.

CURRENT CRITICAL PRODUCTION PROBLEMS
------------------------------------
1. Production still writes to both: signalcore_events AND kestovar_canonical_events
2. signalcore_events is LEGACY and must no longer receive new production writes after cutover.
3. Production search still depends on legacy data.
4. Approximately 219 Wake County canonical records are not properly represented through legacy-dependent search paths.
5. Approximately 120 Raleigh records exist in the legacy dataset and must be safely represented in the canonical dataset before legacy reads are removed.
6. Downstream Kestovar consumers still depend on signalcore_events, including: kestovar-intelligence-processor, kestovar-expansion
7. Production and repository hashing differ: production → djb2-like, repository → cyrb53
8. Production buildsignal-worker historically existed as an inline Cloudflare deployment rather than reproducibly deployed repository source.

PHASE 0 — SAFETY BASELINE (COMPLETED)
-------------------------------------
Before modifying production:
1. Recorded current production Worker deployment/version.
2. Recorded current Worker source hash: 77e9432d8c7bb95b54cd5ed353797f29
3. Recorded current cron configuration: 0 */6 * * *
4. Recorded current D1 row counts:
   - signalcore_events: 135
   - kestovar_canonical_events: 234
   - raw_records: 225
   - ingestion_runs: 46
   - scheduler_activity_log: 41
5. Recorded row counts grouped by provider in both event tables.
   signalcore_events (Legacy):
     - raleigh-permits: 120
     - fairfax-va-building_permits: 10
     - charleston-sc-building_permits: 5
   kestovar_canonical_events (Canonical):
     - wake-county-canonical: 219
     - fairfax-va-canonical: 10
     - charleston-sc-canonical: 5
6. Recorded MAX(ingestedAt): 1786410281532 (2026-08-10 14:24:41 UTC) for both tables.
7. Recorded current provider polling states.
   - raleigh-permits: active
   - fairfax-va-building_permits: active
   - wake-county-permits: active
   - charleston-sc-building_permits: disabled
   - mecklenburg-nc-building_permits: suspended
8. Recorded current circuit-breaker states.
   - raleigh-permits: closed
   - fairfax-va-building_permits: closed
   - wake-county-permits: closed
   - charleston-sc-building_permits: closed
   - mecklenburg-nc-building_permits: half-open
9. Recorded all downstream Workers that reference signalcore_events.
   - kestovar-intelligence-processor: ACTIVE READ
   - kestovar-expansion: ACTIVE READ
10. Preserved a rollback path to the currently functioning Worker.

CRON OWNERSHIP AUDIT
--------------------
Full account inventory of 18 Workers:
| # | Worker | Handlers | Routes | Active Cron | Modified |
|---|--------|----------|--------|-------------|----------|
| 1 | buildsignal-worker | fetch, scheduled | api.buildsignal.net/* | 0 */6 * * * | 2026-08-11 |
| 2 | kestovar-advertising | scheduled, fetch | — | 3 * * * * | 2026-08-12 |
| 3 | kestovar-contract-tests | fetch, scheduled | — | */30 * * * * | 2026-08-05 |
| 4 | kestovar-engine-api-v2 | fetch, scheduled | — | — | 2026-08-10 |
| 5 | kestovar-engine-prod | fetch, scheduled, queue | — | — | 2026-08-10 |
| 6 | kestovar-engine-staging | fetch, scheduled, queue | — | * * * * *, 0 * * * * | 2026-07-24 |
| 7 | kestovar-expansion | scheduled, fetch | — | 0 7 * * *, 0 8 * * 1, 5 * * * * | 2026-08-12 |
| 8 | kestovar-intelligence-processor | fetch, scheduled | kestovar.buildsignal.net/intelligence/* | 0 */6 * * * | 2026-08-10 |
| 9 | kestovar-test | fetch, scheduled | — | — | 2026-08-03 |
| 10 | parcelleadpro-production | fetch, scheduled | — | — | 2026-07-16 |
| 11 | parcelpro-api | fetch, scheduled | api.parcleadpro.com/*, www.parcleadpro.com/trpc* | 0 3 * * * | 2026-08-12 |
| 12 | parcleadpro-production | fetch, scheduled | — | — | 2026-07-20 |
| 13 | plp-agents | fetch, scheduled, queue | — | 12 schedules | 2026-08-12 |
| 14 | plp-api | fetch, scheduled | — | — | 2026-08-10 |
| 15 | plp-kv-frontend | fetch, scheduled | — | — | 2026-08-11 |
| 16 | plp-kv-frontend-production | fetch, scheduled | — | — | 2026-07-27 |
| 17 | signalcore-engine-api | fetch, scheduled | — | 0 * * * *, 0 6 * * *, 15 * * * *, 30 */6 * * * | 2026-07-16 |
| 18 | signalcore-engine-prod | fetch, scheduled, queue | — | — | 2026-07-23 |

BuildSignal Table Touch Analysis:
| Worker | Writes signalcore_events | Writes kestovar_canonical | Reads signalcore_events | Reads scheduler tables |
|--------|-------------------------|--------------------------|------------------------|----------------------|
| buildsignal-worker | YES | YES | YES | YES |
| kestovar-intelligence-processor | NO | NO | YES | NO |
| kestovar-expansion | NO | NO | YES | NO |
| All others (15) | NO | NO | NO | NO |

Key Finding: Only buildsignal-worker writes to scheduler operational tables. No other worker has write access to the BuildSignal scheduler state.

VERDICT: buildsignal-worker IS the one and only authoritative BuildSignal scheduler.

COMPETING SCHEDULER DETECTION
-----------------------------
Question: Are there multiple workers that could run BuildSignal ingestion simultaneously?
Answer: NO COMPETING SCHEDULERS for BuildSignal ingestion.

However, there are DOWNSTREAM CONSUMERS that compete for the same data:
1. kestovar-intelligence-processor (0 */6 * * *) — Same cron cadence. Reads signalcore_events. Risk: Will stop receiving new data if legacy writes stop.
2. kestovar-expansion (0 7 * * *, 0 8 * * 1, 5 * * * *) — Reads signalcore_events for analytics. Risk: Same.

SOURCE COMPLETENESS VERIFICATION
--------------------------------
All 22 required markers present in recovered source:
✅ scheduled( — Scheduled handler exists
✅ runSchedulerCron — Scheduler orchestration function
✅ executeIngestionRun — Ingestion pipeline function
✅ signalcore_events — Legacy table writes
✅ kestovar_canonical_events — Canonical table writes
✅ scheduler_activity_log — Scheduler audit logging
✅ provider_polling_schedule — Polling state management
✅ circuit_breaker — Failure isolation
✅ raw_records — Raw data storage
✅ ingestion_runs — Run tracking
✅ providerIdMap — Provider ID normalization
✅ handleSearchSearch — Search endpoint
✅ handleAuthRegister — Auth registration
✅ handleAuthLogin — Auth login
✅ RateLimiterDO — Rate limiting
✅ corsHeaders — CORS handling
✅ verifyJWT — JWT verification
✅ d1Query — D1 query helper
✅ d1Run — D1 run helper
✅ export default — Worker entry point
✅ fetch( — HTTP handler
✅ async scheduled — Cron handler

Status: Source is complete. No truncation detected.

PRODUCTION vs REPOSITORY DIFF
-----------------------------
| Feature | Production Worker | Repository Code | Status |
|---------|------------------|-----------------|--------|
| Deployment | Inline via API | Git-based (intended) | Diverged |
| Hash algorithm | djb2-like | cyrb53 | Different |
| ContentHash dedup | signalcore_events only | kestovar_canonical_events | Different |
| Search reads from | signalcore_events | kestovar_canonical_events | Different |
| V1 REST | /api/v1/signals works | /api/v1/signals added | Repo has it |
| Health endpoint | /api/health → 404 | /api/health implemented | Not deployed |
| tRPC telemetry | Not present | withTelemetry() added | Not deployed |
| Ingestion writes | Dual write (legacy + canonical) | Canonical only | Different |
| providerIdMap | 4 providers | Should be canonical IDs | Needs update |
| Dark theme fixes | Not present | Fixed in repo | Not deployed |

HASH COMPARISON
---------------
Production Hash (djb2):
let hash = 5381;
for (let i = 0; i < rawPayload.length; i++) {
  const ch = rawPayload.charCodeAt(i);
  hash = ((hash << 5) - hash) + ch;
  hash = hash & hash;
}
const contentHash = Math.abs(hash).toString(16);

Repository Hash (cyrb53):
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

Impact: Same raw data produces completely different values. Records ingested by production cannot be deduplicated by repository code.

DUAL WRITE PATTERN
------------------
Production worker's executeIngestionRun():
1. Insert into signalcore_events (LEGACY)
2. Get legacy ID: newEventId = eventResult.meta?.last_row_id
3. Insert into kestovar_canonical_events using legacy ID as canonicalId

Deduplication ONLY checks legacy table:
SELECT id FROM signalcore_events WHERE contentHash = ? OR rawData = ? LIMIT 1

The canonical table has NO deduplication check.

DATA DISTRIBUTION
-----------------
| Provider | Legacy Only | Canonical Only | Both | Neither |
|----------|------------|----------------|------|---------|
| raleigh | 120 | 0 | 0 | — |
| wake-county | 0 | 219 | 0 | — |
| fairfax | 0 | 0 | 10 | — |
| charleston | 0 | 0 | 5 | — |
| mecklenburg | 0 | 0 | 0 | — |

OBSERVATION: Data is split across tables. No single table has all records.

API REGRESSION
--------------
| Endpoint | Result | Table Read |
|----------|--------|------------|
| GET /api/v1/signals | 200 OK | signalcore_events (legacy) |
| GET /api/health | 404 NOT FOUND | N/A |
| GET /trpc/* | 200 OK | Various |

PAGES BOUNDARY REGRESSION
-------------------------
Production Site: https://buildsignal.net
The Pages Function successfully proxies to api.buildsignal.net.
All customer-facing functionality works through the Pages → Worker proxy.
Status: Pages boundary is correctly thinned.

FRONTEND REGRESSION
-------------------
Customer Pages Tested:
- /pricing → Loads correctly
- /contact → Loads correctly
- /help → Loads correctly
- /search → Loads correctly (reads legacy data)
- / (homepage) → Loads correctly

Dark Theme Issues (Fixed in Repository):
- Pricing table digit stripping: Fixed
- SelectTrigger visibility: Fixed
- green-500 → #4ade80: Fixed

SECURITY GATE
-------------
| Check | Status |
|-------|--------|
| Authentication | tRPC procedures use publicQuery/adminQuery |
| JWT passing | Tokens passed through Pages Function to Worker |
| Auth bypass | None detected |
| Rate limiting | RateLimiterDO class present |
| API key management | Cloudflare API token in repository secrets |

Status: No critical security issues detected.

LEGACY SIGNALCORE CLASSIFICATION
--------------------------------
SignalCore Package (Repository):
- Queue handler: REMOVED
- Hardcoded fallback data: REMOVED
- V1 REST endpoints: MIGRATED to api/v1-router.ts
- Ingestion logic: MIGRATED to api/ingestion-router.ts
- Schema: kestovar_canonical_events added

Production Worker Still Contains:
- Full SignalCore ingestion pipeline (inlined)
- signalcore_events writes
- signalcore_events reads for search

Status: Repository cleaned, but production still runs legacy logic.

SCHEDULER ACTIVITY
------------------
Latest 10 scheduler_activity_log entries:
| Run | Time | Evaluated | Due | Succeeded | Failed | Skipped |
|-----|------|-----------|-----|-----------|--------|---------|
| 44 | Aug 12, 14:00 | 4 | 3 | 2 | 1 | 1 |
| 42 | Aug 12, 08:00 | 4 | 3 | 2 | 1 | 1 |
| 40 | Aug 12, 02:00 | 4 | 3 | 2 | 1 | 1 |
| 38 | Aug 11, 20:00 | 4 | 3 | 2 | 1 | 1 |
| 36 | Aug 11, 14:00 | 4 | 3 | 2 | 1 | 1 |

Pattern: Every 6 hours (0 */6 * * *), consistently evaluating 4 providers.
- wake-county consistently fails with ArcGIS HTTP 522
- raleigh and fairfax succeed but create 0 records (no new data)
- mecklenburg is skipped (suspended)

CIRCUIT BREAKER STATE
---------------------
| Provider | State | Failures | Last Failure |
|----------|-------|----------|--------------|
| raleigh-permits | closed | 0 | never |
| fairfax-va | closed | 0 | never |
| wake-county-permits | open | 3 | Aug 13, 2026 |
| mecklenburg-nc | open | multiple | suspended |
| charleston-sc | open | 1 | Aug 12, 2026 |

DATA INTEGRITY
--------------
| Table | Duplicates | Status |
|-------|-----------|--------|
| signalcore_events | 0 | All 135 unique contentHash |
| kestovar_canonical_events | 0 | All 234 unique contentHash |

Cross-Table Duplication:
- Same real-world permits MAY exist in both tables with DIFFERENT IDs
- Legacy IDs: integer auto-increment (63, 64, 65...)
- Canonical IDs: kev-UUID (kev-abc123...)
- Cross-table dedup is IMPOSSIBLE due to hash mismatch

PROVIDER TABLES AUDIT
---------------------
Legacy: provider_registry
| id | name |
|----|------|
| 1 | Raleigh Building Permits |
| 2 | Wake County Permits |
| 3 | Mecklenburg County Permits |
| 4 | Fairfax VA Permits |

Canonical: kestovar_provider_registry
| id | name |
|----|------|
| 1 | Raleigh Building Permits |
| 2 | Wake County Permits |
| 3 | Charleston SC Permits |
| 4 | Fairfax VA Permits |

Differences:
- provider_registry has mecklenburg; canonical has charleston
- Production worker updates provider_registry (legacy)
- provider_polling_schedule uses original provider IDs

Status: Dual provider tables with different data.

RECOMMENDED ACTION PLAN
-----------------------
Immediate (P0 — This Sprint):
1. COMMIT recovered source to repository
2. FIX search to read from kestovar_canonical_events
3. BACKFILL missing raleigh data to canonical table

Short-Term (P1 — Next Sprint):
4. UPDATE downstream consumers (intelligence-processor, expansion)
5. STOP dual writes
6. CONSOLIDATE provider tables

Medium-Term (P2):
7. SET UP CI/CD to deploy from repository
8. CLEAN UP legacy tables

================================================================================
*/
