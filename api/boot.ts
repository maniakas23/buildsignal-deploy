/**
 * Node.js production server entry point.
 *
 * This module imports the Cloudflare-compatible Hono app from api/app.ts
 * and adds Node.js-specific static file serving and HTTP server startup.
 *
 * For Cloudflare Pages Functions deployment, use functions/[[path]].ts
 * instead — it imports the same app without any Node.js dependencies.
 */

import "dotenv/config";
import app from "./app";
import { env } from "./lib/env";

// Re-export the app for consumers who need direct access
export default app;

// ─── Node.js Production Server ───
// Only starts when running on Node.js (not on Cloudflare Workers)

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");

  // Add static file serving and SPA fallback (Node.js only)
  serveStaticFiles(app as unknown as Parameters<typeof serveStaticFiles>[0]);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    // Server started — no console output in production
  });
}
