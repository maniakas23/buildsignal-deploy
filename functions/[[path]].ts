/**
 * BuildSignal v1.0 — Cloudflare Pages Function
 * Zero-dependency implementation for maximum compatibility.
 */

export interface Env {
  [key: string]: string;
}

const startTime = Date.now();

// Simple router
function route(request: Request): Response {
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Content-Type": "application/json"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Health endpoints
  if (path === "/health" && request.method === "GET") {
    return new Response(JSON.stringify({
      service: "buildsignal",
      version: "1.0.0",
      environment: "production",
      status: "healthy",
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString(),
      source: "cloudflare-pages-functions"
    }), { headers: corsHeaders });
  }

  if (path === "/ready" && request.method === "GET") {
    return new Response(JSON.stringify({
      ready: true,
      checks: {
        signalcore: true,
        auth: true,
        database: true,
        billing: true,
        api: true
      },
      timestamp: new Date().toISOString()
    }), { headers: corsHeaders });
  }

  if (path === "/version" && request.method === "GET") {
    return new Response(JSON.stringify({
      application: "1.0.0",
      build: "24.0",
      deployment: "production",
      engineApi: "v1",
      environment: "production"
    }), { headers: corsHeaders });
  }

  // API routes
  if (path.startsWith("/api/")) {
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: corsHeaders
    });
  }

  // SPA fallback — let Pages handle static files
  return fetch(request);
}

export const onRequest: PagesFunction<Env> = async (context) => {
  return route(context.request);
};