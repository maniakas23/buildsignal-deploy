// Pricing page extras — FAQ, trust badges, contact CTA, FeatureValue
// (extracted from PricingPage, m1(24C); FAQ trial answer corrected to the
// certified contract).
import { useNavigate } from "react-router-dom";
import {
  Check, Shield, Lock, CreditCard, BadgeCheck, HelpCircle, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export function PricingFaq() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">
        Frequently asked questions
      </h2>
      <Accordion type="single" collapsible className="max-w-2xl mx-auto">
        <AccordionItem value="trial">
          <AccordionTrigger>
            Can I try the product before subscribing?
          </AccordionTrigger>
          <AccordionContent>
            Yes — every paid plan starts with a 14-day free trial: $0 today
            and no credit card required. Billing begins only after the trial
            at your plan's monthly price, and you can cancel anytime. You can
            also request a demo and our team will walk you through the
            platform.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="cancel">
          <AccordionTrigger>
            How do I cancel my subscription?
          </AccordionTrigger>
          <AccordionContent>
            You can cancel anytime from your account settings. Your access
            continues until the end of your billing period.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="upgrade">
          <AccordionTrigger>
            Can I upgrade or downgrade my plan?
          </AccordionTrigger>
          <AccordionContent>
            Yes, you can change your plan at any time. Upgrades take effect
            immediately; downgrades take effect at the next billing cycle.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="enterprise">
          <AccordionTrigger>
            What's included in the Enterprise plan?
          </AccordionTrigger>
          <AccordionContent>
            Enterprise includes everything in Business plus custom data
            sources, SLA guarantees, dedicated support, and optional
            on-premise deployment. Contact us for a custom quote.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function PricingTrustAndCta() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#4ade80]" />
          <span>SSL Secure</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-[#4ade80]" />
          <span>Payments secured by Stripe</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#4ade80]" />
          <span>No hidden fees</span>
        </div>
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-[#4ade80]" />
          <span>SOC 2 Program In Progress</span>
        </div>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">
          Still have questions?
        </h2>
        <p className="text-muted-foreground">
          Our team is here to help you find the right plan.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/contact")}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Sales
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/help")}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Help Center
          </Button>
        </div>
      </div>
    </>
  );
}

export function FeatureValue({
  plan,
  featureKey,
}: {
  plan: { features: string[]; name: string };
  featureKey: string;
}) {
  if (!plan.features || plan.features.length === 0) {
    return <span className="text-[var(--bs-text-muted)] text-sm">—</span>;
  }

  const normalizedKey = featureKey.toLowerCase();

  const matchFn = (f: string) => {
    const lower = f.toLowerCase();
    switch (normalizedKey) {
      case "reports":
        return lower.includes("report");
      case "alerts":
        return lower.includes("alert");
      case "counties":
        return lower.includes("count");
      case "watchlist":
        return lower.includes("watch") || lower.includes("track");
      case "api":
        return lower.includes("api");
      case "sso":
        return lower.includes("sso") || lower.includes("saml");
      case "support":
        return lower.includes("support") || lower.includes("dedicated");
      case "analytics":
        return lower.includes("analytic") || lower.includes("dashboard") || lower.includes("insight");
      case "whiteglove":
        return lower.includes("onboard") || lower.includes("white-glove") || lower.includes("whiteglove");
      default:
        return lower.includes(normalizedKey);
    }
  };

  const hasFeature = plan.features.some(matchFn);

  if (hasFeature) {
    const matchingFeature = plan.features.find(matchFn);
    // Show full feature text, but clean up for display
    const displayText = matchingFeature
      ?.replace(/^\d+\s*/, "") // Remove leading numbers only
      .trim() || "";
    return (
      <div className="flex items-center justify-center gap-1.5">
        <Check className="h-4 w-4 text-[#4ade80] shrink-0" />
        <span className="text-xs text-[var(--bs-text-secondary)]">
          {displayText}
        </span>
      </div>
    );
  }

  return <span className="text-[var(--bs-text-muted)] text-sm">—</span>;
}

// Fallback plan list (matches the certified stripe.plans contract) used only
// if the plans request fails — keeps pricing truthful instead of crashing.
export const PRICING_FALLBACK_PLANS = [
  {
    id: "starter",
    name: "Scout",
    price: 99,
    interval: "month",
    description: "Perfect for individual investors",
    features: ["1 County", "3 Alerts/Day", "Email Support"],
  },
  {
    id: "professional",
    name: "Professional",
    price: 249,
    interval: "month",
    description: "For serious investors & small teams",
    features: [
      "10 Counties",
      "50 Alerts/Day",
      "Watchlists",
      "Basic Analytics",
      "Priority Support",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 599,
    interval: "month",
    description: "For teams & organizations",
    features: [
      "All Counties",
      "Unlimited Alerts",
      "Advanced Analytics",
      "SSO",
      "Dedicated Support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    interval: "custom",
    description: "For large enterprises with custom requirements",
    features: [
      "Unlimited everything",
      "Dedicated account manager",
      "Custom data sources",
      "SLA guarantees",
      "On-premise option",
    ],
  },
];

export const PRICING_COMPARISON_FEATURES = [
  "counties",
  "alerts",
  "watchlist",
  "api",
  "analytics",
  "sso",
  "support",
  "whiteglove",
];

export function getPriceDisplay(plan: { price: number | null; interval: string }) {
  if (plan.price === null || plan.price === 0) return { display: "Custom", sub: "" };
  if (plan.interval === "year") {
    const monthly = Math.round(plan.price / 12);
    return { display: `$${monthly}`, sub: `/mo (billed $${plan.price}/yr)` };
  }
  return { display: `$${plan.price}`, sub: "/month" };
}
