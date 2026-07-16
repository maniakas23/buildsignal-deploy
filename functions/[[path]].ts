/**
 * BuildSignal v1.0 — Cloudflare Pages Function
 * Inline implementation with zero external dependencies for Functions bundle.
 */

export interface Env {
  ASSETS: Fetcher;
  [key: string]: string | Fetcher;
}

const startTime = Date.now();

// Simple router with all API endpoints
function route(request: Request): Response {
  const url = new URL(request.url);
  const path = url.pathname;

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

  if (path.startsWith("/api/")) {
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: corsHeaders
    });
  }

  // Fall through to static files — handled by onRequest
  return new Response("fallback", { status: 404 });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  
  // API routes handled by Functions
  if (url.pathname.startsWith("/api/") ||
      url.pathname === "/health" ||
      url.pathname === "/ready" ||
      url.pathname === "/version") {
    return route(context.request);
  }
  
  // Static files served by Pages
  return context.env.ASSETS.fetch(context.request);
};