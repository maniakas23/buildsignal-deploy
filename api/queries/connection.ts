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

/** Set the D1 binding from Cloudflare Pages Functions context */
export function setD1Binding(db: D1Database) {
  d1Binding = db;
  instance = undefined; // Reset instance so next getDb() picks up D1
}

/** Check if D1 is active */
export function isD1(): boolean {
  return !!d1Binding;
}

export function getDb() {
  if (!instance) {
    // Prefer D1 binding if available (Cloudflare Workers)
    if (d1Binding) {
      instance = drizzleD1(d1Binding, { schema: fullSqliteSchema });
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

/** Get DB from tRPC context (for per-request D1 access in Pages Functions) */
export function getDbFromContext(ctxEnv: Record<string, unknown> | undefined) {
  if (ctxEnv?.DB) {
    return drizzleD1(ctxEnv.DB as D1Database, { schema: fullSqliteSchema });
  }
  return getDb(); // fallback to global instance
}

/** Get the active schema (SQLite for D1, MySQL otherwise) */
export function getSchema() {
  if (d1Binding) {
    return sqliteSchema;
  }
  return mysqlSchema;
}
