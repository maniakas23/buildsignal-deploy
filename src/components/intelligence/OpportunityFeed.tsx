import { useEngineListQuery } from '@/hooks/useEngine';
import { fetchRecommendations } from '@/signalcore/engine';
import type { Recommendation } from '@/signalcore/engine';

export function OpportunityFeed({ limit = 5, onSelectOpportunity }: { limit?: number; onSelectOpportunity?: (opp: Recommendation) => void }) {
  const { data } = useEngineListQuery<Recommendation>(fetchRecommendations);
  const items = (data ?? []).slice(0, limit);
  return (
    <div className="bg-surface rounded-2xl p-5 shadow-card">
      <h2 className="text-sm font-semibold text-ink-primary mb-2">Opportunity Feed</h2>
      {items.length === 0 ? (
        <p className="text-xs text-ink-secondary">Latest ranked opportunities.</p>
      ) : (
        <ul className="divide-y divide-ink-wash">
          {items.map((opp) => (
            <li key={opp.id}>
              <button
                type="button"
                onClick={() => onSelectOpportunity?.(opp)}
                className="w-full text-left py-2 hover:bg-canvas rounded-lg px-2 transition-colors"
              >
                <p className="text-sm font-medium text-ink-primary truncate">{opp.title}</p>
                <p className="text-xs text-ink-secondary">Confidence: {opp.confidence}%</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
