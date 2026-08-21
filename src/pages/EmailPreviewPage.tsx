import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";

export default function EmailPreviewPage() {
  const navigate = useNavigate();
  // NOTE: There is currently no backend capability that returns email campaign
  // previews (the legacy `email.list` procedure no longer returns messages).
  // Render a truthful unavailable state instead of querying a stale contract.
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

        {/* Truthful unavailable state — no fabricated email records */}
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bs-surface)] flex items-center justify-center">
            <Mail className="w-7 h-7 text-[var(--bs-text-tertiary)]" />
          </div>
          <p className="text-lg font-medium text-[var(--bs-text-primary)] mb-2">
            Email previews aren&apos;t available yet
          </p>
          <p className="text-sm text-[var(--bs-text-tertiary)]">
            This capability is not part of the current release.
          </p>
        </div>
      </div>
    </div>
  );
}
