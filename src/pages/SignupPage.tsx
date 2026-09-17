import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { trackEvent } from "@/hooks/usePageTracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { selectPlans } from "./billingPlans";
import { selectTrial, signupGuardRedirect } from "@/lib/customerJourney";
import { toWizardPlan, type Plan } from "./signup/wizardPlan";
import { SignupAccountStep } from "./signup/SignupAccountStep";
import { SignupPlanStep } from "./signup/SignupPlanStep";
import { SignupSummaryStep } from "./signup/SignupSummaryStep";
import { SignupSidebar } from "./signup/SignupSidebar";
import {
  SignupProgress,
  SignupNavButtons,
  validateAccountFields,
} from "./signup/SignupChrome";
import { ArrowLeft, Zap } from "lucide-react";

export function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, registerError, registerIsPending, isAuthenticated, isLoading: authLoading } = useAuth();
  // billing.config does not exist on the deployed backend; plan + trial data
  // comes from stripe.plans (public), unwrapped via the certified helpers.
  const plansQuery = trpc.stripe.plans.useQuery();

  const preselectedPlan = searchParams.get("plan");
  const preselectedCycle = searchParams.get("cycle") as "monthly" | "annual" | null;

  // Always start at step 1 (Account) — even with a preselected plan, the
  // account credentials must be collected before registration can succeed.
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(preselectedPlan);
  const [billingCycle] = useState<"monthly" | "annual">(
    preselectedCycle || "monthly"
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registerFailed, setRegisterFailed] = useState(false);

  const apiPlans = selectPlans(plansQuery.data as any);
  const plans: Plan[] | undefined = apiPlans?.map(toWizardPlan);
  const trial = selectTrial(plansQuery.data as any);

  useEffect(() => {
    // Enterprise is Contact Sales only — never preselect it for self-service.
    if (preselectedPlan && preselectedPlan !== "enterprise") {
      setSelectedPlan(preselectedPlan);
    }
  }, [preselectedPlan]);

  // m1(24C) authenticated guard: an existing customer must never see the
  // Create Account wizard (re-registering with their email fails against the
  // backend's anti-enumeration error and strands them). Send them to the
  // authenticated billing destination instead. Guests sign up as before.
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bs-canvas)]">
        <Zap className="h-8 w-8 animate-spin text-[var(--bs-action)]" />
      </div>
    );
  }
  const guardRedirect = signupGuardRedirect(isAuthenticated);
  if (guardRedirect) {
    return <Navigate to={guardRedirect} replace />;
  }

  const clearError = (key: string) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });


  const handleNext = () => {
    if (step === 1) {
      const newErrors = validateAccountFields(name, email, password, confirmPassword);
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        setStep(2);
      }
    } else if (step === 2) {
      if (selectedPlan) {
        setStep(3);
      } else {
        setErrors({ plan: "Please select a plan to continue" });
      }
    }
  };

  const handleBack = () => {
    setErrors({});
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3) {
      try {
        await register({ name, email, password });
        trackEvent("sign_up", {
          method: "email",
          plan: selectedPlan || "unknown",
          billing_cycle: billingCycle,
        });
        // Paid plan selected → send the new user to Billing to complete checkout;
        // otherwise straight to the dashboard.
        navigate(selectedPlan && selectedPlan !== "enterprise" ? "/billing" : "/dashboard");
      } catch (err: any) {
        // The backend intentionally returns a generic anti-enumeration
        // failure (e.g. duplicate email is indistinguishable from a bad
        // login). Show a recovery path without disclosing account existence.
        setRegisterFailed(true);
        setErrors({});
      }
    }
  };

  const selectedPlanData = plans?.find((p) => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-[var(--bs-canvas)]">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 gap-2 text-[var(--bs-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-[var(--bs-border)] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-[var(--bs-text-primary)]">
                    {step === 1 && "Create Your Account"}
                    {step === 2 && "Choose Your Plan"}
                    {step === 3 && "Get Started with BuildSignal"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SignupProgress step={step} />

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {step === 1 && (
                      <SignupAccountStep
                        name={name}
                        email={email}
                        password={password}
                        confirmPassword={confirmPassword}
                        showPassword={showPassword}
                        errors={errors}
                        setName={setName}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        setConfirmPassword={setConfirmPassword}
                        setShowPassword={setShowPassword}
                        clearError={clearError}
                      />
                    )}

                    {step === 2 && (
                      <SignupPlanStep
                        plans={plans}
                        plansError={plansQuery.isError}
                        trial={trial}
                        selectedPlan={selectedPlan}
                        selectedPlanData={selectedPlanData}
                        errors={errors}
                        onSelect={(id) => {
                          setSelectedPlan(id);
                          clearError("plan");
                        }}
                      />
                    )}

                    {step === 3 && (
                      <SignupSummaryStep
                        selectedPlanData={selectedPlanData}
                        trial={trial}
                        registerFailed={registerFailed}
                        registerError={registerError}
                        onGoToLogin={() => navigate("/login")}
                      />
                    )}

                    <SignupNavButtons
                      step={step}
                      registerIsPending={registerIsPending}
                      onBack={handleBack}
                      onNext={handleNext}
                    />
                  </form>

                  <div className="mt-6 text-center text-sm text-[var(--bs-text-tertiary)]">
                    Already have an account?{" "}
                    <button
                      onClick={() => navigate("/login")}
                      className="text-[var(--bs-action)] hover:underline font-medium"
                    >
                      Log in
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <SignupSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
