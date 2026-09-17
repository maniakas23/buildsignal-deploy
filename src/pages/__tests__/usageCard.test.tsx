// m1(28) regression: production /billing crashed with
// "Cannot read properties of undefined (reading 'used')" because the UI read a
// flat { counties: { used, limit } } shape while billing.usage returns the
// envelope { plan, usage: { counties: { used, allowed|null, unlimited? }, ... } }.
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { UsageCard, mapUsageEnvelope } from "../../components/billing/UsageCard";

// Captured verbatim from production billing.usage for a founder-like user:
// starter plan, zero Stripe linkage, zero usage.
const PRODUCTION_ENVELOPE_STARTER = {
  plan: "starter",
  usage: {
    counties: { used: 0, allowed: 1 },
    alerts: { used: 0, allowed: 3, window: "utc_day" },
    alertRules: { used: 0, allowed: 1 },
    watchlists: { used: 0, allowed: 1 },
    searches: { used: null, allowed: null, status: "UNAVAILABLE" },
    reports: { used: 0, allowed: null, status: "UNMETERED" },
  },
  apiAccess: false,
  period: "utc_day",
};

const PRODUCTION_ENVELOPE_BUSINESS = {
  plan: "business",
  usage: {
    counties: { used: 4, allowed: null, unlimited: true },
    alerts: { used: 2, allowed: null, unlimited: true, window: "utc_day" },
    alertRules: { used: 1, allowed: null, unlimited: true },
    watchlists: { used: 0, allowed: null, unlimited: true },
    searches: { used: null, allowed: null, status: "UNAVAILABLE" },
    reports: { used: 3, allowed: null, status: "UNMETERED" },
  },
  apiAccess: true,
  period: "utc_day",
};

describe("m1(28) billing usage envelope contract", () => {
  it("maps the production starter envelope without throwing", () => {
    const rows = mapUsageEnvelope(PRODUCTION_ENVELOPE_STARTER);
    expect(rows).not.toBeNull();
    const byLabel = Object.fromEntries(rows!.map((r) => [r.label, r.display]));
    expect(byLabel["Counties"]).toBe("0 / 1");
    expect(byLabel["Searches"]).toBe("Unavailable"); // honest status, never a fake number
    expect(byLabel["Reports"]).toBe("0 · Unmetered");
  });

  it("maps unlimited business envelope truthfully", () => {
    const rows = mapUsageEnvelope(PRODUCTION_ENVELOPE_BUSINESS);
    const byLabel = Object.fromEntries(rows!.map((r) => [r.label, r.display]));
    expect(byLabel["Counties"]).toBe("4 · Unlimited");
  });

  it("UsageCard renders (SSR) for the founder-like starter state without throwing", () => {
    expect(() =>
      renderToString(createElement(UsageCard, { usage: PRODUCTION_ENVELOPE_STARTER, usageLoading: false }))
    ).not.toThrow();
    const html = renderToString(
      createElement(UsageCard, { usage: PRODUCTION_ENVELOPE_STARTER, usageLoading: false })
    );
    expect(html).toContain("Usage This Period");
    expect(html).not.toContain("undefined");
    expect(html).not.toContain("NaN");
  });

  it("UsageCard tolerates null/loading/partial data", () => {
    expect(() =>
      renderToString(createElement(UsageCard, { usage: null, usageLoading: false }))
    ).not.toThrow();
    expect(mapUsageEnvelope(null)).toBeNull();
    expect(mapUsageEnvelope({})).toBeNull();
    expect(mapUsageEnvelope({ plan: "starter" })).toBeNull();
  });
});
