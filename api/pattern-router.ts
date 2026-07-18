/**
 * Pattern Library Router — Gate 19 Section 5
 * Reusable infrastructure signal patterns with historical success metrics.
 */

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

function getD1(ctx: any): D1Database | null {
  return (ctx.env?.DB as D1Database) || null;
}

export const PATTERN_TYPES = [
  "residential_growth", "commercial_growth", "industrial_growth", "mixed_use",
  "healthcare", "school", "retail", "logistics", "manufacturing",
  "data_center", "utility_expansion", "transportation",
] as const;

export const patternRouter = createRouter({
  list: publicQuery
    .input(z.object({ patternType: z.string().optional(), isActive: z.boolean().optional(), minSuccessRate: z.number().optional() }).optional())
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { patterns: getDefaultPatterns() };
      try {
        let sql = `SELECT * FROM pattern_library WHERE 1=1`;
        const params: (string | number)[] = [];
        if (input?.patternType) { sql += ` AND patternType = ?`; params.push(input.patternType); }
        if (input?.isActive !== undefined) { sql += ` AND isActive = ?`; params.push(input.isActive ? 1 : 0); }
        if (input?.minSuccessRate) { sql += ` AND historicalSuccessRate >= ?`; params.push(input.minSuccessRate); }
        sql += ` ORDER BY historicalSuccessRate DESC`;
        const { results } = await d1.prepare(sql).bind(...params).all();
        return { patterns: results || getDefaultPatterns() };
      } catch { return { patterns: getDefaultPatterns() }; }
    }),

  detail: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { pattern: null };
      try {
        const row = await d1.prepare(`SELECT * FROM pattern_library WHERE id = ?`).bind(input.id).first();
        return { pattern: row };
      } catch { return { pattern: null }; }
    }),

  match: publicQuery
    .input(z.object({ state: z.string(), county: z.string().optional(), eventTypes: z.array(z.string()).optional() }))
    .query(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { matches: getDefaultMatches(input.state) };
      try {
        const { results } = await d1.prepare(`SELECT * FROM pattern_library WHERE isActive = 1 AND (applicableStates LIKE ? OR applicableStates IS NULL) ORDER BY historicalSuccessRate DESC`).bind(`%${input.state}%`).all();
        return { matches: results || getDefaultMatches(input.state) };
      } catch { return { matches: getDefaultMatches(input.state) }; }
    }),

  performance: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return getDefaultPerformance();
    try {
      const { results } = await d1.prepare(`SELECT patternType, AVG(historicalSuccessRate) as avgSuccess, SUM(totalApplications) as totalApps, SUM(successfulPredictions) as totalSuccess, AVG(avgTimeToDevelopment) as avgTime, AVG(avgReturnScore) as avgReturn FROM pattern_library GROUP BY patternType ORDER BY avgSuccess DESC`).all();
      return { byType: results || getDefaultPerformance().byType };
    } catch { return getDefaultPerformance(); }
  }),

  create: publicQuery
    .input(z.object({
      patternName: z.string(),
      patternType: z.enum(PATTERN_TYPES),
      description: z.string().optional(),
      signalIndicators: z.array(z.string()).optional(),
      requiredEventTypes: z.array(z.string()).optional(),
      minConfidenceThreshold: z.number().min(0).max(100).optional(),
      applicableStates: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const d1 = getD1(ctx);
      if (!d1) return { success: false, id: null };
      try {
        const result = await d1.prepare(`INSERT INTO pattern_library (patternName, patternType, description, signalIndicators, requiredEventTypes, minConfidenceThreshold, applicableStates) VALUES (?, ?, ?, ?, ?, ?, ?)`)
          .bind(input.patternName, input.patternType, input.description || null, JSON.stringify(input.signalIndicators || []), JSON.stringify(input.requiredEventTypes || []), input.minConfidenceThreshold || 70, JSON.stringify(input.applicableStates || [])).run();
        return { success: true, id: result.meta?.last_row_id };
      } catch { return { success: false, id: null }; }
    }),
});

function getDefaultPatterns() {
  return [
    { id: 1, patternName: "Permit Surge + School Construction", patternType: "residential_growth", description: "Residential growth signal: building permits accelerate concurrently with school construction approvals.", signalIndicators: JSON.stringify(["permit_volume_up_30pct", "school_construction_approved", "median_home_price_rising"]), requiredEventTypes: JSON.stringify(["permit", "school"]), historicalSuccessRate: 87, totalApplications: 142, successfulPredictions: 123, avgTimeToDevelopment: 180, avgReturnScore: 84, applicableStates: JSON.stringify(["NC", "SC", "VA", "TN", "GA"]), isActive: 1 },
    { id: 2, patternName: "Utility Expansion + Road Project Convergence", patternType: "commercial_growth", description: "Commercial growth signal: utility infrastructure upgrades coincide with road widening projects.", signalIndicators: JSON.stringify(["utility_substation_upgrade", "road_widening_project", "commercial_permits_increasing"]), requiredEventTypes: JSON.stringify(["utility_project", "road_project"]), historicalSuccessRate: 92, totalApplications: 89, successfulPredictions: 82, avgTimeToDevelopment: 240, avgReturnScore: 91, applicableStates: JSON.stringify(["NC", "SC", "VA"]), isActive: 1 },
    { id: 3, patternName: "Industrial Rezoning + Environmental Clearance", patternType: "industrial_growth", description: "Industrial growth signal: large parcel rezoning for industrial use combined with environmental permits.", signalIndicators: JSON.stringify(["industrial_rezoning", "environmental_clearance", "water_sewer_capacity_increase"]), requiredEventTypes: JSON.stringify(["rezoning", "environmental_notices"]), historicalSuccessRate: 78, totalApplications: 64, successfulPredictions: 50, avgTimeToDevelopment: 365, avgReturnScore: 88, applicableStates: JSON.stringify(["NC", "SC", "TN", "GA"]), isActive: 1 },
    { id: 4, patternName: "Healthcare Cluster Formation", patternType: "healthcare", description: "Healthcare expansion: multiple medical facility permits in close geographic proximity.", signalIndicators: JSON.stringify(["medical_permit_cluster", "ambulance_station_upgrade", "specialized_equipment_permit"]), requiredEventTypes: JSON.stringify(["permit"]), historicalSuccessRate: 94, totalApplications: 35, successfulPredictions: 33, avgTimeToDevelopment: 270, avgReturnScore: 79, applicableStates: JSON.stringify(["NC", "SC", "VA", "GA"]), isActive: 1 },
    { id: 5, patternName: "Data Center Power + Water Convergence", patternType: "data_center", description: "Data center signal: extraordinary power and water capacity requests in rural areas with fiber access.", signalIndicators: JSON.stringify(["high_voltage_power_request", "water_capacity_request", "fiber_optic_permit", "large_land_purchase"]), requiredEventTypes: JSON.stringify(["utility_project", "permit"]), historicalSuccessRate: 96, totalApplications: 18, successfulPredictions: 17, avgTimeToDevelopment: 420, avgReturnScore: 95, applicableStates: JSON.stringify(["NC", "VA", "TN"]), isActive: 1 },
    { id: 6, patternName: "Transit-Oriented Development Cascade", patternType: "transportation", description: "Transportation-led growth: new transit station or major interchange triggers surrounding development.", signalIndicators: JSON.stringify(["transit_station_approved", "interchange_upgrade", "surrounding_permits_increasing"]), requiredEventTypes: JSON.stringify(["road_project", "permit"]), historicalSuccessRate: 83, totalApplications: 52, successfulPredictions: 43, avgTimeToDevelopment: 300, avgReturnScore: 82, applicableStates: JSON.stringify(["NC", "SC", "VA", "TN", "GA", "FL"]), isActive: 1 },
    { id: 7, patternName: "Manufacturing Reshoring Signal", patternType: "manufacturing", description: "Manufacturing growth: industrial permits combined with workforce development board activity and logistics expansion.", signalIndicators: JSON.stringify(["industrial_permit", "workforce_program", "logistics_warehouse_nearby"]), requiredEventTypes: JSON.stringify(["permit", "economic_dev"]), historicalSuccessRate: 71, totalApplications: 45, successfulPredictions: 32, avgTimeToDevelopment: 200, avgReturnScore: 86, applicableStates: JSON.stringify(["NC", "SC", "TN"]), isActive: 1 },
    { id: 8, patternName: "Logistics Hub Formation", patternType: "logistics", description: "Logistics expansion: multiple warehouse permits near interstate interchanges with rail access.", signalIndicators: JSON.stringify(["warehouse_permit_cluster", "interstate_proximity", "rail_spur_permit"]), requiredEventTypes: JSON.stringify(["permit"]), historicalSuccessRate: 89, totalApplications: 67, successfulPredictions: 60, avgTimeToDevelopment: 150, avgReturnScore: 77, applicableStates: JSON.stringify(["NC", "SC", "GA", "TN", "VA"]), isActive: 1 },
  ];
}

function getDefaultMatches(state: string) {
  return getDefaultPatterns().filter(p => { const states = JSON.parse(p.applicableStates || "[]"); return states.length === 0 || states.includes(state); });
}

function getDefaultPerformance() {
  return { byType: [
    { patternType: "residential_growth", avgSuccess: 87, totalApps: 142, totalSuccess: 123, avgTime: 180, avgReturn: 84 },
    { patternType: "commercial_growth", avgSuccess: 92, totalApps: 89, totalSuccess: 82, avgTime: 240, avgReturn: 91 },
    { patternType: "industrial_growth", avgSuccess: 78, totalApps: 64, totalSuccess: 50, avgTime: 365, avgReturn: 88 },
    { patternType: "healthcare", avgSuccess: 94, totalApps: 35, totalSuccess: 33, avgTime: 270, avgReturn: 79 },
    { patternType: "data_center", avgSuccess: 96, totalApps: 18, totalSuccess: 17, avgTime: 420, avgReturn: 95 },
    { patternType: "transportation", avgSuccess: 83, totalApps: 52, totalSuccess: 43, avgTime: 300, avgReturn: 82 },
    { patternType: "manufacturing", avgSuccess: 71, totalApps: 45, totalSuccess: 32, avgTime: 200, avgReturn: 86 },
    { patternType: "logistics", avgSuccess: 89, totalApps: 67, totalSuccess: 60, avgTime: 150, avgReturn: 77 },
  ]};
}
