// Signup step 2 — plan selection (extracted from SignupPage, m1(24C)).
// Enterprise is Contact Sales only: visible but never selectable, never a
// self-service purchase action. Trial disclosure appears before any account
// or Stripe state is created.
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { trialDisclosure, type TrialTerms } from "@/lib/customerJourney";
import type { Plan } from "./wizardPlan";

interface Props {
  plans: Plan[] | undefined;
  plansError: boolean;
  trial: TrialTerms | undefined;
  selectedPlan: string | null;
  selectedPlanData: Plan | undefined;
  errors: Record<string, string>;
  onSelect: (id: string) => void;
}

export function SignupPlanStep(p: Props) {
  return (
    <div className="space-y-4">
      {p.errors.plan && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          <AlertCircle className="h-4 w-4" />
          {p.errors.plan}
        </div>
      )}

      {/* Certified trial truth — shown before any account or
          Stripe state is created (m1(24C)). */}
      <p className="text-sm text-center text-[var(--bs-text-tertiary)] bg-[var(--bs-canvas)] border border-[var(--bs-border)] rounded-lg px-3 py-2">
        {trialDisclosure(p.trial)}
      </p>

      {!p.plans ? (
        <div className="text-center py-8 text-sm text-[var(--bs-text-tertiary)]">
          {p.plansError
            ? "Plans are temporarily unavailable. Please go back and try again."
            : "Loading plans…"}
        </div>
      ) : (<>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {p.plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            disabled={!plan.purchasable}
            onClick={() => {
              if (!plan.purchasable) return;
              p.onSelect(plan.id);
            }}
            className={cn(
              "relative p-4 border rounded-lg text-left transition-all bg-[var(--bs-surface)]",
              plan.purchasable && "hover:shadow-md",
              !plan.purchasable && "opacity-70 cursor-default",
              p.selectedPlan === plan.id
                ? "border-[var(--bs-action)] ring-2 ring-[var(--bs-action)] bg-[var(--bs-action)]/4"
                : "border-[var(--bs-border)]"
            )}
          >
            {plan.highlighted && plan.purchasable && (
              <Badge className="absolute top-2 right-2 text-[10px] px-1.5 bg-[var(--bs-action)] text-white hover:bg-[var(--bs-action)]">
                Popular
              </Badge>
            )}
            {!plan.purchasable && (
              <Badge variant="secondary" className="absolute top-2 right-2 text-[10px] px-1.5 bg-[var(--bs-surface-hover)] text-[var(--bs-text-primary)]">
                Contact Sales
              </Badge>
            )}
            <div className="font-semibold text-[var(--bs-text-primary)]">{plan.name}</div>
            <div className="text-lg font-bold mt-1 text-[var(--bs-text-primary)]">
              {plan.price === 0
                ? "Custom"
                : `$${plan.price}`}
              {plan.price > 0 && (
                <span className="text-sm font-normal text-[var(--bs-text-tertiary)]">
                  /{plan.interval}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--bs-text-tertiary)] mt-1 line-clamp-2">
              {plan.description}
            </p>
            {p.selectedPlan === plan.id && plan.purchasable && (
              <div className="absolute bottom-2 right-2">
                <Check className="h-5 w-5 text-[var(--bs-action)]" />
              </div>
            )}
          </button>
        ))}
      </div>

      {p.selectedPlanData && (
        <div className="bg-[var(--bs-canvas)] rounded-lg p-4 mt-4 border border-[var(--bs-border)]">
          <h4 className="font-medium mb-2 text-[var(--bs-text-primary)]">
            {p.selectedPlanData.name} includes:
          </h4>
          <ul className="space-y-1">
            {p.selectedPlanData.features.map((f: string) => (
              <li
                key={f}
                className="flex items-center gap-2 text-sm text-[var(--bs-text-primary)]"
              >
                <Check className="h-3.5 w-3.5 text-[var(--bs-intelligence)]" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
      </>)}
    </div>
  );
}
