# BuildSignal — Demand-Driven External-Data Architecture Assessment

**Date:** 2026-09-18 · **Type:** Record + assess only (no refactor, no production mutation)
**Directive:** BUILDSIGNAL — DEMAND-DRIVEN EXTERNAL-DATA ARCHITECTURE UPDATE
**Prior directive preserved:** REFERENCE → RETRIEVE → NORMALIZE → CHANGE-DETECT → CACHE (permanent, recorded 2026-09-18)

## New lesson recorded (from PLP production, generalized only)

DEMAND → SOURCE RESOLUTION → AUTHORITATIVE RETRIEVAL → IDENTITY VALIDATION → NORMALIZATION → EVIDENCE COLLECTION → PROVENANCE → EVIDENCE SUFFICIENCY → PRODUCT INTELLIGENCE → MATERIALIZATION → FINGERPRINT → CACHE → CHANGE-ONLY REFRESH.

No PLP parcel logic, Opportunity Score logic, adapters, or schemas imported. No BuildSignal dependency on PLP anything. Kestovar unmodified.

## Gap analysis (production evidence, 2026-09-18)

| # | Capability | Status | Evidence |
|---|---|---|---|
| 1 | Source registry | **EXISTS** | `provider_registry` (9 providers: authority, jurisdiction, endpoint, licensing, health, watermarks); `ingestion_sources`, `data_providers` (fragmented — 3 overlapping registries) |
| 2 | Canonical identity | **EXISTS** | `providerId + sourceRecordId` keys throughout ingestion; zero duplicate `(providerId, sourceRecordId)` pairs in `kestovar_canonical_events` |
| 3 | Demand-driven retrieval | **MISSING** | Retrieval is 100% scheduled (6-hourly cron, 44 scheduled providers); no on-demand/event-driven fetch path in worker |
| 4 | Identity validation before materialization | **PARTIAL** | Dedupe keys work, but no documented validation that a source's external ID is unique/stable within its authority scope before materializing (the PLP-proven risk class) |
| 5 | Normalization | **EXISTS** | Per-provider adapters normalize into `kestovar_canonical_events`; schema signatures tracked |
| 6 | Provenance | **EXISTS (partial depth)** | `provenance` columns, ledger with retrieval time + schema fingerprint; per-record locator/schema-version chain not uniformly queryable |
| 7 | Fingerprint / change detection | **EXISTS** | `provider_fingerprints` (46); ledger: 48 scheduled polls, 1,200 observed, **1,200 skipped / 0 created** — unchanged data produces zero writes; `schemaChanged` tracked |
| 8 | Evidence sufficiency states | **MISSING** | No record-exists / evidence-available / sufficient / insufficient / source-unavailable distinction in product logic |
| 9 | UNKNOWN handling | **PARTIAL** | 9 explicit UNKNOWN paths; billing UI shows truthful `Unavailable`/`Unmetered` rather than fabricated numbers; not yet a system-wide contract |
| 10 | Cache / materialization separation | **PARTIAL** | Canonical events vs `raw_records` separated; no explicit FRESH/STALE/INVALIDATED/NOT_MATERIALIZED state model (5 TTL references only) |
| 11 | Historical evidence distinction | **PARTIAL** | `historical_warehouse` exists but is empty (0 rows) — no durable snapshot path for customer-facing output vs current source data |
| 12 | Source-health handling | **PARTIAL** | Circuit breaker (8 providers: 5 closed, 2 open, 1 half-open) isolates failures truthfully; `schemaChanged` flagged; no formal NOT_FOUND / RATE_LIMITED / STALE / AMBIGUOUS state vocabulary |
| 13 | Rate protection | **EXISTS** | Circuit breakers, polling schedule, due queue, per-provider pacing; no request coalescing (0 references) |
| 14 | Cost guards | **PARTIAL** | Watermark-bounded fetch + skip-on-unchanged keep cost low; no pre-ingestion cost estimation; no negative caching; paid-data purchases already fail closed to founder (standing directive) |
| 15 | Write amplification | **CONTROLLED** | Measured: 0 writes from 1,200 unchanged observations in the recorded ledger window |
| 16 | Source-failure truthfulness | **EXISTS** | Mecklenburg suspension documented with investigation trail; failing adapters isolated, no fabricated replacement data |

## Applicable lessons from PLP (adopt as future direction only)

1. **Demand-triggered retrieval** for user-facing queries over never-yet-needed jurisdictions/objects, instead of expanding scheduled pre-fetch.
2. **Identity validation step** before materialization (verify external ID scope/uniqueness within its authority).
3. **Evidence-sufficiency vocabulary** so product intelligence can distinguish thin evidence from no evidence.
4. **Negative caching** for confirmed-absent results to avoid re-hammering sources.

## PLP-specific concepts explicitly rejected

Parcel identity model, Opportunity Score semantics, government parcel adapters, PLP source_registry, PLP Data Coverage, PLP billing, any PLP database dependency.

## Potential future Kestovar primitives (identification only, no dependency created)

Source-adapter framework, fingerprint/change-detection library, provenance chain, cache policy engine, cost guards, observability.

## Future remediation order (not implemented)

1. Evidence-sufficiency + UNKNOWN-as-neutral system contract (product-visible truthfulness).
2. Cache freshness state model (FRESH/STALE/SOURCE_UNAVAILABLE/INVALIDATED/NOT_MATERIALIZED).
3. Identity-validation step in the materialization path for new adapters.
4. Historical-evidence snapshot path for customer reports/alerts (`historical_warehouse` or successor).
5. Demand-driven retrieval layer for user-facing queries (with coalescing + negative caching).
6. Source-health state vocabulary formalization (NOT_FOUND/RATE_LIMITED/STALE/AMBIGUOUS).
7. Pre-ingestion cost estimation for large refreshes.
8. Registry consolidation (3 → 1) when next touching that area.

## Closeout

1. **Production baseline:** commit `abb05dac` on main; Pages deployment `292b0067` SUCCESS; worker deployment `7beee14a`; /billing P0 fixed; all regression gates PASS.
2. **CI status:** GitHub → Cloudflare Pages auto-deploy healthy (two consecutive successful builds this session).
3–16. Per gap table above.
22. **Production changes: 0** (this document is the only commit; app bundle unchanged).
23. **PLP changes: 0.**
24. **Kestovar changes: 0.**
25. **Durable evidence:** this file + standing instruction memory #17 + archived directive text (`BUILDSIGNAL_PERMANENT_EXTERNAL_DATA_ARCHITECTURE_DIRECTIVE_2026-09-18.txt`).
27. **Ledger record:** directive recorded as permanent standing instruction; this assessment committed to repository.

**Terminal status: B — BUILDSIGNAL PARTIALLY ALIGNED / FUTURE GAPS DOCUMENTED**
