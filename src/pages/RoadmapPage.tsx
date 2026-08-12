import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/providers/trpc";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Search,
  Send,
  ThumbsUp,
  User,
  Loader2,
  AlertTriangle,
  Plus,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

interface RoadmapItem {
  id: number;
  title: string;
  description: string;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  category: string;
  votes: number;
  votedByMe: boolean;
  createdAt: string;
  eta: string | null;
  progress: number;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  planned: {
    label: "Planned",
    color: "text-[var(--bs-text-tertiary)]",
    bg: "bg-[var(--bs-text-tertiary)]/10",
    icon: <Calendar className="w-3.5 h-3.5" />,
  },
  in_progress: {
    label: "In Progress",
    color: "text-[var(--bs-action)]",
    bg: "bg-[var(--bs-action)]/10",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  completed: {
    label: "Completed",
    color: "text-[var(--bs-intelligence)]",
    bg: "bg-[var(--bs-intelligence)]/10",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-[var(--bs-text-tertiary)]",
    bg: "bg-[var(--bs-text-tertiary)]/10",
    icon: <X className="w-3.5 h-3.5" />,
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.planned;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${config.bg} ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

function RoadmapCard({
  item,
  onVote,
}: {
  item: RoadmapItem;
  onVote: (id: number) => void;
}) {
  const status = statusConfig[item.status] || statusConfig.planned;
  const { user } = useAuth();
  const canVote = !!user;

  return (
    <Card className="bg-[var(--bs-surface)] border-[var(--bs-border)] hover:border-[var(--bs-action)]/30 transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Vote Button */}
          <button
            onClick={() => canVote && onVote(item.id)}
            disabled={!canVote}
            className={`flex flex-col items-center gap-1 min-w-[48px] ${
              item.votedByMe
                ? "text-[var(--bs-action)]"
                : "text-[var(--bs-text-tertiary)]"
            } ${!canVote ? "opacity-50 cursor-not-allowed" : "hover:text-[var(--bs-action)]"}`}
          >
            <ThumbsUp className={`w-5 h-5 ${item.votedByMe ? "fill-current" : ""}`} />
            <span className="text-sm font-medium">{item.votes}</span>
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <StatusBadge status={item.status} />
              <Badge variant="outline" className="text-[10px] bg-[var(--bs-canvas)] text-[var(--bs-text-tertiary)] border-[var(--bs-border)]">
                {item.category}
              </Badge>
            </div>
            <h3 className="text-base font-semibold text-[var(--bs-text-primary)] mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-[var(--bs-text-secondary)] leading-relaxed mb-3">
              {item.description}
            </p>
            {item.progress > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[var(--bs-text-tertiary)]">Progress</span>
                  <span className="text-[var(--bs-action)] font-medium">{item.progress}%</span>
                </div>
                <div className="h-1.5 bg-[var(--bs-surface-hover)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--bs-action)] rounded-full transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 text-xs text-[var(--bs-text-tertiary)]">
              {item.eta && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  ETA: {item.eta}
                </span>
              )}
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {format(new Date(item.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RoadmapPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    title: "",
    description: "",
    category: "feature",
  });

  const { data: items, isLoading } = trpc.roadmap.list.useQuery();
  const voteMutation = trpc.roadmap.vote.useMutation({
    onSuccess: () => {
      utils.roadmap.list.invalidate();
    },
  });
  const submitMutation = trpc.roadmap.submit.useMutation({
    onSuccess: () => {
      setIsSubmitOpen(false);
      setSubmitForm({ title: "", description: "", category: "feature" });
      utils.roadmap.list.invalidate();
    },
  });
  const utils = trpc.useUtils();

  const categories = Array.from(new Set(items?.map((i) => i.category) ?? []));

  const filteredItems = items?.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleVote = (id: number) => {
    voteMutation.mutate({ id });
  };

  const handleSubmit = () => {
    if (!submitForm.title.trim() || !submitForm.description.trim()) return;
    submitMutation.mutate(submitForm);
  };

  return (
    <div className="min-h-screen bg-[var(--bs-canvas)]">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="gap-2 text-[var(--bs-text-primary)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[var(--bs-text-primary)]">Product Roadmap</h1>
              <p className="text-sm text-[var(--bs-text-tertiary)]">
                See what&apos;s coming next and vote on features
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsSubmitOpen(true)}
            className="gap-2 bg-[var(--bs-action)] hover:bg-[var(--bs-action)]/90"
          >
            <Plus className="h-4 w-4" />
            Request Feature
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--bs-text-tertiary)]" />
            <Input
              placeholder="Search roadmap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[var(--bs-surface)] border-[var(--bs-border)] text-[var(--bs-text-primary)]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] bg-[var(--bs-surface)] border-[var(--bs-border)]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[var(--bs-surface)] border-[var(--bs-border)]">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] bg-[var(--bs-surface)] border-[var(--bs-border)]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-[var(--bs-surface)] border-[var(--bs-border)]">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: items?.length ?? 0, color: "text-[var(--bs-text-primary)]" },
            { label: "Planned", value: items?.filter((i) => i.status === "planned").length ?? 0, color: "text-[var(--bs-text-tertiary)]" },
            { label: "In Progress", value: items?.filter((i) => i.status === "in_progress").length ?? 0, color: "text-[var(--bs-action)]" },
            { label: "Completed", value: items?.filter((i) => i.status === "completed").length ?? 0, color: "text-[var(--bs-intelligence)]" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-[var(--bs-surface)] border-[var(--bs-border)]">
              <CardContent className="p-3">
                <p className="text-xs text-[var(--bs-text-tertiary)] uppercase tracking-wider">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.color}`}>{isLoading ? "—" : stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Items */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="bg-[var(--bs-surface)] border-[var(--bs-border)]">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[var(--bs-surface-hover)] animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 bg-[var(--bs-surface-hover)] rounded animate-pulse" />
                      <div className="h-3 w-3/4 bg-[var(--bs-surface-hover)] rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-[var(--bs-surface-hover)] rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems && filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <RoadmapCard key={item.id} item={item as RoadmapItem} onVote={handleVote} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bs-surface)] flex items-center justify-center">
              <Search className="w-7 h-7 text-[var(--bs-text-tertiary)]" />
            </div>
            <p className="text-lg font-medium text-[var(--bs-text-primary)] mb-2">
              No items found
            </p>
            <p className="text-sm text-[var(--bs-text-tertiary)]">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>

      {/* Submit Dialog */}
      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent className="bg-[var(--bs-surface)] border-[var(--bs-border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--bs-text-primary)]">Request a Feature</DialogTitle>
            <DialogDescription className="text-[var(--bs-text-tertiary)]">
              Submit your idea for the BuildSignal roadmap
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--bs-text-primary)]">Title</label>
              <Input
                placeholder="Short, clear title"
                value={submitForm.title}
                onChange={(e) => setSubmitForm((s) => ({ ...s, title: e.target.value }))}
                className="bg-[var(--bs-canvas)] border-[var(--bs-border)] text-[var(--bs-text-primary)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--bs-text-primary)]">Category</label>
              <Select
                value={submitForm.category}
                onValueChange={(v) => setSubmitForm((s) => ({ ...s, category: v }))}
              >
                <SelectTrigger className="bg-[var(--bs-canvas)] border-[var(--bs-border)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--bs-surface)] border-[var(--bs-border)]">
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="improvement">Improvement</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                  <SelectItem value="bug">Bug Fix</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--bs-text-primary)]">Description</label>
              <Textarea
                placeholder="Describe the feature and why it would be useful..."
                value={submitForm.description}
                onChange={(e) => setSubmitForm((s) => ({ ...s, description: e.target.value }))}
                className="bg-[var(--bs-canvas)] border-[var(--bs-border)] text-[var(--bs-text-primary)] min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSubmitOpen(false)}
              className="border-[var(--bs-border)] text-[var(--bs-text-primary)]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending || !submitForm.title.trim() || !submitForm.description.trim()}
              className="gap-2 bg-[var(--bs-action)] hover:bg-[var(--bs-action)]/90"
            >
              {submitMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}