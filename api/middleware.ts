import { z } from "zod";
import { initTRPC, TRPCError } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { rateLimitIP } from "./lib/rate-limit";

export async function createContext(opts: FetchCreateContextFnOptions) {
  return { req: opts.req, resHeaders: opts.resHeaders };
}

const t = initTRPC.context<typeof createContext>().create();
export const router = t.router;
export const createRouter = t.router;
export const publicQuery = t.procedure;
export const appRouter = t.router;

// Rate-limited public query
export const rateLimitedPublicQuery = publicQuery.use(async ({ ctx, next }) => {
  const ip = (ctx.req as any)?.headers?.get?.('cf-connecting-ip') || 'unknown';
  const endpoint = (ctx.req as any)?.url || 'unknown';
  const result = rateLimitIP(ip, endpoint, 100, 60000); // 100 req/min per IP
  if (!result.allowed) throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded' });
  return next({ ctx });
});

// Plan-enforced query
export function createPlanEnforcedQuery(requiredPlan: string[]) {
  return authedQuery.use(async ({ ctx, next }) => {
    if (!requiredPlan.includes(ctx.user.plan)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: `This feature requires one of: ${requiredPlan.join(', ')}` });
    }
    return next({ ctx });
  });
}
