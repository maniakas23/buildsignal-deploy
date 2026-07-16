/**
 * BuildSignal v1.0 — Cloudflare Pages Function Entry Point
 * Full Hono app with health endpoints, tRPC, auth, Stripe, and monitoring.
 */

import type { PagesFunction } from "@cloudflare/workers-types";
import app from "../api/app";

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
  // Polyfill process.env from Cloudflare environment bindings
  polyfillProcessEnv(context.env);

  // Set NODE_ENV if not already set
  const g = globalThis as unknown as Record<string, unknown>;
  const proc = g.process as unknown as { env: Record<string, unknown> };
  if (!proc.env.NODE_ENV) {
    proc.env.NODE_ENV = "production";
  }

  // Route API requests through Hono, static files through Pages
  const url = new URL(context.request.url);
  if (url.pathname.startsWith("/api/") ||
      url.pathname === "/health" ||
      url.pathname === "/ready" ||
      url.pathname === "/version") {
    return app.fetch(context.request, context.env, context as any);
  }

  // Fall through to static file serving
  return context.env.ASSETS.fetch(context.request);
};