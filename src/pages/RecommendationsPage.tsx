import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb } from "lucide-react";
import { fetchRecommendations } from "@/signalcore/engine";

export function RecommendationsPage() {
  const [sortBy, setSortBy] = useState("confidence");

  // The legacy trpc.recommendation.* contract does not exist on the deployed
  // backend. Live recommendations come from the engine's pattern.list
  // pipeline (same source as the dashboard). Save/dismiss/act actions had no
  // backend capability and have been removed rather than left as dead calls.
  const recommendations = useQuery({
    queryKey: ["engine", "recommendations"],
    queryFn: fetchRecommendations,
    retry: false,
  });

  const items = [...(recommendations.data?.data ?? [])].sort((a, b) => {
    if (sortBy === "date") return b.lastUpdated.localeCompare(a.lastUpdated);
    if (sortBy === "type") return a.category.localeCompare(b.category);
    return b.confidence - a.confidence;
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Recommendations</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 border rounded-lg bg-card">
          <div className="text-sm text-muted-foreground">Total</div>
          <div className="text-2xl font-bold">{items.length}</div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-input bg-background px-4 py-2 text-sm"
        >
          <option value="confidence">Confidence</option>
          <option value="date">Date</option>
          <option value="type">Type</option>
        </select>
      </div>

      <div className="space-y-4">
        {items.map((rec) => (
          <div key={rec.id} className="p-4 border rounded-lg bg-card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <h3 className="font-semibold">{rec.title}</h3>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                    <span>{rec.category}</span>
                    <span>Confidence: {rec.confidence}%</span>
                    {(rec.county || rec.state) && (
                      <span>{[rec.county, rec.state].filter(Boolean).join(", ")}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {!recommendations.isLoading && items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Lightbulb className="mx-auto h-12 w-12 mb-4" />
            <p>No recommendations available</p>
            <p className="text-sm">The Kestovar engine is analyzing your markets</p>
          </div>
        )}
      </div>
    </div>
  );
}
