#!/usr/bin/env bash
# BuildSignal API Gateway — production security regression suite.
# Run after EVERY gateway deploy. Requires: curl, python3.
# Usage: BASE=https://api.buildsignal.net OPS_KEY=... ./regression.sh
set -u
BASE="${BASE:-https://api.buildsignal.net}"
PASS=0; FAIL=0
chk() { # chk <name> <expected> <actual>
  if [ "$2" = "$3" ]; then PASS=$((PASS+1)); echo "PASS  $1"; else FAIL=$((FAIL+1)); echo "FAIL  $1 (expected $2, got $3)"; fi
}
code() { curl -s -o /dev/null -w "%{http_code}" "$@"; }

# --- 1. IDOR lockdown on per-user endpoints ---
chk "alerts/status unauth -> 401" 401 "$(code "$BASE/api/v1/alerts/status?userId=1")"
chk "alerts/configure unauth -> 401" 401 "$(code -X POST -H 'Content-Type: application/json' "$BASE/api/v1/alerts/configure" -d '{"userId":1}')"
chk "onboarding/status unauth -> 401" 401 "$(code "$BASE/api/v1/onboarding/status?userId=1")"
chk "onboarding/track unauth -> 401" 401 "$(code -X POST -H 'Content-Type: application/json' "$BASE/api/v1/onboarding/track" -d '{"userId":1}')"

# --- 2. Ops lockdown ---
chk "ops/metrics unauth -> 401" 401 "$(code "$BASE/api/v1/ops/metrics")"
chk "ops/metrics bad key -> 401" 401 "$(code -H 'X-Ops-Key: wrong' "$BASE/api/v1/ops/metrics")"
if [ -n "${OPS_KEY:-}" ]; then
  chk "ops/metrics valid key -> 200" 200 "$(code -H "X-Ops-Key: $OPS_KEY" "$BASE/api/v1/ops/metrics")"
fi
chk "conversion/funnel unauth -> 401" 401 "$(code "$BASE/api/v1/conversion/funnel")"

# --- 3. Tenant isolation with two live users ---
TS=$(date +%s)
EA="reg-a-${TS}@buildsignal.test"; EB="reg-b-${TS}@buildsignal.test"
reg() { curl -s -X POST "$BASE/api/trpc/auth.register?batch=1" -H 'Content-Type: application/json' -d "{\"0\":{\"json\":{\"email\":\"$1\",\"password\":\"RegTest!2026\",\"name\":\"Reg\"}}}"; }
login() { curl -s -X POST "$BASE/api/trpc/auth.login?batch=1" -H 'Content-Type: application/json' -d "{\"0\":{\"json\":{\"email\":\"$1\",\"password\":\"RegTest!2026\"}}}"; }
IDA=$(reg "$EA" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["result"]["data"]["userId"])')
IDB=$(reg "$EB" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["result"]["data"]["userId"])')
TA=$(login "$EA" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["result"]["data"]["token"])')
TB=$(login "$EB" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["result"]["data"]["token"])')

chk "A reads A -> 200" 200 "$(code -H "Authorization: Bearer $TA" "$BASE/api/v1/alerts/status?userId=$IDA")"
chk "A reads B -> 403" 403 "$(code -H "Authorization: Bearer $TA" "$BASE/api/v1/alerts/status?userId=$IDB")"
chk "B writes A -> 403" 403 "$(code -X POST -H "Authorization: Bearer $TB" -H 'Content-Type: application/json' "$BASE/api/v1/alerts/configure" -d "{\"userId\":$IDA}")"
chk "invalid JWT -> 401" 401 "$(code -H 'Authorization: Bearer garbage' "$BASE/api/v1/alerts/status?userId=$IDA")"
chk "non-admin ops JWT -> 403" 403 "$(code -H "Authorization: Bearer $TA" "$BASE/api/v1/ops/metrics")"

# --- 4. Entitlements: watchlist gate ---
WL=$(curl -s -X POST "$BASE/api/trpc/watchlist.create?batch=1" -H "Authorization: Bearer $TA" -H 'Content-Type: application/json' -d '{"0":{"json":{"name":"reg"}}}')
echo "$WL" | grep -q 'FORBIDDEN' && chk "starter watchlist.create FORBIDDEN" yes yes || chk "starter watchlist.create FORBIDDEN" yes no

# --- 5. Checkout guards (Stripe secrets not required for these) ---
chk "checkout unauth -> envelope" 200 "$(code -X POST -H 'Content-Type: application/json' "$BASE/api/trpc/billing.createCheckout?batch=1" -d '{"0":{"json":{"plan":"starter"}}}')"
CO=$(curl -s -X POST "$BASE/api/trpc/billing.createCheckout?batch=1" -H "Authorization: Bearer $TA" -H 'Content-Type: application/json' -d '{"0":{"json":{"plan":"bogus"}}}')
echo "$CO" | grep -q 'BAD_REQUEST' && chk "checkout bogus plan BAD_REQUEST" yes yes || chk "checkout bogus plan BAD_REQUEST" yes no

# --- 6. Passthrough intact ---
chk "health -> 200" 200 "$(code "$BASE/health")"
chk "signals -> 200" 200 "$(code "$BASE/api/v1/signals?limit=1")"
chk "search -> 200" 200 "$(code "$BASE/api/v1/search?q=wake")"
AM=$(curl -s -X POST "$BASE/api/trpc/auth.me?batch=1" -H "Authorization: Bearer $TA" -H 'Content-Type: application/json' -d '{"0":{"json":{}}}')
echo "$AM" | grep -q "\"id\":$IDA" && chk "auth.me passthrough" yes yes || chk "auth.me passthrough" yes no

# --- 7. Self-service account deletion (cleans up both test users) ---
for U in "$IDA:$TA" "$IDB:$TB"; do
  UID2="${U%%:*}"; T="${U##*:}"
  curl -s -X POST "$BASE/api/v1/alerts/configure" -H "Authorization: Bearer $T" -H 'Content-Type: application/json' -d "{\"userId\":$UID2,\"minScore\":1}" > /dev/null
  DL=$(curl -s -X POST "$BASE/api/trpc/auth.deleteAccount?batch=1" -H "Authorization: Bearer $T" -H 'Content-Type: application/json' -d '{"0":{"json":{}}}')
  echo "$DL" | grep -q '"success":true' && chk "deleteAccount user $UID2" yes yes || chk "deleteAccount user $UID2" yes no
  AM2=$(curl -s -X POST "$BASE/api/trpc/auth.me?batch=1" -H "Authorization: Bearer $T" -H 'Content-Type: application/json' -d '{"0":{"json":{}}}')
  echo "$AM2" | grep -q 'UNAUTHORIZED' && chk "token revoked user $UID2" yes yes || chk "token revoked user $UID2" yes no
done

echo "----------------------------------------"
echo "PASS=$PASS FAIL=$FAIL"
[ "$FAIL" = 0 ]
