import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery, checkRateLimit } from "./middleware";
import { users, passwordResetTokens } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, signJWT, verifyJWT } from "./lib/crypto";

// Password strength validation
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be at most 100 characters")
  .refine((val) => /[A-Z]/.test(val), "Password must contain at least one uppercase letter")
  .refine((val) => /[a-z]/.test(val), "Password must contain at least one lowercase letter")
  .refine((val) => /[0-9]/.test(val), "Password must contain at least one number");

export const authRouter = createRouter({
  // Register
  register: publicQuery
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: passwordSchema,
        name: z.string().min(1, "Name is required").max(100, "Name is too long"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const clientIp =
        (ctx.req as any)?.headers?.get?.("cf-connecting-ip") ||
        (ctx.req as any)?.headers?.get?.("x-forwarded-for") ||
        "unknown";
      const identifier = `register:${clientIp}:${input.email}`;

      if (!checkRateLimit(identifier, 5, 60000)) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many registration attempts. Please try again later.",
        });
      }

      const existing = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .get();

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      const passwordHash = await hashPassword(input.password);
      const result = await ctx.db
        .insert(users)
        .values({
          email: input.email,
          name: input.name,
          unionId: crypto.randomUUID(),
          passwordHash,
          plan: "starter",
        })
        .returning()
        .get();

      const jwtSecret =
        (ctx.env as any)?.JWT_SECRET || "buildsignal-dev-secret-change-in-production";
      const token = await signJWT({ sub: result.id, email: result.email }, jwtSecret);

      return {
        user: {
          id: result.id,
          email: result.email,
          name: result.name,
          plan: result.plan,
        },
        token,
      };
    }),

  // Login
  login: publicQuery
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const clientIp =
        (ctx.req as any)?.headers?.get?.("cf-connecting-ip") ||
        (ctx.req as any)?.headers?.get?.("x-forwarded-for") ||
        "unknown";
      const identifier = `login:${clientIp}:${input.email}`;

      if (!checkRateLimit(identifier, 5, 60000)) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many login attempts. Please try again later.",
        });
      }

      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .get();

      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      const valid = await verifyPassword(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      // Update last login timestamp
      await ctx.db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id))
        .run();

      const jwtSecret =
        (ctx.env as any)?.JWT_SECRET || "buildsignal-dev-secret-change-in-production";
      const token = await signJWT(
        { sub: user.id, email: user.email, orgId: user.organizationId },
        jwtSecret
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          isAdmin: user.isAdmin,
        },
        token,
      };
    }),

  // Get current user
  me: publicQuery.query(async ({ ctx }) => {
    const authHeader =
      (ctx.req as any)?.headers?.get?.("authorization") ||
      (ctx.req as any)?.headers?.authorization;
    const token = typeof authHeader === "string" ? authHeader.replace("Bearer ", "") : null;

    if (!token) return null;

    try {
      const jwtSecret =
        (ctx.env as any)?.JWT_SECRET || "buildsignal-dev-secret-change-in-production";
      const payload = await verifyJWT(token, jwtSecret);
      if (!payload) return null;

      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, payload.sub))
        .get();

      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        isAdmin: user.isAdmin,
      };
    } catch {
      return null;
    }
  }),

  // Logout (client-side token deletion)
  logout: publicQuery.mutation(() => ({ success: true })),

  // Request password reset
  requestPasswordReset: publicQuery
    .input(z.object({ email: z.string().email("Invalid email address") }))
    .mutation(async ({ input, ctx }) => {
      const clientIp =
        (ctx.req as any)?.headers?.get?.("cf-connecting-ip") ||
        (ctx.req as any)?.headers?.get?.("x-forwarded-for") ||
        "unknown";
      const identifier = `reset:${clientIp}:${input.email}`;

      if (!checkRateLimit(identifier, 3, 60000)) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many password reset attempts. Please try again later.",
        });
      }

      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .get();

      // Always return success to prevent user enumeration
      if (!user) {
        return { success: true };
      }

      // Generate secure random token
      const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
      const token = btoa(String.fromCharCode(...tokenBytes))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

      const expiresAt = new Date(Date.now() + 3600000); // 1 hour

      await ctx.db.insert(passwordResetTokens).values({
        userId: user.id,
        token,
        expiresAt,
      });

      return { success: true };
    }),

  // Reset password with token
  resetPassword: publicQuery
    .input(
      z.object({
        token: z.string().min(1, "Token is required"),
        password: passwordSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const resetRecord = await ctx.db
        .select()
        .from(passwordResetTokens)
        .where(eq(passwordResetTokens.token, input.token))
        .get();

      if (!resetRecord || resetRecord.used) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired reset token",
        });
      }

      if (resetRecord.expiresAt.getTime() < Date.now()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reset token has expired",
        });
      }

      const passwordHash = await hashPassword(input.password);

      await ctx.db
        .update(users)
        .set({ passwordHash })
        .where(eq(users.id, resetRecord.userId))
        .run();

      await ctx.db
        .update(passwordResetTokens)
        .set({ used: true })
        .where(eq(passwordResetTokens.id, resetRecord.id))
        .run();

      return { success: true };
    }),
});
