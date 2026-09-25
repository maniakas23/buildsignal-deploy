import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/hooks/usePageTracking";
import { Check, ChevronDown, ChevronUp, ArrowRight, MoveHorizontal } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { selectTrial, trialDisclosure } from "@/lib/customerJourney";
import {
  PricingFaq,
  PricingTrustAndCta,
  FeatureValue,
  PRICING_FALLBACK_PLANS,
  PRICING_COMPARISON_FEATURES,
  getPriceDisplay,
} from "@/components/pricing/PricingExtras";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


/** Explicit horizontal-scroll affordance for the comparison table on small screens. */
export function MobileComparisonHint() {
  return (
    <p className="sm:hidden flex items-center gap-1.5 text-xs text-muted-foreground">
      <MoveHorizontal className="h-3.5 w-3.5 shrink-0" />
      Swipe sideways to compare Scout, Professional, Business, and Enterprise
    </p>
  );
}


export interface PlanCtaDeps {
  planId: string;
  isEnterprise: boolean;
  isAuthenticated: boolean;
  /**
   * m1(29) race fix: true when a session token exists in localStorage at click
   * time. useAuth's isAuthenticated stays false until auth.me resolves, so an
   * authenticated customer clicking early was misrouted to /signup (and the
   * signup guard then bounced them to /billing). The server re-validates the
   * JWT inside createCheckoutSession — the browser never supplies authoritative
   * Stripe IDs — so token presence is a safe checkout-eligibility signal.
   */
  hasSessionToken: boolean;
  checkout: { mutate: (input: { plan: string; successUrl: string; cancelUrl: string }) => void };
  navigate: (to: string) => void;
  origin: string;
}

/**
 * m1(29): authenticated self-service plan selection initiates Stripe Checkout
 * directly (server creates the session; browser only receives the URL).
 * Guests sign up first; Enterprise stays Contact Sales and NEVER calls Checkout.
 */
export function handlePlanCta({ planId, isEnterprise, isAuthenticated, hasSessionToken, checkout, navigate, origin }: PlanCtaDeps) {
  trackEvent("pricing_cta_click", { plan: planId });
  const checkoutEligible = isAuthenticated || hasSessionToken;
  if (isEnterprise || !checkoutEligible) {
    navigate(`/signup?plan=${planId}`);
    return;
  }
  checkout.mutate({
    plan: planId,
    successUrl: `${origin}/billing?upgraded=1`,
    cancelUrl: `${origin}/pricing`,
  });
}

/** Navigate toward Stripe Checkout only when the server returned a valid URL.
 *  The worker returns { checkoutUrl } (m1(29): reading data.url silently
 *  swallowed the handoff); tolerate a legacy { url } shape too. */
export function applyCheckoutResult(
  data: { checkoutUrl?: string | null; url?: string | null } | undefined,
  assign: (url: string) => void
) {
  const u = data?.checkoutUrl ?? data?.url;
  if (u) assign(u);
}

export function PricingPage() {
  const navigate = useNavigate();
  const [expandedComparison, setExpandedComparison] = useState(false);
  const { isAuthenticated } = useAuth();

  // Plans are served by stripe.plans (billing.plans does not exist).
  const { data: plansData } = trpc.stripe.plans.useQuery();
  const checkout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => applyCheckoutResult(data, (url) => { window.location.href = url; }),
  });
  const trial = selectTrial(plansData as any);

  const rawPlans = (plansData as any)?.plans ?? plansData;
  // Enterprise is custom pricing ("Contact Sales") — never display a fixed monthly price for it
  const apiPlans = Array.isArray(rawPlans)
    ? rawPlans.map((pl: any) =>
        pl && pl.id === "enterprise" ? { ...pl, price: null, interval: "custom" } : pl
      )
    : rawPlans;
  const plans = (Array.isArray(apiPlans) && apiPlans.length ? apiPlans : null) || PRICING_FALLBACK_PLANS;



  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Straightforward monthly billing. No hidden fees, cancel anytime.
          Applicable taxes are included in plan prices.
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
                  disabled={checkout.isPending}
                  onClick={() =>
                    handlePlanCta({
                      planId: plan.id,
                      isEnterprise,
                      isAuthenticated,
                      // read at click time — immune to the auth.me resolution race
                      hasSessionToken: !!localStorage.getItem("auth_token"),
                      checkout,
                      navigate,
                      origin: window.location.origin,
                    })
                  }
                >
                  {isEnterprise ? "Contact Sales" : "Get Started"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                {!isEnterprise && (
                  <p className="text-xs text-center text-[var(--bs-text-tertiary)] mt-2">
                    {trialDisclosure(trial, { id: plan.id, price: plan.price })}
                  </p>
                )}
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

        <MobileComparisonHint />
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto pb-2">
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
                  {PRICING_COMPARISON_FEATURES.map((feature) => (
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

      <PricingFaq />

      <Separator />

      <PricingTrustAndCta />
    </div>
  );
}
