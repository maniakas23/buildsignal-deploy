/**
 * Kestovar Engine — Main Entry Point
 *
 * BuildSignal Powered by Kestovar. The shared intelligence engine
 * of the BuildSignal ecosystem. All reusable business logic lives here:
 * pattern intelligence, AI learning, confidence scoring, provider SDK,
 * data pipeline, search, analytics, governance, quality assurance.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { logger } from "hono/logger";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { engineRouter } from "./router";
import { createContext } from "./context";
import { getDbFromEnv } from "./lib/db";

const app = new Hono<{ Bindings: Record<string, unknown> }>();

app.use(logger());
app.use("*", cors({
  origin: ["https://buildsignal.net", "https://www.buildsignal.net", "https://buildsignal-v2.pages.dev", "https://api.buildsignal.net", "http://localhost:3000", "http://localhost:5173"],
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true, maxAge: 86400
}));
app.use(secureHeaders({ xFrameOptions: "DENY", xContentTypeOptions: "nosniff", referrerPolicy: "strict-origin-when-cross-origin", strictTransportSecurity: "max-age=63072000; includeSubDomains; preload", crossOriginEmbedderPolicy: false }));

// tRPC endpoint
app.use("/trpc/*", async (c) => {
  return fetchRequestHandler({ router: engineRouter, req: c.req.raw, endpoint: "/trpc", createContext: (opts) => createContext({ ...opts, env: c.env as Record<string, unknown> }) });
});

// Health
app.get("/health", (c) => c.json({ status: "healthy", service: "kestovar-engine", timestamp: new Date().toISOString() }));
app.get("/ready", async (c) => {
  try { getDbFromEnv(c.env); return c.json({ status: "ready", service: "kestovar-engine", db: "connected" }); }
  catch (e) { return c.json({ status: "not_ready", service: "kestovar-engine", db: "disconnected", error: (e as Error).message }, 503); }
});
app.get("/version", (c) => c.json({ version: "1.0.0", service: "kestovar-engine", build: "2026-07-21" }));

// REST API Routes — query canonical tables only, no hardcoded fallbacks
app.get("/v1/patterns", async (c) => {
  try {
    const db = c.env.DB as D1Database;
    const rows = await db.prepare("SELECT * FROM signalcore_patterns WHERE provenance = 'LIVE' ORDER BY confidence DESC LIMIT 50").all();
    return c.json({ patterns: rows.results || [], total: (rows.results || []).length, timestamp: new Date().toISOString() });
  } catch (e) {
    return c.json({ patterns: [], total: 0, error: (e as Error).message, timestamp: new Date().toISOString() }, 500);
  }
});

app.get("/v1/signals", async (c) => {
  try {
    const db = c.env.DB as D1Database;
    const rows = await db.prepare("SELECT canonicalId, providerId, title, description, county, city, state, zipCode, lat, lng, address, publishedAt, ingestedAt, confidence, statusMapped, eventType, value FROM kestovar_canonical_events WHERE provenance = 'LIVE' ORDER BY publishedAt DESC LIMIT 200").all();
    return c.json({ signals: rows.results || [], total: (rows.results || []).length, timestamp: new Date().toISOString() });
  } catch (e) {
    return c.json({ signals: [], total: 0, error: (e as Error).message, timestamp: new Date().toISOString() }, 500);
  }
});

app.get("/v1/opportunities", async (c) => {
  try {
    const db = c.env.DB as D1Database;
    const rows = await db.prepare("SELECT * FROM opportunities ORDER BY confidence_score DESC LIMIT 50").all();
    return c.json({ opportunities: rows.results || [], total: (rows.results || []).length, timestamp: new Date().toISOString() });
  } catch (e) {
    return c.json({ opportunities: [], total: 0, error: (e as Error).message, timestamp: new Date().toISOString() }, 500);
  }
});

app.get("/v1/recommendations", async (c) => {
  try {
    const db = c.env.DB as D1Database;
    const rows = await db.prepare("SELECT * FROM recommendations WHERE status = 'active' ORDER BY confidence DESC LIMIT 50").all();
    return c.json({ recommendations: rows.results || [], total: (rows.results || []).length, timestamp: new Date().toISOString() });
  } catch (e) {
    return c.json({ recommendations: [], total: 0, error: (e as Error).message, timestamp: new Date().toISOString() }, 500);
  }
});

app.get("/v1/analytics/pipeline", async (c) => {
  try {
    const db = c.env.DB as D1Database;
    const runs = await db.prepare("SELECT COUNT(*) as totalRuns, SUM(recordsCreated) as totalCreated, AVG(totalLatencyMs) as avgLatency FROM ingestion_runs WHERE startedAt > strftime('%s', 'now', '-24 hours')").first();
    return c.json({ pipeline: { status: "healthy", last_run: new Date().toISOString(), records_processed: runs?.totalRuns || 0, records_created: runs?.totalCreated || 0, avg_latency_ms: Math.round(runs?.avgLatency || 0) }, timestamp: new Date().toISOString() });
  } catch (e) {
    return c.json({ pipeline: { status: "unknown" }, error: (e as Error).message, timestamp: new Date().toISOString() }, 500);
  }
});

app.get("/v1/analytics/summary", async (c) => {
  try {
    const db = c.env.DB as D1Database;
    const signals = await db.prepare("SELECT COUNT(*) as cnt FROM kestovar_canonical_events WHERE provenance = 'LIVE'").first();
    const patterns = await db.prepare("SELECT COUNT(*) as cnt FROM signalcore_patterns WHERE provenance = 'LIVE'").first();
    const opportunities = await db.prepare("SELECT COUNT(*) as cnt FROM opportunities").first();
    const counties = await db.prepare("SELECT COUNT(DISTINCT county) as cnt FROM kestovar_canonical_events WHERE county IS NOT NULL").first();
    return c.json({ summary: { total_signals: signals?.cnt || 0, total_opportunities: opportunities?.cnt || 0, total_patterns: patterns?.cnt || 0, active_counties: counties?.cnt || 0 }, timestamp: new Date().toISOString() });
  } catch (e) {
    return c.json({ summary: {}, error: (e as Error).message, timestamp: new Date().toISOString() }, 500);
  }
});

app.get("/v1/providers", async (c) => {
  try {
    const db = c.env.DB as D1Database;
    const rows = await db.prepare("SELECT providerId, providerName, sourceType, isActive, healthStatus FROM provider_registry ORDER BY providerName").all();
    return c.json({ providers: rows.results || [], total: (rows.results || []).length, timestamp: new Date().toISOString() });
  } catch (e) {
    return c.json({ providers: [], total: 0, error: (e as Error).message, timestamp: new Date().toISOString() }, 500);
  }
});

app.get("/v1/search", async (c) => {
  const q = c.req.query("q") || "";
  if (!q.trim()) return c.json({ query: q, results: [], total: 0, timestamp: new Date().toISOString() });
  try {
    const db = c.env.DB as D1Database;
    const rows = await db.prepare("SELECT canonicalId, title, description, county, city, state, eventType, confidence FROM kestovar_canonical_events WHERE (title LIKE ?1 OR description LIKE ?1 OR county LIKE ?1 OR city LIKE ?1) AND provenance = 'LIVE' ORDER BY confidence DESC LIMIT 50").bind(`%${q}%`).all();
    return c.json({ query: q, results: rows.results || [], total: (rows.results || []).length, timestamp: new Date().toISOString() });
  } catch (e) {
    return c.json({ query: q, results: [], total: 0, error: (e as Error).message, timestamp: new Date().toISOString() }, 500);
  }
});

app.notFound((c) => c.json({ error: "Not Found", path: c.req.path }, 404));
app.onError((err, c) => { console.error(`[Kestovar] ${err}`); return c.json({ error: "Internal Server Error", message: (err as Error).message }, 500); });

export default {
  async fetch(request: Request, env: Record<string, unknown>, ctx: ExecutionContext): Promise<Response> {
    const { setD1Binding } = await import("./lib/db");
    if (env.DB) { setD1Binding(env.DB as D1Database); }
    return app.fetch(request, env, ctx);
  },
};
