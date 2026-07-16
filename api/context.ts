import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getDb } from "./queries/connection";

export async function createContext(opts: FetchCreateContextFnOptions) {
  const db = getDb();
  return {
    db,
    req: opts.req,
    resHeaders: opts.resHeaders,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
