/**
 * Cloudflare-compatible Hono application.
 */

import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { handleStripeWebhook } from "./stripe-router";
import { Paths } from "@contracts/constants";
import { getDb } from "./queries/connection";
import { sql } from "drizzle-orm";

const serverStartTime = Date.now();
const app = new Hono();

app.use(secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", env.kimiAuthUrl, env.kimiOpenUrl],
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: [env.kimiAuthUrl, env.kimiOpenUrl, "http://localhost:3000", "http://localhost:5173"],
  credentials: true,
}));

// ─── Health Endpoints ───

app.get("/health", (c) => c.json({
  service: "buildsignal",
  version: "1.0.0",
  environment: env.isProduction ? "production" : "development",
  status: "healthy",
  uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
  timestamp: new Date().toISOString(),
}));

interface CheckResult {
  status: "passed" | "failed" | "degraded";
  latencyMs?: number;
  detail?: string;
}

app.get("/ready", async (c) => {
  const checks: Record<string, CheckResult> = {};

  // 1. Database configuration
  const dbStart = Date.now();
  if (!env.databaseUrl) {
    checks.database = { status: "failed", detail: "DATABASE_URL not configured" };
  } else {
    try {
      const db = getDb();
      await db.select({ one: sql`1` });
      checks.database = { status: "passed", latencyMs: Date.now() - dbStart };
    } catch {
      checks.database = { status: "failed", latencyMs: Date.now() - dbStart, detail: "Query failed" };
    }
  }

  // 2. Authentication configuration
  if (!env.appId || !env.appSecret) {
    checks.authentication = { status: "failed", detail: "APP_ID or APP_SECRET not configured" };
  } else {
    checks.authentication = { status: "passed" };
  }

  // 3. Stripe configuration
  if (!env.stripeSecretKey) {
    checks.stripe = { status: "failed", detail: "STRIPE_SECRET_KEY not configured" };
  } else {
    checks.stripe = { status: "passed" };
  }

  // 4. SignalCore Engine connectivity
  const engineStart = Date.now();
  try {
    const engineResp = await fetch(`${env.kimiOpenUrl}/v1/health`, { method: "GET" });
    if (engineResp.ok) {
      checks.signalCoreEngine = { status: "passed", latencyMs: Date.now() - engineStart };
    } else {
      checks.signalCoreEngine = { status: "degraded", latencyMs: Date.now() - engineStart, detail: `HTTP ${engineResp.status}` };
    }
  } catch {
    checks.signalCoreEngine = { status: "failed", latencyMs: Date.now() - engineStart, detail: "Unreachable" };
  }

  // 5. Billing subsystem
  checks.billing = checks.stripe.status === "passed"
    ? { status: "passed" }
    : { status: "failed", detail: "Requires Stripe" };

  // 6. Analytics persistence (database-dependent)
  checks.analytics = checks.database.status === "passed"
    ? { status: "passed" }
    : { status: "failed", detail: "Requires database" };

  // 7. Reports subsystem (database-dependent)
  checks.reports = checks.database.status === "passed"
    ? { status: "passed" }
    : { status: "failed", detail: "Requires database" };

  const allReady = Object.values(checks).every((c) => c.status === "passed");
  return c.json(
    { ready: allReady, checks, timestamp: new Date().toISOString() },
    allReady ? 200 : 503,
  );
});

app.get("/version", (c) => c.json({
  application: "1.0.0",
  build: "24.0",
  deployment: env.isProduction ? "production" : "development",
  builtAt: new Date().toISOString(),
  engineApi: "v1",
}));

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.get(Paths.oauthCallback, createOAuthCallbackHandler());

app.post("/api/webhooks/stripe", async (c) => {
  try {
    const body = await c.req.text();
    const signature = c.req.header("stripe-signature") ?? "";
    const result = await handleStripeWebhook(body, signature);
    return c.json(result);
  } catch {
    return c.json({ error: "Webhook processing failed" }, 400);
  }
});

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;
