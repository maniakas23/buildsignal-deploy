import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { mapMarkers } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const mapRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        type: z.enum(["project", "permit", "zoning", "utility", "hotspot"]).optional(),
        county: z.string().optional(),
        state: z.string().optional(),
        minScore: z.number().optional(),
        bounds: z.object({
          north: z.number(), south: z.number(), east: z.number(), west: z.number(),
        }).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      let query = db.select().from(mapMarkers);
      if (input?.type) { query = query.where(eq(mapMarkers.type, input.type)) as typeof query; }
      if (input?.county) { query = query.where(eq(mapMarkers.county, input.county)) as typeof query; }
      if (input?.state) { query = query.where(eq(mapMarkers.state, input.state)) as typeof query; }
      return query.orderBy(desc(mapMarkers.score)).limit(500);
    }),

  search: publicQuery
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = getDb();
      const all = await db.select().from(mapMarkers).limit(100);
      const q = input.query.toLowerCase();
      return all.filter((m) => m.title.toLowerCase().includes(q) || m.county.toLowerCase().includes(q));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db.select().from(mapMarkers).where(eq(mapMarkers.id, input.id)).limit(1);
      return results[0] ?? null;
    }),

  seed: adminQuery.mutation(async () => {
    const db = getDb();
    const existing = await db.select({ count: mapMarkers.id }).from(mapMarkers).limit(1);
    if (existing.length > 0) return { seeded: false, reason: "Data exists" };

    const demoMarkers = [
      { type: "project" as const, title: "County Line Road Widening", county: "Mecklenburg", state: "NC", lat: "35.2271", lng: "-80.8431", score: 92, confidence: 94, status: "active" },
      { type: "project" as const, title: "Highway 29 Interchange", county: "Guilford", state: "NC", lat: "36.0726", lng: "-79.7920", score: 88, confidence: 96, status: "active" },
      { type: "permit" as const, title: "South Main Rezoning", county: "Wake", state: "NC", lat: "35.7796", lng: "-78.6382", score: 45, confidence: 78, status: "pending" },
      { type: "utility" as const, title: "Duke Energy Pre-Build", county: "Mecklenburg", state: "NC", lat: "35.2087", lng: "-80.8308", score: 76, confidence: 88, status: "active" },
      { type: "hotspot" as const, title: "Data Center Corridor", county: "Cabarrus", state: "NC", lat: "35.4168", lng: "-80.5883", score: 95, confidence: 93, status: "hot" },
      { type: "zoning" as const, title: "Northwood Annexation", county: "Union", state: "NC", lat: "34.9834", lng: "-80.5516", score: 78, confidence: 82, status: "active" },
      { type: "project" as const, title: "I-485 Expansion Phase 3", county: "Mecklenburg", state: "NC", lat: "35.1495", lng: "-80.9795", score: 85, confidence: 90, status: "active" },
      { type: "permit" as const, title: "Riverside Industrial Complex", county: "Durham", state: "NC", lat: "35.9940", lng: "-78.8986", score: 67, confidence: 81, status: "review" },
      { type: "utility" as const, title: "Charlotte Water Main Extension", county: "Mecklenburg", state: "NC", lat: "35.3082", lng: "-80.7467", score: 72, confidence: 85, status: "active" },
      { type: "hotspot" as const, title: "Biotech Research Park", county: "Wake", state: "NC", lat: "35.8032", lng: "-78.7118", score: 89, confidence: 91, status: "hot" },
    ];

    for (const marker of demoMarkers) { await db.insert(mapMarkers).values(marker); }
    return { seeded: true, count: demoMarkers.length };
  }),
});
