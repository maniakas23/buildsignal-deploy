// m1(34) Phase 5 regression: the Current Plan card subtext must be truthful
// for canceled and scheduled-cancel subscriptions.
//  - canceled: never "Current period ends on …" (implies an ongoing period);
//    state the cancellation plainly.
//  - trialing/active + cancelAtPeriodEnd: access end date + "cancellation
//    scheduled, no renewal" — never the word "renews".
//  - trialing (not scheduled): "Trial ends on …".
//  - active (not scheduled): "Current period ends on …" (unchanged).
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { CurrentPlanCard, getPlanSubtext } from "../../components/billing/CurrentPlanCard";

const PLAN_INFO = { name: "Scout", color: "bg-x", features: ["1 county"] };
const STATUS_CANCELED = { label: "Canceled", color: "bg-y" };
const STATUS_TRIALING = { label: "Trialing", color: "bg-z" };
const NOOP = () => {};
const PERIOD_END = 1793000000; // fixed epoch seconds

const baseProps = {
  subLoading: false,
  planInfo: PLAN_INFO,
  portalPending: false,
  cancelPending: false,
  onManageBilling: NOOP,
  onOpenCancelDialog: NOOP,
  onGoToPricing: NOOP,
};

describe("m1(34) CurrentPlanCard subtext truth", () => {
  it("canceled subscription: no 'Current period ends', states cancellation", () => {
    const sub = { plan: "starter", status: "canceled", currentPeriodEnd: PERIOD_END, cancelAtPeriodEnd: false };
    const text = getPlanSubtext(sub);
    expect(text).not.toContain("Current period ends");
    expect(text.toLowerCase()).toContain("cancel");
    expect(text).not.toContain("renews");
  });

  it("trialing + cancelAtPeriodEnd: access end date + scheduled cancel + no renewal", () => {
    const sub = { plan: "starter", status: "trialing", currentPeriodEnd: PERIOD_END, cancelAtPeriodEnd: true };
    const text = getPlanSubtext(sub);
    expect(text).toContain("ends on");
    expect(text.toLowerCase()).toContain("cancellation scheduled");
    expect(text.toLowerCase()).toContain("no renewal");
    expect(text).not.toContain("renews");
  });

  it("active + cancelAtPeriodEnd: access end date + no renewal, never 'renews'", () => {
    const sub = { plan: "professional", status: "active", currentPeriodEnd: PERIOD_END, cancelAtPeriodEnd: true };
    const text = getPlanSubtext(sub);
    expect(text).toContain("Access ends on");
    expect(text.toLowerCase()).toContain("no renewal");
    expect(text).not.toContain("renews");
  });

  it("trialing without scheduled cancel: 'Trial ends on …'", () => {
    const sub = { plan: "starter", status: "trialing", currentPeriodEnd: PERIOD_END, cancelAtPeriodEnd: false };
    expect(getPlanSubtext(sub)).toContain("Trial ends on");
  });

  it("active without scheduled cancel: unchanged 'Current period ends on …'", () => {
    const sub = { plan: "professional", status: "active", currentPeriodEnd: PERIOD_END, cancelAtPeriodEnd: false };
    expect(getPlanSubtext(sub)).toContain("Current period ends on");
  });

  it("no subscription: free starter plan", () => {
    expect(getPlanSubtext(null)).toBe("You are on the free starter plan");
    expect(getPlanSubtext(undefined)).toBe("You are on the free starter plan");
  });

  it("canceled card SSR: shows Canceled badge, truthful subtext, only Upgrade action", () => {
    const sub = { plan: "starter", status: "canceled", currentPeriodEnd: PERIOD_END, cancelAtPeriodEnd: false };
    const html = renderToString(
      createElement(CurrentPlanCard, { ...baseProps, subscription: sub, status: STATUS_CANCELED })
    );
    expect(html).toContain("Canceled");
    expect(html).toContain("Subscription canceled");
    expect(html).not.toContain("Current period ends");
    expect(html).toContain("Upgrade Plan");
    expect(html).not.toContain("Manage Billing");
    expect(html).not.toContain("Cancel Subscription");
  });

  it("scheduled-cancel card SSR: shows warning line with no 'renews' language", () => {
    const sub = { plan: "starter", status: "trialing", currentPeriodEnd: PERIOD_END, cancelAtPeriodEnd: true };
    const html = renderToString(
      createElement(CurrentPlanCard, { ...baseProps, subscription: sub, status: STATUS_TRIALING })
    );
    expect(html).toContain("cancellation scheduled");
    expect(html).toContain("will cancel at the end of this period");
    expect(html).not.toContain("renews");
  });
});
