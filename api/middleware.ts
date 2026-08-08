import { z } from "zod";
import { initTRPC, TRPCError } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import { Context } from "./context";
import { verifyJWT } from "./lib/crypto";
import { rateLimitIP } from "./lib/rate-limit";

export async function createContext(opts: FetchCreateContextFnOptions) {
  return { req: opts.req, resHeaders: opts.resHeaders };
}

const t = initTRPC.context<Context>().create();
export const router = t.router;
export const createRouter = t.router;
export const publicQuery = t.procedure;
export const appRouter = t.router;

// Rate limiting store (in-memory for Workers)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / windowMs)}`;
  const entry = rateLimitStore.get(key);
  if (!entry) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

// Rate-limited public query
export const rateLimitedPublicQuery = publicQuery.use(async ({ ctx, next }) => {
  const ip = (ctx.req as any)?.headers?.get?.("cf-connecting-ip") || "unknown";
  const endpoint = (ctx.req as any)?.url || "unknown";
  const result = rateLimitIP(ip, endpoint, 100, 60000); // 100 req/min per IP
  if (!result.allowed) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Rate limit exceeded" });
  return next({ ctx });
});

// Auth middleware procedure
export const authedQuery = publicQuery.use(async ({ ctx, next }) => {
  const authHeader =
    (ctx.req as any)?.headers?.get?.("authorization") ||
    (ctx.req as any)?.headers?.authorization;
  const token = typeof authHeader === "string" ? authHeader.replace("Bearer ", "") : null;

  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" });
  }

  const jwtSecret = (ctx.env as any)?.JWT_SECRET || "buildsignal-dev-secret-change-in-production";
  const payload = await verifyJWT(token, jwtSecret);
  if (!payload) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired token" });
  }

  // Fetch user from DB
  const user = await ctx.db.select().from(users).where(eq(users.id, payload.sub)).get();
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });
  }

  return next({
    ctx: {
      ...ctx,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        isAdmin: user.isAdmin,
      },
      orgId: payload.orgId || null,
    },
  });
});

// Admin-only middleware
export const adminQuery = authedQuery.use(async ({ ctx, next }) => {
  if (!ctx.user.isAdmin) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// Plan-enforced query
export function createPlanEnforcedQuery(requiredPlan: string[]) {
  return authedQuery.use(async ({ ctx, next }) => {
    if (!requiredPlan.includes(ctx.user.plan)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `This feature requires one of: ${requiredPlan.join(", ")}`,
      });
    }
    return next({ ctx });
  });
}
