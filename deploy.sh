#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# BuildSignal Production Deployment Script
# Deploys the separated Cloudflare stack:
#   1. API Worker (api.buildsignal.com)
#   2. SignalCore Worker (api.signalcore.buildsignal.com)
#   3. Frontend Pages (app.buildsignal.com)
# Usage: ./deploy.sh [production|preview]
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

ENVIRONMENT="${1:-production}"
echo "BuildSignal Deployment — Environment: $ENVIRONMENT"
echo ""

if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "preview" ]]; then
  echo "Invalid environment. Use: production | preview"
  exit 1
fi

echo "Step 1: Verification..."
npm run verify
echo "Verification passed"
echo ""

if [[ "$ENVIRONMENT" == "preview" ]]; then
  echo "Step 2: Applying D1 migrations to preview..."
  npx wrangler d1 migrations apply buildsignal-db-preview --remote \
    --config packages/api/wrangler.toml
  echo "Preview migrations applied"
else
  echo "Step 2: D1 migrations for PRODUCTION must be applied manually:"
  echo "   npx wrangler d1 migrations apply buildsignal-db-production --remote \\"
  echo "     --config packages/api/wrangler.toml"
  echo "   Skipping automatic migration for safety."
fi
echo ""

echo "Step 3: Deploying API Worker..."
if [[ "$ENVIRONMENT" == "preview" ]]; then
  cd packages/api && npx wrangler deploy --env preview && cd ../..
else
  cd packages/api && npx wrangler deploy && cd ../..
fi
echo "API Worker deployed"
echo ""

echo "Step 4: Verifying API health..."
API_URL="https://api.buildsignal.com"
if [[ "$ENVIRONMENT" == "preview" ]]; then
  API_URL="https://api-preview.buildsignal.com"
fi

for endpoint in "/health" "/ready" "/version"; do
  echo "   Checking $API_URL$endpoint..."
  if curl -sf "$API_URL$endpoint" > /dev/null 2>&1; then
    echo "   $endpoint OK"
  else
    echo "   $endpoint not ready yet (may need a moment)"
  fi
done
echo ""

echo "Step 5: Deploying SignalCore Worker..."
if [[ "$ENVIRONMENT" == "preview" ]]; then
  cd packages/signalcore && npx wrangler deploy --env preview && cd ../..
else
  cd packages/signalcore && npx wrangler deploy && cd ../..
fi
echo "SignalCore Worker deployed"
echo ""

echo "Step 6: Deploying Frontend to Cloudflare Pages..."
if [[ "$ENVIRONMENT" == "preview" ]]; then
  npx wrangler pages deploy packages/frontend/dist \
    --project-name buildsignal-app-production \
    --branch preview
else
  npx wrangler pages deploy packages/frontend/dist \
    --project-name buildsignal-app-production \
    --branch production
fi
echo "Frontend deployed"
echo ""

echo "Step 7: Running smoke tests..."
APP_URL="https://app.buildsignal.com"
if [[ "$ENVIRONMENT" == "preview" ]]; then
  APP_URL="https://preview.buildsignal.com"
fi

echo "   Checking $APP_URL..."
if curl -sf "$APP_URL" > /dev/null 2>&1; then
  echo "   Frontend reachable"
else
  echo "   Frontend not immediately reachable"
fi
echo ""

echo "BuildSignal $ENVIRONMENT deployment complete!"
echo ""
echo "   Frontend:   $APP_URL"
echo "   API:        $API_URL"
echo "   SignalCore: https://api.signalcore.buildsignal.com"
echo ""
