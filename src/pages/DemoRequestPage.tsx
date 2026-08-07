import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Video,
  Phone,
  MessageSquare,
  Star,
  Zap,
  Building2,
  Globe,
  Landmark,
  Briefcase,
  HardHat,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DemoRequestPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    teamSize: "",
    useCase: "",
    preferredDate: undefined as Date | undefined,
    preferredTime: "",
    demoType: "video",
    notes: "",
  });

  const handleChange = (field: string, value: string | Date | undefined) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const useCases = [
    {
      value: "commercial-development",
      label: "Commercial Real Estate Development",
      icon: Building2,
      description: "Spot emerging submarkets and track permit activity",
    },
    {
      value: "land-investment",
      label: "Land Investment",
      icon: Landmark,
      description: "Identify counties with accelerating construction",
    },
    {
      value: "site-selection",
      label: "Site Selection Consulting",
      icon: Globe,
      description: "Deliver data-backed location recommendations",
    },
    {
      value: "brokerage",
      label: "Commercial Brokerage",
      icon: Briefcase,
      description: "Time your outreach and win more listings",
    },
    {
      value: "economic-dev",
      label: "Economic Development",
      icon: Users,
      description: "Benchmark regions and track investment flows",
    },
    {
      value: "engineering",
      label: "Engineering & Construction",
      icon: HardHat,
      description: "Anticipate new projects and align BD efforts",
    },
  ];

  const teamSizes = [
    { value: "1-5", label: "1-5 employees" },
    { value: "6-25", label: "6-25 employees" },
    { value: "26-100", label: "26-100 employees" },
    { value: "101-500", label: "101-500 employees" },
    { value: "500+", label: "500+ employees" },
  ];

  const timeSlots = [
    "9:00 AM ET",
    "10:00 AM ET",
    "11:00 AM ET",
    "1:00 PM ET",
    "2:00 PM ET",
    "3:00 PM ET",
    "4:00 PM ET",
  ];

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full text-center space-y-6 p-8">
          <div className="mx-auto h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">Demo Request Submitted!</h1>
          <p className="text-muted-foreground">
            Thanks for your interest! Our team will reach out within 24 hours to
            confirm your demo time and send a calendar invite.
          </p>
          <div className="bg-muted rounded-lg p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{form.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{form.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Company:</span>
              <span className="font-medium">{form.company}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Demo Type:</span>
              <span className="font-medium">
                {form.demoType === "video" ? "Video Call" : "Phone Call"}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate("/")} className="gap-2">
              Return to Home
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={() => navigate("/pricing")}>
              View Pricing
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
            <Video className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Request a Demo</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            See how BuildSignal can help you spot construction surges before your
            competitors. Schedule a personalized demo with our team.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {["Your Info", "Use Case", "Schedule"].map((label, idx) => (
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
                    step >= idx + 1 ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Tell Us About Yourself"}
              {step === 2 && "How Can We Help?"}
              {step === 3 && "Pick a Time"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="demo-name">Full Name *</Label>
                      <Input
                        id="demo-name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="demo-email">Work Email *</Label>
                      <Input
                        id="demo-email"
                        type="email"
                        placeholder="john@company.com"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="demo-company">Company *</Label>
                      <Input
                        id="demo-company"
                        placeholder="Acme Inc."
                        value={form.company}
                        onChange={(e) => handleChange("company", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="demo-role">Your Role</Label>
                      <Input
                        id="demo-role"
                        placeholder="e.g., VP of Acquisitions"
                        value={form.role}
                        onChange={(e) => handleChange("role", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="demo-team">Team Size</Label>
                    <Select
                      value={form.teamSize}
                      onValueChange={(value) => handleChange("teamSize", value)}
                    >
                      <SelectTrigger id="demo-team">
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Use Case */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>What's Your Primary Use Case?</Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {useCases.map((uc) => (
                        <button
                          key={uc.value}
                          type="button"
                          onClick={() => handleChange("useCase", uc.value)}
                          className={cn(
                            "p-4 border rounded-lg text-left transition-all hover:shadow-md",
                            form.useCase === uc.value
                              ? "border-primary ring-2 ring-primary bg-primary/5"
                              : "border-border bg-card"
                          )}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <uc.icon className="h-5 w-5 text-primary" />
                            <span className="font-medium text-sm">{uc.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {uc.description}
                          </p>
                          {form.useCase === uc.value && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                              <Check className="h-3.5 w-3.5" />
                              Selected
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="demo-notes">
                      Additional Context (Optional)
                    </Label>
                    <Textarea
                      id="demo-notes"
                      placeholder="Tell us about your specific needs, markets of interest, or questions..."
                      rows={3}
                      value={form.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Schedule */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Demo Type</Label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleChange("demoType", "video")}
                        className={cn(
                          "flex-1 p-4 border rounded-lg text-center transition-all",
                          form.demoType === "video"
                            ? "border-primary ring-2 ring-primary bg-primary/5"
                            : "border-border bg-card hover:bg-accent/50"
                        )}
                      >
                        <Video className="h-6 w-6 text-primary mx-auto mb-2" />
                        <div className="font-medium text-sm">Video Call</div>
                        <div className="text-xs text-muted-foreground">
                          Via Zoom or Google Meet
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange("demoType", "phone")}
                        className={cn(
                          "flex-1 p-4 border rounded-lg text-center transition-all",
                          form.demoType === "phone"
                            ? "border-primary ring-2 ring-primary bg-primary/5"
                            : "border-border bg-card hover:bg-accent/50"
                        )}
                      >
                        <Phone className="h-6 w-6 text-primary mx-auto mb-2" />
                        <div className="font-medium text-sm">Phone Call</div>
                        <div className="text-xs text-muted-foreground">
                          We'll call you
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Date</Label>
                    <div className="border rounded-lg p-4 flex justify-center">
                      <Calendar
                        mode="single"
                        selected={form.preferredDate}
                        onSelect={(date) => handleChange("preferredDate", date)}
                        disabled={(date) => date < new Date()}
                        className="rounded-md"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Time</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleChange("preferredTime", slot)}
                          className={cn(
                            "p-2 border rounded-lg text-xs text-center transition-all",
                            form.preferredTime === slot
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:bg-accent/50"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={handleBack} className="gap-2">
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
                    disabled={
                      (step === 1 && (!form.name || !form.email || !form.company)) ||
                      (step === 2 && !form.useCase)
                    }
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="gap-2"
                    disabled={!form.preferredDate || !form.preferredTime}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Submit Request
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust Signals */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-500" />
            <span>Response within 24h</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-500" />
            <span>Personalized for your team</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-green-500" />
            <span>No pressure, no obligation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
