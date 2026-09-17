// Signup chrome — progress header + nav buttons (extracted, m1(24C)).
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { wizardSteps } from "./wizardPlan";

export function SignupProgress({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {wizardSteps.map((s, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1",
                step > idx + 1
                  ? "bg-[var(--bs-intelligence)] text-white"
                  : step === idx + 1
                  ? "bg-[var(--bs-action)] text-white"
                  : "bg-[var(--bs-surface-hover)] text-[var(--bs-text-tertiary)]"
              )}
            >
              {step > idx + 1 ? (
                <Check className="h-4 w-4" />
              ) : (
                idx + 1
              )}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                step >= idx + 1
                  ? "text-[var(--bs-text-primary)]"
                  : "text-[var(--bs-text-tertiary)]"
              )}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <Progress value={(step / 3) * 100} className="h-2 bg-[var(--bs-surface-hover)]" />
    </div>
  );
}

interface NavProps {
  step: number;
  registerIsPending: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function SignupNavButtons(p: NavProps) {
  return (
    <div className="flex items-center justify-between pt-4">
      {p.step > 1 ? (
        <Button
          type="button"
          variant="outline"
          onClick={p.onBack}
          className="gap-2 border-[var(--bs-border)] text-[var(--bs-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      ) : (
        <div />
      )}

      {p.step < 3 ? (
        <Button
          type="button"
          onClick={p.onNext}
          className="gap-2 bg-[var(--bs-action)] hover:bg-[var(--bs-action)]/90"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={p.registerIsPending}
          className="gap-2 bg-[var(--bs-action)] hover:bg-[var(--bs-action)]/90"
        >
          {p.registerIsPending ? (
            <>
              <Zap className="h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export function validateWizardPassword(pwd: string): string | null {
  if (pwd.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
  return null;
}

// Step-1 (account) field validation — extracted from SignupPage (m1(24C)).
export function validateAccountFields(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): Record<string, string> {
  const newErrors: Record<string, string> = {};
  if (!name.trim()) {
    newErrors.name = "Name is required";
  }
  if (!email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "Please enter a valid email address";
  }
  const pwdError = validateWizardPassword(password);
  if (pwdError) {
    newErrors.password = pwdError;
  }
  if (password !== confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }
  return newErrors;
}
