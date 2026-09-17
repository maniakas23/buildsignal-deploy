import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { trackEvent } from "@/hooks/usePageTracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { selectPlans, isContactSalesPlan, type BillingPlan } from "./billingPlans";
import {
  selectTrial,
  signupGuardRedirect,
  trialDisclosure,
  REGISTRATION_RECOVERY_MESSAGE,
} from "@/lib/customerJourney";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Shield,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  Building2,
  Sparkles,
  TrendingUp,
  Database,
  BrainCircuit,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
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
function toWizardPlan(p: BillingPlan): Plan {
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

const steps = [
  { label: "Account", description: "Create your account" },
  { label: "Plan", description: "Choose your plan" },
  { label: "Get Started", description: "Start building intelligence" },
];

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

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
    return null;
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      newErrors.password = pwdError;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
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

  const getPlanById = (id: string | null) => {
    return plans?.find((p) => p.id === id);
  };

  const selectedPlanData = getPlanById(selectedPlan);

  return (
    <div className="min-h-screen bg-[var(--bs-canvas)]">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back to home */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 gap-2 text-[var(--bs-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
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
                  {/* Progress */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      {steps.map((s, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1",
                              step > idx + 1
                                ? "bg-[var(--bs-intelligence)] text-white"
                                : step === idx + 1
                                ? "bg-[var(--bs-action)] text-white"
                                : "bg-[var(--bs-surface