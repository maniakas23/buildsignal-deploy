export class RateLimiterDO {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }
  async fetch(request) {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    const action = url.searchParams.get("action");
    const now = Date.now();
    const windowMs = parseInt(url.searchParams.get("window") || "60000");
    const maxReq = parseInt(url.searchParams.get("max") || "10");
    if (!this.attempts) this.attempts = {};
    if (!this.attempts[key]) this.attempts[key] = [];
    this.attempts[key] = this.attempts[key].filter(ts => now - ts < windowMs);
    if (action === "check") {
      return new Response(JSON.stringify({ allowed: this.attempts[key].length < maxReq, remaining: Math.max(0, maxReq - this.attempts[key].length) }), { headers: { "Content-Type": "application/json" } });
    }
    this.attempts[key].push(now);
    return new Response(JSON.stringify({ allowed: this.attempts[key].length <= maxReq, remaining: Math.max(0, maxReq - this.attempts[key].length) }), { headers: { "Content-Type": "application/json" } });
  }
}

// NOTE: This is a placeholder file. The full recovered production worker source
// (143,914 characters / 2,555 lines) has been saved locally.
//
// To view the full source, see:
//   /mnt/agents/output/buildsignal-recovery/buildsignal-worker-recovered.js
//
// MD5: 77e9432d8c7bb95b54cd5ed353797f29
//
// The full source was recovered from Cloudflare on 2026-08-13 via:
//   GET /accounts/{account_id}/workers/scripts/buildsignal-worker/download
//
// CRITICAL: This production worker is deployed as an inline script via API.
// It is NOT built from any repository code. The repository code in packages/api/
// is completely different and has NEVER been deployed to production.
