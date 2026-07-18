/**
 * Direct D1 test - bypasses Hono/tRPC to test binding at Pages Function level
 */

import type { PagesFunction } from "@cloudflare/workers-types";

export const onRequest: PagesFunction = async (context) => {
  const env = context.env;
  const keys = Object.keys(env).filter(k => !k.includes('SECRET') && !k.includes('KEY'));
  const hasDB = !!env.DB;
  
  let dbTest = "not attempted";
  if (hasDB) {
    try {
      const db = env.DB as any;
      const result = await db.prepare("SELECT 1 as one").first();
      dbTest = `success: ${JSON.stringify(result)}`;
    } catch (e: any) {
      dbTest = `error: ${e.message}`;
    }
  }
  
  return new Response(JSON.stringify({
    hasDB,
    envKeys: keys,
    dbTest,
    timestamp: new Date().toISOString(),
  }), {
    headers: { "Content-Type": "application/json" },
  });
};
