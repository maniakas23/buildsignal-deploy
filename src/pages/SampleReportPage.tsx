import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/providers/trpc";
import {
  ArrowLeft,
  Download,
  FileText,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";

interface ReportSection {
  title: string;
  content: string;
  type: "text" | "chart" | "table" | "summary";
}

interface Report {
  id: string;
  title: string;
  county: string;
  state: string;
  generatedAt: string;
  sections: ReportSection[];
  status: "generating" | "ready" | "error";
}

export default function SampleReportPage() {
  const navigate = useNavigate();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: reports, isLoading } = trpc.report.list.useQuery();

  const handleDownload = async (reportId: string) => {
    setDownloadingId(reportId);
    // Simulate download
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setDownloadingId(null);
  };

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
            <h1 className="text-2xl font-bold text-[var(--bs-text-primary)]">Sample Reports</h1>
            <p className="text-sm text-[var(--bs-text-tertiary)]">
              Preview and download generated reports
            </p>
          </div>
        </div>

        {/* Reports List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
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
        ) : reports && reports.length > 0 ? (
          <div className="space-y-3">
            {reports.map((report: Report) => (
              <Card
                key={report.id}
                className="bg-[var(--bs-surface)] border-[var(--bs-border)] hover:border-[var(--bs-action)]/30 transition-all"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bs-action)]/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[var(--bs-action)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-[var(--bs-text-primary)]">
                          {report.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            report.status === "ready"
                              ? "text-[var(--bs-intelligence)] border-[var(--bs-intelligence)]/20"
                              : report.status === "generating"
                              ? "text-[var(--bs-action)] border-[var(--bs-action)]/20"
                              : "text-red-400 border-red-500/20"
                          }`}
                        >
                          {report.status === "ready" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {report.status === "generating" && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                          {report.status === "error" && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--bs-text-secondary)] mb-2">
                        {report.county}, {report.state}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--bs-text-tertiary)]">
                          Generated {format(new Date(report.generatedAt), "MMM d, yyyy")}
                        </span>
                        {report.status === "ready" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(report.id)}
                            disabled={downloadingId === report.id}
                            className="gap-2 border-[var(--bs-border)] text-[var(--bs-text-primary)] hover:bg-[var(--bs-surface-hover)]"
                          >
                            {downloadingId === report.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Download className="h-3.5 w-3.5" />
                            )}
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bs-surface)] flex items-center justify-center">
              <FileText className="w-7 h-7 text-[var(--bs-text-tertiary)]" />
            </div>
            <p className="text-lg font-medium text-[var(--bs-text-primary)] mb-2">
              No reports yet
            </p>
            <p className="text-sm text-[var(--bs-text-tertiary)]">
              Reports will appear here once they are generated
            </p>
          </div>
        )}
      </div>
    </div>
  );
}