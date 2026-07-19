import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

const apiBaseUrl = import.meta.env.VITE_API_URL || "";
const trpcUrl = apiBaseUrl ? `${apiBaseUrl}/api/trpc` : "/api/trpc";

export const signalcoreClient = createTRPCProxyClient<any>({
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
