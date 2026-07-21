/**
 * BuildSignal Kestovar Client
 * Direct proxy client for Kestovar Engine API calls.
 *
 * In production: calls https://api.kestovar.buildsignal.com
 * In development: proxied via Vite to the local Kestovar Worker
 */

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

const apiBaseUrl = import.meta.env.VITE_API_URL || "";
const trpcUrl = apiBaseUrl ? `${apiBaseUrl}/api/trpc` : "/api/trpc";

export const kestovarClient = createTRPCProxyClient<any>({
  links: [
    httpBatchLink({
      url: trpcUrl,
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});
