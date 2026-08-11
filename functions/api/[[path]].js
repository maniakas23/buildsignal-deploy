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
  "raleigh-permits":
    "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Building_Permits_Pending/FeatureServer/0/query",
  "raleigh_building_permits":
    "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Building_Permits_Pending/FeatureServer/0/query",
  "wake-county-permits":
    "https://maps.wake.gov/arcgis/rest/services/Inspections/Building_Permits/MapServer/0/query",
  "wake_county_building_permits":
    "https://maps.wake.gov/arcgis/rest/services/Inspections/Building_Permits/MapServer/0/query",
  "mecklenburg-nc-building_permits":
    "https://gis.mecknc.gov/arcgis/rest/services/CodeEnforcement/BuildingPermits/MapServer/0/query",
  "mecklenburg_nc_building_permits":
    "https://gis.mecknc.gov/arcgis/rest/services/CodeEnforcement/BuildingPermits/MapServer/0/query",
  "fairfax-va-building_permits":
    "https://www.fairfaxcounty.gov/gispub1/rest/services/LDS/DevelopmentTracker/MapServer/5/query",
  "fairfax_va_building_permits":
    "https://www.fairfaxcounty.gov/gispub1/rest/services/LDS/DevelopmentTracker/MapServer/5/query",
};

// Provider ID normalization (hyphens ↔ underscores)
const PROVIDER_ID_MAP = {
  "raleigh_building_permits": "raleigh-permits",
  "wake_county_building_permits": "wake-county-permits",
  "mecklenburg_nc_building_permits": "mecklenburg-nc-building_permits",
  "fairfax_va_building_permits": "fairfax-va-building_permits",
};

function normalizeProviderId(providerId) {
  return PROVIDER_ID_MAP[providerId] || providerId;
}

async function resolveEndpoint(db, providerId) {
  const canonicalId = normalizeProviderId(providerId);
  
  // First check known endpoints
  const known = KNOWN_ENDPOINTS[canonicalId];
  if (known) return known;
  
  // Fall back to provider registry (try both original and canonical)
  if (db) {
    for (const pid of [canonicalId, providerId]) {
      const rows = await d1Query(db, "SELECT apiEndpoint FROM provider_registry WHERE providerId = ? LIMIT 1", [pid]);
      if (rows.length > 0 && rows[0].apiEndpoint) {
        return rows[0].apiEndpoint;
      }
    }
  }
  
  return null;
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
  const canonicalId = normalizeProviderId(providerId);
  const limit = Math.min(Math.max(body.limit || 50, 1), 500);
  const overallStart = Date.now();
  let runId;
  let recordsObserved = 0;
  let recordsCreated = 0;
  let errorMsg;

  try {
    // Resolve endpoint
    const endpoint = await resolveEndpoint(db, providerId);
    if (!endpoint) {
      throw new Error(`No endpoint configured for providerId: ${providerId}`);
    }

    // Create ingestion run
    const now = Math.floor(Date.now() / 1000);
    const runResult = await d1Run(db,
      `INSERT INTO ingestion_runs (providerId, startedAt, status, triggerType) VALUES (?, ?, ?, ?)`,
      [canonicalId, now, "running", "manual"]
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

      // Check for duplicates (use canonical ID)
      const existing = await d1Query(db,
        `SELECT id FROM raw_records WHERE providerId = ? AND rawPayload = ? LIMIT 1`,
        [canonicalId, rawPayload]
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
        [canonicalId, sourceRecordId, endpoint, now, now, rawPayload, rawTitle, rawDescription, rawLocation, rawStatus, rawDates, rawMetadata || null, runId, "LIVE"]
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

    // Update provider telemetry
    await d1Run(db,
      `UPDATE provider_registry SET lastSuccessfulFetch = ?, recordsIngested = recordsIngested + ?, healthStatus = 'healthy', isActive = 1, updatedAt = ? WHERE providerId = ?`,
      [now, recordsCreated, now, canonicalId]
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
      
      // Update provider telemetry on failure
      await d1Run(db,
        `UPDATE provider_registry SET healthStatus = 'error', isActive = 0, updatedAt = ? WHERE providerId = ?`,
        [now, canonicalId]
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
  const canonicalId = normalizeProviderId(providerId);

  if (!runId) {
    return jsonResponse({ success: false, error: "runId is required" }, 400);
  }

  const normalizeStart = Date.now();
  let recordsNormalized = 0;
  let recordsSkipped = 0;

  try {
    // Get raw records for this run (try both canonical and original providerId)
    const rows = await d1Query(db,
      `SELECT * FROM raw_records WHERE ingestionRunId = ? AND (providerId = ? OR providerId = ?) AND isDeleted = 0`,
      [runId, canonicalId, providerId]
    );

    // Get provider name
    const providers = await d1Query(db,
      `SELECT providerName FROM provider_registry WHERE providerId = ? OR providerId = ? OR providerName = ? LIMIT 1`,
      [canonicalId, providerId, providerId]
    );
    const providerName = providers[0]?.providerName || canonicalId;

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
        const match = address.match(/,\s*([A-Za-z\s]+),?\s*(?:NC|North Carolina|VA|Virginia|SC|South Carolina)?/i);
        if (match) city = match[1].trim();
      }
      if (!city) city = "";

      const county = getAttr(attrs, "county", "sitecounty") || "";
      const state = getAttr(attrs, "state", "sitestate") || "";
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
  const canonicalId = normalizeProviderId(providerId);
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
    const endpoint = await resolveEndpoint(db, providerId);
    if (!endpoint) {
      throw new Error(`No endpoint configured for providerId: ${providerId}`);
    }

    const now = Math.floor(Date.now() / 1000);
    const runResult = await d1Run(db,
      `INSERT INTO ingestion_runs (providerId, startedAt, status, triggerType) VALUES (?, ?, ?, ?)`,
      [canonicalId, now, "running", "manual"]
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
        const match = address.match(/,\s*([A-Za-z\s]+),?\s*(?:NC|North Carolina|VA|Virginia|SC|South Carolina)?/i);
        if (match) city = match[1].trim();
      }
      if (!city) city = "";

      const county = getAttr(attrs, "county", "sitecounty") || "";
      const state = getAttr(attrs, "state", "sitestate") || "";
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

    // Update provider telemetry on success (use canonical ID for registry lookup)
    await d1Run(db,
      `UPDATE provider_registry SET lastSuccessfulFetch = ?, recordsIngested = recordsIngested + ?, healthStatus = 'healthy', isActive = 1, updatedAt = ? WHERE providerId = ?`,
      [now, recordsNormalized, now, canonicalId]
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
      
      // Update provider telemetry on failure
      await d1Run(db,
        `UPDATE provider_registry SET healthStatus = 'error', isActive = 0, updatedAt = ? WHERE providerId = ?`,
        [now, canonicalId]
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
    success: true,
    summary: { totalRuns, completed, failed, running, totalObserved, totalCreated, totalResolved },
    runs: latestRuns,
  });
}

async function handleIngestionRaw(context) {
  const db = context.env.DB;
  const url = new URL(context.request.url);
  const providerId = url.searchParams.get("providerId");
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50"), 1), 500);

  if (!providerId) {
    return jsonResponse({ success: false, error: "providerId is required" }, 400);
  }

  try {
    const canonicalId = normalizeProviderId(providerId);

    // Count total
    const countResult = await d1Query(db,
      `SELECT COUNT(*) as cnt FROM raw_records WHERE providerId = ?`,
      [canonicalId]
    );
    const totalCount = countResult[0]?.cnt || 0;

    // Also try original providerId if different
    let fallbackCount = 0;
    if (canonicalId !== providerId) {
      const fbResult = await d1Query(db,
        `SELECT COUNT(*) as cnt FROM raw_records WHERE providerId = ?`,
        [providerId]
      );
      fallbackCount = fbResult[0]?.cnt || 0;
    }

    // Get records (prefer canonical ID)
    const queryId = totalCount > 0 || fallbackCount === 0 ? canonicalId : providerId;
    const recordsResult = await d1Query(db,
      `SELECT id, providerId, sourceRecordId, sourceUrl, observedAt, ingestedAt, rawPayload, rawTitle, rawDescription, rawLocation, rawStatus, rawDates, ingestionRunId, provenance FROM raw_records WHERE providerId = ? ORDER BY observedAt DESC LIMIT ?`,
      [queryId, limit]
    );

    return jsonResponse({
      success: true,
      providerId: queryId,
      count: totalCount + fallbackCount,
      records: recordsResult || []
    });
  } catch (e) {
    return jsonResponse({ success: false, error: e?.message || String(e) }, 500);
  }
}

// ─── V1 REST API Handlers ───

async function handleV1Signals(context) {
  const db = context.env.DB;
  try {
    const events = await d1Query(db,
      `SELECT id, title, description, county, city, state, lat, lng, confidence, publishedAt, ingestedAt, dataSource, eventType, status, contentHash FROM signalcore_events WHERE provenance = 'LIVE' ORDER BY publishedAt DESC LIMIT 200`,
      []
    );

    const signals = events.map(ev => {
      const cityName = ev.city && !ev.city.startsWith("16000") ? ev.city : "Raleigh";
      const location = `${cityName}, ${ev.county} County, ${ev.state}`;
      const firstDetected = ev.publishedAt
        ? new Date(ev.publishedAt * 1000).toISOString().split("T")[0]
        : new Date(ev.ingestedAt * 1000).toISOString().split("T")[0];

      return {
        id: `kev-${ev.id}`,
        title: ev.title || "Building Permit",
        description: ev.description || "",
        location,
        confidence: ev.confidence || 70,
        stage: ev.status === "active" ? "early" : "developing",
        projectType: ev.eventType === "building_permit" ? "Building Permit" : (ev.eventType || "Infrastructure"),
        signals: 1,
        estimatedValue: 0,
        firstDetected,
        sources: [ev.dataSource || "Raleigh Open Data"],
        patternMatch: [],
        opportunityScore: ev.confidence || 70,
        recommendedAction: "Review permit details at Raleigh Open Data Portal",
      };
    });

    return jsonResponse({ signals });
  } catch (err) {
    return jsonResponse({ signals: [], error: err.message }, 500);
  }
}

async function handleV1Patterns(context) {
  const db = context.env.DB;
  try {
    const patterns = await d1Query(db,
      `SELECT id, name, patternType, description, county, state, confidence, evidenceCount, status, firstDetectedAt, lastDetectedAt, summary, recommendedAction, impactScore, geographicReach, createdAt FROM signalcore_patterns WHERE provenance = 'LIVE' ORDER BY confidence DESC LIMIT 50`,
      []
    );

    const mapped = patterns.map(p => {
      const locations = [];
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

    return jsonResponse({ patterns: mapped });
  } catch (err) {
    return jsonResponse({ patterns: [], error: err.message }, 500);
  }
}

async function handleV1Providers(context) {
  const db = context.env.DB;
  try {
    const providers = await d1Query(db,
      `SELECT providerId, providerName, sourceType, isActive, healthStatus FROM provider_registry WHERE isActive = 1 ORDER BY providerName`,
      []
    );

    const enriched = [];
    for (const p of providers) {
      const stats = await d1Query(db,
        `SELECT COUNT(*) as totalRuns, SUM(recordsCreated) as totalRecords, AVG(totalLatencyMs) as avgLatency FROM ingestion_runs WHERE providerId = ?`,
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

    return jsonResponse({ providers: enriched });
  } catch (err) {
    return jsonResponse({ providers: [], error: err.message }, 500);
  }
}

function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
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

  // Handle ingestion endpoints directly (both /api/ingestion.* and /api/v1/ingestion/*)
  if (url.pathname.startsWith("/api/ingestion") || url.pathname.startsWith("/api/v1/ingestion")) {
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
    if ((path === "/api/ingestion.fetch" || path === "/api/v1/ingestion/fetch") && method === "POST") {
      return handleIngestionFetch(context);
    }
    if ((path === "/api/ingestion.normalize" || path === "/api/v1/ingestion/normalize") && method === "POST") {
      return handleIngestionNormalize(context);
    }
    if ((path === "/api/ingestion.run" || path === "/api/v1/ingestion/run") && method === "POST") {
      return handleIngestionRun(context);
    }
    if ((path === "/api/ingestion.raw" || path === "/api/v1/ingestion/raw") && method === "GET") {
      return handleIngestionRaw(context);
    }
    if ((path === "/api/ingestion.status" || path === "/api/v1/ingestion/status") && method === "GET") {
      return handleIngestionStatus(context);
    }

    return jsonResponse({ error: "Unknown ingestion endpoint" }, 404);
  }

  // Handle V1 REST API endpoints
  if (url.pathname === "/api/v1/signals" && method === "GET") {
    return handleV1Signals(context);
  }
  if (url.pathname === "/api/v1/patterns" && method === "GET") {
    return handleV1Patterns(context);
  }
  if (url.pathname === "/api/v1/providers" && method === "GET") {
    return handleV1Providers(context);
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
