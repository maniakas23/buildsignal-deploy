// Current Plan card — extracted from BillingPage (m1(24C)).
// m1(34): subtext is now truth-preserving for canceled and scheduled-cancel
// subscriptions — a canceled subscription never says "Current period ends"
// (that implies an ongoing period), and a scheduled cancel always says the
// access end date + "no renewal", never "renews".
import {
  CreditCard,
  Check,
  AlertTriangle,
  Loader2,
  ExternalLink,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "./billingConfig";

interface CurrentPlanCardProps {
  subscription: any;
  subLoading: boolean;
  planInfo: { name: string; color: string; features: string[] };
  status: { label: string; color: string };
  trial?: any;
  portalPending: boolean;
  cancelPending: boolean;
  onManageBilling: () => void;
  onOpenCancelDialog: () => void;
  onGoToPricing: () => void;
}

// Truthful subtext for the Current Plan card (m1(34)).
// Rules:
//  - canceled: state that the subscription is canceled; no "current period"
//    language, no renewal implication.
//  - cancelAtPeriodEnd (scheduled cancel): give the access end date and say
//    cancellation is scheduled + no renewal. Never the word "renews".
//  - trialing (not scheduled): say the trial end date.
//  - active (not scheduled): current period end date.
//  - no subscription but active internal trial (m1(45)): trial end date + $0/no-card terms.
//  - no subscription: free starter plan.
export function getPlanSubtext(subscription: any, trial?: any): string {
  // The worker returns { status: "inactive" } for accounts with no Stripe
  // subscription — treat it the same as no subscription object.
  const noSub =
    !subscription ||
    subscription.status === "inactive" ||
    subscription.status === "none";
  if (noSub && trial?.status === "active" && trial?.endsAt) {
    const end = new Date(trial.endsAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `Free trial ends on ${end} · $0 today · no credit card required`;
  }
  if (noSub) return "You are on the free starter plan";
  const end = subscription.currentPeriodEnd
    ? formatDate(subscription.currentPeriodEnd)
    : null;
  if (subscription.status === "canceled") {
    return "Subscription canceled — no renewal, no further charges";
  }
  if (subscription.cancelAtPeriodEnd && end) {
    return subscription.status === "trialing"
      ? `Trial access ends on ${end} — cancellation scheduled, no renewal`
      : `Access ends on ${end} — cancellation scheduled, no renewal`;
  }
  if (subscription.status === "trialing" && end) {
    return `Trial ends on ${end}`;
  }
  if (end) return `Current period ends on ${end}`;
  if (trial?.status === "active" && trial?.endsAt) {
    const tEnd = new Date(trial.endsAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `Free trial ends on ${tEnd} · $0 today · no credit card required`;
  }
  return "You are on the free starter plan";
}

export function CurrentPlanCard(p: CurrentPlanCardProps) {
  const { subscription, subLoading, planInfo, status, trial } = p;
  return (
    <Card className="border-[var(--bs-surface-hover)] shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-[var(--bs-text-primary)]">Current Plan</CardTitle>
          <Badge className={cn("font-medium", status.color)}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {subLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--bs-action)]" />
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4">
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", planInfo.color)}>
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[var(--bs-text-primary)]">
                  {planInfo.name}
                </h3>
                <p className="text-sm text-[var(--bs-text-tertiary)] mt-0.5">
                  {getPlanSubtext(subscription, trial)}
                </p>
                {subscription?.cancelAtPeriodEnd &&
                  (subscription?.status === "active" || subscription?.status === "trialing") && (
                  <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Your subscription will cancel at the end of this period
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {planInfo.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-[var(--bs-text-primary)]">
                  <Check className="h-4 w-4 text-[var(--bs-intelligence)] shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {subscription?.status === "active" || subscription?.status === "trialing" ? (
                <>
                  <Button
                    onClick={p.onManageBilling}
                    disabled={p.portalPending}
                    className="gap-2 bg-[var(--bs-action)] hover:bg-[var(--bs-action)]/90"
                  >
                    {p.portalPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                    Manage Billing
                  </Button>
                  <Button
                    variant="outline"
                    onClick={p.onOpenCancelDialog}
                    disabled={p.cancelPending}
                    className="gap-2 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel Subscription
                  </Button>
                </>
              ) : (
                <Button
                  onClick={p.onGoToPricing}
                  className="gap-2 bg-[var(--bs-action)] hover:bg-[var(--bs-action)]/90"
                >
                  Upgrade Plan
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
