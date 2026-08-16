import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/hooks/usePageTracking";
import {
  Check,
  Building2,
  Shield,
  Lock,
  CreditCard,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Users,
  Zap,
  HelpCircle,
  ArrowRight,
  MessageSquare,
  Star,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function PricingPage() {
  const navigate = useNavigate();
  const [expandedComparison, setExpandedComparison] = useState(false);

  const { data: plansData } = trpc.billing.plans.useQuery();

  const plans = plansData || [
    {
      id: "starter",
      name: "Scout",
      price: 99,
      interval: "month",
      description: "Perfect for individual investors",
      features: ["1 County", "3 Alerts/Day", "30-Day History", "Email Support"],
    },
    {
      id: "professional",
      name: "Pro",
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

  const getPriceDisplay = (plan: { price: number | null; interval: string }) => {
    if (plan.price === null || plan.price === 0) return { display: "Custom", sub: "" };
    if (plan.interval === "year") {
      const monthly = Math.round(plan.price / 12);
      return { display: `$${monthly}`, sub: `/mo (billed $${plan.price}/yr)` };
    }
    return { display: `$${plan.price}`, sub: "/month" };
  };

  const getAnnualPrice = (monthly: number) => Math.round(monthly * 12 * 0.85);

  const comparisonFeatures = [
    "counties",
    "alerts",
    "watchlist",
    "api",
    "analytics",
    "sso",
    "support",
    "whiteglove",
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Straightforward monthly billing. No hidden fees, cancel anytime.
        </p>
      </div>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const price = getPriceDisplay(plan as any);
          const isEnterprise = plan.price === null;

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.id === "professional"
                  ? "border-primary shadow-lg"
                  : "border-border"
              }`}
            >
              {plan.id === "professional" && (
                <Badge
                  variant="default"
                  className="absolute -top-2 -right-2 bg-[#4ade80] text-[#081018] text-[10px] px-1.5 py-0 font-semibold"
                >
                  Popular
                </Badge>
              )}
              <CardHeader className="pb-3">
                <div className="text-sm font-medium text-muted-foreground">
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{price.display}</span>
                  {price.sub && (
                    <span className="text-sm text-muted-foreground">
                      {price.sub}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2 mb-6 flex-1">
                  {(plan as any).features.map((feature: string) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#4ade80] shrink-0" />
                      <span className="text-sm text-[var(--bs-text-primary)]">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full"
                  variant={plan.id === "professional" ? "default" : "outline"}
                  onClick={() => {
                    trackEvent("pricing_cta_click", { plan: plan.id });
                    navigate(`/signup?plan=${plan.id}`);
                  }}
                >
                  {isEnterprise ? "Contact Sales" : "Get Started"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator />

      {/* Feature Comparison */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Feature comparison</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedComparison(!expandedComparison)}
          >
            {expandedComparison ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Expand all
              </>
            )}
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Feature</th>
                    {plans.map((plan) => (
                      <th
                        key={plan.id}
                        className={`text-center p-4 font-medium ${
                          plan.id === "professional" ? "bg-primary/5" : ""
                        }`}
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature) => (
                    <tr key={feature} className="border-b last:border-0">
                      <td className="p-4 capitalize">{feature}</td>
                      {plans.map((plan) => (
                        <td
                          key={plan.id}
                          className={`text-center p-4 ${
                            plan.id === "professional" ? "bg-primary/5" : ""
                          }`}
                        >
                          <FeatureValue plan={plan as any} featureKey={feature} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* FAQ */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="max-w-2xl mx-auto">
          <AccordionItem value="trial">
            <AccordionTrigger>
              Can I see the product before subscribing?
            </AccordionTrigger>
            <AccordionContent>
              Yes — request a demo and our team will walk you through the
              platform. Subscriptions are billed monthly with immediate access,
              and you can cancel anytime.
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

      <Separator />

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#4ade80]" />
          <span>SSL Secure</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-[#4ade80]" />
          <span>PCI Compliant</span>
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

      <Separator />

      {/* CTA */}
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
    </div>
  );
}

function FeatureValue({
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
