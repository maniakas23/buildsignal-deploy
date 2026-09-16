// m1(24A) regression test — BillingPage stripe.plans response contract.
//
// Captures the ACTUAL production response shape (Worker #416, verified live
// 2026-09-16): the procedure returns { plans: [...] }, and the page must
// consume it without throwing.
import { describe, it, expect } from "vitest";
import { selectPlans, isContactSalesPlan, type BillingPlan } from "../billingPlans";

// Verbatim production response body (data field) from
// GET /api/trpc/stripe.plans?batch=1 on api.buildsignal.net.
const PRODUCTION_RESPONSE = {
  plans: [
    {
      id: "starter",
      name: "Scout",
      description: "Perfect for individual investors",
      price: 99,
      interval: "month",
      features: ["1 County", "3 Alerts/Day", "Email Support"],
      cta: "Start Free Trial",
      purchasable: true,
      popular: false,
    },
    {
      id: "professional",
      name: "Professional",
      description: "For serious investors & small teams",
      price: 249,
      interval: "month",
      features: ["10 Counties", "50 Alerts/Day", "Watchlists", "Basic Analytics", "Priority Support"],
      cta: "Start Free Trial",
      purchasable: true,
      popular: true,
    },
    {
      id: "business",
      name: "Business",
      description: "For teams & organizations",
      price: 599,
      interval: "month",
      features: ["All Counties", "Unlimited Alerts", "Advanced Analytics", "SSO", "Dedicated Support"],
      cta: "Contact Sales",
      purchasable: true,
      popular: false,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Custom solutions for large organizations",
      price: null,
      interval: null,
      features: ["Custom Coverage", "SLA"],
      cta: "Contact Sales",
      purchasable: false,
      popular: false,
    },
  ],
};

describe("selectPlans (stripe.plans response contract)", () => {
  it("unwraps the actual production { plans: [...] } shape without throwing", () => {
    let plans: BillingPlan[] | undefined;
    expect(() => {
      plans = selectPlans(PRODUCTION_RESPONSE);
    }).not.toThrow();
    expect(Array.isArray(plans)).toBe(true);
    // The page does plans?.map(...) — this must be a real mappable array.
    expect(() => plans!.map((p) => p.id)).not.toThrow();
    expect(plans!.map((p) => p.id)).toEqual(["starter", "professional", "business", "enterprise"]);
  });

  it("passes through a bare array defensively", () => {
    const arr = [{ id: "starter", price: 99 }];
    expect(selectPlans(arr as BillingPlan[])).toEqual(arr);
  });

  it("returns undefined for absent/loading data instead of crashing", () => {
    expect(selectPlans(undefined)).toBeUndefined();
    expect(selectPlans(null)).toBeUndefined();
    expect(selectPlans({})).toBeUndefined();
    expect(() => selectPlans(undefined)?.map((p) => p.id)).not.toThrow();
  });
});

describe("commercial truth of the production plan collection", () => {
  const plans = selectPlans(PRODUCTION_RESPONSE)!;

  it("renders Scout at $99/month", () => {
    const scout = plans.find((p) => p.id === "starter")!;
    expect(scout.name).toBe("Scout");
    expect(scout.price).toBe(99);
    expect(scout.interval).toBe("month");
    expect(scout.purchasable).toBe(true);
  });

  it("renders Professional at $249/month", () => {
    const pro = plans.find((p) => p.id === "professional")!;
    expect(pro.price).toBe(249);
    expect(pro.interval).toBe("month");
  });

  it("renders Business at $599/month", () => {
    const biz = plans.find((p) => p.id === "business")!;
    expect(biz.price).toBe(599);
    expect(biz.interval).toBe("month");
  });

  it("Enterprise is Contact Sales only — never a self-service purchase control", () => {
    const ent = plans.find((p) => p.id === "enterprise")!;
    expect(isContactSalesPlan(ent)).toBe(true);
    expect(ent.purchasable).toBe(false);
    expect(ent.price).toBeNull();
    // Every purchasable plan must NOT be contact-sales.
    for (const p of plans) {
      if (p.id !== "enterprise") expect(isContactSalesPlan(p)).toBe(false);
    }
  });
});
