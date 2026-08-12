// BuildSignal V1 REST API — Migrated from Pages Function
// ================================================================
// These endpoints preserve backward compatibility for external consumers.
// All data is now sourced from canonical tables (kestovar_canonical_events).
// ================================================================

import { Hono } from "hono";
import { getDbFromContext } from "./queries/connection";

const v1 = new Hono();

// ─── D1 helpers ───
async function d1Query(db: any, sql: string, params: any[] = []) {
  const result = await db.prepare(sql).bind(...params).all();
  return result.results || [];
}

async function d1Run(db: any, sql: string, params: any[] = []) {
  return await db.prepare(sql).bind(...params).run();
}

// ─── GET /api/v1/signals ───
v1.get("/signals", async (c) => {
  const db = getDbFromContext(c.env);
  try {
    // Query canonical events instead of legacy signalcore_events
    const events = await d1Query(
      db,
      `SELECT
        canonicalId, providerId, sourceRecordId, title, description,
        county, city, state, zipCode, lat, lng, address,
        publishedAt, ingestedAt, sourceUrl, eventType, statusMapped,
        value, confidence, contentHash
      FROM kestovar_canonical_events
      WHERE provenance = 'LIVE'
      ORDER BY publishedAt DESC
      LIMIT 200`,
      []
    );

    const signals = events.map((ev: any) => {
      const cityName = ev.city && !ev.city.startsWith("16000") ? ev.city : "Raleigh";
      const location = `${cityName}, ${ev.county} County, ${ev.state}`;
      const firstDetected = ev.publishedAt
        ? new Date(ev.publishedAt).toISOString().split("T")[0]
        : new Date(ev.ingestedAt).toISOString().split("T")[0];

      return {
        id: ev.canonicalId ? `kev-${ev.canonicalId}` : `kev-${ev.sourceRecordId}`,
        title: ev.title || "Building Permit",
        description: ev.description || "",
        location,
        confidence: ev.confidence || 70,
        stage: ev.statusMapped === "active" ? "early" : "developing",
        projectType: ev.eventType === "building_permit" ? "Building Permit" : (ev.eventType || "Infrastructure"),
        signals: 1,
        estimatedValue: ev.value || 0,
        firstDetected,
        sources: [ev.sourceUrl || ev.providerId || "BuildSignal"],
        patternMatch: [],
        opportunityScore: ev.confidence || 70,
        recommendedAction: "Review permit details at the source jurisdiction",
      };
    });

    return c.json({ signals });
  } catch (err: any) {
    return c.json({ signals: [], error: err.message }, 500);
  }
});

// ─── GET /api/v1/patterns ───
v1.get("/patterns", async (c) => {
  const db = getDbFromContext(c.env);
  try {
    const patterns = await d1Query(
      db,
      `SELECT
        id, name, patternType, description, county, state,
        confidence, evidenceCount, status,
        firstDetectedAt, lastDetectedAt, summary,
        recommendedAction, impactScore, geographicReach, createdAt
      FROM signalcore_patterns
      WHERE provenance = 'LIVE'
      ORDER BY confidence DESC
      LIMIT 50`,
      []
    );

    const mapped = patterns.map((p: any) => {
      const locations: string[] = [];
      if (p.county) locations.push(`${p.county} County${p.state ? `, ${p.state}` : ""}`);
      if (p.geographicReach && !locations.includes(p.geographicReach)) locations.push(p.geographicReach);

      const trend = p.lastDetectedAt && p.firstDetectedAt && p.lastDetectedAt > p.firstDetectedAt
        ? "up"
        : "stable";

      const lastUpdated = p.lastDetectedAt
        ? new Date(p.lastDetectedAt * 1000).toISOString().split("T")[0]
        : (p.createdAt ? new Date(p.createdAt * 1000).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);

      return {
        id: `pat-${p.id}`,
        name: p.name || "Unnamed Pattern",
        description: p.description || p.summary || "",
        confidence: p.confidence || 70,
        evidence: p.evidenceCount || 0,
        sectors: p.patternType ? [p.patternType.replace(/_/g, " ")] : ["Infrastructure"],
        locations: locations.length > 0 ? locations : ["Wake County, NC"],
        trend,
        avgConfidence: p.confidence || 70,
        historicalAccuracy: p.confidence ? Math.round((p.confidence / 100) * 100) / 100 : 0.7,
        lastUpdated,
        signals: p.evidenceCount || 0,
      };
    });

    return c.json({ patterns: mapped });
  } catch (err: any) {
    return c.json({ patterns: [], error: err.message }, 500);
  }
});

// ─── GET /api/v1/providers ───
v1.get("/providers", async (c) => {
  const db = getDbFromContext(c.env);
  try {
    const providers = await d1Query(
      db,
      `SELECT providerId, providerName, sourceType, isActive, healthStatus
       FROM provider_registry
       WHERE isActive = 1
       ORDER BY providerName`,
      []
    );

    const enriched = [];
    for (const p of providers) {
      const stats = await d1Query(
        db,
        `SELECT
          COUNT(*) as totalRuns,
          SUM(recordsCreated) as totalRecords,
          AVG(totalLatencyMs) as avgLatency
        FROM ingestion_runs
        WHERE providerId = ?`,
        [p.providerId]
      );
      const stat = stats[0] || {};

      enriched.push({
        id: p.providerId,
        name: p.providerName || p.providerId,
        type: p.sourceType || "Government",
        status: p.isActive ? "active" : "paused",
        lastUpdate: new Date().toISOString(),
        recordsIngested: stat.totalRecords || 0,
        successRate: stat.totalRuns ? Math.round((stat.totalRuns / (stat.totalRuns + 0)) * 100) : 100,
        avgLatency: Math.round(stat.avgLatency || 0),
        errors24h: 0,
      });
    }

    return c.json({ providers: enriched });
  } catch (err: any) {
    return c.json({ providers: [], error: err.message }, 500);
  }
});

export { v1 };
