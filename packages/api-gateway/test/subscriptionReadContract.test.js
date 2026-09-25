// m1(32) contract tests: post-checkout sync remediation on the PRODUCTION
// gateway. Pin the /billing read projection and the duplicate-subscription
// guards — no live Stripe calls, no objects created.
import { describe, it, expect } from "vitest";
import {
  buildCheckoutParams,
  extractSubscriptionView,
  resolvePlanFromPriceEnv,
  findBlockingSubscription,
} from "../gateway.js";

const ENV = {
  STRIPE_PRICE_SCOUT: "price_1U0sP8HXCBDUF0R2X47ogHQG",
  STRIPE_PRICE_PRO: "price_1U0sP9HXCBDUF0R2xy5mGBGk",
  STRIPE_PRICE_BUSINESS: "price_1U0sPAHXCBDUF0R2BXYqNpGR",
};

const TRIAL_END = 1791504000; // 2026-10-09T00:00:00Z (founder trial end)

function trialingSub() {
  // Current API shape (2025-03-31.basil and later): NO top-level
  // current_period_end on the Subscription; period fields live on the item.
  return {
    id: "sub_1UJdypHXCBDUF0R2VCdDF8tP",
    status: "trialing",
    cancel_at_period_end: false,
    items: {
      data: [
        {
          current_period_end: TRIAL_END,
          current_period_start: 1790272800,
          price: { id: ENV.STRIPE_PRICE_SCOUT, lookup_key: "starter" },
        },
      ],
    },
  };
}

describe("m1(32) subscription read projection", () => {
  it("trialing Scout subscription -> status trialing, plan starter, period end from the ITEM", () => {
    const v = extractSubscriptionView(trialingSub(), ENV, "starter");
    expect(v.status).toBe("trialing");
    expect(v.plan).toBe("starter"); // starter = internal id for Scout
    expect(v.currentPeriodEnd).toBe(TRIAL_END); // NOT undefined (basil regression)
    expect(v.cancelAtPeriodEnd).toBe(false);
  });

  it("never depends on the removed top-level current_period_end", () => {
    const sub = trialingSub();
    expect(sub.current_period_end).toBeUndefined();
    const v = extractSubscriptionView(sub, ENV, "starter");
    expect(v.currentPeriodEnd).toBe(TRIAL_END);
  });

  it("tolerates legacy top-level current_period_end when item field absent", () => {
    const sub = trialingSub();
    delete sub.items.data[0].current_period_end;
    sub.current_period_end = TRIAL_END;
    expect(extractSubscriptionView(sub, ENV, "starter").currentPeriodEnd).toBe(TRIAL_END);
  });

  it("no subscription -> inactive with org plan fallback", () => {
    const v = extractSubscriptionView(null, ENV, "starter");
    expect(v).toEqual({ status: "inactive", currentPeriodEnd: null, cancelAtPeriodEnd: false, plan: "starter" });
  });

  it("plan resolves from price id, then lookup key, then org fallback", () => {
    expect(resolvePlanFromPriceEnv(ENV, ENV.STRIPE_PRICE_PRO, null)).toBe("professional");
    expect(resolvePlanFromPriceEnv(ENV, "price_unknown", "business")).toBe("business");
    expect(resolvePlanFromPriceEnv(ENV, null, null)).toBeNull();
    const sub = trialingSub();
    sub.items.data[0].price.id = "price_unknown";
    sub.items.data[0].price.lookup_key = null;
    expect(extractSubscriptionView(sub, ENV, "pro").plan).toBe("professional"); // historical pro -> professional
  });

  it("canceled subscription surfaces truthfully", () => {
    const sub = trialingSub();
    sub.status = "canceled";
    sub.cancel_at_period_end = false;
    expect(extractSubscriptionView(sub, ENV, "starter").status).toBe("canceled");
  });
});

describe("m1(32) duplicate-subscription prevention", () => {
  it("checkout with an existing org customer passes customer= and omits customer_email", () => {
    const p = buildCheckoutParams({
      plan: "starter",
      priceId: ENV.STRIPE_PRICE_SCOUT,
      userId: "117",
      email: "maniakas2@gmail.com",
      customerId: "cus_VKIZtVjj0LjQr2",
      successUrl: "https://buildsignal.net/billing?upgraded=1",
      cancelUrl: "https://buildsignal.net/pricing",
    });
    expect(p.get("customer")).toBe("cus_VKIZtVjj0LjQr2");
    expect(p.get("customer_email")).toBeNull();
    expect(p.get("client_reference_id")).toBe("117");
    expect(p.get("subscription_data[trial_period_days]")).toBe("14");
  });

  it("checkout without an existing customer keeps the customer_email path", () => {
    const p = buildCheckoutParams({
      plan: "starter",
      priceId: ENV.STRIPE_PRICE_SCOUT,
      userId: "117",
      email: "maniakas2@gmail.com",
      successUrl: "https://buildsignal.net/billing?upgraded=1",
      cancelUrl: "https://buildsignal.net/pricing",
    });
    expect(p.get("customer")).toBeNull();
    expect(p.get("customer_email")).toBe("maniakas2@gmail.com");
  });

  it.each([
    ["trialing"], ["active"], ["past_due"], ["unpaid"], ["incomplete"],
  ])("a %s subscription blocks a new checkout", (status) => {
    expect(findBlockingSubscription([{ status }])?.status).toBe(status);
  });

  it.each([["canceled"], ["incomplete_expired"]])("a %s subscription does not block", (status) => {
    expect(findBlockingSubscription([{ status }])).toBeNull();
  });

  it("no subscriptions -> no block", () => {
    expect(findBlockingSubscription([])).toBeNull();
    expect(findBlockingSubscription(null)).toBeNull();
  });
});
