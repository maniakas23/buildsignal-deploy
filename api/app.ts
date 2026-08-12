import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { handleStripeWebhook } from "./stripe-router";
import { getDbFromContext } from "./queries/connection";
import { v1 } from "./v1-router";

const app = new Hono();

app.use(secureHeaders());
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

app.get("/health", (c) => c.json({ status: "ok", service: "buildsignal", version: "1.0.0" }));

// Stripe webhook handler — must receive raw body for signature verification
app.post("/api/webhooks/stripe", async (c) => {
  const db = getDbFromContext(c.env);
  return handleStripeWebhook(c.req.raw, c.env, db);
});

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: (opts) => createContext({ ...opts, env: c.env }),
  });
});

// V1 REST API — backward compatibility for external consumers
app.route("/api/v1", v1);

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;
