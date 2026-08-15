// Cloudflare Function: Proxy API requests to api.buildsignal.net
// This replaces the invalid _redirects external proxy rule

export interface Env {
  // Add any environment variables if needed
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context;
  const url = new URL(request.url);

  // Build the target URL
  const targetUrl = new URL(url.pathname + url.search, "https://api.buildsignal.net");

  // Clone the request with the new URL
  const modifiedRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: "follow",
  });

  try {
    const response = await fetch(modifiedRequest);

    // Create a new response with CORS headers
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    // Add CORS headers
    modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");
    modifiedResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    modifiedResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return modifiedResponse;
  } catch (error) {
    return new Response(JSON.stringify({ error: "API proxy failed" }), {
      status: 502,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};
