// Canonical plan presentation config for the Billing page (Worker #416 /
// stripe.plans contract). Extracted from BillingPage (m1(24C)).
export const planConfig: Record<
  string,
  { name: string; color: string; features: string[] }
> = {
  starter: {
    name: "Starter",
    color: "bg-[var(--bs-text-tertiary)]",
    // Canonical Scout-tier entitlements: 1 county, 3 alert deliveries per UTC day.
    features: ["1 county", "3 alerts per day", "1 team member", "Email support"],
  },
  scout: {
    name: "Scout",
    color: "bg-[var(--bs-action)]",
    features: ["1 county", "3 alerts per day", "1 watchlist", "1 team member", "Email support"],
  },
  professional: {
    name: "Professional",
    color: "bg-[var(--bs-intelligence)]",
    features: ["10 counties", "50 alerts per day", "Watchlists", "Basic analytics", "Priority support"],
  },
  business: {
    name: "Business",
    color: "bg-[var(--bs-canvas)]",
    features: ["All counties", "Unlimited alerts", "Advanced analytics", "SSO", "Dedicated support"],
  },
  enterprise: {
    name: "Enterprise",
    color: "bg-[var(--bs-opportunity)]",
    features: ["Custom coverage", "SLA", "White-glove onboarding", "Dedicated account manager"],
  },
};

export const statusConfig: Record<
  string,
  { label: string; variant: string; color: string }
> = {
  active: { label: "Active", variant: "default", color: "bg-[var(--bs-intelligence)] text-white" },
  trialing: { label: "Trialing", variant: "secondary", color: "bg-[var(--bs-action)] text-white" },
  past_due: { label: "Past Due", variant: "destructive", color: "bg-red-500 text-white" },
  canceled: { label: "Canceled", variant: "outline", color: "bg-[var(--bs-text-tertiary)] text-white" },
  none: { label: "No Subscription", variant: "outline", color: "bg-[var(--bs-surface-hover)] text-[var(--bs-text-tertiary)]" },
};

export function formatDate(timestamp: number | null | undefined) {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
}

// stripe.plans returns plan prices in DOLLARS (unlike invoice amounts, which
// are cents) — do not divide these by 100.
export function formatPlanPrice(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "Custom";
  if (amount === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
