/**
 * BuildSignal API — Cloudflare Worker Entry Point
 *
 * This is the dedicated Worker entry point for api.buildsignal.net.
 * It imports the Hono app from app.ts and runs it with Cloudflare
 * Workers env bindings.
 */

import { setD1Binding } from "./queries/connection";

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

// CORS headers for preflight and actual requests
function corsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
  };
}

const ALLOWED_ORIGINS = [
  "https://buildsignal.net",
  "https://www.buildsignal.net",
  "https://buildsignal-v2.pages.dev",
  "http://localhost:3000",
  "http://localhost:5173",
];

function getOrigin(request: Request): string | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  // Allow any buildsignal-v2.pages.dev subdomain
  if (origin.endsWith(".buildsignal-v2.pages.dev")) return origin;
  return null;
}

export default {
  async fetch(request: Request, env: Record<string, unknown>, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight
    const origin = getOrigin(request);
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: origin ? corsHeaders(origin) : {},
      });
    }

    polyfillProcessEnv(env);

    const g = globalThis as unknown as Record<string, unknown>;
    const proc = g.process as unknown as { env: Record<string, unknown> };
    proc.env.NODE_ENV = "production";

    const dbBinding = env.DB as D1Database | undefined;
    if (dbBinding) {
      (globalThis as unknown as Record<string, unknown>).__D1_BINDING__ = dbBinding;
      setD1Binding(dbBinding);
    }

    const { default: app } = await import("./app");
    const response = await app.fetch(request, env, ctx);

    // Add CORS headers to the response
    if (origin) {
      const headers = corsHeaders(origin);
      for (const [key, value] of Object.entries(headers)) {
        (response.headers as Headers).set(key, value);
      }
    }
    return response;
  },
};
