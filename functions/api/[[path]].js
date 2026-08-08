/**
 * Cloudflare Pages Function — API Proxy
 * Forwards all /api/* requests to the backend Worker at api.buildsignal.net
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api/, "");
    const target = new URL(path + url.search, "https://api.buildsignal.net");

    const headers = new Headers(request.headers);
    headers.set("Host", "api.buildsignal.net");

    const response = await fetch(target.toString(), {
      method: request.method,
      headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
    });

    const corsHeaders = new Headers(response.headers);
    corsHeaders.set("Access-Control-Allow-Origin", "https://buildsignal.net");
    corsHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    corsHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, stripe-signature");
    corsHeaders.set("Access-Control-Allow-Credentials", "true");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: corsHeaders,
    });
  },
};
