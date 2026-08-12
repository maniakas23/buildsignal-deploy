// BuildSignal Pages Function — Thin Proxy
// ================================================================
// ARCHITECTURE CONTRACT: This file MUST remain a thin proxy.
// All business logic (ingestion, normalization, provider resolution,
// circuit breakers, deduplication) lives ONLY in buildsignal-worker.
// ================================================================

const API_BASE = "https://api.buildsignal.net";

/**
 * Build a JSON Response with CORS headers.
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

/**
 * Handle CORS preflight requests.
 */
function handleCorsPreflight() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

/**
 * Main request handler — thin proxy to buildsignal-worker.
 *
 * Architecture invariant: NO business logic here.
 *  - No direct D1 queries
 *  - No ArcGIS fetching
 *  - No provider resolution
 *  - No deduplication
 *  - No normalization
 *  - No signalcore_events writes
 *
 * All /api/* traffic is forwarded to api.buildsignal.net.
 */
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const method = request.method;

  // Debug endpoint (optional, harmless)
  if (url.pathname === "/api/debug") {
    return jsonResponse({
      debug: true,
      pathname: url.pathname,
      proxy: API_BASE,
      note: "Pages Function is a thin proxy — all business logic lives in buildsignal-worker",
    });
  }

  // CORS preflight for all API routes
  if (method === "OPTIONS") {
    return handleCorsPreflight();
  }

  // Forward EVERYTHING to the API Worker.
  // The Worker (buildsignal-worker) owns all ingestion, normalization,
  // provider management, circuit breakers, and V1 REST API logic.
  const targetUrl = API_BASE + url.pathname + url.search;
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  const response = await fetch(modifiedRequest);
  const newHeaders = new Headers(response.headers);
  const origin = request.headers.get("Origin") || "https://buildsignal.net";
  newHeaders.set("Access-Control-Allow-Origin", origin);
  newHeaders.set("Access-Control-Allow-Credentials", "true");
  newHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, stripe-signature");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
