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
  starter: { name: "Starter", color: "bg-[#6B7B8F]", features: ["1 county", "10 searches/mo", "1 report/mo"] },
  scout: { name: "Scout", color: "bg-[#1F5EFF]", features: ["5 counties", "100 searches/mo", "10 reports/mo", "Email alerts"] },
  professional: { name: "Professional", color: "bg-[#18A999]", features: ["20 counties", "500 searches/mo", "50 reports/mo", "API access"] },
  business: { name: "Business", color: "bg-[#0B1F33]", features: ["Unlimited counties", "Unlimited searches", "Full API", "Priority support"] },
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
      <div className="flex items-center justify-center min-h-screen bg-[#F7F9FC]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1F5EFF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="gap-2 text-[#0B1F33]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#0B1F33]">Settings</h1>
            <p className="text-sm text-[#6B7B8F]">
              Manage your account, preferences, and billing
            </p>
          </div>
        </div>

        {savedMessage && (
          <div className="mb-6 bg-[#18A999]/10 border border-[#18A999]/20 text-[#18A999] rounded-lg p-3 flex items-center gap-2 text-sm font-medium">
            <Check className="h-4 w-4" />
            Settings saved successfully
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile */}
            <Card className="border-[#F5F5F5] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#0B1F33] flex items-center gap-2">
                  <User className="h-5 w-5 text-[#1F5EFF]" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="settings-name" className="text-[#0B1F33]">
                    Full Name
                  </Label>
                  <Input
                    id="settings-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="text-[#0B1F33]"
                  />
                  <p className="text-xs text-[#6B7B8F]">
                    This is how your name will appear across the platform.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="settings-email" className="text-[#0B1F33]">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7B8F]" />
                    <Input
                      id="settings-email"
                      value={user?.email || ""}
                      disabled
                      className="pl-10 bg-[#F7F9FC] text-[#6B7B8F]"
                    />
                  </div>
                  <p className="text-xs text-[#6B7B8F]">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="border-[#F5F5F5] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#0B1F33] flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[#1F5EFF]" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {prefsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-[#1F5EFF]" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-[#0B1F33]">Email Notifications</Label>
                        <p className="text-xs text-[#6B7B8F]">
                          Receive alerts and updates via email
                        </p>
                      </div>
                      <Switch
                        checked={prefs?.emailEnabled ?? true}
                        onCheckedChange={handleToggleEmail}
                        disabled={updatePrefs.isPending}
                      />
                    </div>

                    <Separator className="bg-[#F5F5F5]" />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-[#0B1F33]">In-App Notifications</Label>
                        <p className="text-xs text-[#6B7B8F]">
                          Show notifications inside the app
                        </p>
                      </div>
                      <Switch
                        checked={prefs?.inAppEnabled ?? true}
                        onCheckedChange={handleToggleInApp}
                        disabled={updatePrefs.isPending}
                      />
                    </div>

                    <Separator className="bg-[#F5F5F5]" />

                    <div className="space-y-2">
                      <Label className="text-[#0B1F33]">Alert Frequency</Label>
                      <Select
                        value={prefs?.alertFrequency ?? "daily"}
                        onValueChange={handleFrequencyChange}
                        disabled={updatePrefs.isPending}
                      >
                        <SelectTrigger className="w-[200px] border-[#E5E5E5]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Summary</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-[#6B7B8F]">
                        How often you want to receive non-urgent alerts
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-[#F5F5F5] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#0B1F33] flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#1F5EFF]" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0B1F33]">Password</p>
                    <p className="text-xs text-[#6B7B8F]">
                      Manage your account password
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/forgot-password")}
                    className="border-[#E5E5E5] text-[#0B1F33]"
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
            <Card className="border-[#F5F5F5] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#0B1F33] flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#1F5EFF]" />
                  Your Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", planInfo.color)}>
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B1F33]">{planInfo.name}</p>
                    <Badge
                      variant="secondary"
                      className="bg-[#F5F5F5] text-[#6B7B8F] text-[10px] mt-0.5"
                    >
                      {currentPlan === "starter" ? "Free" : "Paid"}
                    </Badge>
                  </div>
                </div>

                <ul className="space-y-1.5">
                  {planInfo.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-[#0B1F33]">
                      <Check className="h-3 w-3 text-[#18A999] shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full bg-[#1F5EFF] hover:bg-[#1F5EFF]/90"
                  onClick={() => navigate("/billing")}
                >
                  Manage Billing
                </Button>
              </CardContent>
            </Card>

            {/* Usage Summary */}
            {usage && (
              <Card className="border-[#F5F5F5] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-[#0B1F33]">Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Counties", used: usage.counties.used, limit: usage.counties.limit },
                    { label: "Searches", used: usage.searches.used, limit: usage.searches.limit },
                    { label: "Reports", used: usage.reports.used, limit: usage.reports.limit },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#6B7B8F]">{item.label}</span>
                        <span className="text-[#0B1F33] font-medium">
                          {item.limit >= 9999 ? "Unlimited" : `${item.used} / ${item.limit}`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            item.limit >= 9999 ? "w-full bg-[#18A999]" : "bg-[#1F5EFF]"
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
