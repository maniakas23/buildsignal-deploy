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
    cta: "Start Free Trial",
  },
  {
    id: "professional",
    name: "Professional",
    price: 249,
    interval: "month",
    description: "For growing teams that need deeper intelligence and more coverage.",
    features: ["25 counties", "Daily alerts + weekly briefings", "Advanced predictions", "API access", "Priority support"],
    highlighted: true,
    cta: "Start Free Trial",
  },
  {
    id: "business",
    name: "Business",
    price: 599,
    interval: "month",
    description: "Built for organizations managing multi-market portfolios at scale.",
    features: ["Unlimited counties", "Real-time alerts", "Custom models", "Full API + webhooks", "SSO & SAML", "Dedicated account manager"],
    highlighted: false,
    cta: "Start Free Trial",
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
  { label: "Payment", description: "Start your trial" },
];

export function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const config = trpc.billing.config.useQuery();

  const preselectedPlan = searchParams.get("plan");
  const preselectedCycle = searchParams.get("cycle") as "monthly" | "annual" | null;

  const [step, setStep] = useState(preselectedPlan ? 2 : 1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(preselectedPlan);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    preselectedCycle || "monthly"
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plans = (config.data?.plans?.length ? config.data.plans : defaultPlans) as Plan[];

  useEffect(() => {
    if (preselectedPlan) {
      setSelectedPlan(preselectedPlan);
      setStep(2);
    }
  }, [preselectedPlan]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!company.trim()) {
      newErrors.company = "Company name is required";
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
      setIsSubmitting(true);
      try {
        await login(email, password);
        trackEvent("sign_up", {
          method: "email",
          plan: selectedPlan || "unknown",
          billing_cycle: billingCycle,
          company: company,
        });
        navigate("/welcome");
      } catch {
        setErrors({ submit: "Something went wrong. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getPlanById = (id: string | null) => {
    return plans.find((p) => p.id === id);
  };

  const selectedPlanData = getPlanById(selectedPlan);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back to home */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {step === 1 && "Create Your Account"}
                    {step === 2 && "Choose Your Plan"}
                    {step === 3 && "Start Your Free Trial"}
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
                                ? "bg-green-500 text-white"
                                : step === idx + 1
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
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
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Progress value={(step / 3) * 100} className="h-2" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Step 1: Account */}
                    {step === 1 && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="email">Work Email</Label>
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
                            className={cn(errors.email && "border-destructive")}
                          />
                          {errors.email && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company">Company Name</Label>
                          <Input
                            id="company"
                            type="text"
                            value={company}
                            onChange={(e) => {
                              setCompany(e.target.value);
                              if (errors.company) {
                                setErrors((prev) => {
                                  const next = { ...prev };
                                  delete next.company;
                                  return next;
                                });
                              }
                            }}
                            placeholder="Acme Inc."
                            className={cn(errors.company && "border-destructive")}
                          />
                          {errors.company && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.company}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
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
                              placeholder="At least 8 characters"
                              className={cn(
                                errors.password && "border-destructive",
                                "pr-10"
                              )}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.password}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                            className={cn(
                              errors.confirmPassword && "border-destructive"
                            )}
                          />
                          {errors.confirmPassword && (
                            <p className="text-xs text-destructive flex items-center gap-1">
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
                          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                            <AlertCircle className="h-4 w-4" />
                            {errors.plan}
                          </div>
                        )}

                        <div className="flex items-center justify-center gap-2 mb-4">
                          <Button
                            type="button"
                            variant={
                              billingCycle === "monthly" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setBillingCycle("monthly")}
                          >
                            Monthly
                          </Button>
                          <Button
                            type="button"
                            variant={
                              billingCycle === "annual" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setBillingCycle("annual")}
                            className="relative"
                          >
                            Annual
                            <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px]">
                              Save 20%
                            </Badge>
                          </Button>
                        </div>

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
                                "relative p-4 border rounded-lg text-left transition-all hover:shadow-md",
                                selectedPlan === plan.id
                                  ? "border-primary ring-2 ring-primary bg-primary/5"
                                  : "border-border bg-card"
                              )}
                            >
                              {plan.highlighted && (
                                <Badge className="absolute top-2 right-2 text-[10px] px-1.5">
                                  Popular
                                </Badge>
                              )}
                              <div className="font-semibold">{plan.name}</div>
                              <div className="text-lg font-bold mt-1">
                                {plan.price === 0
                                  ? "Custom"
                                  : `$${plan.price}`}
                                {plan.price > 0 && (
                                  <span className="text-sm font-normal text-muted-foreground">
                                    /{plan.interval}
                                  </span>
                                )}
                              </div>
                              {billingCycle === "annual" && plan.price > 0 && (
                                <p className="text-xs text-green-600 mt-1">
                                  ${Math.round(plan.price * 12 * 0.8)} billed
                                  annually
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {plan.description}
                              </p>
                              {selectedPlan === plan.id && (
                                <div className="absolute bottom-2 right-2">
                                  <Check className="h-5 w-5 text-primary" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>

                        {selectedPlanData && (
                          <div className="bg-muted/50 rounded-lg p-4 mt-4">
                            <h4 className="font-medium mb-2">
                              {selectedPlanData.name} includes:
                            </h4>
                            <ul className="space-y-1">
                              {selectedPlanData.features.map((f: string) => (
                                <li
                                  key={f}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                  {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                      <div className="space-y-6 text-center">
                        <div className="bg-muted/50 rounded-lg p-6">
                          <Building2 className="h-10 w-10 text-primary mx-auto mb-3" />
                          <h3 className="text-lg font-semibold mb-1">
                            You&apos;re almost there!
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            Start your 14-day free trial. No credit card required.
                          </p>

                          {selectedPlanData && (
                            <div className="bg-card border border-border rounded-lg p-4 mb-4 text-left">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">
                                  {selectedPlanData.name}
                                </span>
                                <Badge variant="secondary">
                                  {billingCycle === "annual" ? "Annual" : "Monthly"}
                                </Badge>
                              </div>
                              <div className="text-2xl font-bold">
                                {selectedPlanData.price === 0
                                  ? "Custom"
                                  : `$${selectedPlanData.price}`}
                                {selectedPlanData.price > 0 && (
                                  <span className="text-sm font-normal text-muted-foreground">
                                    /{selectedPlanData.interval}
                                  </span>
                                )}
                              </div>
                              {billingCycle === "annual" &&
                                selectedPlanData.price > 0 && (
                                  <p className="text-xs text-green-600 mt-1">
                                    ${Math.round(selectedPlanData.price * 12 * 0.8)}{" "}
                                    billed annually (Save 20%)
                                  </p>
                                )}
                            </div>
                          )}

                          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
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

                        {errors.submit && (
                          <p className="text-sm text-destructive">
                            {errors.submit}
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
                          className="gap-2"
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
                          className="gap-2"
                        >
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Zap className="h-4 w-4 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            <>
                              Start Free Trial
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </form>

                  {/* Login link */}
                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      onClick={() => navigate("/login")}
                      className="text-primary hover:underline font-medium"
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
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Why BuildSignal?</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500 shrink-0" />
                      AI-powered trend analysis across construction markets
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-500 shrink-0" />
                      Streamline market research with automated intelligence gathering
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500 shrink-0" />
                      Bank-grade security &amp; SOC 2 certified
                    </li>
                  </ul>
                </div>

                {/* Free Trial Box */}
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Start with a 14-Day Free Trial</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Full access to all features. No credit card required. Cancel anytime.
                    Get actionable intelligence for your markets within minutes.
                  </p>
                </div>

                {/* Platform Trust Signals — Evidence Based */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Why professionals trust BuildSignal
                  </h3>

                  {/* Data Coverage */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Real-time data coverage</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Multi-county permit monitoring from municipal sources. Daily updates on construction activity across target markets.
                    </p>
                  </div>

                  {/* AI Methodology */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BrainCircuit className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Transparent AI methodology</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Confidence scores on every prediction. Model performance published monthly. No black boxes.
                    </p>
                  </div>

                  {/* Security */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-sm">Enterprise-grade security</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      SOC 2 Type II certified. 256-bit AES encryption. SSO & SAML 2.0 ready. Data never sold.
                    </p>
                  </div>

                  {/* Sample Report */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">See a sample report</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Preview the intelligence BuildSignal delivers — real opportunity analysis, confidence scores, and market trends.
                    </p>
                    <button
                      onClick={() => window.open('/reports-hub', '_blank')}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      View sample report →
                    </button>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold mb-3">Your data is safe</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4 text-green-500" />
                      256-bit SSL encryption
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-green-500" />
                      Your data is never sold
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" />
                      SOC 2 Type II certified
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
