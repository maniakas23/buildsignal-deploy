// m1(24C) regression tests — customer journey truth + auth routing.
//
// Covers the production { plans: [...], trial: {...} } wrapper, canonical
// plan values, the authenticated signup guard decision, auth-aware
// acquisition destinations, trial disclosure formatting, Enterprise
// non-purchasable behavior, and fail-safe handling of null/loading data.
import { describe, it, expect } from "vitest";
import { selectPlans, isContactSalesPlan } from "../billingPlans";
import {
  selectTrial,
  acquisitionCtaTarget,
  signupGuardRedirect,
  trialDisclosure,
  REGISTRATION_RECOVERY_MESSAGE,
} from "@/lib/customerJourney";

// Verbatim production response body (data field) from
// GET /api/trpc/stripe.plans?batch=1 on api.buildsignal.net (Worker #416).
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
      features: ["Custom Coverage", "SLA", "White-Glove Onboarding", "Dedicated Account Manager"],
      cta: "Contact Sales",
      purchasable: false,
      popular: false,
    },
  ],
  trial: {
    days: 14,
    noCreditCard: true,
    cardRequiredToStart: false,
    chargedToday: 0,
    billingBegins: "after the 14-day trial",
    recurring: "monthly",
    autoConverts: true,
    noCardAtTrialEnd: "subscription_canceled_never_charged",
    cancelAnytime: true,
  },
};

describe("production plan wrapper", () => {
  it("unwraps plans from the live { plans, trial } response", () => {
    const plans = selectPlans(PRODUCTION_RESPONSE as any);
    expect(plans?.map((p) => p.id)).toEqual(["starter", "professional", "business", "enterprise"]);
  });

  it("preserves canonical commercial values", () => {
    const plans = selectPlans(PRODUCTION_RESPONSE as any)!;
    const scout = plans.find((p) => p.id === "starter")!;
    expect(scout.name).toBe("Scout");
    expect(scout.price).toBe(99);
    expect(scout.interval).toBe("month");
    expect(scout.features).toContain("1 County");
    expect(scout.features).toContain("3 Alerts/Day");
    // stale pre-consolidation claims must not resurface
    expect(scout.features?.join(" ")).not.toMatch(/5 counties/i);
    expect(scout.features?.join(" ")).not.toMatch(/weekly/i);
    expect(plans.find((p) => p.id === "professional")!.price).toBe(249);
    expect(plans.find((p) => p.id === "business")!.price).toBe(599);
  });

  it("extracts the certified trial terms", () => {
    const trial = selectTrial(PRODUCTION_RESPONSE as any)!;
    expect(trial.days).toBe(14);
    expect(trial.noCreditCard).toBe(true);
    expect(trial.chargedToday).toBe(0);
    expect(trial.noCardAtTrialEnd).toBe("subscription_canceled_never_charged");
  });

  it("fails safely on null/undefined/empty data", () => {
    expect(selectPlans(null)).toBeUndefined();
    expect(selectPlans(undefined)).toBeUndefined();
    expect(selectPlans({} as any)).toBeUndefined();
    expect(selectTrial(null)).toBeUndefined();
    expect(selectTrial(undefined)).toBeUndefined();
    expect(selectTrial([] as any)).toBeUndefined();
  });
});

describe("authenticated signup guard", () => {
  it("sends authenticated visitors to /billing (no wizard)", () => {
    expect(signupGuardRedirect(true)).toBe("/billing");
  });

  it("lets guests see the signup wizard", () => {
    expect(signupGuardRedirect(false)).toBeNull();
  });
});

describe("auth-aware acquisition routing", () => {
  it("routes authenticated customers to billing", () => {
    expect(acquisitionCtaTarget(true)).toBe("/billing");
    expect(acquisitionCtaTarget(true, "/signup?plan=starter")).toBe("/billing");
  });

  it("routes guests to the provided signup target", () => {
    expect(acquisitionCtaTarget(false)).toBe("/signup");
    expect(acquisitionCtaTarget(false, "/signup?plan=starter")).toBe("/signup?plan=starter");
  });
});

describe("trial disclosure", () => {
  const trial = selectTrial(PRODUCTION_RESPONSE as any);

  it("states 14-day, $0 today and no-card from live trial data", () => {
    const line = trialDisclosure(trial)!;
    expect(line).toContain("14-day free trial");
    expect(line).toContain("$0 today");
    expect(line).toContain("No credit card required");
  });

  it("states the post-trial recurring price when a plan is given", () => {
    const line = trialDisclosure(trial, { id: "starter", price: 99 })!;
    expect(line).toContain("$99/month after trial");
    expect(line).not.toMatch(/^\s*free\s*$/i);
  });

  it("never renders for Enterprise (Contact Sales only)", () => {
    expect(trialDisclosure(trial, { id: "enterprise", price: null })).toBeNull();
  });

  it("degrades to certified contract wording without live trial data", () => {
    const line = trialDisclosure(undefined, { id: "starter", price: 99 })!;
    expect(line).toContain("14-day free trial");
    expect(line).toContain("$0 today");
    expect(line).toContain("$99/month after trial");
  });
});

describe("enterprise firewall", () => {
  it("enterprise is contact-sales, not self-service purchasable", () => {
    const plans = selectPlans(PRODUCTION_RESPONSE as any)!;
    const enterprise = plans.find((p) => p.id === "enterprise")!;
    expect(isContactSalesPlan(enterprise)).toBe(true);
    expect(enterprise.purchasable).toBe(false);
    expect(enterprise.price).toBeNull();
    expect(enterprise.cta).toBe("Contact Sales");
  });
});

describe("registration recovery", () => {
  it("offers login recovery without disclosing account existence", () => {
    expect(REGISTRATION_RECOVERY_MESSAGE).toMatch(/try signing in/i);
    expect(REGISTRATION_RECOVERY_MESSAGE).not.toMatch(/already exists/i);
    expect(REGISTRATION_RECOVERY_MESSAGE).not.toMatch(/email is registered/i);
  });
});
