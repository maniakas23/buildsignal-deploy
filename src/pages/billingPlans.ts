// Billing plan response-contract helper.
//
// Production truth (Worker #416, verified live): the tRPC `stripe.plans`
// procedure returns an object wrapper — { plans: BillingPlan[] } — not a bare
// array. The billing page previously treated the response itself as the
// array, so `plans.map` threw and the ErrorBoundary rendered an endless
// "reload the page" loop (m1(24A) P0 hotfix).

export interface BillingPlan {
  id: string;
  name?: string;
  description?: string;
  price: number | null;
  interval?: string | null;
  features?: string[];
  cta?: string;
  purchasable?: boolean;
  popular?: boolean;
}

/**
 * Accepts the actual production response shapes and returns the plan array:
 * - { plans: [...] }  — the live production contract
 * - [...]             — bare array (defensive, in case the API ever flattens)
 * - undefined/null    — loading or absent data → undefined (caller must use
 *                       optional chaining, as the page already does)
 */
export function selectPlans(
  data: { plans?: BillingPlan[] } | BillingPlan[] | null | undefined
): BillingPlan[] | undefined {
  if (data == null) return undefined;
  if (Array.isArray(data)) return data;
  return data.plans;
}

/**
 * Enterprise is Contact Sales only — it must never render a self-service
 * purchase control. Mirrors the render rule in BillingPage.
 */
export function isContactSalesPlan(plan: Pick<BillingPlan, "id">): boolean {
  return plan.id === "enterprise";
}
