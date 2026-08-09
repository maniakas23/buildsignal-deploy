const API_BASE = process.env.API_BASE || "https://api.buildsignal.net";

// ─── Helpers ───
async function fetchApi(path, opts = {}) {
  const res = await fetch(API_BASE + path, opts);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

async function apiGet(path) {
  return fetchApi(path, { headers: { Accept: "application/json" } });
}

async function apiPost(path, body) {
  return fetchApi(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
}

// ─── Test Runner ───
const results = { pass: 0, fail: 0, critical: 0, warnings: 0, details: [] };

async function test(name, fn) {
  try {
    const r = await fn();
    if (r.pass) {
      results.pass++;
      console.log("  PASS:", name);
    } else {
      results.fail++;
      if (r.critical) results.critical++;
      else results.warnings++;
      console.log(r.critical ? "  CRITICAL FAIL:" : "  WARNING:", name, "—", r.message);
    }
    results.details.push({ name, ...r });
  } catch (e) {
    results.fail++;
    results.critical++;
    console.log("  CRITICAL FAIL:", name, "—", e.message);
    results.details.push({ name, pass: false, critical: true, message: e.message });
  }
}

// ─── Run all gates ───
(async () => {
  console.log("=== BuildSignal Certification Truth Tests ===");
  console.log("API:", API_BASE);
  console.log("Time:", new Date().toISOString());
  console.log();

  // ─── Gate 1: LIVE opportunities reference LIVE evidence ───
  await test("LIVE opportunities reference LIVE evidence", async () => {
    const data = await apiGet("/api/v1/opportunities?provenance=LIVE");
    const ops = data.opportunities || [];
    if (!ops.length) return { pass: false, message: "No LIVE opportunities", critical: true };
    const missingEvidence = ops.filter(o => !o.provenance || o.provenance !== "LIVE");
    if (missingEvidence.length > 0) return { pass: false, message: `${missingEvidence.length} missing provenance`, critical: true };
    return { pass: true };
  });

  // ─── Gate 2: LIVE signals have source providers ───
  await test("LIVE signals have source providers", async () => {
    const data = await apiGet("/api/v1/search?q=building");
    const signals = data.results || [];
    const liveSignals = signals.filter(s => s.provenance === "LIVE");
    if (!liveSignals.length) return { pass: false, message: "No LIVE signals in search", critical: true };
    const missingSource = liveSignals.filter(s => !s.sourceProvider);
    if (missingSource.length > 0) return { pass: false, message: `${missingSource.length} missing sourceProvider`, critical: true };
    return { pass: true };
  });

  // ─── Gate 3-6: Provenance isolation ───
  for (const prov of ["SEED", "SAMPLE", "TEST", "SIMULATED"]) {
    await test(`${prov} excluded from LIVE query`, async () => {
      const data = await apiGet(`/api/v1/opportunities?provenance=LIVE`);
      const contaminated = (data.opportunities || []).filter(o => o.provenance === prov);
      if (contaminated.length > 0) return { pass: false, message: `${contaminated.length} ${prov} in LIVE`, critical: true };
      return { pass: true };
    });
  }

  // ─── Gate 7: BS-SCORE determinism ───
  await test("BS-SCORE is deterministic (same input → same score)", async () => {
    const d1 = await apiGet("/api/v1/opportunities?provenance=LIVE");
    const d2 = await apiGet("/api/v1/opportunities?provenance=LIVE");
    const ops1 = d1.opportunities || [];
    const ops2 = d2.opportunities || [];
    if (ops1.length !== ops2.length) return { pass: false, message: "Count mismatch" };
    for (let i = 0; i < ops1.length; i++) {
      if (ops1[i].score !== ops2[i].score) return { pass: false, message: `Score drift: ${ops1[i].score} vs ${ops2[i].score}` };
    }
    return { pass: true };
  });

  // ─── Gate 8: Provider IDs stable ───
  await test("Provider IDs are stable", async () => {
    const d1 = await apiGet("/api/v1/freshness");
    const d2 = await apiGet("/api/v1/freshness");
    const p1 = (d1.providers || []).map(p => p.id).sort().join(",");
    const p2 = (d2.providers || []).map(p => p.id).sort().join(",");
    if (p1 !== p2) return { pass: false, message: `Provider IDs changed: ${p1} vs ${p2}` };
    return { pass: true };
  });

  // ─── Gate 9: API returns real data ───
  await test("API returns real data (not empty mock)", async () => {
    const data = await apiGet("/api/v1/opportunities");
    if (!data.opportunities || data.opportunities.length === 0) return { pass: false, message: "Empty opportunities", critical: true };
    return { pass: true };
  });

  // ─── Gate 10: Signals have source dates ───
  await test("Signals have source dates (not all current)", async () => {
    const data = await apiGet("/api/v1/search?q=raleigh");
    const signals = data.results || [];
    if (!signals.length) return { pass: false, message: "No signals" };
    const withDates = signals.filter(s => s.publishedAt && s.publishedAt > 0);
    if (withDates.length === 0) return { pass: false, message: "No signals have publishedAt" };
    return { pass: true };
  });

  // ─── Gate 11: No unsupported geospatial claims ───
  await test("No unsupported geospatial claims in API", async () => {
    const data = await apiGet("/api/v1/opportunities");
    const ops = data.opportunities || [];
    for (const o of ops) {
      if (o.geoAccuracy && [" rooftop", "parcel", "building"].some(a => (o.geoAccuracy || "").toLowerCase().includes(a))) {
        return { pass: false, message: `Unsupported geo claim on ${o.id}` };
      }
    }
    return { pass: true };
  });

  // ─── Gate 12: Empty provenance query returns empty array (not error) ───
  await test("Empty provenance query returns empty array (not error)", async () => {
    const data = await apiGet("/api/v1/opportunities?provenance=NONEXISTENT");
    if (data.error) return { pass: false, message: `Error: ${data.error}`, critical: true };
    if (!Array.isArray(data.opportunities)) return { pass: false, message: "Not an array" };
    return { pass: true };
  });

  // ─── Gate 13: LIVE current data exists ───
  await test("LIVE current data exists in system", async () => {
    const data = await apiGet("/api/v1/freshness");
    const events = data.events || {};
    const liveCount = events.LIVE || 0;
    if (liveCount === 0) return { pass: false, message: "No LIVE events", critical: true };
    return { pass: true };
  });

  // ─── Gate 14: Freshness classification is computed ───
  await test("Freshness classification is computed", async () => {
    const data = await apiGet("/api/v1/opportunities");
    const ops = data.opportunities || [];
    if (ops.length === 0) return { pass: false, message: "No opportunities" };
    const withFreshness = ops.filter(o => o.freshness && o.freshness !== "unknown");
    if (withFreshness.length === 0) return { pass: false, message: "No freshness computed" };
    return { pass: true };
  });

  // ─── Gate 15: Search endpoint returns real permit data ───
  await test("Search endpoint returns real permit data", async () => {
    const data = await apiGet("/api/v1/search?q=raleigh");
    const results = data.results || [];
    if (results.length === 0) return { pass: false, message: "Search returned empty" };
    const hasPermits = results.some(r => (r.title || "").toLowerCase().includes("permit") || (r.description || "").toLowerCase().includes("building"));
    if (!hasPermits) return { pass: false, message: "No permit data in search results" };
    return { pass: true };
  });

  // ─── Gate 16: Staleness alert endpoint returns status ───
  await test("Staleness alert endpoint returns status", async () => {
    const data = await apiGet("/api/v1/staleness-alert");
    if (data.error) return { pass: false, message: `Error: ${data.error}` };
    if (typeof data.newestRecord !== "number") return { pass: false, message: "Missing newestRecord" };
    return { pass: true };
  });

  // ─── Gate 17: Alert generation produces verifiable alerts ───
  await test("Alert generation produces verifiable alerts", async () => {
    const gen = await apiPost("/api/v1/alerts/generate", { opportunityId: "opp-8", userId: 1, organizationId: 1 });
    if (!gen.alertId) return { pass: false, message: "No alertId returned" };
    const alerts = await apiGet("/api/v1/alerts?userId=1");
    const found = (alerts.alerts || []).some(a => a.alertId === gen.alertId);
    if (!found) return { pass: false, message: `Alert ${gen.alertId} not retrievable` };
    return { pass: true };
  });

  // ─── Gate 18: Reports contain evidence but no forecasts ───
  await test("Reports contain evidence but no forecasts", async () => {
    const reports = await apiGet("/api/v1/reports?userId=1");
    const reps = reports.reports || [];
    if (reps.length === 0) return { pass: false, message: "No reports found", critical: false };
    for (const r of reps) {
      const text = [r.executiveSummary, r.recommendedInvestigation, r.riskFactors].join(" ");
      const forecastPattern = /forecast|predict|projected future|will be completed|expected to|anticipate/i;
      if (forecastPattern.test(text)) {
        return { pass: false, message: `Report ${r.reportId} contains forecast language`, critical: true };
      }
    }
    return { pass: true };
  });

  // ─── Gate 19: Provider watermark updated ───
  await test("Provider registry shows ingestion activity", async () => {
    const data = await apiGet("/api/v1/freshness");
    const providers = data.providers || [];
    const activeProviders = providers.filter(p => (p.recordsIngested || 0) > 0);
    if (activeProviders.length === 0) return { pass: false, message: "No providers show ingestion activity", critical: true };
    return { pass: true };
  });

  // ─── Gate 20: Production signup creates real customer + organization + auth ───
  await test("Production signup creates real customer + organization + auth", async () => {
    // Use a unique email to avoid conflicts
    const uniqueEmail = `ci-test-${Date.now()}@buildsignal.example`;
    const registerBody = JSON.stringify({ "0": { json: { email: uniqueEmail, password: "SecurePass123!", name: "CI Test User" } } });
    const registerResp = await fetch(`${API_BASE}/api/trpc/auth.register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Origin": "https://buildsignal.net" },
      body: registerBody
    });
    if (!registerResp.ok) return { pass: false, message: `Register HTTP ${registerResp.status}`, critical: true };
    const regData = await registerResp.json();
    const userId = regData?.[0]?.result?.data?.userId;
    const orgId = regData?.[0]?.result?.data?.orgId;
    if (!userId || !orgId) return { pass: false, message: "Signup did not return userId and orgId", critical: true };

    // Login with the new account
    const loginBody = JSON.stringify({ "0": { json: { email: uniqueEmail, password: "SecurePass123!" } } });
    const loginResp = await fetch(`${API_BASE}/api/trpc/auth.login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Origin": "https://buildsignal.net" },
      body: loginBody
    });
    if (!loginResp.ok) return { pass: false, message: `Login HTTP ${loginResp.status}`, critical: true };
    const loginData = await loginResp.json();
    const token = loginData?.[0]?.result?.data?.token;
    if (!token) return { pass: false, message: "Login did not return token", critical: true };

    // Verify auth.me returns organizationId
    const meResp = await fetch(`${API_BASE}/api/trpc/auth.me`, {
      headers: { "Authorization": `Bearer ${token}`, "Origin": "https://buildsignal.net" }
    });
    if (!meResp.ok) return { pass: false, message: `auth.me HTTP ${meResp.status}`, critical: true };
    const meData = await meResp.json();
    const meOrgId = meData?.[0]?.result?.data?.organizationId;
    if (!meOrgId) return { pass: false, message: "auth.me did not return organizationId", critical: true };

    return { pass: true };
  });

  // ─── Gate 21: Freshness uses canonical thresholds ───
  await test("Freshness uses canonical thresholds (source event date, not ingestion date)", async () => {
    const data = await apiGet("/api/v1/opportunities?provenance=LIVE");
    const ops = data.opportunities || [];
    if (ops.length === 0) return { pass: false, message: "No LIVE opportunities", critical: false };

    // Every opportunity must have sourceEventDate
    const missingSourceDate = ops.filter(o => !o.sourceEventDate);
    if (missingSourceDate.length > 0) return { pass: false, message: `${missingSourceDate.length} opportunities missing sourceEventDate`, critical: true };

    // Verify freshness aligns with sourceEventDate, not createdAt
    const now = Math.floor(Date.now() / 1000);
    for (const o of ops) {
      const ageSeconds = now - o.sourceEventDate;
      let expectedFreshness = "unknown";
      if (ageSeconds < 86400) expectedFreshness = "current";
      else if (ageSeconds < 604800) expectedFreshness = "recent";
      else if (ageSeconds < 2592000) expectedFreshness = "stale";
      else expectedFreshness = "archived";

      if (o.freshness !== expectedFreshness) {
        return { pass: false, message: `Opportunity ${o.id}: expected ${expectedFreshness}, got ${o.freshness} (age=${ageSeconds}s)`, critical: true };
      }
    }

    // Verify staleness endpoint returns canonical freshness label
    const staleData = await apiGet("/api/v1/staleness-alert");
    const validFreshness = ["current", "recent", "stale", "archived", "unknown"];
    if (!validFreshness.includes(staleData.systemFreshness)) {
      return { pass: false, message: `Invalid systemFreshness: ${staleData.systemFreshness}`, critical: true };
    }

    return { pass: true };
  });

  // ─── Gate 22: Search endpoint defaults to LIVE only ───
  await test("Search endpoint defaults to LIVE only, requires explicit provenance for non-LIVE", async () => {
    // Default search (no provenance param) should return only LIVE
    const defaultData = await apiGet("/api/v1/search?q=raleigh");
    const defaultResults = defaultData.results || [];
    if (defaultResults.length === 0) return { pass: false, message: "Default search returned no results", critical: false };
    const nonLiveDefault = defaultResults.filter(r => r.provenance !== "LIVE");
    if (nonLiveDefault.length > 0) return { pass: false, message: `${nonLiveDefault.length} non-LIVE results in default search`, critical: true };

    // Explicit provenance=SEED should work
    const seedData = await apiGet("/api/v1/search?q=raleigh&provenance=SEED");
    const seedResults = seedData.results || [];
    if (seedResults.length > 0) {
      const nonSeed = seedResults.filter(r => r.provenance !== "SEED");
      if (nonSeed.length > 0) return { pass: false, message: `${nonSeed.length} non-SEED results when provenance=SEED requested`, critical: true };
    }

    return { pass: true };
  });

  console.log();

  // ─── Summary ───
  console.log("=== Results ===");
  console.log("Passed:", results.pass);
  console.log("Failed:", results.fail);
  console.log("Critical failures:", results.critical);
  console.log("Warnings:", results.warnings);
  console.log();

  if (results.critical > 0) {
    console.log("*** CERTIFICATION FAILED — Critical issues found ***");
    process.exit(1);
  }

  if (results.warnings > 0) {
    console.log("*** CERTIFICATION PASSED WITH WARNINGS ***");
  } else {
    console.log("*** CERTIFICATION PASSED ***");
  }

  process.exit(0);
})();
