// Pricing truth regression: the customer-facing "SOC 2 Program In Progress"
// claim is unsupported by any documented formal SOC 2 program, auditor/CPA
// engagement, or readiness process in this repository — it must not appear on
// the pricing surface. Also pins the mobile comparison scroll affordance.
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { PricingTrustAndCta } from "../../components/pricing/PricingExtras";
import { MobileComparisonHint } from "../PricingPage";

describe("pricing truth", () => {
  it("PricingTrustAndCta contains no SOC 2 claim but keeps truthful trust signals", () => {
    const html = renderToString(createElement(MemoryRouter, null, createElement(PricingTrustAndCta)));
    expect(html).not.toMatch(/SOC ?2/i);
    expect(html).toContain("SSL Secure");
    expect(html).toContain("Payments secured by Stripe");
    expect(html).toContain("No hidden fees");
    expect(html).toContain("Contact Sales"); // Enterprise CTA preserved
  });

  it("MobileComparisonHint gives an explicit scroll affordance naming all four plans", () => {
    const html = renderToString(createElement(MobileComparisonHint));
    expect(html).toContain("Swipe sideways");
    for (const plan of ["Scout", "Professional", "Business", "Enterprise"]) {
      expect(html).toContain(plan);
    }
    expect(html).toContain("sm:hidden"); // mobile-only
  });
});
