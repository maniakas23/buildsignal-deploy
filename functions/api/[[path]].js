// BuildSignal API Proxy + Ingestion Handler — Pages Function
// Proxies all /api/* requests to the production API Worker
// Handles /api/ingestion/* directly for real data ingestion

const API_BASE = "https://api.buildsignal.net";

// ─── Hash function for content deduplication ───
function cyrb53(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

// ─── ArcGIS endpoint resolver ───
const KNOWN_ENDPOINTS = {
  raleigh_building_permits:
    "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Building_Permits_Pending/FeatureServer/0/query",
  wake_county_building_permits:
    "https://maps.wake.gov/arcgis/rest/services/Inspections/Building_Permits/MapServer/0/query",
};

function resolveEndpoint(providerId) {
  return KNOWN_ENDPOINTS[providerId] || null;
}

// ─── D1 helpers ───
async function d1Query(db, sql, params = []) {
  const result = await db.prepare(sql).bind(...params).all();
  return result.results || [];
}

async function d1Run(db, sql, params = []) {
  return await db.prepare(sql).bind(...params).run();
}

// ─── Attribute helpers ───
function getAttr(attrs, ...keys) {
  for (const k of keys) {
    const v = attrs[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return String(v);
    }
  }
  return undefined;
}

function msToDate(ms) {
  if (typeof ms === "number" && ms > 0) {
    return new Date(ms);
  }
  if (typeof ms === "string") {
    const n = Number(ms);
    if (!isNaN(n) && n > 0) return new Date(n);
  }
  return undefined;
}

// ─── Fetch ArcGIS data ───
async function fetchArcGIS(url, limit) {
  const params = new URLSearchParams({
    where: "1=1",
    outFields: "*",
    outSR: "4326",
    f: "json",
    resultRecordCount: String(limit),
  });
  const res = await fetch(`${url}?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`ArcGIS HTTP ${res.status}: ${res.statusText}`);
  }
  const data = await res.json();
  if (data.error) {
    throw new Error(`ArcGIS Error ${data.error.code}: ${data.error.message}`);
  }
  return data;
}

// ─── Ingestion Handlers ───
async function handleIngestionFetch(context) {
  const db = context.env.DB;
  const body = await context.request.json().catch(() => ({}));
  const providerId = body.providerId || "raleigh_building_permits";
  const limit = Math.min(Math.max(body.limit || 50, 1), 500);
  const overallStart = Date.now();
  let runId;
  let recordsObserved = 0;
  let recordsCreated = 0;
  let errorMsg;

  try {
    // Resolve endpoint
    const endpoint = resolveEndpoint(providerId);
    if (!endpoint) {
      throw new Error(`No endpoint configured for providerId: ${providerId}`);
    }

    // Create ingestion run
    const now = Math.floor(Date.now() / 1000);
    const runResult = await d1Run(db,
      `INSERT INTO ingestion_runs (providerId, startedAt, status, triggerType) VALUES (?, ?, ?, ?)`,
      [providerId, now, "running", "manual"]
    );
    runId = runResult.meta?.last_row_id || runResult.lastRowId;

    // Fetch from ArcGIS
    const fetchStart = Date.now();
    const data = await fetchArcGIS(endpoint, limit);
    const fetchLatency = Date.now() - fetchStart;
    const features = data.features || [];
    recordsObserved = features.length;

    // Parse and store raw records
    const parseStart = Date.now();
    for (const feature of features) {
      const attrs = feature.attributes || {};
      const rawPayload = JSON.stringify(attrs);
      const contentHash = cyrb53(rawPayload);

      const rawTitle =
        getAttr(attrs, "workclass", "permitclass", "type", "permit_type") ||
        `Permit ${getAttr(attrs, "permitnum", "permitnumber", "id", "objectid") || "unknown"}`;
      const rawDescription = getAttr(attrs, "proposedworkdescription", "description", "workdescription", "comments");
      const rawLocation = getAttr(attrs, "siteaddress", "address", "fulladdress", "location");
      const rawStatus = getAttr(attrs, "status", "permitstatus", "permit_status");
      const rawDates = JSON.stringify({
        applied: getAttr(attrs, "applieddate", "applied_date", "dateapplied"),
        issued: getAttr(attrs, "issueddate", "issued_date", "dateissued"),
        completed: getAttr(attrs, "completeddate", "completed_date", "datecompleted"),
        expires: getAttr(attrs, "expirationdate", "expiration_date", "expires"),
      });

      // Check for duplicates
      const existing = await d1Query(db,
        `SELECT id FROM raw_records WHERE providerId = ? AND rawPayload = ? LIMIT 1`,
        [providerId, rawPayload]
      );
      if (existing.length > 0) {
        await d1Run(db,
          `UPDATE raw_records SET observedAt = ? WHERE id = ?`,
          [now, existing[0].id]
        );
        continue;
      }

      let rawMetadata;
      if (feature.geometry) {
        rawMetadata = JSON.stringify({ geometry: feature.geometry });
      }

      const sourceRecordId = getAttr(attrs, "permitnum", "permitnumber", "id", "objectid") || String(attrs["OBJECTID"] || attrs["objectid"] || "");

      await d1Run(db,
        `INSERT INTO raw_records (providerId, sourceRecordId, sourceUrl, observedAt, ingestedAt, rawPayload, rawTitle, rawDescription, rawLocation, rawStatus, rawDates, rawMetadata, ingestionRunId, provenance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [providerId, sourceRecordId, endpoint, now, now, rawPayload, rawTitle, rawDescription, rawLocation, rawStatus, rawDates, rawMetadata || null, runId, "LIVE"]
      );
      recordsCreated++;
    }
    const parseLatency = Date.now() - parseStart;
    const totalLatency = Date.now() - overallStart;

    // Update run as completed
    await d1Run(db,
      `UPDATE ingestion_runs SET status = ?, completedAt = ?, recordsObserved = ?, recordsCreated = ?, fetchLatencyMs = ?, parseLatencyMs = ?, totalLatencyMs = ?, sourceRecordCount = ? WHERE id = ?`,
      ["completed", now, recordsObserved, recordsCreated, fetchLatency, parseLatency, totalLatency, recordsObserved, runId]
    );

    return jsonResponse({ success: true, runId, recordsObserved, recordsCreated });
  } catch (err) {
    errorMsg = err?.message || String(err);
    if (runId) {
      const now = Math.floor(Date.now() / 1000);
      await d1Run(db,
        `UPDATE ingestion_runs SET status = ?, completedAt = ?, recordsObserved = ?, recordsCreated = ?, error = ?, errorCode = ?, totalLatencyMs = ? WHERE id = ?`,
        ["failed", now, recordsObserved, recordsCreated, errorMsg, "FETCH_ERROR", Date.now() - overallStart, runId]
      );
    }
    return jsonResponse({ success: false, runId: runId || 0, recordsObserved, recordsCreated, error: errorMsg }, 500);
  }
}

async function handleIngestionNormalize(context) {
  const db = context.env.DB;
  const body = await context.request.json().catch(() => ({}));
  const runId = body.runId;
  const providerId = body.providerId || "raleigh_building_permits";

  if (!runId) {
    return jsonResponse({ success: false, error: "runId is required" }, 400);
  }

  const normalizeStart = Date.now();
  let recordsNormalized = 0;
  let recordsSkipped = 0;

  try {
    // Get raw records for this run
    const rows = await d1Query(db,
      `SELECT * FROM raw_records WHERE ingestionRunId = ? AND providerId = ? AND isDeleted = 0`,
      [runId, providerId]
    );

    // Get provider name
    const providers = await d1Query(db,
      `SELECT providerName FROM provider_registry WHERE providerId = ? OR providerName = ? LIMIT 1`,
      [providerId, providerId]
    );
    const providerName = providers[0]?.providerName || providerId;

    for (const row of rows) {
      if (!row.rawPayload) continue;
      const attrs = JSON.parse(row.rawPayload);
      const rawPayload = row.rawPayload;
      const hash = cyrb53(rawPayload);

      // Check for duplicate
      const dupCheck = await d1Query(db,
        `SELECT id FROM signalcore_events WHERE contentHash = ? LIMIT 1`,
        [hash]
      );
      if (dupCheck.length > 0) {
        recordsSkipped++;
        continue;
      }

      const workClass = getAttr(attrs, "workclass", "permitclass", "type", "permit_type");
      const workDesc = getAttr(attrs, "proposedworkdescription", "description", "workdescription", "comments");
      const title = row.rawTitle || (workClass && workDesc ? `${workClass}: ${workDesc}` : workClass || workDesc || "Building Permit");
      const description = row.rawDescription || workDesc || "";

      const address = row.rawLocation || getAttr(attrs, "siteaddress", "address", "fulladdress", "location") || "";
      let lat = null;
      let lng = null;

      if (row.rawMetadata) {
        try {
          const meta = JSON.parse(row.rawMetadata);
          if (meta.geometry?.y) lat = String(meta.geometry.y);
          if (meta.geometry?.x) lng = String(meta.geometry.x);
        } catch {
          // ignore
        }
      }
      if (!lat) lat = getAttr(attrs, "latitude", "lat", "y") || null;
      if (!lng) lng = getAttr(attrs, "longitude", "lng", "long", "x") || null;

      const appliedDateMs = attrs["applieddate"] || attrs["applied_date"] || attrs["dateapplied"];
      const publishedAt = msToDate(appliedDateMs);
      const publishedAtSeconds = publishedAt ? Math.floor(publishedAt.getTime() / 1000) : null;

      let city = getAttr(attrs, "city", "sitecity", "jurisdiction");
      if (!city && address) {
        const match = address.match(/,\s*([A-Za-z\s]+),?\s*(?:NC|North Carolina)?/i);
        if (match) city = match[1].trim();
      }
      if (!city) city = "Raleigh";

      const county = getAttr(attrs, "county", "sitecounty") || "Wake";
      const state = getAttr(attrs, "state", "sitestate") || "NC";
      const zipCode = getAttr(attrs, "zip", "zipcode", "postalcode", "sitezip") || null;
      const now = Math.floor(Date.now() / 1000);

      await d1Run(db,
        `INSERT INTO signalcore_events (providerId, externalId, eventType, title, description, county, state, city, zipCode, lat, lng, address, publishedAt, ingestedAt, confidence, status, contentHash, rawData, dataSource, provenance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [row.providerId, row.sourceRecordId || null, "building_permit", title, description, county, state, city, zipCode, lat, lng, address, publishedAtSeconds, now, 70, "active", hash, rawPayload, providerName, "LIVE"]
      );
      recordsNormalized++;
    }

    // Update run
    await d1Run(db,
      `UPDATE ingestion_runs SET recordsResolved = ?, resolveLatencyMs = ? WHERE id = ?`,
      [recordsNormalized, Date.now() - normalizeStart, runId]
    );

    return jsonResponse({ success: true, recordsNormalized, recordsSkipped });
  } catch (err) {
    return jsonResponse({ success: false, recordsNormalized, recordsSkipped, error: err?.message || String(err) }, 500);
  }
}

async function handleIngestionRun(context) {
  const db = context.env.DB;
  const body = await context.request.json().catch(() => ({}));
  const providerId = body.providerId || "raleigh_building_permits";
  const limit = Math.min(Math.max(body.limit || 50, 1), 500);
  const overallStart = Date.now();
  let runId;
  let recordsObserved = 0;
  let recordsCreated = 0;
  let recordsNormalized = 0;
  let recordsSkipped = 0;
  let fetchError;

  try {
    // FETCH PHASE
    const endpoint = resolveEndpoint(providerId);
    if (!endpoint) {
      throw new Error(`No endpoint configured for providerId: ${providerId}`);
    }

    const now = Math.floor(Date.now() / 1000);
    const runResult = await d1Run(db,
      `INSERT INTO ingestion_runs (providerId, startedAt, status, triggerType) VALUES (?, ?, ?, ?)`,
      [providerId, now, "running", "manual"]
    );
    runId = runResult.meta?.last_row_id || runResult.lastRowId;

    const fetchStart = Date.now();
    const data = await fetchArcGIS(endpoint, limit);
    const fetchLatency = Date.now() - fetchStart;
    const features = data.features || [];
    recordsObserved = features.length;

    const parseStart = Date.now();
    for (const feature of features) {
      const attrs = feature.attributes || {};
      const rawPayload = JSON.stringify(attrs);
      const contentHash = cyrb53(rawPayload);

      const rawTitle = getAttr(attrs, "workclass", "permitclass", "type", "permit_type") || `Permit ${getAttr(attrs, "permitnum", "permitnumber", "id", "objectid") || "unknown"}`;
      const rawDescription = getAttr(attrs, "proposedworkdescription", "description", "workdescription", "comments");
      const rawLocation = getAttr(attrs, "siteaddress", "address", "fulladdress", "location");
      const rawStatus = getAttr(attrs, "status", "permitstatus", "permit_status");
      const rawDates = JSON.stringify({
        applied: getAttr(attrs, "applieddate", "applied_date", "dateapplied"),
        issued: getAttr(attrs, "issueddate", "issued_date", "dateissued"),
        completed: getAttr(attrs, "completeddate", "completed_date", "datecompleted"),
        expires: getAttr(attrs, "expirationdate", "expiration_date", "expires"),
      });

      const existing = await d1Query(db,
        `SELECT id FROM raw_records WHERE providerId = ? AND rawPayload = ? LIMIT 1`,
        [providerId, rawPayload]
      );
      if (existing.length > 0) {
        await d1Run(db, `UPDATE raw_records SET observedAt = ? WHERE id = ?`, [now, existing[0].id]);
        continue;
      }

      let rawMetadata;
      if (feature.geometry) {
        rawMetadata = JSON.stringify({ geometry: feature.geometry });
      }

      const sourceRecordId = getAttr(attrs, "permitnum", "permitnumber", "id", "objectid") || String(attrs["OBJECTID"] || attrs["objectid"] || "");

      await d1Run(db,
        `INSERT INTO raw_records (providerId, sourceRecordId, sourceUrl, observedAt, ingestedAt, rawPayload, rawTitle, rawDescription, rawLocation, rawStatus, rawDates, rawMetadata, ingestionRunId, provenance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [providerId, sourceRecordId, endpoint, now, now, rawPayload, rawTitle, rawDescription, rawLocation, rawStatus, rawDates, rawMetadata || null, runId, "LIVE"]
      );
      recordsCreated++;
    }
    const parseLatency = Date.now() - parseStart;

    // NORMALIZE PHASE
    const normalizeStart = Date.now();
    const rawRows = await d1Query(db,
      `SELECT * FROM raw_records WHERE ingestionRunId = ? AND providerId = ? AND isDeleted = 0`,
      [runId, providerId]
    );

    const providers = await d1Query(db,
      `SELECT providerName FROM provider_registry WHERE providerId = ? OR providerName = ? LIMIT 1`,
      [providerId, providerId]
    );
    const providerName = providers[0]?.providerName || providerId;

    for (const row of rawRows) {
      if (!row.rawPayload) continue;
      const attrs = JSON.parse(row.rawPayload);
      const rawPayload = row.rawPayload;
      const hash = cyrb53(rawPayload);

      const dupCheck = await d1Query(db,
        `SELECT id FROM signalcore_events WHERE contentHash = ? LIMIT 1`,
        [hash]
      );
      if (dupCheck.length > 0) {
        recordsSkipped++;
        continue;
      }

      const workClass = getAttr(attrs, "workclass", "permitclass", "type", "permit_type");
      const workDesc = getAttr(attrs, "proposedworkdescription", "description", "workdescription", "comments");
      const title = row.rawTitle || (workClass && workDesc ? `${workClass}: ${workDesc}` : workClass || workDesc || "Building Permit");
      const description = row.rawDescription || workDesc || "";

      const address = row.rawLocation || getAttr(attrs, "siteaddress", "address", "fulladdress", "location") || "";
      let lat = null;
      let lng = null;

      if (row.rawMetadata) {
        try {
          const meta = JSON.parse(row.rawMetadata);
          if (meta.geometry?.y) lat = String(meta.geometry.y);
          if (meta.geometry?.x) lng = String(meta.geometry.x);
        } catch {
          // ignore
        }
      }
      if (!lat) lat = getAttr(attrs, "latitude", "lat", "y") || null;
      if (!lng) lng = getAttr(attrs, "longitude", "lng", "long", "x") || null;

      const appliedDateMs = attrs["applieddate"] || attrs["applied_date"] || attrs["dateapplied"];
      const publishedAt = msToDate(appliedDateMs);
      const publishedAtSeconds = publishedAt ? Math.floor(publishedAt.getTime() / 1000) : null;

      let city = getAttr(attrs, "city", "sitecity", "jurisdiction");
      if (!city && address) {
        const match = address.match(/,\s*([A-Za-z\s]+),?\s*(?:NC|North Carolina)?/i);
        if (match) city = match[1].trim();
      }
      if (!city) city = "Raleigh";

      const county = getAttr(attrs, "county", "sitecounty") || "Wake";
      const state = getAttr(attrs, "state", "sitestate") || "NC";
      const zipCode = getAttr(attrs, "zip", "zipcode", "postalcode", "sitezip") || null;

      await d1Run(db,
        `INSERT INTO signalcore_events (providerId, externalId, eventType, title, description, county, state, city, zipCode, lat, lng, address, publishedAt, ingestedAt, confidence, status, contentHash, rawData, dataSource, provenance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [row.providerId, row.sourceRecordId || null, "building_permit", title, description, county, state, city, zipCode, lat, lng, address, publishedAtSeconds, now, 70, "active", hash, rawPayload, providerName, "LIVE"]
      );
      recordsNormalized++;
    }
    const resolveLatency = Date.now() - normalizeStart;
    const totalLatency = Date.now() - overallStart;

    // Update run
    await d1Run(db,
      `UPDATE ingestion_runs SET status = ?, completedAt = ?, recordsObserved = ?, recordsCreated = ?, recordsResolved = ?, fetchLatencyMs = ?, parseLatencyMs = ?, resolveLatencyMs = ?, totalLatencyMs = ?, sourceRecordCount = ? WHERE id = ?`,
      ["completed", now, recordsObserved, recordsCreated, recordsNormalized, fetchLatency, parseLatency, resolveLatency, totalLatency, recordsObserved, runId]
    );

    return jsonResponse({ success: true, runId, recordsObserved, recordsCreated, recordsNormalized, recordsSkipped, totalLatencyMs: totalLatency });
  } catch (err) {
    fetchError = err?.message || String(err);
    if (runId) {
      const now = Math.floor(Date.now() / 1000);
      await d1Run(db,
        `UPDATE ingestion_runs SET status = ?, completedAt = ?, recordsObserved = ?, recordsCreated = ?, recordsResolved = ?, error = ?, errorCode = ?, totalLatencyMs = ? WHERE id = ?`,
        ["failed", now, recordsObserved, recordsCreated, recordsNormalized, fetchError, "RUN_ERROR", Date.now() - overallStart, runId]
      );
    }
    return jsonResponse({ success: false, runId: runId || 0, recordsObserved, recordsCreated, recordsNormalized, recordsSkipped, error: fetchError }, 500);
  }
}

async function handleIngestionStatus(context) {
  const db = context.env.DB;
  const url = new URL(context.request.url);
  const runId = url.searchParams.get("runId");

  if (runId) {
    const runs = await d1Query(db,
      `SELECT * FROM ingestion_runs WHERE id = ? LIMIT 1`,
      [runId]
    );
    if (runs.length === 0) {
      return jsonResponse({ found: false, run: null });
    }
    return jsonResponse({ found: true, run: runs[0] });
  }

  // Return latest runs summary
  const latestRuns = await d1Query(db,
    `SELECT * FROM ingestion_runs ORDER BY startedAt DESC LIMIT 20`
  );

  const totalRuns = latestRuns.length;
  const completed = latestRuns.filter(r => r.status === "completed").length;
  const failed = latestRuns.filter(r => r.status === "failed").length;
  const running = latestRuns.filter(r => r.status === "running").length;
  const totalObserved = latestRuns.reduce((sum, r) => sum + (r.recordsObserved || 0), 0);
  const totalCreated = latestRuns.reduce((sum, r) => sum + (r.recordsCreated || 0), 0);
  const totalResolved = latestRuns.reduce((sum, r) => sum + (r.recordsResolved || 0), 0);

  return jsonResponse({
    summary: { totalRuns, completed, failed, running, totalObserved, totalCreated, totalResolved },
    latestRuns,
  });
}

// ─── JSON response helper ───
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// ─── Main handler ───
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const method = request.method;

  // DEBUG: Echo back what we see
  if (url.pathname === "/api/debug") {
    return jsonResponse({ debug: true, pathname: url.pathname, url: request.url });
  }

  // Handle ingestion endpoints directly
  if (url.pathname.startsWith("/api/ingestion")) {
    // CORS preflight
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    const path = url.pathname;
    if (path === "/api/ingestion.fetch" && method === "POST") {
      return handleIngestionFetch(context);
    }
    if (path === "/api/ingestion.normalize" && method === "POST") {
      return handleIngestionNormalize(context);
    }
    if (path === "/api/ingestion.run" && method === "POST") {
      return handleIngestionRun(context);
    }
    if (path === "/api/ingestion.status" && method === "GET") {
      return handleIngestionStatus(context);
    }

    return jsonResponse({ error: "Unknown ingestion endpoint" }, 404);
  }

  // Proxy everything else to the API Worker
  const targetUrl = API_BASE + url.pathname + url.search;
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  const response = await fetch(modifiedRequest);
  const newHeaders = new Headers(response.headers);
  const origin = request.headers.get("Origin") || "https://buildsignal.net";
  newHeaders.set("Access-Control-Allow-Origin", origin);
  newHeaders.set("Access-Control-Allow-Credentials", "true");
  newHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, stripe-signature");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
