// Signup step 3 — summary + registration recovery (extracted from
// SignupPage, m1(24C)).
import { Badge } from "@/components/ui/badge";
import { Building2, Lock, Shield } from "lucide-react";
import {
  trialDisclosure,
  REGISTRATION_RECOVERY_MESSAGE,
  type TrialTerms,
} from "@/lib/customerJourney";
import type { Plan } from "./wizardPlan";

interface Props {
  selectedPlanData: Plan | undefined;
  trial: TrialTerms | undefined;
  registerFailed: boolean;
  registerError: Error | null;
  onGoToLogin: () => void;
}

export function SignupSummaryStep(p: Props) {
  return (
    <div className="space-y-6 text-center">
      <div className="bg-[var(--bs-canvas)] rounded-lg p-6 border border-[var(--bs-border)]">
        <Building2 className="h-10 w-10 text-[var(--bs-action)] mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-1 text-[var(--bs-text-primary)]">
          You&apos;re almost there!
        </h3>
        <p className="text-[var(--bs-text-tertiary)] text-sm mb-4">
          Create your account and start exploring construction market intelligence.
        </p>

        {p.selectedPlanData && (
          <div className="bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-lg p-4 mb-4 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-[var(--bs-text-primary)]">
                {p.selectedPlanData.name}
              </span>
              <Badge variant="secondary" className="bg-[var(--bs-surface-hover)] text-[var(--bs-text-primary)]">
                Monthly
              </Badge>
            </div>
            <div className="text-2xl font-bold text-[var(--bs-text-primary)]">
              {p.selectedPlanData.price === 0
                ? "Custom"
                : `$${p.selectedPlanData.price}`}
              {p.selectedPlanData.price > 0 && (
                <span className="text-sm font-normal text-[var(--bs-text-tertiary)]">
                  /{p.selectedPlanData.interval}
                </span>
              )}
            </div>
            {p.selectedPlanData.purchasable && (
              <p className="text-xs text-[var(--bs-intelligence)] mt-2">
                {trialDisclosure(p.trial, p.selectedPlanData)}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-center gap-4 text-xs text-[var(--bs-text-tertiary)]">
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            256-bit SSL
          </span>
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Payments secured by Stripe
          </span>
        </div>
      </div>

      {(p.registerFailed || p.registerError) && (
        <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20 space-y-2">
          <p>{REGISTRATION_RECOVERY_MESSAGE}</p>
          <button
            type="button"
            onClick={p.onGoToLogin}
            className="font-medium text-[var(--bs-action)] hover:underline"
          >
            Go to Sign In
          </button>
        </div>
      )}
    </div>
  );
}
