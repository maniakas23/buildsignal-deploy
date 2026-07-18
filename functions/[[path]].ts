/**
 * Cloudflare Pages Function — catch-all handler.
 *
 * API routes are handled by the Hono app. All other requests fall through
 * to Cloudflare Pages static file serving (SPA + assets).
 *
 * Route matching:
 *   /health           → Health check (JSON)
 *   /ready            → Readiness probe (JSON, 200 or 503)
 *   /version          → Build/version info (JSON)
 *   /api/*            → OAuth, Stripe webhooks, tRPC, 404s
 *   /*                → Static files / SPA fallback
 */

import type { PagesFunction } from "@cloudflare/workers-types";
import { setD1Binding } from "../api/queries/connection";

/** API route prefixes — matched against incoming request paths. */
const API_PREFIXES = ["/health", "/ready", "/version", "/api/", "/cron/"];

/** Check if a path should be handled by the API server. */
function isApiRoute(path: string): boolean {
  return API_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
}

/**
 * Polyfill process.env for modules that depend on it (api/lib/env.ts,
 * stripe-router, etc.). Cloudflare Workers don't have process.env natively —
 * environment variables are passed as bindings via the context object.
 */
function polyfillProcessEnv(cfEnv: Record<string, unknown>) {
  const g = globalThis as unknown as Record<string, unknown>;
  if (!g.process) {
    g.process = { env: {} } as unknown as NodeJS.Process;
  }
  const proc = g.process as unknown as { env: Record<string, unknown> };
  if (!proc.env) {
    proc.env = {};
  }
  for (const [key, value] of Object.entries(cfEnv)) {
    if (typeof value === "string" && !proc.env[key]) {
      proc.env[key] = value;
    }
  }
}

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);

  // --- Static assets / SPA: fall through to Cloudflare Pages ---
  if (!isApiRoute(url.pathname)) {
    return context.env.ASSETS.fetch(context.request);
  }

  // --- API routes: polyfill env, then route through Hono ---
  polyfillProcessEnv(context.env);

  // Bind D1 database if available (Cloudflare D1)
  const dbBinding = (context.env as Record<string, unknown>).DB as D1Database | undefined;
  if (dbBinding) {
    // Store on globalThis so api/ chunk (separate bundler chunk) can access it
    (globalThis as unknown as Record<string, unknown>).__D1_BINDING__ = dbBinding;
    setD1Binding(dbBinding);
  }

  // Force NODE_ENV to production BEFORE importing app modules
  const g = globalThis as unknown as Record<string, unknown>;
  const proc = g.process as unknown as { env: Record<string, unknown> };
  proc.env.NODE_ENV = "production";

  // Dynamic import so env polyfill runs BEFORE api/lib/env.ts evaluates isProduction
  const { default: app } = await import("../api/app");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return app.fetch(context.request, context.env, context as any);
};
