import { useState } from "react";
import { TrendingUp, Filter, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { useKestovarData } from "@/kestovar/engine";
import { LoadingState, ErrorState } from "@/components/ui-custom/EngineStates";

export default function GrowthSignalsPage() {
  const { patterns, loading, error } = useKestovarData();
  const [filter, setFilter] = useState("all");

  if (loading) return <LoadingState message="Loading growth patterns..." submessage="Kestovar is analyzing trend data" />;
  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;

  const filtered = filter === "all" ? patterns : patterns.filter((p) => p.sectors?.includes(filter));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent-indigo" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-ink-primary">Growth Patterns</h1>
            <p className="text-xs text-ink-tertiary">{patterns.length} patterns detected by Kestovar</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((pattern) => {
          const TrendIcon = pattern.trend === "up" ? ArrowUpRight : pattern.trend === "down" ? ArrowDownRight : Minus;
          const trendColor = pattern.trend === "up" ? "text-accent-teal" : pattern.trend === "down" ? "text-accent-crimson" : "text-ink-tertiary";
          return (
            <div key={pattern.id} className="bg-surface border border-ink-wash rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-ink-primary">{pattern.name}</h3>
                  <p className="text-xs text-ink-secondary mt-1">{pattern.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[11px] text-ink-tertiary">{pattern.confidence}% confidence</span>
                    <span className="text-[11px] text-ink-tertiary">{pattern.evidence} signals</span>
                    <span className="text-[11px] text-ink-tertiary">{pattern.historicalAccuracy * 100}% historical accuracy</span>
                  </div>
                </div>
                <TrendIcon className={`w-5 h-5 ${trendColor}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
