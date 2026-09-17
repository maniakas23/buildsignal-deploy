// Customer-journey helpers (m1(24C)).
//
// Single source for acquisition-routing and trial-disclosure truth so every
// surface (Home, Pricing, ROI calculator, Signup, Billing) agrees with the
// certified production commercial contract:
//   Scout $99/mo · 14-day free trial · $0 today · no credit card required ·
//   billing begins after the trial · no card at trial end → cancel, no charge.
// Backend truth is Worker #416 / stripe.plans; these helpers only format and
// route — they never invent plan or trial values.

import { isContactSalesPlan, type BillingPlan } from "@/pages/billingPlans";

/** Trial terms as served live by stripe.plans ({ plans, trial }). */
export interface TrialTerms {
  days?: number;
  noCreditCard?: boolean;
  cardRequiredToStart?: boolean;
  chargedToday?: number;
  billingBegins?: string;
  recurring?: string;
  autoConverts?: boolean;
  noCardAtTrialEnd?: string;
  cancelAnytime?: boolean;
}

/**
 * Extract the trial block from the production { plans, trial } wrapper.
 * Returns undefined when absent — callers must degrade gracefully.
 */
export function selectTrial(
  data: { trial?: TrialTerms } | null | undefined
): TrialTerms | undefined {
  if (data == null || Array.isArray(data)) return undefined;
  return data.trial;
}

/**
 * Where an acquisition CTA ("Get Started" etc.) should send a visitor:
 * - authenticated customer → authenticated billing destination
 * - guest → the provided guest target (signup/onboarding)
 */
export function acquisitionCtaTarget(
  isAuthenticated: boolean,
  guestTarget = "/signup"
): string {
  return isAuthenticated ? "/billing" : guestTarget;
}

/**
 * Signup guard decision: an authenticated visitor must NOT see the
 * Create Account wizard; return the route they should be sent to instead.
 * Returns null when the wizard may render (guest).
 */
export function signupGuardRedirect(isAuthenticated: boolean): string | null {
  return isAuthenticated ? "/billing" : null;
}

/** Shown when registration fails with the generic anti-enumeration error.
 * Never affirms that an email exists; offers the login recovery path. */
export const REGISTRATION_RECOVERY_MESSAGE =
  "Unable to create the account with those details. If you may already have an account, try signing in.";

/**
 * Concise trial disclosure for paid, self-service plans.
 * - Contact-sales plans (Enterprise) get no trial line → null.
 * - Without live trial terms, falls back to the certified contract wording
 *   (the values are contractual constants, not per-request data).
 * - planPrice, when given, appends the post-trial recurring price so "free"
 *   is never stated without the price that follows the trial.
 */
export function trialDisclosure(
  trial: TrialTerms | null | undefined,
  plan?: Pick<BillingPlan, "id" | "price"> | null
): string | null {
  if (plan && isContactSalesPlan(plan)) return null;
  const days = trial?.days ?? 14;
  const parts = [
    `${days}-day free trial`,
    "$0 today",
    "No credit card required",
  ];
  if (plan?.price != null && plan.price > 0) {
    parts.push(`$${plan.price}/month after trial`);
  }
  if (trial?.cancelAnytime ?? true) parts.push("Cancel anytime");
  return parts.join(" · ");
}
