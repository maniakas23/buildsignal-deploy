import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";

const THRESHOLDS = {
  readiness: { warning: 2, critical: 5 },
  api5xx: { warning: 0.01, critical: 0.05 },
  engineLatencyP95: { warning: 500, critical: 1000 },
  reportFailure: { warning: 0.02, critical: 0.05 },
  authFailure: { warningMultiplier: 2, criticalMultiplier: 4 },
  billingWebhook: { warning: 1, critical: 3 },
  frontendError: { warning: 0.01, critical: 0.03 },
};

interface MetricEntry {
  timestamp: number;
  value: number;
  labels: string;
}

const metrics: Record<string, MetricEntry[]> = {};
const maxMetricsPerKey = 10000;

function recordMetric(name: string, value: number, labelStr = "") {
  if (!metrics[name]) metrics[name] = [];
  metrics[name].push({ timestamp: Date.now(), value, labels: labelStr });
  if (metrics[name].length > maxMetricsPerKey) {
    metrics[name] = metrics[name].slice(-maxMetricsPerKey);
  }
}

export const monitoringRouter = createRouter({
  record: publicQuery
    .input(z.object({
      name: z.string(),
      value: z.number(),
      labels: z.record(z.string(), z.string()).optional(),
    }))
    .mutation(({ input }) => {
      const labelStr = input.labels ? JSON.stringify(input.labels) : "";
      recordMetric(input.name, input.value, labelStr);
      return { recorded: true };
    }),

  summary: authedQuery.query(() => {
    const summary: Record<string, { count: number; last: number | null; avg: number | null }> = {};
    for (const [name, entries] of Object.entries(metrics)) {
      if (entries.length === 0) continue;
      const values = entries.map((e) => e.value);
      summary[name] = {
        count: entries.length,
        last: entries[entries.length - 1]?.value ?? null,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
      };
    }
    return summary;
  }),

  thresholds: publicQuery.query(() => THRESHOLDS),

  alerts: publicQuery.query(() => {
    const alerts: Array<{ metric: string; level: "warning" | "critical"; current: number; threshold: number }> = [];

    const readinessFails = metrics["readiness_failure"]?.length ?? 0;
    if (readinessFails >= THRESHOLDS.readiness.critical) {
      alerts.push({ metric: "readiness", level: "critical", current: readinessFails, threshold: THRESHOLDS.readiness.critical });
    } else if (readinessFails >= THRESHOLDS.readiness.warning) {
      alerts.push({ metric: "readiness", level: "warning", current: readinessFails, threshold: THRESHOLDS.readiness.warning });
    }

    const totalRequests = (metrics["api_request"]?.length ?? 0);
    const errorRequests = (metrics["api_5xx"]?.length ?? 0);
    if (totalRequests > 0) {
      const errorRate = errorRequests / totalRequests;
      if (errorRate >= THRESHOLDS.api5xx.critical) {
        alerts.push({ metric: "api_5xx_rate", level: "critical", current: errorRate, threshold: THRESHOLDS.api5xx.critical });
      } else if (errorRate >= THRESHOLDS.api5xx.warning) {
        alerts.push({ metric: "api_5xx_rate", level: "warning", current: errorRate, threshold: THRESHOLDS.api5xx.warning });
      }
    }

    const latencies = metrics["engine_latency_ms"] ?? [];
    if (latencies.length > 0) {
      const sorted = [...latencies].sort((a, b) => a.value - b.value);
      const p95 = sorted[Math.floor(sorted.length * 0.95)]?.value ?? 0;
      if (p95 >= THRESHOLDS.engineLatencyP95.critical) {
        alerts.push({ metric: "engine_p95_latency", level: "critical", current: p95, threshold: THRESHOLDS.engineLatencyP95.critical });
      } else if (p95 >= THRESHOLDS.engineLatencyP95.warning) {
        alerts.push({ metric: "engine_p95_latency", level: "warning", current: p95, threshold: THRESHOLDS.engineLatencyP95.warning });
      }
    }

    return { alerts, thresholdConfig: THRESHOLDS };
  }),
});

export { recordMetric, THRESHOLDS };
