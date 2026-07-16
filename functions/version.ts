/**
 * Version Endpoint — Standalone Function
 * Returns build and version information.
 */

import type { PagesFunction } from "@cloudflare/workers-types";

export const onRequest: PagesFunction = async () => {
  return new Response(
    JSON.stringify({
      service: "buildsignal",
      version: "1.0.0",
      build: "2026.07.17",
      environment: "production",
      node_compat: true,
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
