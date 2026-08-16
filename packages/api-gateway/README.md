# BuildSignal API Gateway

Worker: `buildsignal-api-gateway`
Route: `api.buildsignal.net/*`
Origin: service binding `ORIGIN` → `buildsignal-worker`
D1: `DB` → buildsignal-db (a8ecb143-6aa6-4741-b4e8-fe3e16695452)

## Purpose (P0 remediation, 2026-08-16)

1. **Alerts/Onboarding IDOR fix** — per-user endpoints require a valid JWT;
   client-supplied `userId` must match the token subject (403 otherwise);
   unauthenticated requests get 401.
2. **Ops metrics lockdown** — `/api/v1/ops/*` and `/api/v1/conversion/funnel`
   require an admin JWT or the `X-Ops-Key` shared secret (secret `OPS_KEY`).
3. **Stripe Checkout restoration** — `billing.createCheckout` and
   `stripe.createCheckoutSession` are served by the gateway with
   server-authoritative plan→Price-ID mapping. Requires secrets:
   `STRIPE_SECRET_KEY`, `STRIPE_PRICE_SCOUT`, `STRIPE_PRICE_PRO`,
   `STRIPE_PRICE_BUSINESS`. Approved pricing: Scout $99 / Pro $249 / Business $599.
4. **Watchlist entitlement** — `watchlist.create` requires Pro+ server-side.
   Legacy Scout records remain readable/deletable.
5. **Account deletion** — `auth.deleteAccount` removes only the authenticated
   user's own rows (alerts, configs, notifications, watchlists, saved_areas,
   onboarding, conversion events, reports, webpush subs, org membership,
   single-owner orgs without active Stripe subscriptions, user record).

## Deploy

The script is a single self-contained ES module (`gateway.js`). Deploy via the
Cloudflare Workers Scripts API (multipart upload, `main_module: gateway.js`)
with the bindings listed above, or via wrangler with an equivalent config.

## Rollback

Re-point zone route `074a4c99ba69482785e09597d806ff75`
(`api.buildsignal.net/*`) back to script `buildsignal-worker`.
