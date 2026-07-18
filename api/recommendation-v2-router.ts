import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { confidenceScores, recommendationOutcomes, patternLibrary } from "@db/schema-sqlite";
import { eq, desc, and } from "drizzle-orm";
import { getDbFromContext } from "./queries/connection";

export const recommendationV2Router = createRouter({
  confidence: publicQuery.input(z.object({ entityType: z.string(), entityId: z.number() })).query(async ({ ctx, input }) => {
    const db = getDbFromContext(ctx.env);
    const rows = await db.select().from(confidenceScores).where(and(eq(confidenceScores.entityType,input.entityType),eq(confidenceScores.entityId,input.entityId))).orderBy(desc(confidenceScores.calculatedAt)).limit(1);
    return rows[0] || null;
  }),

  calculateConfidence: publicQuery.input(z.object({
    entityType: z.enum(["recommendation","pattern","event","provider"]), entityId: z.number(),
    providerReliability: z.number().min(0).max(100).optional(), historicalAccuracy: z.number().min(0).max(100).optional(),
    crossSourceAgreement: z.number().min(0).max(100).optional(), dataFreshness: z.number().min(0).max(100).optional(),
    patternMatch: z.number().min(0).max(100).optional(), geographicContext: z.number().min(0).max(100).optional(),
    eventCorrelation: z.number().min(0).max(100).optional(), historicalOutcomes: z.number().min(0).max(100).optional(),
    explanation: z.string().optional(),
  })).mutation(async ({ ctx, input }) => {
    const db = getDbFromContext(ctx.env);
    const weights = { providerReliability:0.15, historicalAccuracy:0.20, crossSourceAgreement:0.15, dataFreshness:0.10, patternMatch:0.15, geographicContext:0.10, eventCorrelation:0.10, historicalOutcomes:0.05 };
    let overallScore = 0, totalWeight = 0;
    const factors: Record<string,number> = {};
    for (const [key,weight] of Object.entries(weights)) { const value = (input as any)[key]; if (value !== undefined) { factors[key] = value; overallScore += value * weight; totalWeight += weight; } }
    if (totalWeight > 0) overallScore = Math.round(overallScore / totalWeight);
    const result = await db.insert(confidenceScores).values({
      entityType: input.entityType, entityId: input.entityId, overallScore,
      providerReliability: input.providerReliability||0, historicalAccuracy: input.historicalAccuracy||0,
      crossSourceAgreement: input.crossSourceAgreement||0, dataFreshness: input.dataFreshness||0,
      patternMatch: input.patternMatch||0, geographicContext: input.geographicContext||0,
      eventCorrelation: input.eventCorrelation||0, historicalOutcomes: input.historicalOutcomes||0,
      explanation: input.explanation || `Calculated confidence: ${overallScore}%`,
    }).returning();
    return { success: true, score: result[0], factors, overallScore };
  }),

  outcomes: publicQuery.input(z.object({
    status: z.enum(["pending","confirmed","partially_confirmed","incorrect","expired","all"]).optional().default("all"),
    limit: z.number().min(1).max(200).optional().default(50),
  }).optional()).query(async ({ ctx, input }) => {
    const db = getDbFromContext(ctx.env);
    const rows = await db.select().from(recommendationOutcomes).orderBy(desc(recommendationOutcomes.createdAt)).limit(input?.limit || 50);
    let filtered = rows;
    if (input?.status && input.status !== "all") {
      filtered = rows.filter((r: any) => r.outcomeStatus === input.status);
    }
    // JS-based status counts instead of sql template literal
    const byStatus: Record<string,number> = { pending:0, confirmed:0, partially_confirmed:0, incorrect:0, expired:0 };
    for (const r of rows) { byStatus[r.outcomeStatus] = (byStatus[r.outcomeStatus] || 0) + 1; }
    return { outcomes: filtered, total: filtered.length, byStatus };
  }),

  recordOutcome: publicQuery.input(z.object({
    recommendationId: z.number(), patternId: z.number().optional(), county: z.string().optional(),
    state: z.string().optional(), predictedEventTypes: z.string().optional(), actualEventTypes: z.string().optional(),
    outcomeStatus: z.enum(["pending","confirmed","partially_confirmed","incorrect","expired"]),
    accuracyScore: z.number().min(0).max(100).optional(), timeToDevelopmentDays: z.number().optional(),
    confidenceAtPrediction: z.number().optional(), lessonsLearned: z.string().optional(),
  })).mutation(async ({ ctx, input }) => {
    const db = getDbFromContext(ctx.env);
    const result = await db.insert(recommendationOutcomes).values({ ...input, validatedAt: input.outcomeStatus !== "pending" ? new Date() : undefined }).returning();
    return { success: true, outcome: result[0] };
  }),

  patterns: publicQuery.input(z.object({ patternType: z.string().optional(), isActive: z.boolean().optional() }).optional()).query(async ({ ctx, input }) => {
    const db = getDbFromContext(ctx.env);
    const rows = await db.select().from(patternLibrary).orderBy(desc(patternLibrary.historicalSuccessRate));
    let filtered = rows;
    if (input?.patternType) filtered = filtered.filter((r: any) => r.patternType === input.patternType);
    if (input?.isActive !== undefined) filtered = filtered.filter((r: any) => r.isActive === input.isActive);
    return { patterns: filtered };
  }),

  stats: publicQuery.query(async ({ ctx }) => {
    const db = getDbFromContext(ctx.env);
    const [outcomes, patterns] = await Promise.all([
      db.select().from(recommendationOutcomes),
      db.select().from(patternLibrary),
    ]);
    const activePatterns = patterns.filter((p: any) => p.isActive).length;
    const confirmed = outcomes.filter((o:any)=>o.outcomeStatus==="confirmed");
    const accuracy = outcomes.length>0 ? Math.round(outcomes.reduce((sum:number,o:any)=>sum+(o.accuracyScore||0),0)/outcomes.length) : 0;
    const confirmedRate = outcomes.length>0 ? Math.round((confirmed.length/outcomes.length)*100) : 0;
    const withTime = outcomes.filter((o:any)=>o.timeToDevelopmentDays);
    const avgTimeToDev = withTime.length>0 ? Math.round(withTime.reduce((sum:number,o:any)=>sum+(o.timeToDevelopmentDays||0),0)/withTime.length) : 0;
    const outcomesByStatus: Record<string,number> = { pending:0, confirmed:0, partially_confirmed:0, incorrect:0, expired:0 };
    for (const o of outcomes) { outcomesByStatus[o.outcomeStatus] = (outcomesByStatus[o.outcomeStatus] || 0) + 1; }
    return { totalOutcomes:outcomes.length, confirmedCount:confirmed.length, accuracy, confirmedRate, activePatterns, avgTimeToDevelopmentDays:avgTimeToDev, outcomesByStatus };
  }),
});
