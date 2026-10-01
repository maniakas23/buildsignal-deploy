import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Mail,
  LayoutDashboard,
  Zap,
  Target,
  Bell,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";

// m1(35): no fabricated work is claimed here. The previous version simulated
// a "report generation" progress bar tied to no real process and asserted a
// welcome email had been sent after a fixed timer. Steps now describe only
// what is actually true when this page renders: the account exists and the
// dashboard is available.
const onboardingSteps = [
  {
    id: 1,
    title: "Your account is ready",
    description:
      "Your BuildSignal account has been created. Your dashboard is available now.",
    icon: Zap,
  },
  {
    id: 2,
    title: "Check your email",
    description:
      "If a verification email was sent to your address, follow the link to verify your account.",
    icon: Mail,
  },
  {
    id: 3,
    title: "Explore your dashboard",
    description:
      "Dive into opportunities, set up alerts, and start tracking markets.",
    icon: LayoutDashboard,
  },
];

const quickTips = [
  {
    title: "Set up your first alert",
    description: "Get notified when new opportunities match your criteria.",
    icon: Bell,
    action: "Go to Alerts",
    path: "/alerts",
  },
  {
    title: "Explore opportunities",
    description: "Browse current intelligence signals across covered markets.",
    icon: Target,
    action: "View Opportunities",
    path: "/opportunities",
  },
  {
    title: "Customize your watchlist",
    description: "Track the counties and markets that matter most to you.",
    icon: Sparkles,
    action: "Manage Watchlist",
    path: "/watchlist",
  },
];

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to BuildSignal!</h1>
          <p className="text-muted-foreground">
            Your account is ready. Here's what happens next:
          </p>
        </div>

        {/* Live Customer Onboarding Checklist */}
        <div className="mb-10">
          <OnboardingChecklist
            completedStepIds={[1]}
            onStepClick={(step) => navigate(step.path)}
          />
        </div>

        {/* Onboarding Steps */}
        <div className="space-y-4 mb-12">
          {onboardingSteps.map((step) => (
            <Card key={step.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Go to Dashboard CTA */}
        <div className="text-center mb-12">
          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="gap-2 px-8"
          >
            <LayoutDashboard className="h-5 w-5" />
            Go to Dashboard
            <ArrowRight className="h-5 w-5" />
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            You can return to this page anytime from the Help menu.
          </p>
        </div>

        {/* Quick Tips */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Tips to Get Started</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickTips.map((tip) => (
              <Card
                key={tip.title}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(tip.path)}
              >
                <CardContent className="p-4">
                  <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <tip.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{tip.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {tip.description}
                  </p>
                  <span className="text-xs text-primary font-medium flex items-center gap-1">
                    {tip.action}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Need help?{" "}
            <button
              onClick={() => navigate("/help")}
              className="text-primary hover:underline"
            >
              Visit our Help Center
            </button>{" "}
            or{" "}
            <button
              onClick={() => navigate("/contact")}
              className="text-primary hover:underline"
            >
              contact support
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
