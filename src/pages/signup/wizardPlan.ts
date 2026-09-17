// Signup wizard plan mapping (extracted from SignupPage for m1(24C)
// transport constraints; behavior identical).
import { isContactSalesPlan, type BillingPlan } from "../billingPlans";

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
  purchasable: boolean;
}

// m1(24C): no hardcoded plan fallbacks. The old defaultPlans table drifted
// from the canonical production contract (e.g. Scout "5 counties" / "Weekly
// email reports" vs the certified 1 county / 3 alerts per UTC day) and was
// ALWAYS shown because `plansQuery.data?.length` is undefined for the live
// { plans: [...], trial: {...} } wrapper. Plans now come exclusively from
// the live API via the m1(24A) contract helper; when data is unavailable the
// wizard shows a safe loading/error state instead of stale plan truth.
export function toWizardPlan(p: BillingPlan): Plan {
  return {
    id: p.id,
    name: p.name ?? p.id,
    price: p.price ?? 0,
    interval: p.interval ?? "custom",
    description: p.description ?? "",
    features: p.features ?? [],
    highlighted: p.popular ?? false,
    cta: p.cta ?? "Get Started",
    purchasable: p.purchasable !== false && !isContactSalesPlan(p),
  };
}

export const wizardSteps = [
  { label: "Account", description: "Create your account" },
  { label: "Plan", description: "Choose your plan" },
  { label: "Get Started", description: "Start building intelligence" },
];
