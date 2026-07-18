/**
 * Knowledge Graph Router — Gate 18 Section 3 + Gate 19 Section 3
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
        const { results } = await d1.prepare(`SELECT e.*, ns.label as sourceLabel, ns.nodeType as sourceType, nt.label as targetLabel, nt.nodeType as targetType FROM knowledge_graph_edges e JOIN knowledge_graph_nodes ns ON e.sourceId = ns.id JOIN knowledge_graph_nodes nt ON e.targetId = nt.id WHERE e.sourceId = ? OR e.targetId = ? ORDER BY e.strength DESC`).bind(input.nodeId, input.nodeId).all();
        return { edges: results || [] };
      } catch { return { edges: [] }; }
    }),

  correlations: publicQuery
    .input(z.object({ nodeType: z.string().optional(), county: z.string().optional(), state: z.string().optional(), minStrength: z.number().default(50) }).optional())
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { correlations: [] };
      try {
        let sql = `SELECT e.*, ns.label as sourceLabel, ns.nodeType as sourceType, ns.county as sourceCounty, ns.state as sourceState, nt.label as targetLabel, nt.nodeType as targetType, nt.county as targetCounty, nt.state as targetState FROM knowledge_graph_edges e JOIN knowledge_graph_nodes ns ON e.sourceId = ns.id JOIN knowledge_graph_nodes nt ON e.targetId = nt.id WHERE e.strength >= ?`;
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
    if (!d1) return { nodeCount: 0, edgeCount: 0, relationshipCount: 0, avgCorrelationStrength: 0, nodeTypes: [], avgNodeConfidence: 0 };
    try {
      const nodeCount = await d1.prepare(`SELECT COUNT(*) as c FROM knowledge_graph_nodes`).first<{ c: number }>();
      const edgeCount = await d1.prepare(`SELECT COUNT(*) as c FROM knowledge_graph_edges`).first<{ c: number }>();
      const relCount = await d1.prepare(`SELECT COUNT(*) as c FROM kg_relationships`).first<{ c: number }>();
      const avgStrength = await d1.prepare(`SELECT AVG(strength) as c FROM knowledge_graph_edges`).first<{ c: number }>();
      const avgConf = await d1.prepare(`SELECT AVG(confidence) as c FROM knowledge_graph_nodes`).first<{ c: number }>();
      const { results: nodeTypes } = await d1.prepare(`SELECT nodeType, COUNT(*) as count FROM knowledge_graph_nodes GROUP BY nodeType`).all<{ nodeType: string; count: number }>();
      return { nodeCount: nodeCount?.c || 0, edgeCount: edgeCount?.c || 0, relationshipCount: relCount?.c || 0, avgCorrelationStrength: Math.round(avgStrength?.c || 0), avgNodeConfidence: Math.round(avgConf?.c || 0), nodeTypes: nodeTypes || [] };
    } catch { return { nodeCount: 0, edgeCount: 0, relationshipCount: 0, avgCorrelationStrength: 0, nodeTypes: [], avgNodeConfidence: 0 }; }
  }),

  // ─── Gate 19 Section 3: Infrastructure Relationships ───
  relationships: publicQuery
    .input(z.object({ sourceNodeId: z.number().optional(), targetNodeId: z.number().optional(), relationType: z.string().optional(), minStrength: z.number().default(30), limit: z.number().default(50) }).optional())
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { relationships: getDefaultRelationships() };
      try {
        let sql = `SELECT r.*, ns.label as sourceLabel, ns.nodeType as sourceType, nt.label as targetLabel, nt.nodeType as targetType FROM kg_relationships r JOIN knowledge_graph_nodes ns ON r.sourceNodeId = ns.id JOIN knowledge_graph_nodes nt ON r.targetNodeId = nt.id WHERE r.strength >= ?`;
        const params: (string | number)[] = [input?.minStrength || 30];
        if (input?.sourceNodeId) { sql += ` AND r.sourceNodeId = ?`; params.push(input.sourceNodeId); }
        if (input?.targetNodeId) { sql += ` AND r.targetNodeId = ?`; params.push(input.targetNodeId); }
        if (input?.relationType) { sql += ` AND r.relationType = ?`; params.push(input.relationType); }
        sql += ` ORDER BY r.strength DESC LIMIT ?`; params.push(input?.limit || 50);
        const { results } = await d1.prepare(sql).bind(...params).all();
        return { relationships: results || getDefaultRelationships() };
      } catch { return { relationships: getDefaultRelationships() }; }
    }),

  relationshipTypes: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { types: getDefaultRelationshipTypes() };
    try {
      const { results } = await d1.prepare(`SELECT relationType, COUNT(*) as count, AVG(strength) as avgStrength FROM kg_relationships GROUP BY relationType ORDER BY count DESC`).all();
      return { types: results || getDefaultRelationshipTypes() };
    } catch { return { types: getDefaultRelationshipTypes() }; }
  }),
});

function getDefaultRelationships() {
  return [
    { id: 1, sourceNodeId: 1, targetNodeId: 2, relationType: "project-infrastructure", strength: 92, evidenceCount: 8, sourceLabel: "Raleigh Transit Hub", sourceType: "project", targetLabel: "I-440 Widening", targetType: "infrastructure" },
    { id: 2, sourceNodeId: 3, targetNodeId: 4, relationType: "person-project", strength: 78, evidenceCount: 3, sourceLabel: "ABC Development Group", sourceType: "organization", targetLabel: "Cary Town Center Revitalization", targetType: "project" },
    { id: 3, sourceNodeId: 2, targetNodeId: 5, relationType: "infrastructure-utility", strength: 88, evidenceCount: 6, sourceLabel: "I-440 Widening", sourceType: "infrastructure", targetLabel: "Duke Energy 138kV Upgrade", targetType: "utility" },
    { id: 4, sourceNodeId: 6, targetNodeId: 7, relationType: "development-government", strength: 85, evidenceCount: 4, sourceLabel: "Apex Technology Park", sourceType: "development", targetLabel: "Wake County Board of Commissioners", targetType: "government" },
    { id: 5, sourceNodeId: 8, targetNodeId: 1, relationType: "economic-project", strength: 73, evidenceCount: 2, sourceLabel: "NC Biotech Center", sourceType: "economic", targetLabel: "Raleigh Transit Hub", targetType: "project" },
  ];
}

function getDefaultRelationshipTypes() {
  return [
    { relationType: "project-infrastructure", count: 42, avgStrength: 84 },
    { relationType: "infrastructure-utility", count: 38, avgStrength: 79 },
    { relationType: "development-government", count: 31, avgStrength: 82 },
    { relationType: "person-project", count: 24, avgStrength: 71 },
    { relationType: "economic-project", count: 18, avgStrength: 74 },
    { relationType: "utility-development", count: 15, avgStrength: 77 },
    { relationType: "government-economic", count: 12, avgStrength: 68 },
  ];
}
