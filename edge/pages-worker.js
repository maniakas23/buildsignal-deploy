// BuildSignal Pages advanced-mode worker: API proxy + static assets
// - Proxies /api/* to the API origin with CORS headers.
// - Security gate: internal ops metrics (analytics.healthScore) require Authorization.
// - Batch isolation: if a batched tRPC request containing billing.usage fails at the
//   backend, re-issue without the failing procedure and splice a truthful per-item
//   error into its slot, so one broken procedure cannot poison sibling queries.
const OPS_GATED = ["analytics.healthScore"];
const ISOLATE_ON_500 = ["billing.usage"];

// Match the backend gateway's error envelope: {"error":{"message","code"}}
function trpcErrorItem(path, message) {
  return {
    error: {
      message: message || "An unexpected error occurred. Please try again later.",
      code: "INTERNAL_SERVER_ERROR",
    },
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }
    // Holds a request body that was read for inspection, so the proxy path can
    // still forward it after the original stream was consumed.
    let prefetchedBody;

    // Security gate for internal ops endpoints
    if (!request.headers.get("Authorization")) {
      for (const p of OPS_GATED) {
        if (url.pathname.includes(p)) {
          return new Response(JSON.stringify([{ error: { message: "Unauthorized", code: "UNAUTHORIZED" } }]), {
            status: 401,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        }
      }
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Edge implementation of notification.updatePrefs.
    // The deployed backend's write path for this procedure 500s (schema drift
    // against the live notification_prefs table) and the backend cannot be
    // safely redeployed (deployed worker source has diverged from the repo).
    // This handler verifies the caller's token against the backend (auth.me),
    // then persists the preference change to the same D1 database the backend
    // reads from (getPrefs reads notification_prefs), so the write is real and
    // immediately visible to the rest of the stack. Any failure falls through
    // to the original backend proxy so behavior is never worse than before.
    if (url.pathname === "/api/trpc/notification.updatePrefs" && request.method === "POST" && env.DB) {
      try {
        const auth = request.headers.get("Authorization");
        if (auth) {
          const me = await fetch("https://api.buildsignal.net/api/trpc/auth.me?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%7D%7D", {
            headers: { Authorization: auth },
          });
          if (me.ok) {
            const meBody = await me.json();
            const user = Array.isArray(meBody) && meBody[0] && meBody[0].result && meBody[0].result.data;
            const userId = user && typeof user.id === "number" ? user.id : null;
            if (userId) {
              const raw = await request.text();
              prefetchedBody = raw;
              const parsed = JSON.parse(raw);
              const slot = parsed && parsed["0"] ? parsed["0"] : {};
              const input = slot.json && typeof slot.json === "object" ? slot.json : slot;
              const sets = [];
              const vals = [];
              if (typeof input.emailEnabled === "boolean") { sets.push("emailEnabled=?"); vals.push(input.emailEnabled ? 1 : 0); }
              if (typeof input.inAppEnabled === "boolean") { sets.push("inAppEnabled=?"); vals.push(input.inAppEnabled ? 1 : 0); }
              if (typeof input.alertFrequency === "string" && ["realtime", "daily", "weekly"].includes(input.alertFrequency)) {
                sets.push("alertFrequency=?"); vals.push(input.alertFrequency);
              }
              if (Array.isArray(input.alertTypes)) { sets.push("alertTypes=?"); vals.push(JSON.stringify(input.alertTypes)); }
              if (sets.length > 0) {
                const upd = await env.DB.prepare(
                  "UPDATE notification_prefs SET " + sets.join(", ") + ", updatedAt=datetime('now') WHERE userId=?"
                ).bind(...vals, userId).run();
                if (!upd.meta || upd.meta.changes === 0) {
                  const cols = { emailEnabled: 1, inAppEnabled: 1, alertFrequency: "daily", alertTypes: '["opportunities","system"]' };
                  if (typeof input.emailEnabled === "boolean") cols.emailEnabled = input.emailEnabled ? 1 : 0;
                  if (typeof input.inAppEnabled === "boolean") cols.inAppEnabled = input.inAppEnabled ? 1 : 0;
                  if (typeof input.alertFrequency === "string" && ["realtime", "daily", "weekly"].includes(input.alertFrequency)) cols.alertFrequency = input.alertFrequency;
                  if (Array.isArray(input.alertTypes)) cols.alertTypes = JSON.stringify(input.alertTypes);
                  await env.DB.prepare(
                    "INSERT INTO notification_prefs (userId, emailEnabled, inAppEnabled, alertFrequency, alertTypes, provenance) VALUES (?, ?, ?, ?, ?, 'LIVE')"
                  ).bind(userId, cols.emailEnabled, cols.inAppEnabled, cols.alertFrequency, cols.alertTypes).run();
                }
                return new Response(JSON.stringify([{ result: { data: { success: true } } }]), {
                  status: 200,
                  headers: { "Content-Type": "application/json", ...corsHeaders },
                });
              }
            }
          }
        }
      } catch (e) {
        // fall through to backend proxy (body restored via prefetchedBody)
      }
    }

    const targetUrl = new URL(url.pathname + url.search, "https://api.buildsignal.net");

    const makeRequest = (pathname, search, body) =>
      new Request(new URL(pathname + (search || ""), "https://api.buildsignal.net").toString(), {
        method: request.method,
        headers: request.headers,
        body: body !== undefined ? body : (prefetchedBody !== undefined ? prefetchedBody : request.body),
        redirect: "follow",
      });

    const finalize = (response) => {
      const r = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
      for (const [k, v] of Object.entries(corsHeaders)) r.headers.set(k, v);
      return r;
    };

    try {
      // Batched tRPC call containing a procedure we isolate on backend 500?
      const trpcPrefix = "/api/trpc/";
      if (url.pathname.startsWith(trpcPrefix)) {
        const procList = decodeURIComponent(url.pathname.slice(trpcPrefix.length)).split(",");
        const isoIndex = procList.findIndex((p) => ISOLATE_ON_500.includes(p));
        if (isoIndex >= 0 && procList.length === 1) {
          // Single-procedure call to a backend-broken query: return a truthful
          // per-item error envelope (never fabricated data) so the client can
          // render its normal error/empty state without a network-level 500.
          const only = await fetch(makeRequest(url.pathname, url.search));
          if (only.status < 500) return finalize(only);
          return new Response(JSON.stringify([trpcErrorItem(procList[isoIndex])]), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }
        if (isoIndex >= 0 && procList.length > 1) {
          const isPost = request.method === "POST";
          const originalBody = isPost ? await request.text() : undefined;
          const first = await fetch(makeRequest(url.pathname, url.search, originalBody));
          if (first.status < 500) return finalize(first);

          // Re-issue without the failing procedure
          const kept = procList.filter((_, i) => i !== isoIndex);
          let newBody = originalBody;
          if (isPost && originalBody) {
            try {
              const parsed = JSON.parse(originalBody);
              const remapped = {};
              kept.forEach((_, newIdx) => {
                const oldIdx = newIdx >= isoIndex ? newIdx + 1 : newIdx;
                if (parsed[String(oldIdx)] !== undefined) remapped[String(newIdx)] = parsed[String(oldIdx)];
              });
              newBody = JSON.stringify(remapped);
            } catch (e) {
              return finalize(first);
            }
          }
          const retryPath = trpcPrefix + kept.join(",");
          let retrySearch = url.search;
          const inputParam = url.searchParams.get("input");
          if (!isPost && inputParam) {
            try {
              const parsed = JSON.parse(inputParam);
              const remapped = {};
              kept.forEach((_, newIdx) => {
                const oldIdx = newIdx >= isoIndex ? newIdx + 1 : newIdx;
                if (parsed[String(oldIdx)] !== undefined) remapped[String(newIdx)] = parsed[String(oldIdx)];
              });
              const sp = new URLSearchParams(url.search);
              sp.set("input", JSON.stringify(remapped));
              retrySearch = "?" + sp.toString();
            } catch (e) {
              return finalize(first);
            }
          }
          const second = await fetch(makeRequest(retryPath, retrySearch, newBody));
          if (second.status >= 500) return finalize(first);
          try {
            const items = await second.json();
            if (Array.isArray(items)) {
              items.splice(isoIndex, 0, trpcErrorItem(procList[isoIndex]));
              return new Response(JSON.stringify(items), {
                status: 200,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              });
            }
            return finalize(first);
          } catch (e) {
            return finalize(first);
          }
        }
      }

      const response = await fetch(makeRequest(url.pathname, url.search));
      return finalize(response);
    } catch (error) {
      return new Response(JSON.stringify({ error: "API proxy failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
  },
};
