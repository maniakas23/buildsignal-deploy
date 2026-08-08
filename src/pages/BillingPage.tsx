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
    color: "bg-[#6B7B8F]",
    features: ["1 county", "10 searches/mo", "1 report/mo", "1 team member"],
  },
  scout: {
    name: "Scout",
    color: "bg-[#1F5EFF]",
    features: ["5 counties", "100 searches/mo", "10 reports/mo", "1 team member", "Email alerts"],
  },
  professional: {
    name: "Professional",
    color: "bg-[#18A999]",
    features: ["20 counties", "500 searches/mo", "50 reports/mo", "3 team members", "Priority alerts", "API access"],
  },
  business: {
    name: "Business",
    color: "bg-[#0B1F33]",
    features: ["Unlimited counties", "Unlimited searches", "Unlimited reports", "10 team members", "Full API + webhooks", "White-label reports", "Dedicated support"],
  },
  enterprise: {
    name: "Enterprise",
    color: "bg-[#FFD700]",
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
  const { data: plans } = trpc.stripe.plans.useQuery();
  const { data: billingHistory, isLoading: historyLoading } =
    trpc.billing.history.useQuery();
  const { data: usage, isLoading: usageLoading } =
    trpc.billing.usage.useQuery();

  const checkout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
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
    active: { label: "Active", variant: "default", color: "bg-[#18A999] text-white" },
    trialing: { label: "Trialing", variant: "secondary", color: "bg-[#1F5EFF] text-white" },
    past_due: { label: "Past Due", variant: "destructive", color: "bg-red-500 text-white" },
    canceled: { label: "Canceled", variant: "outline", color: "bg-[#6B7B8F] text-white" },
    none: { label: "No Subscription", variant: "outline", color: "bg-[#F5F5F5] text-[#6B7B8F]" },
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
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="gap-2 text-[#0B1F33]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#0B1F33]">Billing</h1>
            <p className="text-sm text-[#6B7B8F]">
              Manage your subscription and billing details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column — Current Plan & Usage */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan Card */}
            <Card className="border-[#F5F5F5] shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-[#0B1F33]">Current Plan</CardTitle>
                  <Badge className={cn("font-medium", status.color)}>
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {subLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#1F5EFF]" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-4">
                      <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", planInfo.color)}>
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#0B1F33]">
                          {planInfo.name}
                        </h3>
                        <p className="text-sm text-[#6B7B8F] mt-0.5">
                          {subscription?.currentPeriodEnd
                            ? `Current period ends on ${formatDate(subscription.currentPeriodEnd)}`
                            : "You are on the free starter plan"}
                        </p>
                        {subscription?.cancelAtPeriodEnd && (
                          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Your subscription will cancel at the end of this period
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {planInfo.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-[#0B1F33]">
                          <Check className="h-4 w-4 text-[#18A999] shrink-0" />
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
                            className="gap-2 bg-[#1F5EFF] hover:bg-[#1F5EFF]/90"
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
                            className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                            Cancel Subscription
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => navigate("/pricing")}
                          className="gap-2 bg-[#1F5EFF] hover:bg-[#1F5EFF]/90"
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
            <Card className="border-[#F5F5F5] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#0B1F33]">Current Usage</CardTitle>
              </CardHeader>
              <CardContent>
                {usageLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#1F5EFF]" />
                  </div>
                ) : usage ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Counties", used: usage.counties.used, limit: usage.counties.limit },
                      { label: "Searches", used: usage.searches.used, limit: usage.searches.limit },
                      { label: "Reports", used: usage.reports.used, limit: usage.reports.limit },
                      { label: "Team Members", used: usage.teamMembers.used, limit: usage.teamMembers.limit },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-[#F7F9FC] rounded-lg p-4 border border-[#F5F5F5]"
                      >
                        <p className="text-xs text-[#6B7B8F] uppercase tracking-wide font-medium">
                          {item.label}
                        </p>
                        <p className="text-2xl font-bold text-[#0B1F33] mt-1">
                          {item.limit >= 9999 ? "Unlimited" : `${item.used} / ${item.limit}`}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card className="border-[#F5F5F5] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#0B1F33] flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-[#1F5EFF]" />
                  Billing History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#1F5EFF]" />
                  </div>
                ) : billingHistory?.invoices && billingHistory.invoices.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#F5F5F5]">
                        <TableHead className="text-[#6B7B8F]">Date</TableHead>
                        <TableHead className="text-[#6B7B8F]">Event</TableHead>
                        <TableHead className="text-[#6B7B8F]">Plan</TableHead>
                        <TableHead className="text-[#6B7B8F] text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billingHistory.invoices.map((invoice) => (
                        <TableRow key={invoice.id} className="border-[#F5F5F5]">
                          <TableCell className="text-[#0B1F33]">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-[#6B7B8F]" />
                              {invoice.createdAt
                                ? new Date(invoice.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </div>
                          </TableCell>
                          <TableCell className="text-[#0B1F33] capitalize">
                            {invoice.event.replace(/_/g, " ")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-[#F5F5F5] text-[#0B1F33] capitalize">
                              {invoice.plan}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-[#0B1F33]">
                            {formatCurrency(invoice.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-[#6B7B8F]">
                    <Receipt className="h-8 w-8 mx-auto mb-2 text-[#E5E5E5]" />
                    <p>No billing history yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column — Available Plans */}
          <div className="space-y-6">
            <Card className="border-[#F5F5F5] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#0B1F33]">Available Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {plans?.map((plan) => {
                  const isCurrent = currentPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        "border rounded-lg p-4 transition-all",
                        isCurrent
                          ? "border-[#1F5EFF] bg-[rgba(31,94,255,0.04)]"
                          : "border-[#E5E5E5] bg-white hover:border-[#1F5EFF]/30"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[#0B1F33]">
                          {plan.name}
                        </span>
                        {isCurrent && (
                          <Badge className="bg-[#1F5EFF] text-white text-[10px]">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="text-xl font-bold text-[#0B1F33]">
                        {plan.price === null
                          ? "Custom"
                          : `$${(plan.price / 100).toFixed(0)}`}
                        {plan.price !== null && plan.interval && (
                          <span className="text-sm font-normal text-[#6B7B8F]">
                            /{plan.interval}
                          </span>
                        )}
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {plan.features.map((feature: string) => (
                          <li
                            key={feature}
                            className="flex items-center gap-2 text-xs text-[#0B1F33]"
                          >
                            <Check className="h-3 w-3 text-[#18A999] shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {!isCurrent && plan.id !== "enterprise" && (
                        <Button
                          size="sm"
                          className="w-full mt-3 bg-[#1F5EFF] hover:bg-[#1F5EFF]/90"
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={checkout.isPending}
                        >
                          {checkout.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            "Upgrade"
                          )}
                        </Button>
                      )}
                      {plan.id === "enterprise" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-3 border-[#E5E5E5] text-[#0B1F33]"
                          onClick={() => navigate("/contact")}
                        >
                          Contact Sales
                        </Button>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="border-[#F5F5F5]">
          <DialogHeader>
            <DialogTitle className="text-[#0B1F33]">Cancel Subscription?</DialogTitle>
            <DialogDescription className="text-[#6B7B8F]">
              Your subscription will remain active until the end of the current billing period ({formatDate(subscription?.currentPeriodEnd)}). After that, you will be downgraded to the Starter plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              className="border-[#E5E5E5] text-[#0B1F33]"
            >
              Keep Subscription
            </Button>
            <Button
              onClick={handleCancel}
              disabled={cancel.isPending}
              className="bg-red-500 hover:bg-red-600 text-white gap-2"
            >
              {cancel.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
