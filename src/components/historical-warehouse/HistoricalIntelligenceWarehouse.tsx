import { useState } from 'react';
import {
  History, TrendingUp, Calendar, BarChart3, Target,
  CheckCircle2, AlertTriangle, ArrowRight, Clock,
  Layers, Zap, Eye, Activity, Star, ChevronDown, ChevronUp
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-25: Historical Intelligence Warehouse
// Compare today's activity to previous years.
// Identify recurring development patterns.
// Review historical infrastructure timelines.
// Measure AI recommendation accuracy over time.
// ═══════════════════════════════════════════════════════════════

const YEAR_OVER_YEAR = [
  { metric: 'Signals Detected', current: '11,810', prevYear: '8,420', twoYearsAgo: '5,930', change: '+40%', trend: 'up' },
  { metric: 'Opportunities Qualified', current: '1,247', prevYear: '892', twoYearsAgo: '534', change: '+40%', trend: 'up' },
  { metric: 'Avg Confidence Score', current: '87%', prevYear: '79%', twoYearsAgo: '68%', change: '+8pp', trend: 'up' },
  { metric: 'Customer Actions Taken', current: '3,891', prevYear: '2,456', twoYearsAgo: '1,234', change: '+58%', trend: 'up' },
  { metric: 'Accuracy Rate', current: '91%', prevYear: '86%', twoYearsAgo: '72%', change: '+5pp', trend: 'up' },
  { metric: 'Signal Sources', current: '10', prevYear: '7', twoYearsAgo: '4', change: '+3', trend: 'up' },
];

const RECURRING_PATTERNS = [
  {
    id: 'rp1',
    name: 'DOT Corridor Expansion Cycle',
    description: 'Highway expansion projects follow a predictable 3-4 year cycle: planning → funding → permits → construction.',
    occurrences: [
      { year: '2021', project: 'Highway 14, Fort Collins', outcome: '+22% land appreciation' },
      { year: '2023', project: 'Highway 34, Greeley', outcome: '+34% appreciation, 18 developments' },
      { year: '2024', project: 'I-25 Frontage, Loveland', outcome: '+28% appreciation, 12 projects' },
      { year: '2026', project: 'Highway 287, Larimer', outcome: 'In progress — 94% confidence' },
    ],
    insight: 'Early land acquisition 60+ days before DOT public announcement consistently produces 25-40% returns.',
  },
  {
    id: 'rp2',
    name: 'School District Capital Program',
    description: 'School districts issue RFPs in 2-3 year cycles aligned with bond measure approvals.',
    occurrences: [
      { year: '2022', project: 'WCSD Previous Campus', outcome: '$52M award to regional JV' },
      { year: '2023', project: 'Thompson SD Campus', outcome: '$38M, 14 subcontractors' },
      { year: '2026', project: 'Weld County K-8 RFP', outcome: 'Active — $48M, 91% confidence' },
    ],
    insight: 'Pre-bid meeting attendance and early bonding verification increase win probability by 25-40%.',
  },
  {
    id: 'rp3',
    name: 'Utility Grid Modernization Wave',
    description: 'Utility upgrades cluster in 18-month waves driven by grid modernization funding.',
    occurrences: [
      { year: '2023', project: 'Xcel Phase 1 Upgrades', outcome: '$18M completed' },
      { year: '2025', project: 'Xcel Phase 2 Expansion', outcome: '$22M completed' },
      { year: '2026', project: 'Xcel Substation Upgrade', outcome: 'Active — $22M, 89% confidence' },
    ],
    insight: 'Utility relocation notices are the earliest signal, typically preceding DOT filings by 45 days.',
  },
];

const AI_ACCURACY_HISTORY = [
  { quarter: 'Q1 2024', accuracy: 78, confidence: 72, predictions: 234, correct: 183 },
  { quarter: 'Q2 2024', accuracy: 81, confidence: 75, predictions: 312, correct: 253 },
  { quarter: 'Q3 2024', accuracy: 84, confidence: 78, predictions: 389, correct: 327 },
  { quarter: 'Q4 2024', accuracy: 86, confidence: 79, predictions: 445, correct: 383 },
  { quarter: 'Q1 2025', accuracy: 87, confidence: 81, predictions: 512, correct: 445 },
  { quarter: 'Q2 2025', accuracy: 88, confidence: 83, predictions: 598, correct: 526 },
  { quarter: 'Q3 2025', accuracy: 89, confidence: 85, predictions: 678, correct: 603 },
  { quarter: 'Q4 2025', accuracy: 90, confidence: 86, predictions: 734, correct: 661 },
  { quarter: 'Q1 2026', accuracy: 90, confidence: 87, predictions: 812, correct: 731 },
  { quarter: 'Q2 2026', accuracy: 91, confidence: 87, predictions: 891, correct: 811 },
];

const HISTORICAL_TIMELINES = [
  {
    project: 'Highway 287 Corridor Expansion',
    events: [
      { year: '2021', event: 'First planning document surfaced', type: 'discovery' },
      { year: '2022', event: 'CIP budget draft — $8.2M proposed', type: 'budget' },
      { year: '2023', event: 'Environmental impact study completed', type: 'milestone' },
      { year: '2024', event: 'Community hearings held', type: 'milestone' },
      { year: '2025', event: 'CIP budget increased to $12.4M', type: 'budget' },
      { year: '2026', event: 'DOT filing submitted — 5 signals converged', type: 'action' },
    ],
  },
  {
    project: 'Weld County School Campus',
    events: [
      { year: '2020', event: 'School bond measure passed — $180M', type: 'budget' },
      { year: '2022', event: 'First campus RFP issued — $52M', type: 'action' },
      { year: '2023', event: 'Thompson SD RFP — $38M', type: 'action' },
      { year: '2024', event: 'Road extension planning started', type: 'discovery' },
      { year: '2025', event: 'Sewer infrastructure upgrades', type: 'milestone' },
      { year: '2026', event: 'K-8 campus RFP — $48M, 4 signals', type: 'action' },
    ],
  },
];

export default function HistoricalIntelligenceWarehouse() {
  const [expandedPattern, setExpandedPattern] = useState<string | null>('rp1');
  const [expandedTimeline, setExpandedTimeline] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Year-over-Year Comparison */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-accent-indigo" /> Year-over-Year Intelligence Growth
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-ink-wash">
                <th className="text-left py-2 text-ink-tertiary font-medium">Metric</th>
                <th className="text-right py-2 text-emerald-600 font-medium">2026</th>
                <th className="text-right py-2 text-ink-tertiary font-medium">2025</th>
                <th className="text-right py-2 text-ink-tertiary font-medium">2024</th>
                <th className="text-right py-2 text-emerald-600 font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              {YEAR_OVER_YEAR.map((row) => (
                <tr key={row.metric} className="border-b border-ink-wash/50">
                  <td className="py-2 text-ink-secondary font-medium">{row.metric}</td>
                  <td className="text-right py-2 text-ink-primary font-bold">{row.current}</td>
                  <td className="text-right py-2 text-ink-tertiary">{row.prevYear}</td>
                  <td className="text-right py-2 text-ink-tertiary">{row.twoYearsAgo}</td>
                  <td className="text-right py-2 text-emerald-600 font-bold">{row.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Accuracy Over Time */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-accent-indigo" /> AI Recommendation Accuracy Over Time
        </h4>
        <div className="flex items-end gap-2 h-28 px-2 mb-2">
          {AI_ACCURACY_HISTORY.map((q) => (
            <div key={q.quarter} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] text-emerald-600 font-bold">{q.accuracy}%</span>
              <div className="w-full bg-emerald-500 rounded-t-sm" style={{ height: `${q.accuracy * 1.2}px` }} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 px-2 mb-3">
          {AI_ACCURACY_HISTORY.map((q) => (
            <div key={q.quarter} className="flex-1 text-center">
              <span className="text-[7px] text-ink-tertiary">{q.quarter}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'Latest Accuracy', value: '91%', color: 'text-emerald-600' },
            { label: 'Total Predictions', value: '6,105', color: 'text-accent-indigo' },
            { label: 'Correct', value: '5,534', color: 'text-emerald-600' },
            { label: 'Improvement', value: '+13pp', color: 'text-emerald-600' },
          ].map((s) => (
            <div key={s.label} className="p-2 bg-canvas rounded-lg text-center">
              <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[8px] text-ink-tertiary">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recurring Patterns */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent-indigo" /> Recurring Development Patterns
        </h4>
        <div className="space-y-3">
          {RECURRING_PATTERNS.map((rp) => {
            const expanded = expandedPattern === rp.id;
            return (
              <div key={rp.id} className="bg-canvas border border-ink-wash rounded-xl overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-[12px] font-bold text-ink-primary">{rp.name}</h5>
                    <button
                      onClick={() => setExpandedPattern(expanded ? null : rp.id)}
                      className="text-[10px] text-ink-tertiary hover:text-accent-indigo"
                    >
                      {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-ink-secondary mb-2">{rp.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {rp.occurrences.map((o) => (
                      <span key={o.year} className="text-[9px] px-1.5 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full font-medium">{o.year}</span>
                    ))}
                  </div>
                </div>
                {expanded && (
                  <div className="border-t border-ink-wash px-4 py-3">
                    <div className="space-y-2 mb-3">
                      {rp.occurrences.map((o) => (
                        <div key={o.year} className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-accent-indigo w-8">{o.year}</span>
                          <span className="text-[11px] text-ink-secondary">{o.project}</span>
                          <span className="text-[10px] text-emerald-600 font-medium ml-auto">{o.outcome}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 bg-accent-indigo/[0.03] rounded-lg">
                      <p className="text-[10px] text-accent-indigo font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" /> {rp.insight}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Timelines */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-accent-indigo" /> Historical Infrastructure Timelines
        </h4>
        <div className="space-y-4">
          {HISTORICAL_TIMELINES.map((tl) => {
            const expanded = expandedTimeline === tl.project;
            return (
              <div key={tl.project} className="bg-canvas border border-ink-wash rounded-xl p-4">
                <button
                  onClick={() => setExpandedTimeline(expanded ? null : tl.project)}
                  className="w-full flex items-center justify-between"
                >
                  <h5 className="text-[12px] font-bold text-ink-primary">{tl.project}</h5>
                  {expanded ? <ChevronUp className="w-3.5 h-3.5 text-ink-tertiary" /> : <ChevronDown className="w-3.5 h-3.5 text-ink-tertiary" />}
                </button>
                {expanded && (
                  <div className="mt-3 relative pl-4 border-l-2 border-ink-wash space-y-3">
                    {tl.events.map((e, i) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full border-2 bg-surface border-accent-indigo/30" />
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-accent-indigo">{e.year}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${e.type === 'action' ? 'bg-emerald-50 text-emerald-700' : e.type === 'budget' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                            {e.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-secondary">{e.event}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
