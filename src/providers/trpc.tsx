import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import type { AppRouter } from "../../api/router";

export const trpc = createTRPCReact<AppRouter>();

/**
 * The buildsignal-worker tRPC adapter requires the v10-style "json" envelope
 * around every batched input — {"0":{"json": ...}} — in both the GET `input`
 * query param and the POST body. The stock v11 client omits the envelope when
 * no data transformer is configured, which silently broke every procedure that
 * validates its input (e.g. stripe.createCheckoutSession answered
 * "Invalid or unavailable plan" and the Upgrade button never redirected).
 * Normalize outgoing batch traffic so each item is envelope-wrapped.
 */
function envelopeWrap(map: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(map)) {
    out[k] =
      v !== null && typeof v === "object" && "json" in (v as Record<string, unknown>)
        ? v
        : { json: v };
  }
  return out;
}

const trpcFetch: typeof fetch = async (input, init) => {
  let url = typeof input === "string" ? input : input.url;
  let body = init?.body;
  try {
    const u = new URL(url, window.location.origin);
    const rawInput = u.searchParams.get("input");
    if (rawInput) {
      const parsed: unknown = JSON.parse(rawInput);
      if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
        u.searchParams.set(
          "input",
          JSON.stringify(envelopeWrap(parsed as Record<string, unknown>))
        );
        url = u.toString();
      }
    }
    if (typeof body === "string") {
      const parsed: unknown = JSON.parse(body);
      if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
        body = JSON.stringify(envelopeWrap(parsed as Record<string, unknown>));
      }
    }
  } catch {
    // On any parse issue, pass the request through untouched.
  }
  return fetch(url, { ...init, body });
};

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          fetch: trpcFetch,
          headers() {
            const token = localStorage.getItem("auth_token");
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
