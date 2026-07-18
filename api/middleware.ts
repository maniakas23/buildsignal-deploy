import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext(opts: FetchCreateContextFnOptions) {
  return { req: opts.req, resHeaders: opts.resHeaders };
}

const t = initTRPC.context<typeof createContext>().create();
export const router = t.router;
export const createRouter = t.router;
export const publicQuery = t.procedure;
export const appRouter = t.router;
