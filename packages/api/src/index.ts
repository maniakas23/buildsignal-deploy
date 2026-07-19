/**
 * BuildSignal API — Cloudflare Worker Entry Point
 *
 * This is the dedicated Worker entry point for api.buildsignal.com.
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

export default {
  async fetch(request: Request, env: Record<string, unknown>, ctx: ExecutionContext): Promise<Response> {
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
    return app.fetch(request, env, ctx);
  },
};
