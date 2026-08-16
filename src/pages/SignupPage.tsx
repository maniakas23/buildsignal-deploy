import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { trackEvent } from "@/hooks/usePageTracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
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
}

const defaultPlans: Plan[] = [
  {
    id: "scout",
    name: "Scout",
    price: 99,
    interval: "month",
    description: "Perfect for individual investors and small teams exploring new markets.",
    features: ["5 counties", "Weekly email reports", "Basic predictions", "Email support"],
    highlighted: false,
    cta: "Get Started",
  },
  {
    id: "professional",
    name: "Professional",
    price: 249,
    interval: "month",
    description: "For growing teams that need deeper intelligence and more coverage.",
    features: ["25 counties", "Daily alerts + weekly briefings", "Advanced predictions", "API access", "Priority support"],
    highlighted: true,
    cta: "Get Started",
  },
  {
    id: "business",
    name: "Business",
    price: 599,
    interval: "month",
    description: "Built for organizations managing multi-market portfolios at scale.",
    features: ["Unlimited counties", "Real-time alerts", "Custom models", "Full API + webhooks", "SSO & SAML", "Dedicated account manager"],
    highlighted: false,
    cta: "Get Started",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 0,
    interval: "custom",
    description: "Tailored deployments for large enterprises with custom data needs.",
    features: ["Everything in Business", "Custom data integrations", "White-label reports", "On-premise option", "SLA guarantees", "24/7 phone support"],
    highlighted: false,
    cta: "Talk to Sales",
  },
];

const steps = [
  { label: "Account", description: "Create your account" },
  { label: "Plan", description: "Choose your plan" },
  { label: "Get Started", description: "Start building intelligence" },
];

export function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, registerError, registerIsPending } = useAuth();
  const config = trpc.billing.config.useQuery();

  const preselectedPlan = searchParams.get("plan");
  const preselectedCycle = searchParams.get("cycle") as "monthly" | "annual" | null;

  const [step, setStep] = useState(preselectedPlan ? 2 : 1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(preselectedPlan);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    preselectedCycle || "monthly"
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const plans = (config.data?.plans?.length ? config.data.plans : defaultPlans) as Plan[];

  useEffect(() => {
    if (preselectedPlan) {
      setSelectedPlan(preselectedPlan);
      setStep(2);
    }
  }, [preselectedPlan]);

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
        navigate("/dashboard");
      } catch (err: any) {
        const message = err?.message || "Something went wrong. Please try again.";
        setErrors({ submit: message });
      }
    }
  };

  const getPlanById = (id: string | null) => {
    return plans.find((p) => p.id === id);
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

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Step 1: Account */}
                    {step === 1 && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-[var(--bs-text-primary)]">Full Name</Label>
                          <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (errors.name) {
                                setErrors((prev) => {
                                  const next = { ...prev };
                                  delete next.name;
                                  return next;
                                });
                              }
                            }}
                            placeholder="John Doe"
                            className={cn(errors.name && "border-red-400 focus:ring-red-500/20")}
                          />
                          {errors.name && (
                            <p className="text-xs text-red-400 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-[var(--bs-text-primary)]">Work Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) {
                                setErrors((prev) => {
                                  const next = { ...prev };
                                  delete next.email;
                                  return next;
                                });
                              }
                            }}
                            placeholder="you@company.com"
                            className={cn(errors.email && "border-red-400 focus:ring-red-500/20")}
                          />
                          {errors.email && (
                            <p className="text-xs text-red-400 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-[var(--bs-text-primary)]">Password</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) {
                                  setErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.password;
                                    return next;
                                  });
                                }
                              }}
                              placeholder="At least 8 characters with uppercase, lowercase, and number"
                              className={cn(
                                errors.password && "border-red-400 focus:ring-red-500/20",
                                "pr-10"
                              )}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--bs-text-tertiary)] hover:text-[var(--bs-text-primary)] transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="text-xs text-red-400 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.password}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-[var(--bs-text-primary)]">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              if (errors.confirmPassword) {
                                setErrors((prev) => {
                                  const next = { ...prev };
                                  delete next.confirmPassword;
                                  return next;
                                });
                              }
                            }}
                            placeholder="Repeat your password"
                            className={cn(errors.confirmPassword && "border-red-400 focus:ring-red-500/20")}
                          />
                          {errors.confirmPassword && (
                            <p className="text-xs text-red-400 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {/* Step 2: Plan Selection */}
                    {step === 2 && (
                      <div className="space-y-4">
                        {errors.plan && (
                          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            <AlertCircle className="h-4 w-4" />
                            {errors.plan}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {plans.map((plan) => (
                            <button
                              key={plan.id}
                              type="button"
                              onClick={() => {
                                setSelectedPlan(plan.id);
                                setErrors((prev) => {
                                  const next = { ...prev };
                                  delete next.plan;
                                  return next;
                                });
                              }}
                              className={cn(
                                "relative p-4 border rounded-lg text-left transition-all hover:shadow-md bg-[var(--bs-surface)]",
                                selectedPlan === plan.id
                                  ? "border-[var(--bs-action)] ring-2 ring-[var(--bs-action)] bg-[var(--bs-action)]/4"
                                  : "border-[var(--bs-border)]"
                              )}
                            >
                              {plan.highlighted && (
                                <Badge className="absolute top-2 right-2 text-[10px] px-1.5 bg-[var(--bs-action)] text-white hover:bg-[var(--bs-action)]">
                                  Popular
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
                              {selectedPlan === plan.id && (
                                <div className="absolute bottom-2 right-2">
                                  <Check className="h-5 w-5 text-[var(--bs-action)]" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>

                        {selectedPlanData && (
                          <div className="bg-[var(--bs-canvas)] rounded-lg p-4 mt-4 border border-[var(--bs-border)]">
                            <h4 className="font-medium mb-2 text-[var(--bs-text-primary)]">
                              {selectedPlanData.name} includes:
                            </h4>
                            <ul className="space-y-1">
                              {selectedPlanData.features.map((f: string) => (
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
                      </div>
                    )}

                    {/* Step 3: Finalize */}
                    {step === 3 && (
                      <div className="space-y-6 text-center">
                        <div className="bg-[var(--bs-canvas)] rounded-lg p-6 border border-[var(--bs-border)]">
                          <Building2 className="h-10 w-10 text-[var(--bs-action)] mx-auto mb-3" />
                          <h3 className="text-lg font-semibold mb-1 text-[var(--bs-text-primary)]">
                            You&apos;re almost there!
                          </h3>
                          <p className="text-[var(--bs-text-tertiary)] text-sm mb-4">
                            Create your account and start exploring construction market intelligence.
                          </p>

                          {selectedPlanData && (
                            <div className="bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-lg p-4 mb-4 text-left">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-[var(--bs-text-primary)]">
                                  {selectedPlanData.name}
                                </span>
                                <Badge variant="secondary" className="bg-[var(--bs-surface-hover)] text-[var(--bs-text-primary)]">
                                  Monthly
                                </Badge>
                              </div>
                              <div className="text-2xl font-bold text-[var(--bs-text-primary)]">
                                {selectedPlanData.price === 0
                                  ? "Custom"
                                  : `$${selectedPlanData.price}`}
                                {selectedPlanData.price > 0 && (
                                  <span className="text-sm font-normal text-[var(--bs-text-tertiary)]">
                                    /{selectedPlanData.interval}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-center gap-4 text-xs text-[var(--bs-text-tertiary)]">
                            <span className="flex items-center gap-1">
                              <Lock className="h-3 w-3" />
                              256-bit SSL
                            </span>
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              PCI Compliant
                            </span>
                          </div>
                        </div>

                        {(errors.submit || registerError) && (
                          <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            {errors.submit || registerError.message}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4">
                      {step > 1 ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBack}
                          className="gap-2 border-[var(--bs-border)] text-[var(--bs-text-primary)]"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </Button>
                      ) : (
                        <div />
                      )}

                      {step < 3 ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="gap-2 bg-[var(--bs-action)] hover:bg-[var(--bs-action)]/90"
                        >
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={registerIsPending}
                          className="gap-2 bg-[var(--bs-action)] hover:bg-[var(--bs-action)]/90"
                        >
                          {registerIsPending ? (
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
                  </form>

                  {/* Login link */}
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

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-8 space-y-6">
                {/* Value Proposition */}
                <div className="bg-gradient-to-br from-[var(--bs-action)]/8 to-[var(--bs-action)]/4 border border-[var(--bs-action)]/15 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-[var(--bs-action)]" />
                    <span className="font-semibold text-[var(--bs-text-primary)]">Why BuildSignal?</span>
                  </div>
                  <ul className="space-y-2 text-sm text-[var(--bs-text-tertiary)]">
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[var(--bs-intelligence)] shrink-0" />
                      AI-powered trend analysis across construction markets
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-[var(--bs-intelligence)] shrink-0" />
                      Streamline market research with automated intelligence gathering
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[var(--bs-intelligence)] shrink-0" />
                      Bank-grade security &amp; SOC 2 program in progress
                    </li>
                  </ul>
                </div>

                {/* Free Trial Box */}
                <div className="bg-[var(--bs-action)]/4 border border-[var(--bs-action)]/10 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-[var(--bs-action)]" />
                    <span className="font-semibold text-[var(--bs-text-primary)]">Get Started in Minutes</span>
                  </div>
                  <p className="text-sm text-[var(--bs-text-tertiary)]">
                    Immediate access to your plan’s features with simple monthly billing. Cancel anytime.
                    Get actionable intelligence for your markets within minutes.
                  </p>
                </div>

                {/* Platform Trust Signals */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-[var(--bs-text-tertiary)] uppercase tracking-wide">
                    Why professionals trust BuildSignal
                  </h3>

                  <div className="bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-[var(--bs-action)]" />
                      <span className="font-medium text-sm text-[var(--bs-text-primary)]">Real-time data coverage</span>
                    </div>
                    <p className="text-xs text-[var(--bs-text-tertiary)]">
                      Multi-county permit monitoring from municipal sources. Daily updates on construction activity across target markets.
                    </p>
                  </div>

                  <div className="bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BrainCircuit className="h-4 w-4 text-[var(--bs-action)]" />
                      <span className="font-medium text-sm text-[var(--bs-text-primary)]">Transparent AI methodology</span>
                    </div>
                    <p className="text-xs text-[var(--bs-text-tertiary)]">
                      Confidence scores on every prediction. Model performance published monthly. No black boxes.
                    </p>
                  </div>

                  <div className="bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-[var(--bs-intelligence)]" />
                      <span className="font-medium text-sm text-[var(--bs-text-primary)]">Enterprise-grade security</span>
                    </div>
                    <p className="text-xs text-[var(--bs-text-tertiary)]">
                      SOC 2 Type II program in progress. 256-bit AES encryption. SSO & SAML 2.0 ready. Data never sold.
                    </p>
                  </div>

                  <div className="bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-[var(--bs-action)]" />
                      <span className="font-medium text-sm text-[var(--bs-text-primary)]">See a sample report</span>
                    </div>
                    <p className="text-xs text-[var(--bs-text-tertiary)] mb-2">
                      Preview the intelligence BuildSignal delivers — real opportunity analysis, confidence scores, and market trends.
                    </p>
                    <button
                      onClick={() => window.open("/reports-hub", "_blank")}
                      className="text-xs text-[var(--bs-action)] hover:underline font-medium"
                    >
                      View sample report →
                    </button>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="bg-[var(--bs-canvas)] rounded-xl p-4 border border-[var(--bs-border)]">
                  <h3 className="text-sm font-semibold text-[var(--bs-text-primary)] mb-3">Your data is safe</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[var(--bs-text-tertiary)]">
                      <Lock className="h-4 w-4 text-[var(--bs-intelligence)]" />
                      256-bit SSL encryption
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--bs-text-tertiary)]">
                      <Shield className="h-4 w-4 text-[var(--bs-intelligence)]" />
                      Your data is never sold
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--bs-text-tertiary)]">
                      <Check className="h-4 w-4 text-[var(--bs-intelligence)]" />
                      SOC 2 Type II (In Progress)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
