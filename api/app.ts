import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";

const app = new Hono();

app.use(secureHeaders());
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

app.get("/health", (c) => c.json({ status: "ok", service: "buildsignal", version: "1.0.0" }));

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: (opts) => createContext({ ...opts, env: c.env }),
  });
});

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;
