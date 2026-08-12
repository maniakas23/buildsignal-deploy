import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Bell,
  CreditCard,
  Building2,
  Loader2,
  ArrowLeft,
  Check,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const planConfig: Record<string, { name: string; color: string; features: string[] }> = {
  starter: { name: "Starter", color: "bg-[var(--bs-text-tertiary)]", features: ["1 county", "10 searches/mo", "1 report/mo"] },
  scout: { name: "Scout", color: "bg-[var(--bs-action)]", features: ["5 counties", "100 searches/mo", "10 reports/mo", "Email alerts"] },
  professional: { name: "Professional", color: "bg-[var(--bs-intelligence)]", features: ["20 counties", "500 searches/mo", "50 reports/mo", "API access"] },
  business: { name: "Business", color: "bg-[var(--bs-text-primary)]", features: ["Unlimited counties", "Unlimited searches", "Full API", "Priority support"] },
  enterprise: { name: "Enterprise", color: "bg-[#FFD700]", features: ["Custom integrations", "Unlimited seats", "SLA guarantee"] },
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);

  const { data: prefs, isLoading: prefsLoading } = trpc.notification.getPrefs.useQuery();
  const updatePrefs = trpc.notification.updatePrefs.useMutation({
    onSuccess: () => {
      setSavedMessage(true);
    },
  });

  const { data: usage } = trpc.billing.usage.useQuery();

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  useEffect(() => {
    if (savedMessage) {
      const timer = setTimeout(() => setSavedMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [savedMessage]);

  const handleToggleEmail = (checked: boolean) => {
    updatePrefs.mutate({ emailEnabled: checked });
  };

  const handleToggleInApp = (checked: boolean) => {
    updatePrefs.mutate({ inAppEnabled: checked });
  };

  const handleFrequencyChange = (value: string) => {
    updatePrefs.mutate({ alertFrequency: value as "realtime" | "daily" | "weekly" });
  };

  const currentPlan = user?.plan || "starter";
  const planInfo = planConfig[currentPlan] || planConfig.starter;

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bs-canvas)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--bs-action)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bs-canvas)]">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="gap-2 text-[var(--bs-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--bs-text-primary)]">Settings</h1>
            <p className="text-sm text-[var(--bs-text-tertiary)]">
              Manage your account, preferences, and billing
            </p>
          </div>
        </div>

        {savedMessage && (
          <div className="mb-6 bg-[var(--bs-intelligence)]/10 border border-[var(--bs-intelligence)]/20 text-[var(--bs-intelligence)] rounded-lg p-3 flex items-center gap-2 text-sm font-medium">
            <Check className="h-4 w-4" />
            Settings saved successfully
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile */}
            <Card className="border-[var(--bs-surface-hover)] shadow-sm bg-[var(--bs-surface)]">
              <CardHeader>
                <CardTitle className="text-lg text-[var(--bs-text-primary)] flex items-center gap-2">
                  <User className="h-5 w-5 text-[var(--bs-action)]" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="settings-name" className="text-[var(--bs-text-primary)]">
                    Full Name
                  </Label>
                  <Input
                    id="settings-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="text-[var(--bs-text-primary)] bg-[var(--bs-canvas)] border-[var(--bs-border)]"
                  />
                  <p className="text-xs text-[var(--bs-text-tertiary)]">
                    This is how your name will appear across the platform.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="settings-email" className="text-[var(--bs-text-primary)]">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--bs-text-tertiary)]" />
                    <Input
                      id="settings-email"
                      value={user?.email || ""}
                      disabled
                      className="pl-10 bg-[var(--bs-canvas)] text-[var(--bs-text-tertiary)] border-[var(--bs-border)]"
                    />
                  </div>
                  <p className="text-xs text-[var(--bs-text-tertiary)]">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="border-[var(--bs-surface-hover)] shadow-sm bg-[var(--bs-surface)]">
              <CardHeader>
                <CardTitle className="text-lg text-[var(--bs-text-primary)] flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[var(--bs-action)]" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {prefsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-[var(--bs-action)]" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-[var(--bs-text-primary)]">Email Notifications</Label>
                        <p className="text-xs text-[var(--bs-text-tertiary)]">
                          Receive alerts and updates via email
                        </p>
                      </div>
                      <Switch
                        checked={prefs?.emailEnabled ?? true}
                        onCheckedChange={handleToggleEmail}
                        disabled={updatePrefs.isPending}
                      />
                    </div>

                    <Separator className="bg-[var(--bs-border)]" />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-[var(--bs-text-primary)]">In-App Notifications</Label>
                        <p className="text-xs text-[var(--bs-text-tertiary)]">
                          Show notifications inside the app
                        </p>
                      </div>
                      <Switch
                        checked={prefs?.inAppEnabled ?? true}
                        onCheckedChange={handleToggleInApp}
                        disabled={updatePrefs.isPending}
                      />
                    </div>

                    <Separator className="bg-[var(--bs-border)]" />

                    <div className="space-y-2">
                      <Label className="text-[var(--bs-text-primary)]">Alert Frequency</Label>
                      <Select
                        value={prefs?.alertFrequency ?? "daily"}
                        onValueChange={handleFrequencyChange}
                        disabled={updatePrefs.isPending}
                      >
                        <SelectTrigger className="w-[200px] border-[var(--bs-border)] bg-[var(--bs-canvas)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--bs-surface)] border-[var(--bs-border)]">
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Summary</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-[var(--bs-text-tertiary)]">
                        How often you want to receive non-urgent alerts
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-[var(--bs-surface-hover)] shadow-sm bg-[var(--bs-surface)]">
              <CardHeader>
                <CardTitle className="text-lg text-[var(--bs-text-primary)] flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[var(--bs-action)]" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--bs-text-primary)]">Password</p>
                    <p className="text-xs text-[var(--bs-text-tertiary)]">
                      Manage your account password
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/forgot-password")}
                    className="border-[var(--bs-border)] text-[var(--bs-text-primary)] hover:bg-[var(--bs-surface-hover)]"
                  >
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Plan Info */}
            <Card className="border-[var(--bs-surface-hover)] shadow-sm bg-[var(--bs-surface)]">
              <CardHeader>
                <CardTitle className="text-lg text-[var(--bs-text-primary)] flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[var(--bs-action)]" />
                  Your Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", planInfo.color)}>
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--bs-text-primary)]">{planInfo.name}</p>
                    <Badge
                      variant="secondary"
                      className="bg-[var(--bs-surface-hover)] text-[var(--bs-text-tertiary)] text-[10px] mt-0.5"
                    >
                      {currentPlan === "starter" ? "Free" : "Paid"}
                    </Badge>
                  </div>
                </div>

                <ul className="space-y-1.5">
                  {planInfo.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-[var(--bs-text-primary)]">
                      <Check className="h-3 w-3 text-[var(--bs-intelligence)] shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full bg-[var(--bs-action)] hover:bg-[var(--bs-action)]/90"
                  onClick={() => navigate("/billing")}
                >
                  Manage Billing
                </Button>
              </CardContent>
            </Card>

            {/* Usage Summary */}
            {usage && (
              <Card className="border-[var(--bs-surface-hover)] shadow-sm bg-[var(--bs-surface)]">
                <CardHeader>
                  <CardTitle className="text-lg text-[var(--bs-text-primary)]">Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Counties", used: usage.counties.used, limit: usage.counties.limit },
                    { label: "Searches", used: usage.searches.used, limit: usage.searches.limit },
                    { label: "Reports", used: usage.reports.used, limit: usage.reports.limit },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[var(--bs-text-tertiary)]">{item.label}</span>
                        <span className="text-[var(--bs-text-primary)] font-medium">
                          {item.limit >= 9999 ? "Unlimited" : `${item.used} / ${item.limit}`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[var(--bs-surface-hover)] rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            item.limit >= 9999 ? "w-full bg-[var(--bs-intelligence)]" : "bg-[var(--bs-action)]"
                          )}
                          style={{
                            width: item.limit >= 9999 ? "100%" : `${Math.min((item.used / item.limit) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}