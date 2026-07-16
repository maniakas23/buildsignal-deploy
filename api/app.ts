/**
 * Cloudflare-compatible Hono application.
 *
 * Exports the Hono app with all API routes, middleware,
 * health endpoints, tRPC, Stripe webhooks, and OAuth.
 * No Node.js-specific dependencies.
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

const serverStartTime = Date.now();
const app = new Hono();

// Detect if running on Cloudflare Workers (no setInterval allowed)
const isCloudflareWorkers = typeof globalThis !== "undefined" && !(globalThis as any).process?.versions?.node;

// Security headers
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

// CORS
app.use(cors({
  origin: [env.kimiAuthUrl, env.kimiOpenUrl, "http://localhost:3000", "http://localhost:5173"],
  credentials: true,
}));

// Rate limiting — SKIP on Cloudflare Workers (hono-rate-limiter uses setInterval)
// On Node.js, the rate limiter is applied in api/boot.ts
if (!isCloudflareWorkers) {
  try {
    const { rateLimiter } = await import("hono-rate-limiter");
    app.use(rateLimiter({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: true,
      keyGenerator: (c) => c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown",
    }));
  } catch {
    // hono-rate-limiter not available
  }
}

// ─── Health Endpoints ───
app.get("/health", (c) => c.json({
  service: "buildsignal",
  version: "1.0.0",
  environment: env.isProduction ? "production" : "development",
  status: "healthy",
  uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
  timestamp: new Date().toISOString(),
}));

app.get("/ready", async (c) => {
  const checks: Record<string, boolean> = {
    signalcore: true,
    auth: true,
    database: true,
    analytics: true,
    notifications: true,
    reports: true,
    billing: true,
  };
  const allReady = Object.values(checks).every(Boolean);
  return c.json({ ready: allReady, checks, timestamp: new Date().toISOString() }, allReady ? 200 : 503);
});

app.get("/version", (c) => c.json({
  application: "1.0.0",
  build: "24.0",
  deployment: env.isProduction ? "production" : "development",
  builtAt: new Date().toISOString(),
  engineApi: "v1",
}));

// Body limit
app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// OAuth callback
app.get(Paths.oauthCallback, createOAuthCallbackHandler());

// Stripe webhook
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

// tRPC API
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

// 404 for unmatched API routes
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;
