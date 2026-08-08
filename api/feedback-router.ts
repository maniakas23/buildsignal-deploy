import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { feedback } from "../db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export const feedbackRouter = createRouter({
  // Submit feedback
  submit: authedQuery
    .input(
      z.object({
        type: z.enum([
          "feature_request",
          "bug",
          "general",
          "praise",
          "complaint",
        ]),
        category: z.string().min(1).max(50),
        message: z.string().min(10).max(5000),
        rating: z.number().min(1).max(5).optional(),
        page: z.string().max(200).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .insert(feedback)
        .values({
          userId: ctx.user.id,
          type: input.type,
          category: input.category,
          message: input.message,
          rating: input.rating ?? null,
          page: input.page ?? null,
          status: "new",
        })
        .returning()
        .get();

      return { success: true, id: result.id };
    }),

  // Submit NPS score
  submitNPS: authedQuery
    .input(
      z.object({
        score: z.number().min(0).max(10),
        reason: z.string().max(1000).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .insert(feedback)
        .values({
          userId: ctx.user.id,
          type: "nps",
          category: "nps",
          message: input.reason || `NPS Score: ${input.score}`,
          rating: input.score,
          status: "new",
        })
        .run();

      return { success: true };
    }),

  // Get user's feedback history
  myFeedback: authedQuery
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ input, ctx }) => {
      return ctx.db
        .select()
        .from(feedback)
        .where(eq(feedback.userId, ctx.user.id))
        .orderBy(desc(feedback.createdAt))
        .limit(input.limit)
        .all();
    }),

  // Get public feature requests (for roadmap display)
  featureRequests: publicQuery
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        status: z
          .enum(["new", "reviewing", "planned", "completed", "declined"])
          .optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const conditions = [eq(feedback.type, "feature_request")];
      if (input.status) {
        conditions.push(eq(feedback.status, input.status));
      }

      return ctx.db
        .select()
        .from(feedback)
        .where(and(...conditions))
        .orderBy(desc(feedback.upvotes))
        .limit(input.limit)
        .all();
    }),

  // Upvote a feature request
  upvote: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const existing = await ctx.db
        .select()
        .from(feedback)
        .where(eq(feedback.id, input.id))
        .get();

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Feature request not found",
        });
      }

      await ctx.db
        .update(feedback)
        .set({ upvotes: (existing.upvotes ?? 0) + 1 })
        .where(eq(feedback.id, input.id))
        .run();

      return { success: true };
    }),

  // Admin: Get all feedback (requires admin)
  adminList: authedQuery
    .input(
      z.object({
        status: z
          .enum(["new", "reviewing", "planned", "completed", "declined"])
          .optional(),
        type: z.string().optional(),
        limit: z.number().min(1).max(200).default(50),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      let query = ctx.db
        .select()
        .from(feedback)
        .orderBy(desc(feedback.createdAt))
        .limit(input.limit) as unknown as {
        where: (
          cond: ReturnType<typeof eq>
        ) => { all: () => Promise<(typeof feedback.$inferSelect)[]> };
      };

      if (input.status) {
        query = (query as any).where(eq(feedback.status, input.status));
      }
      if (input.type) {
        query = (query as any).where(eq(feedback.type, input.type));
      }

      return query.all();
    }),

  // Admin: Update feedback status
  adminUpdateStatus: authedQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum([
          "new",
          "reviewing",
          "planned",
          "completed",
          "declined",
        ]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      await ctx.db
        .update(feedback)
        .set({ status: input.status })
        .where(eq(feedback.id, input.id))
        .run();

      return { success: true };
    }),
});
