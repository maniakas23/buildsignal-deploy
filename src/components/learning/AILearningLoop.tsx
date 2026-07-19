import { useState } from 'react';
import {
  Brain, ThumbsUp, ThumbsDown, Eye, Bookmark, Search,
  TrendingUp, CheckCircle2, AlertTriangle, ArrowRight,
  Target, Zap, Clock, BarChart3, Lightbulb, Star,
  Activity, RefreshCw, Filter
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-21: AI Learning Loop
// Feedback mechanisms to improve recommendation quality.
// Capture saved opportunities, ignored recommendations, ratings,
// search behavior, and watchlist activity.
// ═══════════════════════════════════════════════════════════════

const FEEDBACK_METRICS = [
  { label: 'Saved Opportunities', value: '47', change: '+12 this week', icon: Bookmark, trend: 'up' as const },
  { label: 'Recommendations Rated', value: '128', change: '+34 this week', icon: Star, trend: 'up' as const },
  { label: 'Avg Rating', value: '4.6/5', change: '+0.3 vs last week', icon: ThumbsUp, trend: 'up' as const },
  { label: 'Ignored Recommendations', value: '23', change: '-8 this week', icon: ThumbsDown, trend: 'down' as const },
];

const RECOMMENDATION_FEEDBACK = [
  {
    id: 'rf-001',
    title: 'Highway 287 Corridor Expansion',
    action: 'saved',
    rating: 5,
    userNote: 'Immediately relevant to our land acquisition strategy.',
    timestamp: '2h ago',
    user: 'Sarah Chen',
    outcome: 'Contacted county planner',
  },
  {
    id: 'rf-002',
    title: 'Weld County School Campus RFP',
    action: 'saved',
    rating: 5,
    userNote: '$48M RFP — forwarded to estimating team.',
    timestamp: '3h ago',
    user: 'Marcus Johnson',
    outcome: 'Downloaded full RFP',
  },
  {
    id: 'rf-003',
    title: 'Longmont Downtown Retail Development',
    action: 'ignored',
    rating: 2,
    userNote: 'Outside our current service area.',
    timestamp: '5h ago',
    user: 'Sarah Chen',
    outcome: 'Not relevant — geographic filter',
  },
  {
    id: 'rf-004',
    title: 'Fort Collins Water Treatment Upgrade',
    action: 'rated',
    rating: 4,
    userNote: 'Good opportunity but lower priority than highway projects.',
    timestamp: '6h ago',
    user: 'Marcus Johnson',
    outcome: 'Added to watchlist',
  },
  {
    id: 'rf-005',
    title: 'Boulder Commercial Rezoning',
    action: 'saved',
    rating: 5,
    userNote: 'Exact match for our commercial development focus.',
    timestamp: '8h ago',
    user: 'Sarah Chen',
    outcome: 'Scheduled site visit',
  },
];

const BEHAVIORAL_INSIGHTS = [
  { id: 'bi-1', insight: 'Users save DOT-corridor opportunities 3.2x more than other types', confidence: 94, category: 'Preference' },
  { id: 'bi-2', insight: 'High-confidence (>90%) recommendations receive 4.8x more saves', confidence: 91, category: 'Quality' },
  { id: 'bi-3', insight: 'Opportunities with executive summaries get 2.1x more engagement', confidence: 88, category: 'Format' },
  { id: 'bi-4', insight: 'Users act within 48h on 78% of high-urgency alerts', confidence: 85, category: 'Urgency' },
  { id: 'bi-5', insight: 'Larimer County opportunities have highest save-to-action ratio', confidence: 82, category: 'Geographic' },
];

const IMPROVEMENTS_APPLIED = [
  { id: 'imp-1', change: 'Prioritized DOT-corridor opportunities in Today\'s dashboard', impact: '+24% engagement', date: 'Jul 20' },
  { id: 'imp-2', change: 'Elevated executive summaries above fold', impact: '+18% saves', date: 'Jul 18' },
  { id: 'imp-3', change: 'Added urgency scoring to recommendation ranking', impact: '+31% action rate', date: 'Jul 15' },
  { id: 'imp-4', change: 'Enhanced confidence badges for >90% recommendations', impact: '+12% trust signals', date: 'Jul 12' },
];

function ActionBadge({ action }: { action: string }) {
  const colors: Record<string, string> = {
    saved: 'bg-emerald-50 text-emerald-700',
    ignored: 'bg-ink-wash text-ink-tertiary',
    rated: 'bg-accent-indigo/10 text-accent-indigo',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors[action] || colors.rated}`}>
      {action.toUpperCase()}
    </span>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3 h-3 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-ink-wash'}`} />
      ))}
    </div>
  );
}

export default function AILearningLoop() {
  const [activeTab, setActiveTab] = useState<'feedback' | 'insights' | 'improvements'>('feedback');

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FEEDBACK_METRICS.map((m) => (
          <div key={m.label} className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
            <m.icon className="w-5 h-5 text-accent-indigo mx-auto mb-1" />
            <div className="text-xl font-bold text-ink-primary">{m.value}</div>
            <div className="text-[10px] text-ink-tertiary">{m.label}</div>
            <div className={`text-[9px] font-medium ${m.trend === 'up' ? 'text-emerald-600' : 'text-accent-crimson'}`}>
              {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-canvas border border-ink-wash rounded-xl w-fit">
        {([
          { id: 'feedback' as const, label: 'User Feedback', icon: Star },
          { id: 'insights' as const, label: 'Behavioral Insights', icon: Brain },
          { id: 'improvements' as const, label: 'Improvements Applied', icon: TrendingUp },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              activeTab === t.id ? 'bg-accent-indigo text-white' : 'text-ink-secondary hover:bg-surface'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* USER FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="space-y-3">
          {RECOMMENDATION_FEEDBACK.map((rf) => (
            <div key={rf.id} className="bg-surface border border-ink-wash rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ActionBadge action={rf.action} />
                  <RatingStars rating={rf.rating} />
                </div>
                <span className="text-[9px] text-ink-tertiary">{rf.timestamp}</span>
              </div>

              <h4 className="text-sm font-bold text-ink-primary mb-1">{rf.title}</h4>
              <p className="text-[11px] text-ink-secondary italic mb-2">"{rf.userNote}"</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-ink-tertiary">{rf.user}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] text-emerald-600 font-medium">{rf.outcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BEHAVIORAL INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <Brain className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-semibold text-amber-800">How This Works</p>
              <p className="text-[10px] text-amber-700 leading-relaxed">
                BuildSignal captures aggregate behavioral signals — saves, ratings, search patterns, and watchlist activity —
                to improve recommendation quality. All insights are anonymous and used only to enhance relevance.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {BEHAVIORAL_INSIGHTS.map((bi) => (
              <div key={bi.id} className="bg-surface border border-ink-wash rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full">
                      {bi.category}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${bi.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {bi.confidence}% confidence
                    </span>
                  </div>
                </div>
                <p className="text-[12px] font-medium text-ink-primary">{bi.insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IMPROVEMENTS APPLIED */}
      {activeTab === 'improvements' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-semibold text-emerald-800">Continuous Improvement</p>
              <p className="text-[10px] text-emerald-700 leading-relaxed">
                BuildSignal applies insights from user feedback to continuously improve recommendation quality,
                ranking, and presentation. Every change is measured for impact.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {IMPROVEMENTS_APPLIED.map((imp) => (
              <div key={imp.id} className="bg-surface border border-ink-wash rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-ink-tertiary">{imp.date}</span>
                  <span className="text-[10px] font-bold text-emerald-600">{imp.impact}</span>
                </div>
                <p className="text-[12px] font-medium text-ink-primary">{imp.change}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
