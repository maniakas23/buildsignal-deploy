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
 * objects become a full tRPC v11 batch error envelope with HTTP 200,
 * expanded to one item per batched procedure. Successful responses and
 * already-shaped envelopes pass through unchanged.
 */
function trpcErrorCode(message) {
  if (message === "Unauthorized") return "UNAUTHORIZED";
  if (message.startsWith("Not found")) return "NOT_FOUND";
  return "INTERNAL_SERVER_ERROR";
}

/**
 * Map a tRPC string code to its JSON-RPC numeric code and HTTP status,
 * producing the full tRPC v11 error envelope shape the client expects:
 * { error: { message, code: <number>, data: { code: <string>, httpStatus } } }
 * Without data.code/data.httpStatus the v11 batch link cannot settle the
 * call, leaving mutations hanging with no error callback.
 */
const TRPC_CODE_TABLE = {
  PARSE_ERROR: [-32700, 400],
  BAD_REQUEST: [-32600, 400],
  UNAUTHORIZED: [-32001, 401],
  FORBIDDEN: [-32003, 403],
  NOT_FOUND: [-32004, 404],
  METHOD_NOT_SUPPORTED: [-32005, 405],
  TIMEOUT: [-32008, 408],
  CONFLICT: [-32009, 409],
  PRECONDITION_FAILED: [-32012, 412],
  PAYLOAD_TOO_LARGE: [-32013, 413],
  UNPROCESSABLE_CONTENT: [-32022, 422],
  TOO_MANY_REQUESTS: [-32029, 429],
  CLIENT_CLOSED_REQUEST: [-32099, 499],
  INTERNAL_SERVER_ERROR: [-32603, 500],
};

function trpcErrorItem(message, stringCode) {
  const [numeric, httpStatus] = TRPC_CODE_TABLE[stringCode] || TRPC_CODE_TABLE.INTERNAL_SERVER_ERROR;
  return {
    error: {
      message,
      code: numeric,
      data: { code: stringCode, httpStatus },
    },
  };
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
      // The worker collapses a whole batch into one bare error. Expand it to
      // one item per batched procedure so the v11 batch link can settle every
      // call in the batch instead of leaving the others hanging forever.
      const procPath = url.pathname.slice("/api/trpc/".length).split("?")[0];
      const batchSize = Math.max(procPath.split(",").filter(Boolean).length, 1);
      const item = trpcErrorItem(message, trpcErrorCode(message));
      const isBatch = url.searchParams.get("batch") === "1";
      return new Response(
        JSON.stringify(isBatch ? Array.from({ length: batchSize }, () => item) : item),
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
