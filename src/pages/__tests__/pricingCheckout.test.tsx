// m1(29) regression: an authenticated eligible customer selecting Scout on the
// pricing page must initiate Stripe Checkout exactly once — never bounce
// Pricing → Billing → Pricing. Enterprise must NEVER call Checkout.
// No real Stripe objects are created: the mutation is a spy.
import { describe, it, expect, vi } from "vitest";
import { handlePlanCta, applyCheckoutResult } from "../PricingPage";

// trackEvent reads window.location — stub a minimal browser global (node env).
(globalThis as any).window = { location: { pathname: "/pricing", origin: "https://buildsignal.net", href: "" } };

const ORIGIN = "https://buildsignal.net";

function spies() {
  return { mutate: vi.fn(), navigate: vi.fn() };
}

describe("authenticated pricing CTA → checkout handoff", () => {
  it("authenticated Scout selection calls checkout exactly once with the canonical plan and no navigation", () => {
    const { mutate, navigate } = spies();
    handlePlanCta({
      planId: "starter", // canonical backend key for the $99 Scout plan
      isEnterprise: false,
      isAuthenticated: true,
      hasSessionToken: true,
      checkout: { mutate },
      navigate,
      origin: ORIGIN,
    });
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledWith({
      plan: "starter",
      successUrl: `${ORIGIN}/billing?upgraded=1`,
      cancelUrl: `${ORIGIN}/pricing`,
    });
    expect(navigate).not.toHaveBeenCalled(); // no /billing bounce
  });

  it.each(["professional", "business"])("authenticated %s selection also goes straight to checkout", (planId) => {
    const { mutate, navigate } = spies();
    handlePlanCta({ planId, isEnterprise: false, isAuthenticated: true, hasSessionToken: true, checkout: { mutate }, navigate, origin: ORIGIN });
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.calls[0][0].plan).toBe(planId);
  });

  it("guest selection routes to signup and never calls checkout", () => {
    const { mutate, navigate } = spies();
    handlePlanCta({ planId: "starter", isEnterprise: false, isAuthenticated: false, hasSessionToken: false, checkout: { mutate }, navigate, origin: ORIGIN });
    expect(mutate).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/signup?plan=starter");
  });

  it("Enterprise NEVER calls checkout", () => {
    const { mutate, navigate } = spies();
    handlePlanCta({ planId: "enterprise", isEnterprise: true, isAuthenticated: true, hasSessionToken: true, checkout: { mutate }, navigate, origin: ORIGIN });
    expect(mutate).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledTimes(1);
  });


  it("m1(29) race: session token present but auth.me unresolved still goes to checkout (no /signup bounce)", () => {
    // useAuth.isAuthenticated is false until auth.me resolves; an authenticated
    // customer clicking early must NOT be misrouted to /signup (the signup guard
    // then bounced them to /billing — the observed flaky no-fire).
    const { mutate, navigate } = spies();
    handlePlanCta({
      planId: "starter",
      isEnterprise: false,
      isAuthenticated: false, // auth.me still resolving
      hasSessionToken: true,  // ...but a session token exists
      checkout: { mutate },
      navigate,
      origin: ORIGIN,
    });
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.calls[0][0].plan).toBe("starter");
    expect(navigate).not.toHaveBeenCalled();
  });

  it("no token and unauthenticated is a true guest — routes to signup", () => {
    const { mutate, navigate } = spies();
    handlePlanCta({ planId: "professional", isEnterprise: false, isAuthenticated: false, hasSessionToken: false, checkout: { mutate }, navigate, origin: ORIGIN });
    expect(mutate).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/signup?plan=professional");
  });

  it("navigation toward Stripe happens only when the server returns a checkout URL", () => {
    const assign = vi.fn();
    // Production worker field (m1(29) root cause: reading data.url never redirected)
    applyCheckoutResult({ checkoutUrl: "https://checkout.stripe.com/c/pay/cs_live_example" } as any, assign);
    expect(assign).toHaveBeenCalledWith("https://checkout.stripe.com/c/pay/cs_live_example");
    // legacy shape tolerated
    assign.mockClear();
    applyCheckoutResult({ url: "https://checkout.stripe.com/c/pay/cs_test_example" }, assign);
    expect(assign).toHaveBeenCalledWith("https://checkout.stripe.com/c/pay/cs_test_example");
    assign.mockClear();
    applyCheckoutResult({ url: null }, assign);
    applyCheckoutResult(undefined, assign);
    applyCheckoutResult({} as any, assign);
    expect(assign).not.toHaveBeenCalled();
  });
});
