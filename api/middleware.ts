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

// Telemetry store (in-memory, flushed periodically)
const telemetryStore = new Map<string, { count: number; errors: number; totalMs: number; lastReset: number }>();

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

/**
 * Record telemetry for a request.
 * Stores endpoint-level metrics in memory for the current minute window.
 */
export function recordTelemetry(endpoint: string, durationMs: number, error?: boolean) {
  const now = Date.now();
  const windowKey = `${endpoint}:${Math.floor(now / 60000)}`;
  const entry = telemetryStore.get(windowKey);
  if (!entry) {
    telemetryStore.set(windowKey, { count: 1, errors: error ? 1 : 0, totalMs: durationMs, lastReset: now });
  } else {
    entry.count++;
    if (error) entry.errors++;
    entry.totalMs += durationMs;
  }
  // Clean old windows (older than 10 minutes)
  for (const [key, val] of telemetryStore) {
    if (now - val.lastReset > 600000) telemetryStore.delete(key);
  }
}

/**
 * Get current telemetry snapshot.
 */
export function getTelemetry(): Record<string, { requests: number; errors: number; avgMs: number }> {
  const snapshot: Record<string, { requests: number; errors: number; avgMs: number }> = {};
  for (const [key, val] of telemetryStore) {
    snapshot[key] = {
      requests: val.count,
      errors: val.errors,
      avgMs: Math.round(val.totalMs / Math.max(val.count, 1)),
    };
  }
  return snapshot;
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

// Telemetry middleware — wraps any procedure to record request metrics
export function withTelemetry<T extends typeof publicQuery>(procedure: T): T {
  return procedure.use(async ({ path, next }) => {
    const start = Date.now();
    try {
      const result = await next();
      recordTelemetry(path, Date.now() - start, false);
      return result;
    } catch (err) {
      recordTelemetry(path, Date.now() - start, true);
      throw err;
    }
  }) as T;
}

// Telemetry-enabled public query
export const telemetryPublicQuery = withTelemetry(publicQuery);

// Telemetry-enabled authenticated query
export const telemetryAuthedQuery = withTelemetry(authedQuery);

// Telemetry-enabled admin query
export const telemetryAdminQuery = withTelemetry(adminQuery);
