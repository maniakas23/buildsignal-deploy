/**
 * BuildSignal API Gateway — v1.1.1 (Security + Revenue remediation; D1 id-binding fix)
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
 *      server-authoritative plan→price mapping.
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

async function handleCheckout(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return trpcError("Unauthorized", "UNAUTHORIZED");

  let plan;
  try {
    const body = await request.json();
    plan = body?.["0"]?.json?.plan ?? body?.["0"]?.json?.planId;
  } catch {
    return trpcError("Invalid request body", "BAD_REQUEST");
  }

  const priceId = resolvePriceId(plan, env);
  if (!priceId) {
    return trpcError("Invalid or unavailable plan", "BAD_REQUEST");
  }
  if (!env.STRIPE_SECRET_KEY) {
    return trpcError("Stripe not configured", "INTERNAL_SERVER_ERROR");
  }

  const userId = String(auth.user.id);
  const params = new URLSearchParams({
    mode: "subscription",
    success_url: "https://buildsignal.net/settings?checkout=success",
    cancel_url: "https://buildsignal.net/pricing?checkout=cancelled",
    client_reference_id: userId,
    customer_email: auth.user.email || "",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    "metadata[userId]": userId,
    "metadata[plan]": String(plan),
    "subscription_data[metadata][userId]": userId,
    "subscription_data[metadata][plan]": String(plan),
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
      return json({ error: "Gateway error" }, 502);
    }
  },
};
