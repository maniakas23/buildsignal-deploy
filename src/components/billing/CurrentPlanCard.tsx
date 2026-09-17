// Current Plan card — extracted from BillingPage (m1(24C)), behavior-identical.
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
  portalPending: boolean;
  cancelPending: boolean;
  onManageBilling: () => void;
  onOpenCancelDialog: () => void;
  onGoToPricing: () => void;
}

export function CurrentPlanCard(p: CurrentPlanCardProps) {
  const { subscription, subLoading, planInfo, status } = p;
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
                  {subscription?.currentPeriodEnd
                    ? `Current period ends on ${formatDate(subscription.currentPeriodEnd)}`
                    : "You are on the free starter plan"}
                </p>
                {subscription?.cancelAtPeriodEnd && (
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
