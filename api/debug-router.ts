import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { sql } from "drizzle-orm";

export const debugRouter = createRouter({
  testIngestion: publicQuery.query(async () => {
    try {
      const db = getDb();
      const rows = await db.run(sql`SELECT COUNT(*) as count FROM ingestion_sources`);
      return { success: true, method: "drizzle_raw", rows };
    } catch (err) {
      return { success: false, method: "drizzle_raw", error: (err as Error).message, stack: (err as Error).stack?.slice(0, 200) };
    }
  }),

  testExisting: publicQuery.query(async () => {
    try {
      const db = getDb();
      const rows = await db.run(sql`SELECT COUNT(*) as count FROM counties`);
      return { success: true, method: "existing", rows };
    } catch (err) {
      return { success: false, method: "existing", error: (err as Error).message };
    }
  }),
});
