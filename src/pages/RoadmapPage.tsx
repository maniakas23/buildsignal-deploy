import { useState, useEffect, useCallback } from "react";
import {
  Heart,
  ThumbsUp,
  MessageSquare,
  Lightbulb,
  Rocket,
  CheckCircle,
  Clock,
  ArrowRight,
  Send,
  ChevronDown,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  category: "Data" | "Integration" | "UX" | "Mobile" | "API" | "Reporting" | "Other";
  status: "planned" | "in-progress" | "launched";
  votes: number;
}

interface SubmittedIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  submittedAt: string;
}

const initialFeatures: RoadmapFeature[] = [
  // Planned
  { id: "1", title: "County API Expansion", description: "Direct integrations with 50 additional county permit APIs", category: "Data", status: "planned", votes: 47 },
  { id: "2", title: "Mobile App", description: "Native iOS and Android apps for on-the-go alerts", category: "Mobile", status: "planned", votes: 89 },
  { id: "3", title: "CSV Bulk Export", description: "Export up to 10,000 opportunities as CSV with custom columns", category: "Reporting", status: "planned", votes: 34 },
  { id: "4", title: "Dark Mode Default", description: "System-aware dark mode with OLED black option", category: "UX", status: "planned", votes: 22 },
  // In Progress
  { id: "5", title: "Zapier Integration", description: "Connect BuildSignal to 5,000+ apps via Zapier", category: "Integration", status: "in-progress", votes: 56 },
  { id: "6", title: "Slack Notifications v2", description: "Rich Slack alerts with charts and threaded discussions", category: "Integration", status: "in-progress", votes: 71 },
  { id: "7", title: "Custom Report Templates", description: "Build your own branded report templates with drag-and-drop", category: "Reporting", status: "in-progress", votes: 43 },
  // Launched
  { id: "8", title: "AI Confidence Scores", description: "Every prediction now includes a 0-100 confidence score", category: "Data", status: "launched", votes: 128 },
  { id: "9", title: "Real-Time Alerts", description: "Instant notifications when new permits match your criteria", category: "UX", status: "launched", votes: 95 },
  { id: "10", title: "Watchlists", description: "Save and track specific projects across time", category: "UX", status: "launched", votes: 62 },
  { id: "11", title: "API Access", description: "RESTful API for all data and predictions", category: "API", status: "launched", votes: 54 },
  { id: "12", title: "SSO & SAML", description: "Enterprise single sign-on with SAML 2.0 support", category: "Integration", status: "launched", votes: 38 },
];

const VOTES_STORAGE_KEY = "buildsignal_roadmap_votes";
const IDEAS_STORAGE_KEY = "buildsignal_roadmap_ideas";

const categoryColors: Record<string, string> = {
  Data: "bg-sky-100 text-sky-700 border-sky-200",
  Integration: "bg-violet-100 text-violet-700 border-violet-200",
  UX: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Mobile: "bg-amber-100 text-amber-700 border-amber-200",
  API: "bg-rose-100 text-rose-700 border-rose-200",
  Reporting: "bg-orange-100 text-orange-700 border-orange-200",
  Other: "bg-slate-100 text-slate-700 border-slate-200",
};

const statusConfig = {
  planned: {
    label: "Planned",
    borderColor: "border-l-slate-400",
    headerColor: "text-slate-700",
    bgBadge: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock,
  },
  "in-progress": {
    label: "In Progress",
    borderColor: "border-l-[#1F5EFF]",
    headerColor: "text-[#1F5EFF]",
    bgBadge: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Rocket,
  },
  launched: {
    label: "Launched",
    borderColor: "border-l-emerald-500",
    headerColor: "text-emerald-600",
    bgBadge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
};

function getStoredVotes(): string[] {
  try {
    const raw = localStorage.getItem(VOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStoredVotes(votes: string[]) {
  try {
    localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
  } catch {
    // ignore
  }
}

function getStoredIdeas(): SubmittedIdea[] {
  try {
    const raw = localStorage.getItem(IDEAS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStoredIdeas(ideas: SubmittedIdea[]) {
  try {
    localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideas));
  } catch {
    // ignore
  }
}

export function RoadmapPage() {
  const [userVotes, setUserVotes] = useState<string[]>([]);
  const [submittedIdeas, setSubmittedIdeas] = useState<SubmittedIdea[]>([]);
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("");
  const [ideaCategory, setIdeaCategory] = useState("Other");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showIdeas, setShowIdeas] = useState(false);

  useEffect(() => {
    setUserVotes(getStoredVotes());
    setSubmittedIdeas(getStoredIdeas());
  }, []);

  const toggleVote = useCallback((featureId: string) => {
    setUserVotes((prev) => {
      const next = prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId];
      setStoredVotes(next);
      return next;
    });
  }, []);

  const handleSubmitIdea = useCallback(() => {
    if (!ideaTitle.trim()) return;
    const newIdea: SubmittedIdea = {
      id: `idea-${Date.now()}`,
      title: ideaTitle.trim(),
      description: ideaDescription.trim(),
      category: ideaCategory,
      submittedAt: new Date().toISOString(),
    };
    const next = [newIdea, ...submittedIdeas];
    setSubmittedIdeas(next);
    setStoredIdeas(next);
    setIdeaTitle("");
    setIdeaDescription("");
    setIdeaCategory("Other");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  }, [ideaTitle, ideaDescription, ideaCategory, submittedIdeas]);

  const planned = initialFeatures.filter((f) => f.status === "planned");
  const inProgress = initialFeatures.filter((f) => f.status === "in-progress");
  const launched = initialFeatures.filter((f) => f.status === "launched");

  const columns = [
    { key: "planned", features: planned, config: statusConfig.planned },
    { key: "in-progress", features: inProgress, config: statusConfig["in-progress"] },
    { key: "launched", features: launched, config: statusConfig.launched },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge
            className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
          >
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            Community-Driven
          </Badge>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: "#0B1F33" }}
          >
            Product Roadmap
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See what we&apos;re building and vote on what matters most to you.
          </p>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {columns.map((col) => {
            const StatusIcon = col.config.icon;
            return (
              <div key={col.key} className="flex flex-col">
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-4 px-1">
                  <StatusIcon className={cn("h-5 w-5", col.config.headerColor)} />
                  <h2 className={cn("text-lg font-semibold", col.config.headerColor)}>
                    {col.config.label}
                  </h2>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {col.features.length}
                  </Badge>
                </div>

                {/* Cards */}
                <div className="space-y-4">
                  {col.features.map((feature) => {
                    const hasVoted = userVotes.includes(feature.id);
                    const displayVotes = feature.votes + (hasVoted ? 1 : 0);
                    return (
                      <Card
                        key={feature.id}
                        className={cn(
                          "border-l-4 transition-all duration-200 hover:shadow-md",
                          col.config.borderColor
                        )}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base font-semibold leading-snug">
                              {feature.title}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] px-1.5 py-0.5 shrink-0 font-medium",
                                categoryColors[feature.category] || categoryColors.Other
                              )}
                            >
                              {feature.category}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <ThumbsUp className="h-3.5 w-3.5" />
                            <span className="font-medium">{displayVotes}</span>
                            <span className="text-xs">votes</span>
                          </div>
                          <Button
                            size="sm"
                            variant={hasVoted ? "default" : "outline"}
                            onClick={() => toggleVote(feature.id)}
                            className={cn(
                              "h-8 text-xs gap-1.5 transition-all",
                              hasVoted
                                ? "bg-[#1F5EFF] hover:bg-[#1F5EFF]/90 text-white"
                                : "border-slate-200 hover:border-[#1F5EFF] hover:text-[#1F5EFF]"
                            )}
                          >
                            <ThumbsUp
                              className={cn(
                                "h-3.5 w-3.5",
                                hasVoted && "fill-white"
                              )}
                            />
                            {hasVoted ? "You voted" : "Upvote"}
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <Separator className="mb-16" />

        {/* Submit Idea Section */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 mb-4">
              <Lightbulb className="h-6 w-6 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#0B1F33" }}>
              Have an idea?
            </h2>
            <p className="text-slate-600">
              Submit a feature request and help shape the future of BuildSignal.
            </p>
          </div>

          <Card className="border-slate-200">
            <CardContent className="pt-6 space-y-4">
              {showSuccess && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2 text-emerald-700 text-sm">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  Your idea has been submitted successfully. Thank you!
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Feature Title
                </label>
                <Input
                  placeholder="e.g., Google Calendar Integration"
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  className="border-slate-200 focus-visible:ring-[#1F5EFF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description
                </label>
                <Textarea
                  placeholder="Describe what you'd like to see and why it matters..."
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  rows={4}
                  className="border-slate-200 focus-visible:ring-[#1F5EFF] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={ideaCategory}
                    onChange={(e) => setIdeaCategory(e.target.value)}
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F5EFF] focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="Data">Data</option>
                    <option value="Integration">Integration</option>
                    <option value="UX">UX</option>
                    <option value="Mobile">Mobile</option>
                    <option value="API">API</option>
                    <option value="Reporting">Reporting</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <Button
                onClick={handleSubmitIdea}
                disabled={!ideaTitle.trim()}
                className="w-full gap-2 bg-[#1F5EFF] hover:bg-[#1F5EFF]/90 text-white"
              >
                <Send className="h-4 w-4" />
                Submit Idea
              </Button>

              <p className="text-xs text-slate-500 text-center flex items-start justify-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                Ideas are reviewed weekly. You&apos;ll be notified if your idea is added to the roadmap.
              </p>
            </CardContent>
          </Card>

          {/* Submitted Ideas */}
          {submittedIdeas.length > 0 && (
            <div className="mt-10">
              <button
                onClick={() => setShowIdeas((s) => !s)}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#1F5EFF] transition-colors mb-4"
              >
                <ArrowRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    showIdeas && "rotate-90"
                  )}
                />
                Your Submitted Ideas ({submittedIdeas.length})
              </button>

              {showIdeas && (
                <div className="space-y-3">
                  {submittedIdeas.map((idea) => (
                    <Card
                      key={idea.id}
                      className="border-slate-200 border-l-4 border-l-[#18A999]"
                    >
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{idea.title}</h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 shrink-0",
                              categoryColors[idea.category] || categoryColors.Other
                            )}
                          >
                            {idea.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          {idea.description}
                        </p>
                        <p className="text-xs text-slate-400">
                          Submitted{" "}
                          {new Date(idea.submittedAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoadmapPage;
