/**
 * Health Check — Standalone Function
 * Returns service health without importing from api/ directory.
 * This avoids esbuild path alias resolution issues.
 */

import type { PagesFunction } from "@cloudflare/workers-types";

export const onRequest: PagesFunction = async () => {
  return new Response(
    JSON.stringify({
      status: "ok",
      service: "buildsignal",
      version: "1.0.0",
      environment: "production",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
};
