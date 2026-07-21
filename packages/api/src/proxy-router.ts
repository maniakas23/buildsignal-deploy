/**
 * Kestovar Engine Proxy Routers — BuildSignal API
 *
 * BuildSignal Powered by Kestovar. Thin proxy routers that forward intelligence
 * requests to the Kestovar Engine via Cloudflare Workers service binding.
 * These replace the fat monolith routers that previously contained all business logic locally.
 *
 * Architecture: API Gateway → Service Binding → Kestovar Engine
 * The API no longer owns shared business logic — it only proxies to the Engine.
 */

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getEngineProxy } from "./lib/engine-proxy";
import { TRPCError } from "@trpc/server";

/**
 * Create a proxy router for an Engine namespace.
 * All procedures forward to the Engine via service binding.
 */
function createProxyRouter(namespace: string) {
  return createRouter({
    list: publicQuery
      .input(z.record(z.any()).optional())
      .query(async ({ input, ctx }) => {
        try {
          const engine = getEngineProxy(ctx.env);
          return (await engine.call(`${namespace}.list`, input || {})) as any;
        } catch (e) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Engine proxy failed: ${namespace}.list — ${(e as Error).message}` });
        }
      }),

    detail: publicQuery
      .input(z.record(z.any()).optional())
      .query(async ({ input, ctx }) => {
        try {
          const engine = getEngineProxy(ctx.env);
          return (await engine.call(`${namespace}.detail`, input || {})) as any;
        } catch (e) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Engine proxy failed: ${namespace}.detail — ${(e as Error).message}` });
        }
      }),

    match: publicQuery
      .input(z.record(z.any()).optional())
      .query(async ({ input, ctx }) => {
        try {
          const engine = getEngineProxy(ctx.env);
          return (await engine.call(`${namespace}.match`, input || {})) as any;
        } catch (e) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Engine proxy failed: ${namespace}.match — ${(e as Error).message}` });
        }
      }),

    performance: publicQuery
      .input(z.record(z.any()).optional())
      .query(async ({ input, ctx }) => {
        try {
          const engine = getEngineProxy(ctx.env);
          return (await engine.call(`${namespace}.performance`, input || {})) as any;
        } catch (e) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Engine proxy failed: ${namespace}.performance — ${(e as Error).message}` });
        }
      }),

    stats: publicQuery
      .input(z.record(z.any()).optional())
      .query(async ({ input, ctx }) => {
        try {
          const engine = getEngineProxy(ctx.env);
          return (await engine.call(`${namespace}.stats`, input || {})) as any;
        } catch (e) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Engine proxy failed: ${namespace}.stats — ${(e as Error).message}` });
        }
      }),

    create: publicQuery
      .input(z.record(z.any()).optional())
      .mutation(async ({ input, ctx }) => {
        try {
          const engine = getEngineProxy(ctx.env);
          return (await engine.call(`${namespace}.create`, input || {})) as any;
        } catch (e) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Engine proxy failed: ${namespace}.create — ${(e as Error).message}` });
        }
      }),

    // Generic passthrough for any Engine procedure
    _passthrough: publicQuery
      .input(z.object({ method: z.string(), args: z.record(z.any()).optional() }))
      .query(async ({ input, ctx }) => {
        try {
          const engine = getEngineProxy(ctx.env);
          return (await engine.call(`${namespace}.${input.method}`, input.args || {})) as any;
        } catch (e) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Engine proxy failed: ${namespace}.${input.method} — ${(e as Error).message}` });
        }
      }),
  });
}

// ─── Proxy Routers — Intelligence Layer ───
export const patternProxyRouter = createProxyRouter("pattern");
export const learningProxyRouter = createProxyRouter("learning");
export const recommendationProxyRouter = createProxyRouter("recommendation");
export const confidenceProxyRouter = createProxyRouter("confidence");
export const historicalProxyRouter = createProxyRouter("historical");

// ─── Proxy Routers — Data Layer ───
export const providerProxyRouter = createProxyRouter("provider");
export const pipelineProxyRouter = createProxyRouter("pipeline");
export const analyticsProxyRouter = createProxyRouter("analytics");
export const searchProxyRouter = createProxyRouter("search");
export const warehouseProxyRouter = createProxyRouter("warehouse");
export const enrichmentProxyRouter = createProxyRouter("enrichment");

// ─── Proxy Routers — Governance Layer ───
export const governanceProxyRouter = createProxyRouter("governance");
export const validationProxyRouter = createProxyRouter("validation");
export const qualityProxyRouter = createProxyRouter("quality");

// ─── Proxy Routers — Operations Layer ───
export const briefingProxyRouter = createProxyRouter("briefing");
export const expansionProxyRouter = createProxyRouter("expansion");
export const liveProxyRouter = createProxyRouter("live");

// ─── Engine Health Check ───
export const engineHealthRouter = createRouter({
  check: publicQuery.query(async ({ ctx }) => {
    try {
      const engine = getEngineProxy(ctx.env);
      return await engine.health();
    } catch {
      return { status: "unreachable", service: "kestovar-engine" };
    }
  }),
});
