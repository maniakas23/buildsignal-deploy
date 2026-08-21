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
 * tRPC protocol adaptation.
 *
 * The API worker answers most tRPC failures with a proper batch envelope
 * ([{"error":{...}}] + HTTP 200), but its unhandled-exception path answers
 * with a bare {"error":"..."} object and a 5xx status. tRPC batch clients
 * treat a non-200 / non-array response as a network-level failure, which
 * surfaces as a broken page instead of a truthful error state.
 *
 * This normalizes ONLY the wire shape (no business logic): bare error
 * objects become a single-item batch error envelope with HTTP 200.
 * Successful responses and already-shaped envelopes pass through unchanged.
 */
function trpcErrorCode(message) {
  if (message === "Unauthorized") return "UNAUTHORIZED";
  if (message.startsWith("Not found")) return "NOT_FOUND";
  return "INTERNAL_SERVER_ERROR";
}

function applyCors(headers, request) {
  const origin = request.headers.get("Origin") || "https://buildsignal.net";
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, stripe-signature");
  return headers;
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

  // tRPC wire-shape normalization (see trpcErrorCode notes above).
  if (url.pathname.startsWith("/api/trpc/")) {
    const text = await response.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }

    if (!Array.isArray(parsed)) {
      const message =
        (parsed && typeof parsed.error === "string" && parsed.error) ||
        "An unexpected error occurred. Please try again later.";
      return new Response(
        JSON.stringify([{ error: { message, code: trpcErrorCode(message) } }]),
        {
          status: 200,
          headers: applyCors(
            new Headers({ "Content-Type": "application/json" }),
            request
          ),
        }
      );
    }

    return new Response(text, {
      status: 200,
      headers: applyCors(
        new Headers({ "Content-Type": "application/json" }),
        request
      ),
    });
  }

  const newHeaders = applyCors(new Headers(response.headers), request);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
