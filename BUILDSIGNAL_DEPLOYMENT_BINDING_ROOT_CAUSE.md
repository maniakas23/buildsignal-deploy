# BuildSignal — Deployment Binding Root Cause Analysis

v1.0 | 2026-08-09

---

## D1 Binding Loss — 2026-08-09

### Incident
Production Worker lost D1 database access after a code deployment, causing HTTP 500 across all data-dependent endpoints.

### Impact
All API endpoints requiring D1 returned HTTP 500 until manually restored.

### Duration
~2 minutes (detected immediately, repaired via manual PATCH).

---

## Sequence of Events

1. **18:14:26 UTC** — Worker code deployed via Cloudflare Workers API using multipart/form-data PUT.
2. **18:14:27 UTC** — Deployment succeeded (HTTP 200), new version active.
3. **18:14:30 UTC** — Health checks on `/api/v1/health` began failing with HTTP 500.
4. **18:16:00 UTC** — Investigation confirmed D1 binding missing from Worker settings.
5. **18:16:30 UTC** — D1 binding restored via PATCH to Worker settings.
6. **18:16:49 UTC** — New deployment with binding restored went live.

---

## Root Cause

The deployment used a direct Cloudflare Workers API PUT with a multipart body containing:
- `index.js` — the Worker script
- `metadata` — ONLY containing `{ "main_module": "index.js" }`

**The Workers API PUT replaces ALL existing bindings with whatever is provided in the request.** Because the metadata did not include the D1 binding declaration, the existing D1 binding (`DB → a8ecb143-6aa6-4741-b4e8-fe3e16695452`) was silently removed.

### Why This Happened
- The deployment mechanism was an ad-hoc API call using Python `requests` with a handcrafted multipart body.
- There was no authoritative binding manifest included in the deployment payload.
- No pre-deployment or post-deployment binding verification was performed.
- The deployment path bypassed Wrangler and any configuration-as-code safeguards.

### Why It Was Not Caught Sooner
- The deployment returned HTTP 200, appearing successful.
- Binding loss is invisible from the script upload response.
- No automated post-deployment checks verified binding presence.

---

## Evidence

Pre-incident Worker bindings (from earlier session):
```
[{"type":"secret_text","name":"APP_ID"},
 {"type":"secret_text","name":"APP_SECRET"},
 {"type":"d1","name":"DB","id":"a8ecb143-..."},
 ...]
```

Post-incident Worker bindings (immediately after PUT):
```
[{"type":"secret_text","name":"APP_ID"},
 {"type":"secret_text","name":"APP_SECRET"},
 {"type":"secret_text","name":"INTERNAL_API_SECRET"},
 {"type":"secret_text","name":"JWT_SECRET"},
 ...]
```

**D1 binding: NOT PRESENT.**

---

## Fix Applied

D1 binding restored via PATCH to `/accounts/{id}/workers/scripts/buildsignal-worker/settings` with multipart body containing a `settings` part:
```json
{
  "bindings": [
    { "type": "d1", "name": "DB", "id": "a8ecb143-6aa6-4741-b4e8-fe3e16695452" }
  ]
}
```

This re-added the D1 binding without redeploying the script.

---

## Prevention Required

See `BUILDSIGNAL_PRODUCTION_DEPLOYMENT_HARDENING.md` for the hardening plan that prevents this from recurring.
