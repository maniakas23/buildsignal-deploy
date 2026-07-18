/**
 * Database connection module — Cloudflare Workers / D1 compatible.
 *
 * Uses Cloudflare D1 (SQLite) for edge deployment.
 * Falls back to PlanetScale's HTTP driver for MySQL if D1 is not available.
 */

import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzlePlanetScale } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";
import { env } from "../lib/env";

// Import both schemas — D1/SQLite and MySQL
import * as sqliteSchema from "@db/schema-sqlite";
import * as mysqlSchema from "@db/schema";
import * as relations from "@db/relations";

const fullSqliteSchema = { ...sqliteSchema, ...relations };
const fullMysqlSchema = { ...mysqlSchema, ...relations };

let instance: any;
let d1Binding: D1Database | undefined;

/** Get D1 binding from module-level variable or globalThis (for cross-chunk sharing) */
function getResolvedD1Binding(): D1Database | undefined {
  if (d1Binding) return d1Binding;
  // Fallback: check globalThis (set by functions/[[path]].ts in a different bundler chunk)
  const globalBinding = (globalThis as unknown as Record<string, unknown>).__D1_BINDING__;
  if (globalBinding) {
    d1Binding = globalBinding as D1Database; // cache it locally
    return d1Binding;
  }
  return undefined;
}

/** Set the D1 binding from Cloudflare Pages Functions context */
export function setD1Binding(db: D1Database) {
  d1Binding = db;
  instance = undefined; // Reset instance so next getDb() picks up D1
}

/** Check if D1 is active */
export function isD1(): boolean {
  return !!getResolvedD1Binding();
}

// Helper to get DB from tRPC context (for use in routers)
export function getDbFromContext(env: Record<string, unknown> | undefined) {
  if (env?.DB) {
    return drizzleD1(env.DB as D1Database, { schema: fullSqliteSchema });
  }
  // Check globalThis fallback before falling back to PlanetScale
  const globalBinding = (globalThis as unknown as Record<string, unknown>).__D1_BINDING__;
  if (globalBinding) {
    return drizzleD1(globalBinding as D1Database, { schema: fullSqliteSchema });
  }
  return getDb(); // fallback to global instance
}

export function getDb() {
  if (!instance) {
    // Prefer D1 binding if available (Cloudflare Workers)
    const resolved = getResolvedD1Binding();
    if (resolved) {
      instance = drizzleD1(resolved, { schema: fullSqliteSchema });
      return instance;
    }

    // Fallback to PlanetScale HTTP driver (MySQL over HTTPS)
    const client = new Client({
      url: env.databaseUrl,
    });
    instance = drizzlePlanetScale(client, { schema: fullMysqlSchema });
  }
  return instance;
}

/** Get the active schema (SQLite for D1, MySQL otherwise) */
export function getSchema() {
  if (d1Binding) {
    return sqliteSchema;
  }
  return mysqlSchema;
}
