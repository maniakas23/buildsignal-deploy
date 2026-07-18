import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb, isD1, setD1Binding } from "./queries/connection";
import { sql } from "drizzle-orm";

export const debugRouter = createRouter({
  checkD1: publicQuery.query(async ({ ctx }) => {
    const env = (ctx as any).env || {};
    const hasDbBinding = !!env.DB;
    const dbType = typeof env.DB;
    const d1Status = isD1();
    
    if (env.DB && !isD1()) {
      try {
        setD1Binding(env.DB as any);
      } catch (e: any) {
        return { hasDbBinding, dbType, d1Status: isD1(), setError: e.message };
      }
    }
    
    return { hasDbBinding, dbType, d1Status: isD1(), d1StatusAfter: isD1() };
  }),

  testIngestion: publicQuery.query(async ({ ctx }) => {
    try {
      const env = (ctx as any).env || {};
      if (env.DB && !isD1()) {
        setD1Binding(env.DB as any);
      }
      
      const db = getDb();
      const rows = await db.execute(sql`SELECT COUNT(*) as count FROM ingestion_sources`);
      return { success: true, isD1: isD1(), rows };
    } catch (err) {
      return { success: false, isD1: isD1(), error: (err as Error).message };
    }
  }),

  testExisting: publicQuery.query(async ({ ctx }) => {
    try {
      const env = (ctx as any).env || {};
      if (env.DB && !isD1()) {
        setD1Binding(env.DB as any);
      }
      
      const db = getDb();
      const rows = await db.execute(sql`SELECT COUNT(*) as count FROM counties`);
      return { success: true, isD1: isD1(), rows };
    } catch (err) {
      return { success: false, isD1: isD1(), error: (err as Error).message };
    }
  }),
});
