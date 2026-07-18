import { Hono } from "hono";
import { trpcServer } from "@trpc/server/adapters/fetch";
import { appRouter, createContext } from "./router";

export const app = new Hono<{ Bindings: { DB: D1Database } }>();
app.use("/trpc/*", async (c) => {
  return trpcServer({ router: appRouter, createContext: async () => createContext({ req: c.req.raw, resHeaders: c.res.headers }) })(c.req.raw);
});
app.get("/health", (c) => c.json({ status: "ok", service: "buildsignal", version: "1.0.0" }));
