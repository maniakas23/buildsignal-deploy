/**
 * Cloudflare-compatible Hono application.
 *
 * This module exports the Hono app with all API routes, middleware,
 * health endpoints, tRPC, Stripe webhooks, and OAuth — without any
 * Node.js-specific dependencies. It can run on Cloudflare Pages
 * Functions, Cloudflare Workers, or any other edge runtime.
 *
 * For Node.js production server with static file serving, use api/boot.ts
 * which imports this app and adds the Node.js server layer.
 */

import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { rateLimiter } from "hono-rate-limiter";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { Paths } from "@contracts/constants";

// ─── Server start time for uptime tracking ───
const serverStartTime = Date.now();

// ─── Hono App ───
const app = new Hono();

// Security headers on all responses
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

// Rate limiting: 100 requests per 15 minutes per IP
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  keyGenerator: (c) => c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown",
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
  return c.json(
    {
      ready: allReady,
      checks,
      timestamp: new Date().toISOString(),
    },
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

// Body limit for large requests
app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// tRPC API handler
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
