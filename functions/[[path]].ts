/**
 * Cloudflare Pages Function — catch-all handler.
 */

import type { PagesFunction } from "@cloudflare/workers-types";
import { setD1Binding } from "../api/queries/connection";

const API_PREFIXES = ["/health", "/ready", "/version", "/api/", "/cron/"];

function isApiRoute(path: string): boolean {
  return API_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
}

function polyfillProcessEnv(cfEnv: Record<string, unknown>) {
  const g = globalThis as unknown as Record<string, unknown>;
  if (!g.process) g.process = { env: {} } as unknown as NodeJS.Process;
  const proc = g.process as unknown as { env: Record<string, unknown> };
  if (!proc.env) proc.env = {};
  for (const [key, value] of Object.entries(cfEnv)) {
    if (typeof value === "string" && !proc.env[key]) proc.env[key] = value;
  }
}

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);

  if (!isApiRoute(url.pathname)) {
    return context.env.ASSETS.fetch(context.request);
  }

  // Log env keys for debugging (no secrets)
  const envKeys = Object.keys(context.env).filter(k => !k.includes('SECRET') && !k.includes('KEY') && !k.includes('TOKEN'));
  console.log(`[CF] Env keys: ${envKeys.join(', ')}`);
  console.log(`[CF] Has DB: ${!!(context.env as any).DB}`);

  polyfillProcessEnv(context.env);

  const dbBinding = (context.env as Record<string, unknown>).DB as D1Database | undefined;
  if (dbBinding) {
    console.log(`[CF] D1 binding found, storing on globalThis`);
    (globalThis as unknown as Record<string, unknown>).__D1_BINDING__ = dbBinding;
    setD1Binding(dbBinding);
  } else {
    console.log(`[CF] D1 binding NOT found in context.env`);
  }

  const g = globalThis as unknown as Record<string, unknown>;
  const proc = g.process as unknown as { env: Record<string, unknown> };
  proc.env.NODE_ENV = "production";

  const { default: app } = await import("../api/app");
  return app.fetch(context.request, context.env, context as any);
};
