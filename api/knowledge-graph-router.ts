/**
 * Knowledge Graph Router — Gate 18 Section 3
 * Infrastructure Knowledge Graph: nodes, edges, correlations, relationships.
 */

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

function getD1(ctx: any): D1Database | null {
  return (ctx.env?.DB as D1Database) || null;
}

export const knowledgeGraphRouter = createRouter({
  nodes: publicQuery
    .input(z.object({ nodeType: z.string().optional(), county: z.string().optional(), state: z.string().optional() }).optional())
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { nodes: [] };
      try {
        let sql = `SELECT * FROM knowledge_graph_nodes WHERE 1=1`;
        const params: (string | number)[] = [];
        if (input?.nodeType) { sql += ` AND nodeType = ?`; params.push(input.nodeType); }
        if (input?.county) { sql += ` AND county = ?`; params.push(input.county); }
        if (input?.state) { sql += ` AND state = ?`; params.push(input.state); }
        sql += ` ORDER BY confidence DESC LIMIT 50`;
        const { results } = await d1.prepare(sql).bind(...params).all();
        return { nodes: results || [] };
      } catch { return { nodes: [] }; }
    }),

  edges: publicQuery
    .input(z.object({ nodeId: z.number() }))
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { edges: [] };
      try {
        const { results } = await d1.prepare(
          `SELECT e.*, ns.label as sourceLabel, ns.nodeType as sourceType, nt.label as targetLabel, nt.nodeType as targetType
           FROM knowledge_graph_edges e
           JOIN knowledge_graph_nodes ns ON e.sourceId = ns.id
           JOIN knowledge_graph_nodes nt ON e.targetId = nt.id
           WHERE e.sourceId = ? OR e.targetId = ? ORDER BY e.strength DESC`
        ).bind(input.nodeId, input.nodeId).all();
        return { edges: results || [] };
      } catch { return { edges: [] }; }
    }),

  correlations: publicQuery
    .input(z.object({ nodeType: z.string().optional(), county: z.string().optional(), state: z.string().optional(), minStrength: z.number().default(50) }).optional())
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { correlations: [] };
      try {
        let sql = `SELECT e.*, ns.label as sourceLabel, ns.nodeType as sourceType, ns.county as sourceCounty, ns.state as sourceState,
                   nt.label as targetLabel, nt.nodeType as targetType, nt.county as targetCounty, nt.state as targetState
                   FROM knowledge_graph_edges e
                   JOIN knowledge_graph_nodes ns ON e.sourceId = ns.id
                   JOIN knowledge_graph_nodes nt ON e.targetId = nt.id
                   WHERE e.strength >= ?`;
        const params: (string | number)[] = [input?.minStrength || 50];
        if (input?.county) { sql += ` AND (ns.county = ? OR nt.county = ?)`; params.push(input.county, input.county); }
        if (input?.state) { sql += ` AND (ns.state = ? OR nt.state = ?)`; params.push(input.state, input.state); }
        if (input?.nodeType) { sql += ` AND (ns.nodeType = ? OR nt.nodeType = ?)`; params.push(input.nodeType, input.nodeType); }
        sql += ` ORDER BY e.strength DESC LIMIT 50`;
        const { results } = await d1.prepare(sql).bind(...params).all();
        return { correlations: results || [] };
      } catch { return { correlations: [] }; }
    }),

  stats: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { nodeCount: 0, edgeCount: 0, avgCorrelationStrength: 0, nodeTypes: [], avgNodeConfidence: 0 };
    try {
      const nodeCount = await d1.prepare(`SELECT COUNT(*) as c FROM knowledge_graph_nodes`).first<{ c: number }>();
      const edgeCount = await d1.prepare(`SELECT COUNT(*) as c FROM knowledge_graph_edges`).first<{ c: number }>();
      const avgStrength = await d1.prepare(`SELECT AVG(strength) as c FROM knowledge_graph_edges`).first<{ c: number }>();
      const avgConf = await d1.prepare(`SELECT AVG(confidence) as c FROM knowledge_graph_nodes`).first<{ c: number }>();
      const { results: nodeTypes } = await d1.prepare(`SELECT nodeType, COUNT(*) as count FROM knowledge_graph_nodes GROUP BY nodeType`).all<{ nodeType: string; count: number }>();
      return {
        nodeCount: nodeCount?.c || 0,
        edgeCount: edgeCount?.c || 0,
        avgCorrelationStrength: Math.round(avgStrength?.c || 0),
        avgNodeConfidence: Math.round(avgConf?.c || 0),
        nodeTypes: nodeTypes || [],
      };
    } catch { return { nodeCount: 0, edgeCount: 0, avgCorrelationStrength: 0, nodeTypes: [], avgNodeConfidence: 0 }; }
  }),
});
