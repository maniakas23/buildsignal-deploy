import { useState } from "react";
import { BarChart3, TrendingUp, Building2, MapPin } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { LoadingState } from "@/components/ui-custom/EngineStates";

const REGIONS = [
  { name: "Wake County, NC", signals: 1247, opportunities: 18, growth: 12.4 },
  { name: "Mecklenburg County, NC", signals: 892, opportunities: 12, growth: 8.7 },
  { name: "Durham County, NC", signals: 456, opportunities: 7, growth: 15.2 },
  { name: "Chatham County, NC", signals: 252, opportunities: 5, growth: 22.1 },
];

export default function MarketInsightsPage() {
  const { summary, loading } = useAnalytics();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  if (loading) return <LoadingState message="Loading market insights..." submessage="Kestovar is aggregating regional data" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-accent-indigo" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-ink-primary">Market Insights</h1>
          <p className="text-xs text-ink-tertiary">Regional construction intelligence from Kestovar</p>
        </div>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-surface border border-ink-wash rounded-xl p-3">
            <p className="text-[10px] text-ink-tertiary uppercase tracking-wider">Total Signals</p>
            <p className="text-lg font-semibold text-ink-primary">{summary.total_signals.toLocaleString()}</p>
          </div>
          <div className="bg-surface border border-ink-wash rounded-xl p-3">
            <p className="text-[10px] text-ink-tertiary uppercase tracking-wider">Opportunities</p>
            <p className="text-lg font-semibold text-ink-primary">{summary.total_opportunities}</p>
          </div>
          <div className="bg-surface border border-ink-wash rounded-xl p-3">
            <p className="text-[10px] text-ink-tertiary uppercase tracking-wider">Avg Confidence</p>
            <p className="text-lg font-semibold text-accent-teal">{summary.avg_confidence}%</p>
          </div>
        </div>
      )}

      {/* Regional breakdown */}
      <h2 className="text-sm font-semibold text-ink-primary mb-3">Regional Breakdown</h2>
      <div className="space-y-3">
        {REGIONS.map((region) => (
          <button
            key={region.name}
            onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
            className="w-full text-left bg-surface border border-ink-wash rounded-xl p-4 hover:border-accent-indigo/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-accent-indigo" />
                <span className="text-sm font-medium text-ink-primary">{region.name}</span>
              </div>
              <div className="flex items-center gap-1 text-accent-teal">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">+{region.growth}%</span>
              </div>
            </div>
            {selectedRegion === region.name && (
              <div className="mt-3 pt-3 border-t border-ink-wash/50 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] text-ink-tertiary">Signals</p>
                  <p className="text-sm font-semibold text-ink-primary">{region.signals}</p>
                </div>
                <div>
                  <p className="text-[10px] text-ink-tertiary">Opportunities</p>
                  <p className="text-sm font-semibold text-ink-primary">{region.opportunities}</p>
                </div>
                <div>
                  <p className="text-[10px] text-ink-tertiary">Growth</p>
                  <p className="text-sm font-semibold text-accent-teal">+{region.growth}%</p>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
