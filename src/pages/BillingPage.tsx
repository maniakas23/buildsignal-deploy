import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Check,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Receipt,
  XCircle,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const planConfig: Record<string, { name: string; color: string; features: string[] }> = {
  starter: {
    name: "Starter",
    color: "bg-[var(--bs-text-tertiary)]",
    features: ["1 county", "10 searches/mo", "1 report/mo", "1 team member"],
  },
  scout: {
    name: "Scout",
    color: "bg-[var(--bs-action)]",
    features: ["5 counties", "100 searches/mo", "10 reports/mo", "1 team member", "Email alerts"],
  },
  professional: {
    name: "Professional",
    color: "bg-[var(--bs-intelligence)]",
    features: ["20 counties", "500 searches/mo", "50 reports/mo", "3 team members", "Priority alerts", "API access"],
  },
  business: {
    name: "Business",
    color: "bg-[var(--bs-canvas)]",
    features: ["Unlimited counties", "Unlimited searches", "Unlimited reports", "10 team members", "Full API + webhooks", "White-label reports", "Dedicated support"],
  },
  enterprise: {
    name: "Enterprise",
    color: "bg-[var(--bs-opportunity)]",
    features: ["Everything in Business", "Custom integrations", "Unlimited team seats", "SLA guarantee", "Dedicated account manager"],
  },
};

function formatDate(timestamp: number | null | undefined) {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
}

export function BillingPage() {
  const navigate = useNavigate();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const { data: subscription, isLoading: subLoading } =
    trpc.stripe.getSubscription.useQuery();
  const { data: plansData } = trpc.stripe.plans.useQuery();
  // stripe.plans returns { plans: [...], annual, trial, ... } — unwrap it
  const plans = plansData?.plans;
  const { data: billingHistoryData, isLoading: historyLoading } =
    trpc.billing.history.useQuery();
  // billing.history returns { invoices: [...] } — unwrap it
  const billingHistory = billingHistoryData?.invoices;
  const { data: usage, isLoading: usageLoading } =
    trpc.billing.usage.useQuery();

  const checkout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      // API returns { checkoutUrl, sessionId }
      const url = data.checkoutUrl || data.url;
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
  const planInfo = planConfig[currentPlan] || planConfig.starter;

  const statusConfig: Record<string, { label: string; variant: string; color: string }> = {
    active: { label: "Active", variant: "default", color: "bg-[var(--bs-intelligence)] text-white" },
    trialing: { label: "Trialing", variant: "secondary", color: "bg-[var(--bs-action)] text-white" },
    past_due: { label: "Past Due", variant: "destructive", color: "bg-red-500 text-white" },
    canceled: { label: "Canceled", variant: "outline", color: "bg-[var(--bs-text-tertiary)] text-white" },
    none: { label: "No Subscription", variant: "outline", color: "bg-[var(--bs-surface-hover)] text-[var(--bs-text-tertiary)]" },
  };

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

  const handleCancel = () => {
    cancel.mutate();
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
            {/* Current Plan Card */}
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
                            onClick={handleManageBilling}
                            disabled={portal.isPending}
                            className="gap-2 bg-[var(--bs-action)] hover:bg-[var(--bs-action)]/90"
                          >
                            {portal.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ExternalLink className="h-4 w-4" />
                            )}
                            Manage Billing
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setCancelDialogOpen(true)}
                            disabled={cancel.isPending}
                            className="gap-2 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                          >
                            <XCircle className="h-4 w-4" />
                            Cancel Subscription
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => navigate("/pricing")}
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

            {/* Usage Card */}
            <Card className="border-[var(--bs-surface-hover)] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-[var(--bs-text-primary)]">Usage This Period</CardTitle>
              </CardHeader>
              <CardContent>
                {usageLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-[var(--bs-action)]" />
                  </div>
                ) : usage ? (
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Counties", used: usage.counties.used, limit: usage.counties.limit },
                      { label: "Searches", used: usage.searches.used, limit: usage.searches.limit },
                      { label: "Reports", used: usage.reports.used, limit: usage.reports.limit },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <p className="text-xs text-[var(--bs-text-tertiary)] uppercase tracking-wider mb-1">
                          {item.label}
                        </p>
                        <p className="font-mono text-2xl font-medium text-[var(--bs-text-primary)]">
                          {item.limit >= 9999 ? "∞" : `${item.used} / ${item.limit}`}
                        </p>
                        {item.limit < 9999 && (
                          <div className="mt-1.5 h-1.5 bg-[var(--bs-surface-hover)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--bs-action)] rounded-full transition-all"
                              style={{
                                width: `${Math.min((item.used / item.limit) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--bs-text-tertiary)] text-center py-6">
                    No usage data available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card className="border-[var(--bs-surface-hover)] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-[var(--bs-text-primary)] flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-[var(--bs-action)]" />
                  Billing History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[var(--bs-action)]" />
                  </div>
                ) : billingHistory && billingHistory.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[var(--bs-border)]">
                        <TableHead className="text-[var(--bs-text-tertiary)]">Date</TableHead>
                        <TableHead className="text-[var(--bs-text-tertiary)]">Description</TableHead>
                        <TableHead className="text-[var(--bs-text-tertiary)] text-right">Amount</TableHead>
                        <TableHead className="text-[var(--bs-text-tertiary)] text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billingHistory.map((invoice) => (
                        <TableRow key={invoice.id} className="border-[var(--bs-border)]">
                          <TableCell className="text-sm text-[var(--bs-text-primary)]">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-[var(--bs-text-tertiary)]" />
                              {formatDate(invoice.created)}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-[var(--bs-text-primary)]">
                            {invoice.description || "Subscription"}
                          </TableCell>
                          <TableCell className="text-sm font-mono text-right text-[var(--bs-text-primary)]">
                            {formatCurrency(invoice.amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={invoice.paid ? "default" : "secondary"}
                              className={cn(
                                "text-[10px]",
                                invoice.paid
                                  ? "bg-[var(--bs-intelligence)] text-white"
                                  : "bg-[var(--bs-text-tertiary)] text-white"
                              )}
                            >
                              {invoice.paid ? "Paid" : "Unpaid"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-[var(--bs-text-tertiary)] text-center py-8">
                    No billing history available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column — Available Plans */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--bs-text-primary)] uppercase tracking-wider">
              Available Plans
            </h3>
            {plans?.map((plan) => {
              const config = planConfig[plan.id] || planConfig.starter;
              const isCurrent = currentPlan === plan.id;

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
                            {config.name}
                          </p>
                          <p className="text-xs text-[var(--bs-text-tertiary)]">
                            {plan.price > 0
                              ? `${formatCurrency(plan.price)}/mo`
                              : "Free"}
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
                    {!isCurrent && plan.id !== "starter" && (
                      <Button
                        size="sm"
                        className="w-full bg-[var(--bs-action)] hover:bg-[var(--bs-action)]/90"
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={checkout.isPending}
                      >
                        {checkout.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            Upgrade to {config.name}
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
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="bg-[var(--bs-surface)] border-[var(--bs-border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--bs-text-primary)]">
              Cancel Subscription?
            </DialogTitle>
            <DialogDescription className="text-[var(--bs-text-tertiary)]">
              Your subscription will remain active until the end of the current billing period
              ({formatDate(subscription?.currentPeriodEnd)}). After that, you will be downgraded
              to the free Starter plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              className="border-[var(--bs-border)] text-[var(--bs-text-primary)]"
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancel.isPending}
              className="gap-2"
            >
              {cancel.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
