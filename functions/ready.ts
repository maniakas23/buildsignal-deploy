/**
 * Readiness Check — Standalone Function
 * Returns dependency health without importing from api/ directory.
 */

import type { PagesFunction } from "@cloudflare/workers-types";

interface CheckResult {
  status: "passed" | "failed" | "degraded";
  latencyMs?: number;
  detail?: string;
}

async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const dbUrl = (globalThis as unknown as { process?: { env?: Record<string, string> } }).process?.env?.DATABASE_URL;
    if (!dbUrl) {
      return { status: "failed", detail: "DATABASE_URL not configured" };
    }
    const url = new URL(dbUrl);
    if (!url.hostname || !url.pathname) {
      return { status: "failed", detail: "DATABASE_URL malformed" };
    }
    return { status: "passed", latencyMs: Date.now() - start };
  } catch (error) {
    return { status: "failed", latencyMs: Date.now() - start, detail: String(error) };
  }
}

async function checkAuth(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const env = (globalThis as unknown as { process?: { env?: Record<string, string> } }).process?.env;
    if (!env?.APP_ID || !env?.APP_SECRET) {
      return { status: "failed", detail: "Auth credentials not configured" };
    }
    return { status: "passed", latencyMs: Date.now() - start };
  } catch (error) {
    return { status: "failed", latencyMs: Date.now() - start, detail: String(error) };
  }
}

async function checkStripe(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const env = (globalThis as unknown as { process?: { env?: Record<string, string> } }).process?.env;
    const hasKey = !!env?.STRIPE_SECRET_KEY && env.STRIPE_SECRET_KEY !== "sk_test_dummy";
    return {
      status: hasKey ? "passed" : "degraded",
      latencyMs: Date.now() - start,
      detail: hasKey ? undefined : "Using test/dummy key",
    };
  } catch (error) {
    return { status: "failed", latencyMs: Date.now() - start, detail: String(error) };
  }
}

async function checkEngine(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch("https://engine.buildsignal.net/health", {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const contentType = response.headers.get("content-type") || "";
    if (response.ok && contentType.includes("application/json")) {
      return { status: "passed", latencyMs: Date.now() - start };
    }
    return {
      status: "degraded",
      latencyMs: Date.now() - start,
      detail: `HTTP ${response.status}, content-type: ${contentType}`,
    };
  } catch {
    return {
      status: "degraded",
      latencyMs: Date.now() - start,
      detail: "Unreachable or timeout",
    };
  }
}

export const onRequest: PagesFunction = async (context) => {
  const g = globalThis as unknown as { process?: { env?: Record<string, unknown> } };
  if (!g.process) g.process = { env: {} };
  for (const [key, value] of Object.entries(context.env)) {
    if (typeof value === "string") {
      g.process.env = g.process.env || {};
      (g.process.env as Record<string, unknown>)[key] = value;
    }
  }

  const checks: Record<string, CheckResult> = {
    database: await checkDatabase(),
    authentication: await checkAuth(),
    stripe: await checkStripe(),
    signalcore_engine: await checkEngine(),
  };

  const allPassed = Object.values(checks).every((c) => c.status === "passed");
  const anyFailed = Object.values(checks).some((c) => c.status === "failed");

  const status = anyFailed ? 503 : 200;
  const ready = !anyFailed;

  return new Response(
    JSON.stringify({
      ready,
      status: ready ? (allPassed ? "healthy" : "degraded") : "unhealthy",
      timestamp: new Date().toISOString(),
      checks,
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
};
