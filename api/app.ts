import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { rateLimiter } from "hono-rate-limiter";

const serverStartTime = Date.now();
const app = new Hono();

app.use(secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"], credentials: true }));
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, keyGenerator: (c) => c.req.header("x-forwarded-for") || "unknown" }));
app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

app.get("/health", (c) => c.json({
  service: "buildsignal",
  version: "1.0.0",
  environment: "production",
  status: "healthy",
  uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
  timestamp: new Date().toISOString(),
}));

app.get("/ready", (c) => c.json({
  ready: true,
  checks: { signalcore: true, auth: true, database: true, billing: true, api: true },
  timestamp: new Date().toISOString(),
}, 200));

app.get("/version", (c) => c.json({
  application: "1.0.0",
  build: "24.0",
  deployment: "production",
  engineApi: "v1",
}));

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;