import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/providers/trpc";
import {
  ArrowLeft,
  Mail,
  Send,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { format } from "date-fns";

interface EmailPreview {
  id: string;
  subject: string;
  preview: string;
  type: string;
  status: "draft" | "sent" | "scheduled";
  sentAt: string | null;
  opens: number;
  clicks: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", color: "text-[var(--bs-text-tertiary)]", icon: <EyeOff className="w-3.5 h-3.5" /> },
  sent: { label: "Sent", color: "text-[var(--bs-intelligence)]", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  scheduled: { label: "Scheduled", color: "text-[var(--bs-action)]", icon: <Clock className="w-3.5 h-3.5" /> },
};

export default function EmailPreviewPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: emails, isLoading } = trpc.email.list.useQuery();

  const filteredEmails = emails?.filter(
    (email) =>
      !searchQuery ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold text-[var(--bs-text-primary)]">Email Previews</h1>
            <p className="text-sm text-[var(--bs-text-tertiary)]">
              Preview and manage email campaigns
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--bs-text-tertiary)]" />
          <Input
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[var(--bs-surface)] border-[var(--bs-border)] text-[var(--bs-text-primary)]"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total", value: emails?.length ?? 0 },
            { label: "Sent", value: emails?.filter((e) => e.status === "sent").length ?? 0 },
            { label: "Drafts", value: emails?.filter((e) => e.status === "draft").length ?? 0 },
          ].map((stat) => (
            <Card key={stat.label} className="bg-[var(--bs-surface)] border-[var(--bs-border)]">
              <CardContent className="p-3">
                <p className="text-xs text-[var(--bs-text-tertiary)] uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-[var(--bs-text-primary)]">
                  {isLoading ? "—" : stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Email List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="bg-[var(--bs-surface)] border-[var(--bs-border)]">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bs-surface-hover)] animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 bg-[var(--bs-surface-hover)] rounded animate-pulse" />
                      <div className="h-3 w-3/4 bg-[var(--bs-surface-hover)] rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEmails && filteredEmails.length > 0 ? (
          <div className="space-y-3">
            {filteredEmails.map((email) => {
              const status = statusConfig[email.status] || statusConfig.draft;
              return (
                <Card
                  key={email.id}
                  className="bg-[var(--bs-surface)] border-[var(--bs-border)] hover:border-[var(--bs-action)]/30 transition-all cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${status.color.replace("text-", "bg-")}/10`}>
                        {status.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-[var(--bs-text-primary)] truncate">
                            {email.subject}
                          </h3>
                          <Badge variant="outline" className={`text-[10px] ${status.color} border-current`}>
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-[var(--bs-text-secondary)] line-clamp-2 mb-2">
                          {email.preview}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-[var(--bs-text-tertiary)]">
                          {email.sentAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(email.sentAt), "MMM d, yyyy")}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {email.opens} opens
                          </span>
                          <span className="flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            {email.clicks} clicks
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bs-surface)] flex items-center justify-center">
              <Mail className="w-7 h-7 text-[var(--bs-text-tertiary)]" />
            </div>
            <p className="text-lg font-medium text-[var(--bs-text-primary)] mb-2">
              No emails found
            </p>
            <p className="text-sm text-[var(--bs-text-tertiary)]">
              {searchQuery ? "Try adjusting your search" : "Emails will appear here once campaigns are created"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}