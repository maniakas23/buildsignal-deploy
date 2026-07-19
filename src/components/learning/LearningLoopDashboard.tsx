import { useState, useEffect } from 'react';
import {
  TrendingUp, ThumbsUp, ThumbsDown, Bookmark, XCircle, Eye,
  BarChart3, Target, Zap, RotateCcw, CheckCircle2, AlertTriangle,
  MessageSquare, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-13: SignalCore Learning Loop Dashboard
// Aggregated feedback insights showing what the system has learned
// from user interactions to improve recommendation quality.
// ═══════════════════════════════════════════════════════════════

interface FeedbackMetric {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

interface TrendingTopic {
  topic: string;
  engagements: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  trend: 'up' | 'down' | 'flat';
}

interface LearningInsight {
  id: string;
  type: 'pattern' | 'improvement' | 'alert';
  message: string;
  detail: string;
  confidence: number;
}

const FEEDBACK_METRICS: FeedbackMetric[] = [
  { label: 'Helpful Votes', value: '1,247', change: 12, icon: <ThumbsUp className="w-4 h-4 text-accent-teal" /> },
  { label: 'Not Helpful', value: '89', change: -3, icon: <ThumbsDown className="w-4 h-4 text-accent-crimson" /> },
  { label: 'Saved', value: '342', change: 8, icon: <Bookmark className="w-4 h-4 text-accent-indigo" /> },
  { label: 'Dismissed', value: '156', change: -5, icon: <XCircle className="w-4 h-4 text-accent-amber" /> },
  { label: 'Views', value: '8,421', change: 23, icon: <Eye className="w-4 h-4 text-ink-secondary" /> },
  { label: 'Feedback Rate', value: '18.4%', change: 4, icon: <MessageSquare className="w-4 h-4 text-accent-teal" /> },
];

const TRENDING_TOPICS: TrendingTopic[] = [
  { topic: 'Mixed-Use Development', engagements: 234, sentiment: 'positive', trend: 'up' },
  { topic: 'Highway Infrastructure', engagements: 189, sentiment: 'positive', trend: 'up' },
  { topic: 'Utility Modernization', engagements: 156, sentiment: 'neutral', trend: 'flat' },
  { topic: 'School Construction', engagements: 134, sentiment: 'positive', trend: 'up' },
  { topic: 'Zoning Changes', engagements: 98, sentiment: 'negative', trend: 'down' },
  { topic: 'Retail Development', engagements: 87, sentiment: 'neutral', trend: 'flat' },
];

const LEARNING_INSIGHTS: LearningInsight[] = [
  { id: 'l1', type: 'pattern', message: 'Users save opportunities with 90%+ confidence 4x more often', detail: 'Recommendations with confidence >= 90% have 4.2x higher save rate. Consider weighting confidence more heavily in ranking.', confidence: 94 },
  { id: 'l2', type: 'improvement', message: 'Permit signal accuracy improved to 96.2%', detail: 'Cross-validation against actual project outcomes shows permit-based signals are now the most accurate predictor type.', confidence: 96 },
  { id: 'l3', type: 'pattern', message: 'Geographic proximity strongly correlates with engagement', detail: 'Opportunities within 50 miles of user location receive 3.1x more views and 2.7x more saves.', confidence: 91 },
  { id: 'l4', type: 'alert', message: 'Dismissal rate elevated for Federal Registry signals', detail: 'Federal Registry data has 2.3x higher dismissal rate. Freshness is 22+ hours vs <4 hour target.', confidence: 88 },
  { id: 'l5', type: 'improvement', message: 'Cross-provider validation now covers 94% of signals', detail: 'Up from 87% last week. Signals validated by 2+ independent sources have 12% higher helpfulness rating.', confidence: 95 },
  { id: 'l6', type: 'pattern', message: 'Users engage most with "Why it matters" explanations', detail: 'Recommendations showing the "Why it matters" card have 1.8x longer view time and 2.1x higher helpful vote rate.', confidence: 92 },
];

function ChangeIndicator({ change }: { change: number }) {
  if (change > 0) return <span className="flex items-center gap-0.5 text-[10px] text-accent-teal"><ArrowUpRight className="w-3 h-3" />+{change}%</span>;
  if (change < 0) return <span className="flex items-center gap-0.5 text-[10px] text-accent-crimson"><ArrowDownRight className="w-3 h-3" />{change}%</span>;
  return <span className="flex items-center gap-0.5 text-[10px] text-ink-tertiary"><Minus className="w-3 h-3" />0%</span>;
}

function SentimentBadge({ sentiment }: { sentiment: TrendingTopic['sentiment'] }) {
  const styles = {
    positive: 'bg-accent-teal/10 text-accent-teal',
    neutral: 'bg-ink-wash text-ink-tertiary',
    negative: 'bg-accent-crimson/10 text-accent-crimson',
  };
  return <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${styles[sentiment]}`}>{sentiment}</span>;
}

function TrendIcon({ trend }: { trend: TrendingTopic['trend'] }) {
  if (trend === 'up') return <ArrowUpRight className="w-3.5 h-3.5 text-accent-teal" />;
  if (trend === 'down') return <ArrowDownRight className="w-3.5 h-3.5 text-accent-crimson" />;
  return <Minus className="w-3.5 h-3.5 text-ink-tertiary" />;
}

export default function LearningLoopDashboard() {
  const [insights, setInsights] = useState(LEARNING_INSIGHTS);
  const [dismissedInsightIds, setDismissedInsightIds] = useState<Set<string>>(new Set());

  const dismissInsight = (id: string) => {
    setDismissedInsightIds((prev) => new Set(prev).add(id));
  };

  const visibleInsights = insights.filter((i) => !dismissedInsightIds.has(i.id));

  const helpfulRate = 1247 / (1247 + 89);
  const saveRate = 342 / 8421;

  return (
    <div className="space-y-6">
      {/* Feedback Metrics */}
      <div className="bg-surface rounded-xl p-5 border border-ink-wash">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-accent-indigo" />
          <h3 className="text-sm font-semibold text-ink-primary">Feedback Overview</h3>
          <span className="text-[10px] text-ink-tertiary ml-auto">Last 30 days</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FEEDBACK_METRICS.map((m) => (
            <div key={m.label} className="p-3 rounded-lg bg-canvas border border-ink-wash">
              <div className="flex items-center gap-1.5 mb-2">
                {m.icon}
                <span className="text-[10px] text-ink-tertiary">{m.label}</span>
              </div>
              <p className="text-lg font-semibold text-ink-primary font-mono">{m.value}</p>
              <ChangeIndicator change={m.change} />
            </div>
          ))}
        </div>
      </div>

      {/* Quality Rates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface rounded-xl p-4 border border-ink-wash">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-secondary">Helpfulness Rate</span>
            <span className="text-sm font-semibold text-accent-teal font-mono">{(helpfulRate * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2.5 bg-canvas rounded-full overflow-hidden">
            <div className="h-full bg-accent-teal rounded-full" style={{ width: `${helpfulRate * 100}%` }} />
          </div>
          <p className="text-[10px] text-ink-tertiary mt-1">Target: 90%+</p>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-ink-wash">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-secondary">Save Rate</span>
            <span className="text-sm font-semibold text-accent-indigo font-mono">{(saveRate * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2.5 bg-canvas rounded-full overflow-hidden">
            <div className="h-full bg-accent-indigo rounded-full" style={{ width: `${saveRate * 100}%` }} />
          </div>
          <p className="text-[10px] text-ink-tertiary mt-1">Target: 3%+</p>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-surface rounded-xl p-5 border border-ink-wash">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-accent-teal" />
          <h3 className="text-sm font-semibold text-ink-primary">Trending Topics</h3>
          <span className="text-[10px] text-ink-tertiary ml-auto">By engagement</span>
        </div>
        <div className="space-y-2">
          {TRENDING_TOPICS.map((t, i) => (
            <div key={t.topic} className="flex items-center gap-3 p-2.5 rounded-lg bg-canvas hover:bg-canvas/80 transition-colors">
              <span className="text-[10px] font-mono text-ink-tertiary w-4">{i + 1}</span>
              <span className="flex-1 text-xs font-medium text-ink-primary">{t.topic}</span>
              <SentimentBadge sentiment={t.sentiment} />
              <span className="text-[11px] font-mono text-ink-secondary w-16 text-right">{t.engagements}</span>
              <TrendIcon trend={t.trend} />
            </div>
          ))}
        </div>
      </div>

      {/* Learning Insights */}
      <div className="bg-surface rounded-xl p-5 border border-ink-wash">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-accent-amber" />
          <h3 className="text-sm font-semibold text-ink-primary">Learning Insights</h3>
          <span className="text-[10px] text-ink-tertiary ml-auto">{visibleInsights.length} active</span>
        </div>
        <div className="space-y-3">
          {visibleInsights.map((insight) => (
            <div key={insight.id} className="flex items-start gap-3 p-3 rounded-lg bg-canvas border border-ink-wash">
              <div className="mt-0.5 flex-shrink-0">
                {insight.type === 'pattern' && <Target className="w-4 h-4 text-accent-indigo" />}
                {insight.type === 'improvement' && <CheckCircle2 className="w-4 h-4 text-accent-teal" />}
                {insight.type === 'alert' && <AlertTriangle className="w-4 h-4 text-accent-amber" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-ink-primary">{insight.message}</p>
                <p className="text-[11px] text-ink-secondary leading-relaxed mt-0.5">{insight.detail}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-ink-tertiary">Confidence: {insight.confidence}%</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    insight.type === 'pattern' ? 'bg-accent-indigo/10 text-accent-indigo' :
                    insight.type === 'improvement' ? 'bg-accent-teal/10 text-accent-teal' :
                    'bg-accent-amber/10 text-accent-amber'
                  }`}>
                    {insight.type}
                  </span>
                </div>
              </div>
              <button onClick={() => dismissInsight(insight.id)} className="flex-shrink-0 p-1 rounded hover:bg-ink-wash transition-colors">
                <XCircle className="w-3.5 h-3.5 text-ink-tertiary" />
              </button>
            </div>
          ))}
          {visibleInsights.length === 0 && (
            <div className="text-center py-6 text-ink-tertiary text-sm">All insights reviewed. The system is learning.</div>
          )}
        </div>
      </div>
    </div>
  );
}
