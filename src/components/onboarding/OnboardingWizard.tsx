import { useState, useMemo } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Bell,
  Zap,
  Users,
  ChevronRight,
  CheckCircle,
  Building,
  Home,
  Train,
  FileText,
  ArrowRight,
  X,
  Search,
  RadioTower,
  Mail,
  Check,
} from "lucide-react";

// ─── Color Palette ───────────────────────────────────────────────────
const COLORS = {
  deepNavy: "#0B1F33",
  signalBlue: "#1F5EFF",
  insightTeal: "#18A999",
  opportunityAmber: "#F4A261",
};

// ─── Sample Market List (20 popular US metros) ──────────────────────
const SAMPLE_MARKETS = [
  "Austin, TX",
  "Denver, CO",
  "Atlanta, GA",
  "Boston, MA",
  "Charlotte, NC",
  "Chicago, IL",
  "Dallas, TX",
  "Houston, TX",
  "Los Angeles, CA",
  "Miami, FL",
  "Nashville, TN",
  "New York, NY",
  "Phoenix, AZ",
  "Portland, OR",
  "Raleigh, NC",
  "San Francisco, CA",
  "Seattle, WA",
  "Tampa, FL",
  "Washington, DC",
  "Salt Lake City, UT",
];

// ─── Alert Preference Options ─────────────────────────────────────
interface AlertOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  defaultChecked: boolean;
}

const ALERT_OPTIONS: AlertOption[] = [
  {
    id: "commercial",
    label: "New commercial permits > $10M",
    description: "Get notified when major commercial projects are filed",
    icon: <Building className="w-4 h-4" />,
    defaultChecked: true,
  },
  {
    id: "residential",
    label: "Residential surges (permit velocity up 20%+)",
    description: "Detect accelerating residential activity early",
    icon: <Home className="w-4 h-4" />,
    defaultChecked: true,
  },
  {
    id: "infrastructure",
    label: "Infrastructure projects (roads, rail, utilities)",
    description: "Track large-scale public infrastructure projects",
    icon: <Train className="w-4 h-4" />,
    defaultChecked: true,
  },
  {
    id: "zoning",
    label: "Zoning changes in tracked counties",
    description: "Monitor regulatory changes that unlock development",
    icon: <FileText className="w-4 h-4" />,
    defaultChecked: false,
  },
];

// ─── Frequency Options ───────────────────────────────────────────────
const FREQUENCY_OPTIONS = [
  { id: "daily", label: "Daily digest", description: "Every morning at 8 AM" },
  { id: "weekly", label: "Weekly summary", description: "Every Monday morning" },
  { id: "realtime", label: "Real-time", description: "As soon as we detect them" },
];

// ─── Step Indicator ──────────────────────────────────────────────────
function StepIndicator({ step, total }: { step: number; total: number }) {
  const progress = (step / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium">
        <span style={{ color: COLORS.deepNavy }}>Step {step} of {total}</span>
        <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: step === total ? COLORS.insightTeal : COLORS.signalBlue,
          }}
        />
      </div>
      <div className="flex items-center gap-2 pt-1">
        {Array.from({ length: total }).map((_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < step;
          const isActive = stepNum === step;
          return (
            <div key={stepNum} className="flex items-center gap-2">
              <div
                className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all duration-300"
                style={{
                  backgroundColor: isCompleted
                    ? COLORS.insightTeal
                    : isActive
                      ? COLORS.signalBlue
                      : "#e2e8f0",
                  color: isCompleted || isActive ? "#fff" : "#64748b",
                }}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
              </div>
              <span
                className={`text-xs font-medium transition-colors duration-300 ${
                  isActive ? "text-slate-800 dark:text-slate-100" : "text-muted-foreground"
                }`}
              >
                {stepNum === 1 && "Markets"}
                {stepNum === 2 && "Alerts"}
                {stepNum === 3 && "Connect"}
              </span>
              {stepNum < total && (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Animated Step Container ───────────────────────────────────────
function StepContainer({
  children,
  visible,
  direction,
}: {
  children: React.ReactNode;
  visible: boolean;
  direction: "forward" | "backward";
}) {
  if (!visible) return null;

  return (
    <div
      className="transition-all duration-300 ease-out"
      style={{
        animation: `${direction === "forward" ? "slideInRight" : "slideInLeft"} 300ms ease-out`,
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      {children}
    </div>
  );
}

// ─── Step 1: Select Markets ────────────────────────────────────────
function StepSelectMarkets({
  selectedMarkets,
  onToggle,
}: {
  selectedMarkets: string[];
  onToggle: (market: string) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return SAMPLE_MARKETS;
    return SAMPLE_MARKETS.filter((m) =>
      m.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold" style={{ color: COLORS.deepNavy }}>
          Where do you want to track construction activity?
        </h2>
        <p className="text-sm text-muted-foreground">
          Select counties or metros you care about. You can always add more later.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search markets..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-lg max-h-[280px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground text-center">
            No markets match your search
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((market) => {
              const isSelected = selectedMarkets.includes(market);
              return (
                <div
                  key={market}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    isSelected ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                  }`}
                  onClick={() => onToggle(market)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggle(market)}
                    id={`market-${market}`}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <Label
                      htmlFor={`market-${market}`}
                      className="text-sm font-medium cursor-pointer flex-1"
                    >
                      {market}
                    </Label>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-4 h-4" style={{ color: COLORS.insightTeal }} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Badge
          variant="secondary"
          className="text-xs font-medium"
        >
          {selectedMarkets.length} market{selectedMarkets.length !== 1 ? "s" : ""} selected
        </Badge>
        {selectedMarkets.length > 0 && (
          <button
            className="text-xs text-muted-foreground hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            onClick={() => selectedMarkets.forEach((m) => onToggle(m))}
          >
            Clear all
          </button>
        )}
      </div>

      {selectedMarkets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedMarkets.map((m) => (
            <Badge
              key={m}
              variant="outline"
              className="text-xs gap-1 pr-1.5"
              style={{ borderColor: COLORS.signalBlue + "40" }}
            >
              <MapPin className="w-3 h-3" style={{ color: COLORS.signalBlue }} />
              {m}
              <button
                className="ml-1 hover:text-red-500 transition-colors"
                onClick={() => onToggle(m)}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step 2: Alert Preferences ─────────────────────────────────────
function StepAlertPreferences({
  alertPreferences,
  onToggleAlert,
  alertFrequency,
  onSetFrequency,
}: {
  alertPreferences: Record<string, boolean>;
  onToggleAlert: (id: string) => void;
  alertFrequency: string;
  onSetFrequency: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold" style={{ color: COLORS.deepNavy }}>
          What opportunities do you want to know about first?
        </h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ll notify you when these conditions are met in your markets.
        </p>
      </div>

      <div className="space-y-3">
        {ALERT_OPTIONS.map((option) => {
          const checked = alertPreferences[option.id] ?? option.defaultChecked;
          return (
            <div
              key={option.id}
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${
                checked
                  ? "border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/20"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30"
              }`}
              onClick={() => onToggleAlert(option.id)}
            >
              <div className="mt-0.5">
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => onToggleAlert(option.id)}
                  id={`alert-${option.id}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      color: checked ? COLORS.signalBlue : "#64748b",
                    }}
                  >
                    {option.icon}
                  </span>
                  <Label
                    htmlFor={`alert-${option.id}`}
                    className="text-sm font-semibold cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 ml-6">
                  {option.description}
                </p>
              </div>
              {checked && (
                <Zap className="w-4 h-4 mt-1" style={{ color: COLORS.opportunityAmber }} />
              )}
            </div>
          );
        })}
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: COLORS.signalBlue }} />
          <h3 className="text-sm font-semibold" style={{ color: COLORS.deepNavy }}>
            Alert frequency
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FREQUENCY_OPTIONS.map((freq) => (
            <div
              key={freq.id}
              className={`flex flex-col gap-1 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                alertFrequency === freq.id
                  ? "border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/20"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30"
              }`}
              onClick={() => onSetFrequency(freq.id)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor:
                      alertFrequency === freq.id ? COLORS.signalBlue : "#cbd5e1",
                  }}
                >
                  {alertFrequency === freq.id && (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS.signalBlue }}
                    />
                  )}
                </div>
                <span className="text-sm font-medium">{freq.label}</span>
              </div>
              <p className="text-xs text-muted-foreground ml-6">{freq.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Connect & Go ──────────────────────────────────────────
function StepConnectGo({
  integrations,
  onToggleIntegration,
  teamEmail,
  onTeamEmailChange,
  onInviteTeamChange,
  inviteTeam,
  onLaunch,
  onSkip,
}: {
  integrations: Record<string, boolean>;
  onToggleIntegration: (id: string) => void;
  teamEmail: string;
  onTeamEmailChange: (v: string) => void;
  onInviteTeamChange: (v: boolean) => void;
  inviteTeam: boolean;
  onLaunch: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" style={{ color: COLORS.insightTeal }} />
          <h2 className="text-xl font-semibold" style={{ color: COLORS.deepNavy }}>
            You&apos;re ready to start tracking
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Optional: connect integrations or invite your team.
        </p>
      </div>

      <div className="space-y-3">
        {/* Salesforce */}
        <div className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 opacity-70">
          <Checkbox
            checked={false}
            disabled
            id="salesforce"
          />
          <div className="flex items-center gap-2 flex-1">
            <Building className="w-4 h-4 text-muted-foreground" />
            <div>
              <Label htmlFor="salesforce" className="text-sm font-medium cursor-not-allowed">
                Connect Salesforce CRM
              </Label>
              <p className="text-xs text-muted-foreground">Sync opportunities directly to your pipeline</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-medium"
            style={{ borderColor: COLORS.opportunityAmber + "60", color: COLORS.opportunityAmber }}
          >
            Coming soon
          </Badge>
        </div>

        {/* Slack */}
        <div className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 opacity-70">
          <Checkbox checked={false} disabled id="slack" />
          <div className="flex items-center gap-2 flex-1">
            <RadioTower className="w-4 h-4 text-muted-foreground" />
            <div>
              <Label htmlFor="slack" className="text-sm font-medium cursor-not-allowed">
                Connect Slack for alerts
              </Label>
              <p className="text-xs text-muted-foreground">Get real-time alerts in your team channels</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-medium"
            style={{ borderColor: COLORS.opportunityAmber + "60", color: COLORS.opportunityAmber }}
          >
            Coming soon
          </Badge>
        </div>

        {/* Invite Team */}
        <div
          className={`flex flex-col gap-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
            inviteTeam
              ? "border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/20"
              : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30"
          }`}
          onClick={() => onInviteTeamChange(!inviteTeam)}
        >
          <div className="flex items-center gap-3">
            <Checkbox
              checked={inviteTeam}
              onCheckedChange={() => onInviteTeamChange(!inviteTeam)}
              id="invite-team"
            />
            <div className="flex items-center gap-2 flex-1">
              <Users className="w-4 h-4" style={{ color: inviteTeam ? COLORS.signalBlue : "#64748b" }} />
              <div>
                <Label htmlFor="invite-team" className="text-sm font-medium cursor-pointer">
                  Invite team members
                </Label>
                <p className="text-xs text-muted-foreground">Collaborate on opportunities with your team</p>
              </div>
            </div>
          </div>

          {inviteTeam && (
            <div className="ml-7 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-xs font-medium">Team member email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="colleague@company.com"
                  className="pl-9"
                  value={teamEmail}
                  onChange={(e) => onTeamEmailChange(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-3">
        <Button
          className="w-full h-11 text-sm font-semibold transition-all hover:shadow-lg"
          style={{ backgroundColor: COLORS.signalBlue }}
          onClick={onLaunch}
        >
          <Zap className="w-4 h-4 mr-2" />
          Launch My Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <Button
          variant="ghost"
          className="w-full text-xs text-muted-foreground hover:text-slate-700 dark:hover:text-slate-200"
          onClick={onSkip}
        >
          Skip for now — I&apos;ll set this up later
        </Button>
      </div>
    </div>
  );
}

// ─── Main Wizard Component ───────────────────────────────────────────
export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(["Austin, TX", "Denver, CO"]);
  const [alertPreferences, setAlertPreferences] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    ALERT_OPTIONS.forEach((o) => (initial[o.id] = o.defaultChecked));
    return initial;
  });
  const [alertFrequency, setAlertFrequency] = useState("daily");
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({});
  const [inviteTeam, setInviteTeam] = useState(false);
  const [teamEmail, setTeamEmail] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const goNext = () => {
    if (step < 3) {
      setDirection("forward");
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setDirection("backward");
      setStep((s) => s - 1);
    }
  };

  const toggleMarket = (market: string) => {
    setSelectedMarkets((prev) =>
      prev.includes(market) ? prev.filter((m) => m !== market) : [...prev, market]
    );
  };

  const toggleAlert = (id: string) => {
    setAlertPreferences((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLaunch = () => {
    const data = {
      status: "completed",
      step,
      selectedMarkets,
      alertPreferences,
      alertFrequency,
      integrations,
      inviteTeam,
      teamEmail,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem("buildsignal_onboarding_complete", JSON.stringify(data));
    setToast("Dashboard configured! We'll start tracking your markets.");
    setTimeout(() => {
      setToast(null);
      window.location.reload();
    }, 2000);
  };

  const handleSkip = () => {
    localStorage.setItem("buildsignal_onboarding_complete", "skipped");
    window.location.reload();
  };

  return (
    <div
      className="min-h-screen w-full py-8 px-4"
      style={{ backgroundColor: COLORS.deepNavy + "08" }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Logo / Brand */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: COLORS.signalBlue }}
          >
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold" style={{ color: COLORS.deepNavy }}>
            BuildSignal
          </span>
        </div>

        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="pb-2 space-y-4">
            <StepIndicator step={step} total={3} />
            <Separator />
          </CardHeader>

          <CardContent className="pt-2 pb-6 min-h-[420px]">
            <StepContainer visible={step === 1} direction={direction}>
              <StepSelectMarkets
                selectedMarkets={selectedMarkets}
                onToggle={toggleMarket}
              />
            </StepContainer>

            <StepContainer visible={step === 2} direction={direction}>
              <StepAlertPreferences
                alertPreferences={alertPreferences}
                onToggleAlert={toggleAlert}
                alertFrequency={alertFrequency}
                onSetFrequency={setAlertFrequency}
              />
            </StepContainer>

            <StepContainer visible={step === 3} direction={direction}>
              <StepConnectGo
                integrations={integrations}
                onToggleIntegration={(id) =>
                  setIntegrations((prev) => ({ ...prev, [id]: !prev[id] }))
                }
                teamEmail={teamEmail}
                onTeamEmailChange={setTeamEmail}
                onInviteTeamChange={setInviteTeam}
                inviteTeam={inviteTeam}
                onLaunch={handleLaunch}
                onSkip={handleSkip}
              />
            </StepContainer>
          </CardContent>

          {step < 3 && (
            <CardFooter className="flex items-center justify-between pt-0 pb-6">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={goBack}
                disabled={step === 1}
              >
                Back
              </Button>

              <div className="flex items-center gap-3">
                {step === 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground"
                    onClick={handleSkip}
                  >
                    Skip
                  </Button>
                )}
                <Button
                  size="sm"
                  className="text-sm font-medium transition-all hover:shadow-md"
                  style={{
                    backgroundColor: COLORS.signalBlue,
                    opacity: step === 1 && selectedMarkets.length === 0 ? 0.5 : 1,
                  }}
                  onClick={goNext}
                  disabled={step === 1 && selectedMarkets.length === 0}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Footer text */}
        <p className="text-center text-xs text-muted-foreground">
          You can change all of these preferences anytime from your settings.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium"
            style={{ backgroundColor: COLORS.insightTeal }}
          >
            <CheckCircle className="w-4 h-4" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
