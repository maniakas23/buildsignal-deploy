import type { PagesFunction } from "@cloudflare/workers-types";
import app from "../api/app";

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
  polyfillProcessEnv(context.env);
  const g = globalThis as unknown as Record<string, unknown>;
  const proc = g.process as unknown as { env: Record<string, unknown> };
  if (!proc.env.NODE_ENV) {
    proc.env.NODE_ENV = "production";
  }
  return app.fetch(context.request, context.env, context as any);
};