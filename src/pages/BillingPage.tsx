import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { selectPlans } from "./billingPlans";
import { Button } from "@/components/ui/button";
import {
  planConfig,
  statusConfig,
} from "@/components/billing/billingConfig";
import { CurrentPlanCard } from "@/components/billing/CurrentPlanCard";
import { UsageCard } from "@/components/billing/UsageCard";
import { BillingHistoryCard } from "@/components/billing/BillingHistoryCard";
import { AvailablePlans } from "@/components/billing/AvailablePlans";
import { CancelSubscriptionDialog } from "@/components/billing/CancelSubscriptionDialog";

export function BillingPage() {
  const navigate = useNavigate();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const { data: subscription, isLoading: subLoading } =
    trpc.stripe.getSubscription.useQuery();
  const { data: plansData } = trpc.stripe.plans.useQuery();
  // Production returns { plans: [...] } — unwrap via the shared contract
  // helper (m1(24A): the bare-array assumption crashed this page).
  const plans = selectPlans(plansData as any);
  const { data: billingHistoryData, isLoading: historyLoading } =
    trpc.billing.history.useQuery();
  // billing.history returns { invoices: [...] } — unwrap it
  const billingHistory = billingHistoryData?.invoices;
  const { data: usage, isLoading: usageLoading } =
    trpc.billing.usage.useQuery();

  const checkout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      // API returns { sessionId, url }
      const url = data.url;
      if (url) window.location.href = url;
    },
  });

  const portal = trpc.stripe.createBillingPortalSession.useMutation({
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
  });

  const cancel = trpc.stripe.cancelSubscription.useMutation({
    onSuccess: () => {
      setCancelDialogOpen(false);
      window.location.reload();
    },
  });

  const currentPlan = subscription?.plan || "starter";
  // A free user has no paid subscription even though their internal plan id is
  // "starter" — only an active/trialing Stripe subscription makes a plan "Current".
  const hasPaidSubscription =
    subscription?.status === "active" || subscription?.status === "trialing";
  const planInfo = planConfig[currentPlan] || planConfig.starter;
  const status = statusConfig[subscription?.status || "none"] || statusConfig.none;

  const handleUpgrade = (planId: string) => {
    const successUrl = `${window.location.origin}/billing?upgraded=1`;
    const cancelUrl = `${window.location.origin}/billing?canceled=1`;
    checkout.mutate({
      plan: planId as "scout" | "professional" | "business",
      successUrl,
      cancelUrl,
    });
  };

  const handleManageBilling = () => {
    portal.mutate({
      returnUrl: `${window.location.origin}/billing`,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bs-canvas)]">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="gap-2 text-[var(--bs-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--bs-text-primary)]">Billing</h1>
            <p className="text-sm text-[var(--bs-text-tertiary)]">
              Manage your subscription and billing details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column — Current Plan & Usage */}
          <div className="lg:col-span-2 space-y-6">
            <CurrentPlanCard
              subscription={subscription}
              subLoading={subLoading}
              planInfo={planInfo}
              status={status}
              portalPending={portal.isPending}
              cancelPending={cancel.isPending}
              onManageBilling={handleManageBilling}
              onOpenCancelDialog={() => setCancelDialogOpen(true)}
              onGoToPricing={() => navigate("/pricing")}
            />

            <UsageCard usage={usage} usageLoading={usageLoading} />

            <BillingHistoryCard
              billingHistory={billingHistory}
              historyLoading={historyLoading}
            />
          </div>

          {/* Right Column — Available Plans */}
          <AvailablePlans
            plans={plans}
            plansData={plansData}
            hasPaidSubscription={hasPaidSubscription}
            currentPlan={currentPlan}
            checkoutPending={checkout.isPending}
            onUpgrade={handleUpgrade}
          />
        </div>
      </div>

      <CancelSubscriptionDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        currentPeriodEnd={subscription?.currentPeriodEnd}
        cancelPending={cancel.isPending}
        onConfirm={() => cancel.mutate()}
      />
    </div>
  );
}
