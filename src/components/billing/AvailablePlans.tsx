// Available Plans column — extracted from BillingPage (m1(24C)),
// behavior-identical. Enterprise stays Contact Sales only; the certified
// trial disclosure renders next to the self-service plan CTAs.
import { Check, CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isContactSalesPlan } from "@/pages/billingPlans";
import { selectTrial, trialDisclosure } from "@/lib/customerJourney";
import { planConfig, formatPlanPrice } from "./billingConfig";

interface AvailablePlansProps {
  plans: any[] | undefined;
  plansData: unknown;
  hasPaidSubscription: boolean;
  currentPlan: string;
  checkoutPending: boolean;
  onUpgrade: (planId: string) => void;
}

export function AvailablePlans(p: AvailablePlansProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-[var(--bs-text-primary)] uppercase tracking-wider">
        Available Plans
      </h3>
      {/* Certified trial truth next to every self-service plan CTA
          (m1(24C)): 14-day trial · $0 today · no card required. */}
      {!p.hasPaidSubscription && (
        <p className="text-xs text-[var(--bs-text-tertiary)] bg-[var(--bs-canvas)] border border-[var(--bs-border)] rounded-lg px-3 py-2">
          {trialDisclosure(selectTrial(p.plansData as any))}
        </p>
      )}
      {p.plans?.map((plan: any) => {
        const config = planConfig[plan.id] || planConfig.starter;
        // The API names the paid $99 plan "Scout" (id "starter"); a paid
        // subscription may report its plan as either id.
        const displayName = plan.name || config.name;
        const isCurrent =
          p.hasPaidSubscription &&
          (p.currentPlan === plan.id ||
            (plan.id === "starter" && p.currentPlan === "scout"));

        return (
          <Card
            key={plan.id}
            className={cn(
              "border-[var(--bs-surface-hover)] shadow-sm transition-all",
              isCurrent
                ? "border-[var(--bs-action)]/20 bg-[var(--bs-action)]/5"
                : "hover:border-[var(--bs-action)]/30"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", config.color)}>
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[var(--bs-text-primary)]">
                      {displayName}
                    </p>
                    <p className="text-xs text-[var(--bs-text-tertiary)]">
                      {plan.id === "enterprise" || plan.price === null
                        ? "Custom pricing"
                        : `${formatPlanPrice(plan.price)}/mo`}
                    </p>
                  </div>
                </div>
                {isCurrent && (
                  <Badge className="bg-[var(--bs-intelligence)] text-white text-[10px]">
                    Current
                  </Badge>
                )}
              </div>
              <ul className="space-y-1 mb-3">
                {config.features.slice(0, 3).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-1.5 text-xs text-[var(--bs-text-primary)]"
                  >
                    <Check className="h-3 w-3 text-[var(--bs-intelligence)] shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              {!isCurrent && plan.id !== "starter" && isContactSalesPlan(plan) && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.location.href = "mailto:support@buildsignal.net?subject=Enterprise%20plan%20inquiry";
                  }}
                >
                  Contact Sales
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              )}
              {!isCurrent && !isContactSalesPlan(plan) && (
                <Button
                  size="sm"
                  className="w-full bg-[var(--bs-action)] hover:bg-[var(--bs-action)]/90"
                  onClick={() => p.onUpgrade(plan.id)}
                  disabled={p.checkoutPending}
                >
                  {p.checkoutPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      Upgrade to {displayName}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
