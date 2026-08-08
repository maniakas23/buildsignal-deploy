# BuildSignal — Real Intelligence Certification: Intelligence & Benchmarking

## Phase 2-3: Intelligence Validation & Model Benchmarking (Workstreams 8-15)

### Workstream 8: Deterministic Scoring First (P0)

**Status:** BLOCKED

**Evidence:**
- BuildSignal has a scoring architecture in the database schema:
  - `signalcore_patterns.confidence` (values 66-92)
  - `signalcore_patterns.evidenceCount` (values 4-11)
  - `signalcore_patterns.impactScore` (values 62-95)
  - `signalcore_recommendations.confidenceScore` (values 80-91)
  - `signalcore_recommendations.trustScore` (values 82-91)
- However, all scores are on seed data with identical timestamps
- The scoring system exists in schema but has never processed a live record
- The `confidence.list` endpoint returns 404 — no confidence API is deployed
- The policy "LLM can explain but never override scores" is documented in certification requirements but cannot be verified because no AI endpoint is deployed

**Verdict:** Scoring architecture exists in schema but has never been executed against live data. Determinism cannot be verified. LLM policy cannot be enforced.

**Next Action:** Deploy scoring pipeline. Process live records through deterministic scoring. Verify scores are reproducible for identical inputs. Document LLM policy enforcement.

---

### Workstream 9: LLM Role in Scoring (P0)

**Status:** BLOCKED

**Evidence:**
- The `completion.status` endpoint returns 404 — no completion API is deployed
- The Worker has no AI binding — no LLM is accessible in production
- The `aiGovernance.status` endpoint returns 404 — no AI governance API is deployed
- All scores in the database are hardcoded seed values
- The policy "LLM may never directly compute, assign, or override a numeric score" cannot be enforced or tested because there is no LLM integration
- The `learning.status` endpoint returns 404 — no learning API is deployed

**Verdict:** LLM role in scoring cannot be verified. No LLM is deployed. No AI endpoints exist. The policy is documented but unenforceable.

**Next Action:** Add AI binding to Worker. Deploy completion and governance endpoints. Implement score isolation (LLM explains, never overrides). Test with live data.

---

### Workstream 10: Evidence Chain (P0)

**Status:** BLOCKED

**Evidence:**
- `signalcore_pattern_evidence` table (12 records) exists
  - `evidenceType`: permit, spending, utility, geographic, correlation, comparison
  - `sourceUrl`: various URLs (e.g., https://raleighnc.gov/planning, https://charlottenc.gov/permits)
  - `relevanceScore`: 78-94
  - All records link to seed patterns with identical timestamps
- `signalcore_recommendation_evidence` table (12 records) exists
  - Links to seed recommendations with identical `generatedAt`
- `signalcore_recommendation_evidence` links to `signalcore_recommendations` but all are seed
- No live permit → pattern → recommendation → evidence chain has ever been created
- The `evidence.list` endpoint returns 404

**Verdict:** Evidence chain tables exist in schema but contain only seed data. No live evidence chain has ever been created. URLs in evidence records are placeholder values.

**Next Action:** Ingest real permits. Generate real patterns from live data. Create evidence chains with verifiable source URLs. Test evidence retrieval.

---

### Workstream 11: Model Benchmarking (P0)

**Status:** BLOCKED

**Evidence:**
- Configured models (per certification requirements): Llama 3.2 3B, Llama 3.3 70B, Claude, Gemini, Grok
- NONE of these models are accessible in production
- The Worker has no AI binding
- The `completion.status` endpoint returns 404
- The `aiGovernance.status` endpoint returns 404
- Cannot run accuracy, relevance, or trust benchmarks
- Cannot verify routing logic (cheap for fast tasks, expensive for complex analysis)
- No model benchmark endpoint exists

**Verdict:** Model benchmarking is completely blocked. No AI models are deployed. No benchmark infrastructure exists.

**Next Action:** Add AI binding to Worker. Deploy at least one model (recommend Llama 3.2 3B for cost efficiency). Create benchmark test suite. Run benchmarks and record baseline scores.

---

### Workstream 12: Model Routing (P0)

**Status:** BLOCKED

**Evidence:**
- No AI models are deployed
- No routing endpoint exists (`aiGovernance.status` returns 404)
- The routing policy (default to cheapest model, use expensive model only for evidence synthesis, never for score assignment) cannot be tested
- No `model_routing_log` table exists
- No `model_selection` configuration exists in the database

**Verdict:** Model routing cannot be verified. No models exist to route between.

**Next Action:** Deploy multiple models. Implement routing logic. Test routing decisions against query types. Log all routing decisions.

---

### Workstream 13: Baseline Score (P0)

**Status:** BLOCKED

**Evidence:**
- The certification requires 2000 test queries per model and 5000 permit analysis test cases
- These cannot be created or run because no AI models are accessible
- No test suite exists in the repository
- No benchmark dataset exists in the database
- The `historical.list` endpoint returns 404

**Verdict:** No baseline benchmark has been established. The baseline score is undefined.

**Next Action:** Create benchmark test suite (2000 queries, 5000 permit cases). Deploy AI models. Run benchmarks. Record baseline scores per model.

---

### Workstream 14: Accuracy, Relevance, Trust (P0)

**Status:** BLOCKED

**Evidence:**
- No live data exists
- No AI models are deployed
- No real customer queries have been processed
- All metrics are undefined:
  - Accuracy: undefined
  - Relevance: undefined
  - Trust: undefined
- The `analytics.status` endpoint returns 404

**Verdict:** Accuracy, relevance, and trust cannot be measured. No inputs exist to measure against.

**Next Action:** Deploy AI. Process real queries. Measure accuracy against ground truth. Measure relevance against customer feedback. Measure trust over time.

---

### Workstream 15: Hallucination Rate (P0)

**Status:** BLOCKED

**Evidence:**
- The hallucination test suite (50 infrastructure opportunities, deliberately misleading documents, adversarial queries) cannot be run
- No AI endpoint is deployed (`completion.status` returns 404)
- No hallucination detection logic exists in the codebase
- No `hallucination_log` table exists
- The `governance.status` endpoint returns 404

**Verdict:** Hallucination rate cannot be measured. No AI exists to hallucinate.

**Next Action:** Deploy AI models. Create hallucination test suite. Run tests. Measure and log hallucination rate. Implement detection logic.

---

*Phase 2-3 Intelligence Validation & Model Benchmarking complete. All workstreams BLOCKED.*
