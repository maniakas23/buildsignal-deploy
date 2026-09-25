/**
 * BuildSignal API Gateway — v1.1.1-diag (Security + Revenue remediation; D1 id-binding fix)
 *
 * Sits on route api.buildsignal.net/* in front of the legacy `buildsignal-worker`
 * (bound as service binding ORIGIN). Responsibilities:
 *
 *   1. AUTHZ — close IDOR on per-user endpoints (/api/v1/alerts/*, /api/v1/onboarding/*).
 *      Authenticated JWT identity is authoritative; client-supplied userId is
 *      rejected when it does not match the token subject.
 *   2. OPS LOCKDOWN — /api/v1/ops/* and /api/v1/conversion/funnel require an
 *      admin JWT or the internal X-Ops-Key shared secret.
 *   3. BILLING — intercept billing.createCheckout / stripe.createCheckoutSession
 *      and create real Stripe Checkout sessions via the Stripe REST API with
 *      server-authoritative plan→price mapping. m1(32): also serves
 *      stripe.getSubscription with the current Stripe API shape, reuses the
 *      organization's Stripe customer, and blocks duplicate live subscriptions.
 *   4. ENTITLEMENTS — server-side plan gates (watchlist.create requires Pro+).
 *   5. COMPLIANCE — auth.deleteAccount: narrow self-service account deletion.
 *
 * Everything else is proxied unchanged to the origin worker.
 */

const PER_USER_PATHS = new Set([
  "/api/v1/alerts/status",
  "/api/v1/alerts/configure",
  "/api/v1/onboarding/status",
  "/api/v1/onboarding/track",
]);

const CHECKOUT_PATHS = new Set([
  "/api/trpc/billing.createCheckout",
  "/api/trpc/stripe.createCheckoutSession",
]);

// Plan-gated procedures: plan id -> minimum required plan rank
const PLAN_RANK = { starter: 0, scout: 0, professional: 1, pro: 1, business: 2, enterprise: 3 };
const GATED_PROCEDURES = new Map([
  ["/api/trpc/watchlist.create", { minRank: 1, message: "Watchlists require Pro or higher" }],
]);

const DELETE_ACCOUNT_PATH = "/api/trpc/auth.deleteAccount";
const GET_SUBSCRIPTION_PATH = "/api/trpc/stripe.getSubscription";

const ORIGIN_BASE = "https://api.buildsignal.net";

// Per-isolate short-lived cache: token -> { user, expires }
const authCache = new Map();
const AUTH_CACHE_TTL_MS = 60_000;

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

function trpcError(message, code) {
  // Mirror the legacy worker's tRPC batch error envelope (HTTP 200)
  return json([{ error: { message, code } }], 200);
}

async function authenticate(request, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { ok: false };
  }
  const token = authHeader.slice(7);
  const cached = authCache.get(token);
  if (cached && cached.expires > Date.now()) {
    return { ok: true, user: cached.user };
  }
  try {
    const resp = await env.ORIGIN.fetch(
      new Request(`${ORIGIN_BASE}/api/trpc/auth.me?batch=1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ "0": { json: null } }),
      })
    );
    const data = await resp.json();
    const user = data?.[0]?.result?.data;
    if (!user || user.id == null) return { ok: false };
    authCache.set(token, { user, expires: Date.now() + AUTH_CACHE_TTL_MS });
    // Prevent unbounded growth
    if (authCache.size > 5000) authCache.clear();
    return { ok: true, user };
  } catch {
    return { ok: false };
  }
}

async function handlePerUser(request, env, url) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return json({ error: "Unauthorized" }, 401);

  const authId = String(auth.user.id);
  const suppliedQuery = url.searchParams.get("userId");

  // Inspect body userId for POST/PUT without consuming the original body
  let suppliedBody = null;
  let bodyText = null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    bodyText = await request.text();
    try {
      const parsed = JSON.parse(bodyText);
      if (parsed && parsed.userId != null) suppliedBody = String(parsed.userId);
    } catch {
      /* non-JSON body — origin will handle */
    }
  }

  const supplied = suppliedQuery ?? suppliedBody;
  if (supplied != null && supplied !== authId) {
    // Do not reveal whether the other user's resource exists
    return json({ error: "Forbidden" }, 403);
  }

  // Force authoritative identity in the forwarded request
  url.searchParams.set("userId", authId);
  const fwd = new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: bodyText ?? undefined,
  });
  return env.ORIGIN.fetch(fwd);
}

async function handleOps(request, env) {
  // Internal shared-secret path (Operations Center / cron tooling)
  const opsKey = request.headers.get("X-Ops-Key");
  if (env.OPS_KEY && opsKey && opsKey === env.OPS_KEY) {
    return env.ORIGIN.fetch(request);
  }
  // Admin JWT path
  const auth = await authenticate(request, env);
  if (!auth.ok) return json({ error: "Unauthorized" }, 401);
  if (!auth.user.isAdmin) return json({ error: "Forbidden" }, 403);
  return env.ORIGIN.fetch(request);
}

function resolvePriceId(plan, env) {
  const map = {
    starter: env.STRIPE_PRICE_SCOUT, // starter = internal id for Scout
    scout: env.STRIPE_PRICE_SCOUT,
    professional: env.STRIPE_PRICE_PRO,
    pro: env.STRIPE_PRICE_PRO,
    business: env.STRIPE_PRICE_BUSINESS,
  };
  return map[String(plan || "").toLowerCase()] || null;
}

// m1(31): certified BuildSignal trial contract, ported to the production
// checkout authority (this gateway). Pure + exported so contract tests can
// verify the exact Stripe request deterministically — no live Stripe calls.
const CHECKOUT_RETURN_ORIGIN = "https://buildsignal.net";

function safeReturnUrl(candidate, fallback) {
  try {
    const u = new URL(String(candidate || ""));
    if (u.protocol === "https:" && (u.hostname === "buildsignal.net" || u.hostname.endsWith(".buildsignal.net"))) {
      return u.toString();
    }
  } catch { /* fall through */ }
  return fallback;
}

export function buildCheckoutParams({ plan, priceId, userId, email, customerId, successUrl, cancelUrl }) {
  // m1(32): when the organization already has a Stripe customer (linked by a
  // prior checkout's webhook), reuse it. Passing only customer_email made
  // Stripe create a NEW customer (and thus a parallel subscription) on every
  // retry — the founder retry produced 3 customers / 3 trialing subscriptions.
  const params = {
    mode: "subscription",
    success_url: safeReturnUrl(successUrl, CHECKOUT_RETURN_ORIGIN + "/billing?upgraded=1"),
    cancel_url: safeReturnUrl(cancelUrl, CHECKOUT_RETURN_ORIGIN + "/pricing"),
    client_reference_id: userId,
  };
  if (customerId) {
    params.customer = customerId;
  } else {
    params.customer_email = email || "";
  }
  return new URLSearchParams({
    ...params,
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    "metadata[userId]": userId,
    "metadata[plan]": String(plan),
    "subscription_data[metadata][userId]": userId,
    "subscription_data[metadata][plan]": String(plan),
    // Certified 14-day trial: card optional at enrollment, $0 due today,
    // no payment method at trial end -> subscription cancels (never charged).
    "subscription_data[trial_period_days]": "14",
    "subscription_data[trial_settings][end_behavior][missing_payment_method]": "cancel",
    payment_method_collection: "if_required",
    billing_address_collection: "required",
    "automatic_tax[enabled]": "true",
  });
}

// ---------------------------------------------------------------------------
// m1(32): post-checkout sync remediation.
//
// Incident: the founder completed the first real Scout trial. Stripe, the
// webhook, and D1 all recorded it correctly (organizations.stripeCustomerId /
// stripeSubscriptionId set, status 'trialing'), yet /billing showed
// "No Subscription". Root cause: the legacy worker's stripe.getSubscription
// reads subscriptions via the removed nested endpoint
// GET /v1/customers/{id}/subscriptions (gone from current API versions) and
// reads current_period_end off the Subscription object (moved to
// items.data[].current_period_end since API 2025-03-31.basil). Both failure
// modes collapse to { status: "inactive" } / null period end.
//
// The gateway (production authority) now serves this read directly: org-owned
// billing context from D1, canonical GET /v1/subscriptions?customer=... list,
// and item-level period fields. Same response envelope as the legacy handler.

// Resolve the ORGANIZATION that owns billing for this user. Mirrors the
// worker's resolveBillingContext: org is authoritative, matched by the
// owner's unionId, oldest org first. Reads only — never writes.
async function resolveOrgBillingContext(env, userId) {
  if (!env.DB || !userId) return { ok: false };
  const u = await env.DB.prepare("SELECT id, unionId, email FROM users WHERE id = ?")
    .bind(String(userId)).first();
  if (!u) return { ok: false };
  const org = await env.DB.prepare(
    "SELECT id, stripeCustomerId, stripeSubscriptionId, plan, status FROM organizations WHERE ownerUnionId = ? ORDER BY createdAt ASC LIMIT 1"
  ).bind(u.unionId).first();
  return {
    ok: true,
    userId: u.id,
    unionId: u.unionId,
    email: u.email,
    orgId: org ? org.id : null,
    stripeCustomerId: org ? org.stripeCustomerId : null,
    stripeSubscriptionId: org ? org.stripeSubscriptionId : null,
    plan: org && org.plan ? normalizePlanRead(org.plan) : null,
    orgStatus: org ? org.status : null,
  };
}

function normalizePlanRead(plan) {
  if (plan === "pro") return "professional"; // historical read-compat alias
  return plan || null;
}

// Server-authoritative reverse price map from env (no hard-coded price IDs).
export function resolvePlanFromPriceEnv(env, priceId, lookupKey) {
  const byId = {
    [env.STRIPE_PRICE_SCOUT]: "starter", // starter = internal id for Scout
    [env.STRIPE_PRICE_PRO]: "professional",
    [env.STRIPE_PRICE_BUSINESS]: "business",
  };
  if (priceId && byId[priceId]) return byId[priceId];
  const byLookup = { starter: "starter", professional: "professional", business: "business", enterprise: "enterprise" };
  if (lookupKey && byLookup[lookupKey]) return byLookup[lookupKey];
  return null;
}

// Project a Stripe Subscription object into the /billing view model.
// current_period_end lives on the subscription ITEM since API 2025-03-31.basil;
// tolerate the legacy top-level field for older API defaults.
export function extractSubscriptionView(sub, env, fallbackPlan) {
  const fallback = normalizePlanRead(fallbackPlan);
  if (!sub) {
    return { status: "inactive", currentPeriodEnd: null, cancelAtPeriodEnd: false, plan: fallback ?? null };
  }
  const item = sub.items && sub.items.data && sub.items.data[0];
  const plan = resolvePlanFromPriceEnv(env, item?.price?.id, item?.price?.lookup_key) || fallback || null;
  return {
    status: sub.status || "inactive",
    currentPeriodEnd: (item && item.current_period_end) ?? sub.current_period_end ?? null,
    cancelAtPeriodEnd: !!sub.cancel_at_period_end,
    plan,
  };
}

// A customer must never hold two live subscriptions. Retries while /billing
// was broken produced 3 parallel trialing subscriptions; this guard fails
// closed before creating another Checkout Session.
export function findBlockingSubscription(subs) {
  const BLOCKING = new Set(["trialing", "active", "past_due", "unpaid", "incomplete"]);
  return (subs || []).find((s) => s && BLOCKING.has(s.status)) || null;
}

async function listSubscriptions(env, customerId, limit) {
  const resp = await fetch(
    "https://api.stripe.com/v1/subscriptions?customer=" + encodeURIComponent(customerId) + "&status=all&limit=" + limit,
    { headers: { Authorization: "Bearer " + env.STRIPE_SECRET_KEY } }
  );
  if (!resp.ok) return null;
  const data = await resp.json();
  return Array.isArray(data.data) ? data.data : [];
}

async function handleGetSubscription(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return trpcError("Unauthorized", "UNAUTHORIZED");
  try {
    if (!env.STRIPE_SECRET_KEY) return json([{ result: { data: { status: "inactive" } } }]);
    const ctx = await resolveOrgBillingContext(env, auth.user.id);
    if (!ctx.ok) return trpcError("Unauthorized", "UNAUTHORIZED");
    if (!ctx.stripeCustomerId) {
      return json([{ result: { data: { status: "inactive", plan: ctx.plan || "starter" } } }]);
    }
    const subs = await listSubscriptions(env, ctx.stripeCustomerId, 1);
    if (subs === null) {
      return json([{ result: { data: { status: "inactive", plan: ctx.plan || "starter" } } }]);
    }
    const view = extractSubscriptionView(subs[0] || null, env, ctx.plan || "starter");
    return json([{ result: { data: view } }]);
  } catch (err) {
    return json([{ result: { data: { status: "inactive" } } }]);
  }
}

async function handleCheckout(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return trpcError("Unauthorized", "UNAUTHORIZED");

  let plan, successUrl, cancelUrl;
  try {
    const body = await request.json();
    plan = body?.["0"]?.json?.plan ?? body?.["0"]?.json?.planId;
    successUrl = body?.["0"]?.json?.successUrl;
    cancelUrl = body?.["0"]?.json?.cancelUrl;
  } catch {
    return trpcError("Invalid request body", "BAD_REQUEST");
  }

  const priceId = resolvePriceId(plan, env);
  if (!priceId) {
    // Enterprise has no price mapping — self-service Checkout is impossible.
    return trpcError("Invalid or unavailable plan", "BAD_REQUEST");
  }
  if (!env.STRIPE_SECRET_KEY) {
    return trpcError("Stripe not configured", "INTERNAL_SERVER_ERROR");
  }

  const userId = String(auth.user.id);

  // m1(32): reuse the organization's existing Stripe customer and refuse to
  // stack a second live subscription on it.
  let existingCustomerId = null;
  if (env.DB) {
    try {
      const ctx = await resolveOrgBillingContext(env, auth.user.id);
      if (ctx.ok) existingCustomerId = ctx.stripeCustomerId || null;
    } catch { /* resolver failure must not block checkout */ }
  }
  if (existingCustomerId) {
    try {
      const subs = await listSubscriptions(env, existingCustomerId, 10);
      const blocking = subs && findBlockingSubscription(subs);
      if (blocking) {
        return trpcError(
          "An active or trialing subscription already exists for this account. Use Manage Billing on the Billing page instead.",
          "CONFLICT"
        );
      }
    } catch { /* Stripe read failure must not block checkout */ }
  }

  const params = buildCheckoutParams({
    plan, priceId, userId,
    email: auth.user.email,
    customerId: existingCustomerId || undefined,
    successUrl, cancelUrl,
  });

  let session;
  try {
    const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    session = await resp.json();
    if (!resp.ok) {
      return trpcError(
        session?.error?.message || "Stripe checkout failed",
        "INTERNAL_SERVER_ERROR"
      );
    }
  } catch (err) {
    return trpcError("Stripe unreachable", "INTERNAL_SERVER_ERROR");
  }

  return json([
    { result: { data: { checkoutUrl: session.url, sessionId: session.id } } },
  ]);
}

async function handlePlanGate(request, env, gate) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return trpcError("Unauthorized", "UNAUTHORIZED");
  const rank = PLAN_RANK[String(auth.user.plan || "starter").toLowerCase()] ?? 0;
  if (rank < gate.minRank) {
    return trpcError(gate.message, "FORBIDDEN");
  }
  return env.ORIGIN.fetch(request);
}

// Narrow self-service account deletion (customer data-rights path).
// Deletes ONLY the authenticated user's own records; single-owner orgs are
// removed with them. Never touches other tenants' data.
async function handleDeleteAccount(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return trpcError("Unauthorized", "UNAUTHORIZED");
  if (!env.DB) return trpcError("Account deletion unavailable", "INTERNAL_SERVER_ERROR");

  // D1 bound parameters do not receive column-affinity coercion: bind the id
  // as a string so it matches both TEXT and INTEGER user-id columns.
  const uid = String(auth.user.id);
  const run = (sql, params) => env.DB.prepare(sql).bind(...params).run();

  try {
    const memberRows = await env.DB.prepare(
      "SELECT orgId FROM org_members WHERE userId = ?"
    ).bind(uid).all();
    const orgIds = (memberRows.results || []).map((r) => r.orgId);

    await run("DELETE FROM alert_config WHERE userId = ?", [uid]);
    await run("DELETE FROM alerts WHERE user_id = ?", [uid]);
    await run("DELETE FROM notifications WHERE userId = ?", [uid]);
    await run("DELETE FROM notification_prefs WHERE userId = ?", [uid]);
    await run("DELETE FROM onboarding_tracking WHERE userId = ?", [uid]);
    await run("DELETE FROM conversion_events WHERE userId = ?", [uid]);
    await run("DELETE FROM saved_areas WHERE userId = ?", [uid]);
    await run("DELETE FROM watchlists WHERE userId = ?", [uid]);
    await run("DELETE FROM reports WHERE userId = ?", [uid]);
    await run("DELETE FROM webpush_subscriptions WHERE userId = ?", [uid]);
    await run("DELETE FROM org_members WHERE userId = ?", [uid]);

    const deletedOrgs = [];
    for (const orgId of orgIds) {
      const remaining = await env.DB.prepare(
        "SELECT COUNT(*) AS n FROM org_members WHERE orgId = ?"
      ).bind(orgId).first();
      if ((remaining?.n ?? 0) === 0) {
        await run(
          "DELETE FROM organizations WHERE id = ? AND ownerId = ? AND stripe_subscription_id IS NULL",
          [orgId, uid]
        );
        deletedOrgs.push(orgId);
      }
    }

    await run("DELETE FROM users WHERE id = ?", [uid]);
    return json([{ result: { data: { success: true, deletedOrganizations: deletedOrgs } } }]);
  } catch (err) {
    return trpcError("Account deletion failed", "INTERNAL_SERVER_ERROR");
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight: origin owns CORS policy
    if (request.method === "OPTIONS") {
      return env.ORIGIN.fetch(request);
    }

    try {
      // Revenue: real Stripe Checkout sessions
      if (CHECKOUT_PATHS.has(path) && request.method === "POST") {
        return await handleCheckout(request, env);
      }

      // m1(32): subscription read with current Stripe API shape
      if (path === GET_SUBSCRIPTION_PATH && request.method === "POST") {
        return await handleGetSubscription(request, env);
      }

      // Compliance: self-service account deletion
      if (path === DELETE_ACCOUNT_PATH && request.method === "POST") {
        return await handleDeleteAccount(request, env);
      }

      // Entitlements: server-side plan gates
      const gate = GATED_PROCEDURES.get(path);
      if (gate && request.method === "POST") {
        return await handlePlanGate(request, env, gate);
      }

      // Ops lockdown: internal/commercial metrics
      if (path.startsWith("/api/v1/ops/") || path === "/api/v1/conversion/funnel") {
        return await handleOps(request, env);
      }

      // IDOR fix: per-user endpoints
      if (PER_USER_PATHS.has(path)) {
        return await handlePerUser(request, env, url);
      }

      // Everything else: unchanged passthrough
      return env.ORIGIN.fetch(request);
    } catch (err) {
      return new Response(JSON.stringify({
        error: "Gateway error",
        detail: String(err && (err.stack || err.message || err)).slice(0, 500),
        path,
      }), { status: 502, headers: { "Content-Type": "application/json" } });
    }
  },
};
