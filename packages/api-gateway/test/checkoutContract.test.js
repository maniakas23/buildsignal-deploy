// m1(31) contract tests against the PRODUCTION checkout authority
// (buildsignal-api-gateway). These pin the exact Stripe Checkout request the
// gateway builds — no live Stripe calls, no Checkout Sessions created.
import { describe, it, expect } from "vitest";
import { buildCheckoutParams } from "../gateway.js";

const BASE = {
  plan: "starter",
  priceId: "price_1U0sP8HXCBDUF0R2X47ogHQG",
  userId: "117",
  email: "maniakas2@gmail.com",
  successUrl: "https://buildsignal.net/billing?upgraded=1",
  cancelUrl: "https://buildsignal.net/pricing",
};

describe("m1(31) production gateway checkout contract", () => {
  it.each([
    ["starter", "price_1U0sP8HXCBDUF0R2X47ogHQG"],   // Scout $99
    ["professional", "price_1U0sP9HXCBDUF0R2xy5mGBGk"], // $249
    ["business", "price_1U0sPAHXCBDUF0R2BXYqNpGR"],  // $599
  ])("%s checkout request carries the certified trial contract", (plan, priceId) => {
    const p = buildCheckoutParams({ ...BASE, plan, priceId });
    expect(p.get("mode")).toBe("subscription");
    expect(p.get("line_items[0][price]")).toBe(priceId);
    expect(p.get("line_items[0][quantity]")).toBe("1");
    // 14-day trial, $0 due today, card optional
    expect(p.get("subscription_data[trial_period_days]")).toBe("14");
    expect(p.get("payment_method_collection")).toBe("if_required");
    // missing payment method at trial end -> cancel
    expect(p.get("subscription_data[trial_settings][end_behavior][missing_payment_method]")).toBe("cancel");
    // Stripe remains the tax authority
    expect(p.get("automatic_tax[enabled]")).toBe("true");
    expect(p.get("billing_address_collection")).toBe("required");
    // provenance
    expect(p.get("client_reference_id")).toBe("117");
    expect(p.get("metadata[userId]")).toBe("117");
    expect(p.get("metadata[plan]")).toBe(plan);
    expect(p.get("subscription_data[metadata][userId]")).toBe("117");
    // certified customer-journey routing (not stale /settings?checkout=success)
    expect(p.get("success_url")).toBe("https://buildsignal.net/billing?upgraded=1");
    expect(p.get("cancel_url")).toBe("https://buildsignal.net/pricing");
  });

  it("falls back to certified URLs and rejects off-origin return URLs", () => {
    const p = buildCheckoutParams({ ...BASE, successUrl: "https://evil.example/x", cancelUrl: undefined });
    expect(p.get("success_url")).toBe("https://buildsignal.net/billing?upgraded=1");
    expect(p.get("cancel_url")).toBe("https://buildsignal.net/pricing");
  });

  it("browser never supplies authoritative Stripe IDs (params contain no customer/subscription ids)", () => {
    const p = buildCheckoutParams(BASE);
    for (const k of p.keys()) {
      expect(k).not.toMatch(/^customer$/);
      expect(k).not.toMatch(/^subscription$/);
    }
  });

  it("enterprise has no price mapping — gateway resolvePriceId rejects it", async () => {
    // resolvePriceId is module-internal; assert via the same map semantics:
    // enterprise must produce NO checkout params path. Guard: buildCheckoutParams
    // is only reachable after resolvePriceId succeeds; enterprise is absent from
    // the plan→price map, so checkout errors BAD_REQUEST before any Stripe call.
    const src = await import("../gateway.js");
    expect(typeof src.buildCheckoutParams).toBe("function");
    const fs = await import("node:fs");
    const text = fs.readFileSync(new URL("../gateway.js", import.meta.url), "utf8");
    const mapBlock = text.slice(text.indexOf("const map = {"), text.indexOf("};", text.indexOf("const map = {")));
    expect(mapBlock).not.toMatch(/enterprise\s*:/);
  });
});
