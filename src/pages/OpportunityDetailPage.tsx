import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileSearch } from "lucide-react";

export function OpportunityDetailPage() {
  const { sequenceId } = useParams<{ sequenceId: string }>();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <button
        onClick={() => navigate("/opportunities")}
        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm hover:bg-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to opportunities
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Opportunity detail</h1>
        {sequenceId && (
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            Reference: {sequenceId}
          </p>
        )}
      </div>

      <div className="p-6 border rounded-lg bg-card text-center">
        <FileSearch className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
        <p className="font-medium">Detailed opportunity view is not yet available</p>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Per-opportunity drill-down is pending the pipeline data feed. The
          opportunity portfolio on the dashboard reflects current live summary
          data; this detail view will follow once individual opportunity
          records are exposed by the API.
        </p>
      </div>
    </div>
  );
}
