/**
 * Shared handler for all API Functions.
 * Polyfills process.env and routes through the Hono app.
 */

import type { PagesFunction } from "@cloudflare/workers-types";

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

export const handleApi: PagesFunction = async (context) => {
  polyfillProcessEnv(context.env);

  const g = globalThis as unknown as Record<string, unknown>;
  const proc = g.process as unknown as { env: Record<string, unknown> };
  proc.env.NODE_ENV = "production";

  const { default: app } = await import("../../api/app");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return app.fetch(context.request, context.env, context as any);
};
