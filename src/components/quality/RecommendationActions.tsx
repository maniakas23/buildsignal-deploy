import { useState } from 'react';
import { Zap, Target, TrendingUp, Shield, Eye, MapPin, FileText, Bell, Bookmark, Share2, ChevronDown, ChevronUp, CheckCircle2, ArrowRight } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-12: Recommendation Actions Panel
// Suggested actions with "Why this exists / matters / confident".
// ═══════════════════════════════════════════════════════════════

interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  description: string;
}

interface Props {
  opportunityName?: string;
  confidence?: number;
}

const SUGGESTED_ACTIONS: Action[] = [
  { id: 'view', label: 'View Details', icon: <Eye className="w-3.5 h-3.5" />, priority: 'high', description: 'Open full intelligence report' },
  { id: 'save', label: 'Save to Watchlist', icon: <Bookmark className="w-3.5 h-3.5" />, priority: 'high', description: 'Track this opportunity' },
  { id: 'map', label: 'View on Map', icon: <MapPin className="w-3.5 h-3.5" />, priority: 'medium', description: 'See geographic context' },
  { id: 'report', label: 'Generate Report', icon: <FileText className="w-3.5 h-3.5" />, priority: 'medium', description: 'Download PDF or CSV' },
  { id: 'alert', label: 'Set Alert', icon: <Bell className="w-3.5 h-3.5" />, priority: 'low', description: 'Get notified of changes' },
  { id: 'share', label: 'Share', icon: <Share2 className="w-3.5 h-3.5" />, priority: 'low', description: 'Send to team member' },
];

export default function RecommendationActions({ opportunityName = 'Mixed-Use Development — Downtown Corridor', confidence = 91 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const toggleAction = (id: string) => {
    setCompletedActions((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) updated.delete(id);
      else updated.add(id);
      return updated;
    });
  };

  return (
    <div className="bg-surface rounded-xl border border-ink-wash overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-canvas/30 transition-colors"
      >
        <Zap className="w-4 h-4 text-accent-indigo" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink-primary">Suggested Actions</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-indigo/10 text-accent-indigo font-medium">
              {SUGGESTED_ACTIONS.length}
            </span>
          </div>
          <p className="text-[11px] text-ink-secondary">Recommended next steps for this opportunity</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-ink-tertiary" /> : <ChevronDown className="w-4 h-4 text-ink-tertiary" />}
      </button>

      {/* Why this opportunity */}
      {!expanded && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_ACTIONS.filter((a) => a.priority === 'high').map((action) => (
              <button
                key={action.id}
                onClick={() => toggleAction(action.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  completedActions.has(action.id)
                    ? 'bg-accent-teal/10 text-accent-teal border border-accent-teal/20'
                    : 'bg-accent-indigo text-white hover:bg-accent-indigo/90'
                }`}
              >
                {completedActions.has(action.id) ? <CheckCircle2 className="w-3 h-3" /> : action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {expanded && (
        <div className="border-t border-ink-wash px-4 pb-4">
          {/* Why explanations */}
          <div className="mt-4 space-y-3">
            <WhyCard
              icon={<Target className="w-4 h-4 text-accent-indigo" />}
              title="Why this opportunity exists"
              text={`Multiple early signals detected for ${opportunityName}: permit filings, zoning changes, and utility expansion requests have been correlated across independent data sources.`}
            />
            <WhyCard
              icon={<TrendingUp className="w-4 h-4 text-accent-teal" />}
              title="Why it matters"
              text="Projects with this signal pattern typically go to market within 60-90 days. Early engagement increases win probability by 3-4x compared to RFP-stage entry."
            />
            <WhyCard
              icon={<Shield className="w-4 h-4 text-accent-amber" />}
              title="Why the system is confident"
              text={`${confidence}% confidence is based on 5 weighted factors: signal count (92), source diversity (85), historical accuracy (94), data freshness (88), and cross-provider validation (90).`}
            />
          </div>

          {/* Action buttons */}
          <div className="mt-4 pt-3 border-t border-ink-wash">
            <p className="text-[10px] text-ink-tertiary uppercase tracking-wider mb-2">Recommended Actions</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUGGESTED_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => toggleAction(action.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-colors ${
                    completedActions.has(action.id)
                      ? 'bg-accent-teal/[0.04] border-accent-teal/20'
                      : 'bg-canvas border-ink-wash hover:border-accent-indigo/20'
                  }`}
                >
                  <span className={completedActions.has(action.id) ? 'text-accent-teal' : 'text-accent-indigo'}>
                    {completedActions.has(action.id) ? <CheckCircle2 className="w-3.5 h-3.5" /> : action.icon}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-[11px] font-medium ${completedActions.has(action.id) ? 'text-accent-teal line-through' : 'text-ink-primary'}`}>
                      {action.label}
                    </p>
                    <p className="text-[9px] text-ink-tertiary truncate">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WhyCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-canvas border border-ink-wash">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-medium text-ink-primary mb-0.5">{title}</p>
        <p className="text-[11px] text-ink-secondary leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
