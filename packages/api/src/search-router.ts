/**
 * Global Search Router
 * Search across events, patterns, recommendations by county/city/state/project/permit.
 * AI-ranked by relevance (confidence * recency boost).
 */

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

export const searchRouter = createRouter({
  global: publicQuery
    .input(z.object({
      query: z.string().min(1).max(100),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ input, ctx }) => {
      const d1 = (ctx as any).env?.DB as D1Database;
      if (!d1) return { events: [], patterns: [], recommendations: [], total: 0 };

      const q = `%${input.query}%`;
      const limit = input.limit;

      // Search events
      const eventResult = await d1.prepare(
        `SELECT * FROM signalcore_events 
         WHERE county LIKE ? OR city LIKE ? OR state LIKE ? OR title LIKE ? OR description LIKE ? OR eventType LIKE ?
         ORDER BY confidence DESC, ingestedAt DESC LIMIT ?`
      ).bind(q, q, q, q, q, q, limit).all();

      // Search patterns
      const patternResult = await d1.prepare(
        `SELECT * FROM signalcore_patterns 
         WHERE county LIKE ? OR state LIKE ? OR name LIKE ? OR description LIKE ? OR patternType LIKE ?
         ORDER BY confidence DESC LIMIT ?`
      ).bind(q, q, q, q, q, limit).all();

      // Search recommendations
      const recResult = await d1.prepare(
        `SELECT * FROM signalcore_recommendations 
         WHERE jurisdiction LIKE ? OR summary LIKE ? OR rationale LIKE ?
         ORDER BY trustScore DESC LIMIT ?`
      ).bind(q, q, q, limit).all();

      const events = (eventResult.results || []) as any[];
      const patterns = (patternResult.results || []) as any[];
      const recommendations = (recResult.results || []) as any[];

      return {
        events,
        patterns,
        recommendations,
        total: events.length + patterns.length + recommendations.length,
      };
    }),

  // Search by specific entity type
  byType: publicQuery
    .input(z.object({
      query: z.string().min(1).max(100),
      type: z.enum(["county", "city", "state", "project", "permit", "utility", "road", "planning"]),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ input, ctx }) => {
      const d1 = (ctx as any).env?.DB as D1Database;
      if (!d1) return [];

      const q = `%${input.query}%`;
      const limit = input.limit;

      let sql: string;
      switch (input.type) {
        case "county":
          sql = `SELECT * FROM signalcore_events WHERE county LIKE ? ORDER BY ingestedAt DESC LIMIT ?`;
          break;
        case "city":
          sql = `SELECT * FROM signalcore_events WHERE city LIKE ? ORDER BY ingestedAt DESC LIMIT ?`;
          break;
        case "state":
          sql = `SELECT * FROM signalcore_events WHERE state LIKE ? ORDER BY ingestedAt DESC LIMIT ?`;
          break;
        case "project":
          sql = `SELECT * FROM signalcore_recommendations WHERE summary LIKE ? OR rationale LIKE ? ORDER BY trustScore DESC LIMIT ?`;
          break;
        case "permit":
          sql = `SELECT * FROM signalcore_events WHERE eventType LIKE '%permit%' AND (title LIKE ? OR description LIKE ?) ORDER BY ingestedAt DESC LIMIT ?`;
          break;
        case "utility":
          sql = `SELECT * FROM signalcore_events WHERE dataSource LIKE '%Duke%' OR description LIKE ? ORDER BY ingestedAt DESC LIMIT ?`;
          break;
        case "road":
          sql = `SELECT * FROM signalcore_events WHERE dataSource LIKE '%DOT%' OR description LIKE ? ORDER BY ingestedAt DESC LIMIT ?`;
          break;
        case "planning":
          sql = `SELECT * FROM signalcore_events WHERE eventType LIKE '%planning%' OR dataSource LIKE '%Planning%' ORDER BY ingestedAt DESC LIMIT ?`;
          break;
        default:
          sql = `SELECT * FROM signalcore_events WHERE county LIKE ? ORDER BY ingestedAt DESC LIMIT ?`;
      }

      const result = await d1.prepare(sql).bind(q, q, limit).all();
      return (result.results || []) as any[];
    }),
});
