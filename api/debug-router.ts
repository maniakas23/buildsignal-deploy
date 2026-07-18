import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb, isD1, setD1Binding } from "./queries/connection";
import { sql } from "drizzle-orm";

export const debugRouter = createRouter({
  checkD1: publicQuery.query(async ({ ctx }) => {
    const env = (ctx as any).env || {};
    const d1Before = isD1();
    
    if (env.DB && !isD1()) {
      try {
        setD1Binding(env.DB as any);
      } catch (e: any) {
        return { hasDbBinding: true, dbType: typeof env.DB, d1Before, d1After: isD1(), setError: e.message, envKeys: Object.keys(env).filter(k => !k.includes('SECRET') && !k.includes('KEY') && !k.includes('TOKEN')) };
      }
    }
    
    return { hasDbBinding: !!env.DB, dbType: typeof env.DB, d1Before, d1After: isD1(), envKeys: Object.keys(env).filter(k => !k.includes('SECRET') && !k.includes('KEY') && !k.includes('TOKEN')) };
  }),

  testIngestion: publicQuery.query(async ({ ctx }) => {
    try {
      const env = (ctx as any).env || {};
      if (env.DB && !isD1()) {
        setD1Binding(env.DB as any);
      }
      
      const db = getDb();
      const result = await db.execute(sql`SELECT COUNT(*) as count FROM ingestion_sources`);
      return { success: true, isD1: isD1(), result };
    } catch (err) {
      return { success: false, isD1: isD1(), error: (err as Error).message, stack: (err as Error).stack?.slice(0, 300) };
    }
  }),
});
