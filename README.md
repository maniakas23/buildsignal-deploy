# BuildSignal

**Infrastructure intelligence platform for construction opportunity discovery.**

## Architecture

BuildSignal is deployed as a separated Cloudflare production stack:

```
app.buildsignal.com          →  Frontend  (Cloudflare Pages)
api.buildsignal.com          →  API       (Cloudflare Worker)
api.signalcore.buildsignal.com → SignalCore (Cloudflare Worker)
```

## Monorepo Structure

```
packages/
  frontend/       React + Vite SPA → Cloudflare Pages
  api/            Hono + tRPC backend → Cloudflare Worker
  signalcore/     SignalCore Engine → Cloudflare Worker
```

### Package: Frontend

- **Location:** `packages/frontend/`
- **Deploy target:** `app.buildsignal.com` via Cloudflare Pages
- **Build:** `npm run build --workspace=packages/frontend`
- **Key config:** `packages/frontend/wrangler.toml`
- **Dev server:** `npm run dev` (port 3000, proxies `/api` to local Worker)

The frontend is a pure static SPA. It does NOT include any backend code.
All API calls go to `api.buildsignal.com` via the `VITE_API_URL` env var.

### Package: API

- **Location:** `packages/api/`
- **Deploy target:** `api.buildsignal.com` via Cloudflare Worker
- **Build:** `npm run build --workspace=packages/api`
- **Key config:** `packages/api/wrangler.toml`
- **Entry point:** `packages/api/src/index.ts`

The API Worker owns: authentication, tRPC, billing (Stripe), watchlists,
reports, admin APIs, and all customer operations.

**Health endpoints:**
- `GET /health` — Service health
- `GET /ready` — Readiness probe (checks D1, auth, Stripe, SignalCore)
- `GET /version` — Build version

### Package: SignalCore

- **Location:** `packages/signalcore/`
- **Deploy target:** `api.signalcore.buildsignal.com` via Cloudflare Worker
- **Build:** `npm run build --workspace=packages/signalcore`
- **Key config:** `packages/signalcore/wrangler.toml`
- **Entry point:** `packages/signalcore/src/index.ts`

The SignalCore Engine handles: signal ingestion, normalization, AI analysis,
pattern detection, and confidence scoring.

## Infrastructure

### D1 Databases

| Environment | Database Name | Binding |
|-------------|---------------|---------|
| Production  | `buildsignal-db-production` | `DB` |
| Preview     | `buildsignal-db-preview` | `DB` |

**Never share a database ID between environments.**

Apply migrations:
```bash
npm run db:migrate:prod     # Production
npm run db:migrate:preview  # Preview
```

### R2 Buckets

- `buildsignal-documents-production` — Planning-agenda PDFs, permit documents
- `buildsignal-reports-production` — Generated reports, CSV exports

### Queues

- `buildsignal-ingestion-production` — Provider signal ingestion
- `buildsignal-alerts-production` — Alert processing

### Cron Triggers

- `*/5 * * * *` — Frequent checks
- `0 */6 * * *` — Batch processing

## Deployment

### Prerequisites

- Cloudflare account with Workers Paid plan
- Wrangler CLI authenticated: `npx wrangler login`
- D1 databases created (production + preview)
- R2 buckets created
- Queues created
- Custom domains configured

### Deploy All (Production)

```bash
npm install
npm run verify
npm run deploy
```

### Deploy Individual Packages

```bash
# API Worker
npm run deploy:api

# SignalCore Worker
npm run deploy:signalcore

# Frontend Pages
npm run deploy:frontend
```

### Deployment Sequence

1. Freeze a release candidate
2. Run `npm run verify` (typecheck + lint + build)
3. Apply D1 migrations to preview: `npm run db:migrate:preview`
4. Deploy API Worker to preview
5. Deploy SignalCore Worker to preview
6. Deploy Frontend preview
7. Run smoke tests against preview URLs
8. Apply approved migrations to production
9. Deploy backend Workers (API first, then SignalCore)
10. Verify `/health`, `/ready`, `/version`
11. Deploy Frontend to production
12. Run end-to-end smoke tests

## Local Development

```bash
# Install dependencies
npm install

# Start frontend dev server (port 3000)
# Proxies /api to localhost:8787
npm run dev

# In another terminal: start API Worker locally
cd packages/api && npx wrangler dev

# In another terminal: start SignalCore Worker locally
cd packages/signalcore && npx wrangler dev
```

## Environment Variables

### Frontend (`packages/frontend/.env.local`)

```env
VITE_API_URL=                    # Empty in dev (uses proxy), https://api.buildsignal.com in prod
VITE_SIGNALCORE_API_URL=http://localhost:8788/v1
VITE_SIGNALCORE_WS_URL=ws://localhost:8788/v1
```

### API Worker (Wrangler secrets)

```bash
npx wrangler secret put APP_ID
npx wrangler secret put APP_SECRET
npx wrangler secret put DATABASE_URL
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
```

## Production Gates

Do not onboard paying customers until all of these return the correct response:

- `GET https://api.buildsignal.com/health` → JSON
- `GET https://api.buildsignal.com/ready` → JSON (200 or 503)
- `GET https://api.buildsignal.com/version` → JSON
- `POST https://api.buildsignal.com/api/trpc/health` → JSON
- `POST https://api.buildsignal.com/api/webhooks/stripe` → JSON
- `GET https://app.buildsignal.com/` → HTML (SPA)

## License

Private — All rights reserved.
