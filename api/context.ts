import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getDbFromContext } from "./queries/connection";

export async function createContext(opts: FetchCreateContextFnOptions & { env?: Record<string, unknown> }) {
  // Get env from Hono OR fallback to globalThis (set by functions/lib/handler.ts)
  const env = opts.env || (globalThis as any).__CF_ENV__ || {};
  const db = getDbFromContext(env);
  
  return {
    db,
    env,
    req: opts.req,
    resHeaders: opts.resHeaders,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
