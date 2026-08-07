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
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Star,
  Zap,
  Search,
  Filter,
  LayoutDashboard,
  Bell,
  FileText,
  BarChart3,
  Code,
  Globe,
  Clock,
  Hash,
  Check,
  User,
  AlertTriangle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  votes: number;
  status: "planned" | "in-progress" | "completed" | "under-review";
  author: string;
  date: string;
  voted?: boolean;
}

const initialRequests: FeatureRequest[] = [
  {
    id: "FR-001",
    title: "Export reports to PowerPoint",
    description: "Add native PowerPoint export option alongside PDF and Excel for easier client presentations.",
    category: "Reporting",
    votes: 47,
    status: "planned",
    author: "Sarah M.",
    date: "Jan 5, 2025",
  },
  {
    id: "FR-002",
    title: "Dark mode for dashboard",
    description: "A dark theme option for the main dashboard and all report views for reduced eye strain.",
    category: "UI/UX",
    votes: 82,
    status: "in-progress",
    author: "James T.",
    date: "Dec 28, 2024",
  },
  {
    id: "FR-003",
    title: "Slack integration for alerts",
    description: "Send real-time alerts directly to Slack channels with rich formatting and action buttons.",
    category: "Integrations",
    votes: 63,
    status: "completed",
    author: "Lisa R.",
    date: "Dec 15, 2024",
  },
  {
    id: "FR-004",
    title: "Custom alert thresholds",
    description: "Allow users to define custom numerical thresholds for alert triggers instead of preset values.",
    category: "Alerts",
    votes: 31,
    status: "under-review",
    author: "David K.",
    date: "Jan 10, 2025",
  },
  {
    id: "FR-005",
    title: "API webhook support",
    description: "Add webhook support to the API so external systems can receive real-time notifications.",
    category: "API",
    votes: 55,
    status: "planned",
    author: "Maria G.",
    date: "Jan 3, 2025",
  },
  {
    id: "FR-006",
    title: "Multi-county comparison charts",
    description: "Side-by-side comparison charts for up to 5 counties with trend overlays.",
    category: "Analytics",
    votes: 39,
    status: "under-review",
    author: "Alex P.",
    date: "Dec 20, 2024",
  },
];

const categories = [
  "All",
  "Reporting",
  "UI/UX",
  "Integrations",
  "Alerts",
  "API",
  "Analytics",
  "Other",
];

const statusConfig = {
  planned: { label: "Planned", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  "in-progress": { label: "In Progress", color: "bg-amber-500/10 text-amber-600 border-amber-200" },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-600 border-green-200" },
  "under-review": { label: "Under Review", color: "bg-muted text-muted-foreground" },
};

export function FeatureRequestPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [requests, setRequests] = useState<FeatureRequest[]>(initialRequests);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });

  const handleVote = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, votes: r.voted ? r.votes - 1 : r.votes + 1, voted: !r.voted }
          : r
      )
    );
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    const newRequest: FeatureRequest = {
      id: `FR-${String(requests.length + 1).padStart(3, "0")}`,
      title: form.title,
      description: form.description,
      category: form.category || "Other",
      votes: 1,
      status: "under-review",
      author: "You",
      date: "Just now",
      voted: true,
    };
    setRequests((prev) => [newRequest, ...prev]);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full text-center space-y-6 p-8">
          <div className="mx-auto h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">Feature Request Submitted!</h1>
          <p className="text-muted-foreground">
            Thank you for your suggestion. Our team will review it and update
            the status here. You can vote on other requests too!
          </p>
          <div className="bg-muted rounded-lg p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Request ID:</span>
              <Badge variant="secondary">{requests[0]?.id}</Badge>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => { setSubmitted(false); setStep(1); setForm({ title: "", description: "", category: "" }); }} variant="outline">
              Submit Another Request
            </Button>
            <Button onClick={() => navigate("/")} className="gap-2">
              Return to Home
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
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
            <Lightbulb className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Feature Requests</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have an idea? Submit it, vote on existing requests, and help shape
            the future of BuildSignal.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{requests.length}</div>
              <div className="text-xs text-muted-foreground">Total Requests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {requests.filter((r) => r.status === "completed").length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {requests.filter((r) => r.status === "in-progress").length}
              </div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {requests.reduce((sum, r) => sum + r.votes, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Votes</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={step === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setStep(1)}
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            Browse Requests
          </Button>
          <Button
            variant={step === 2 ? "default" : "outline"}
            size="sm"
            onClick={() => setStep(2)}
            className="gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            Submit New
          </Button>
        </div>

        {step === 1 && (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search feature requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Request List */}
            <div className="space-y-3">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <Card
                    key={request.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Vote Button */}
                        <button
                          onClick={() => handleVote(request.id)}
                          className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors min-w-[60px]",
                            request.voted
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:bg-accent/50"
                          )}
                        >
                          <ThumbsUp
                            className={cn(
                              "h-4 w-4",
                              request.voted && "fill-primary"
                            )}
                          />
                          <span className="text-sm font-semibold">
                            {request.votes}
                          </span>
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-xs text-muted-foreground">
                              {request.id}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] px-1.5 py-0",
                                statusConfig[request.status].color
                              )}
                            >
                              {statusConfig[request.status].label}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {request.category}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-sm mb-1">
                            {request.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {request.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {request.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {request.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No feature requests found matching your criteria.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Submit a Feature Request</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fr-title">Feature Title *</Label>
                  <Input
                    id="fr-title"
                    placeholder="e.g., Add PowerPoint export for reports"
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fr-category">Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger id="fr-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => c !== "All")
                        .map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fr-description">Description *</Label>
                  <Textarea
                    id="fr-description"
                    placeholder="Describe the feature, why you need it, and how it would help your workflow..."
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <Button type="submit" className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Submit Feature Request
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
