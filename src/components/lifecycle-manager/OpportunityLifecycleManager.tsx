import { useState } from 'react';
import {
  Target, Clock, CheckCircle2, AlertTriangle, MapPin,
  ChevronDown, ChevronUp, Zap, Bookmark, FileText,
  Bell, TrendingUp, ArrowRight, Calendar, Tag,
  UserCircle, MessageSquare, BarChart3, Layers,
  History, Award, Eye, Star, TrendingDown, DollarSign
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-24: Opportunity Lifecycle Management
// Track every opportunity from discovery through completion
// and historical outcome. Enable customers to revisit completed
// opportunities to measure AI effectiveness.
// ═══════════════════════════════════════════════════════════════

const LIFECYCLE_STAGES = ['Discovery', 'Validation', 'Monitoring', 'Customer Action', 'Infrastructure Progress', 'Completion', 'Historical Outcome'] as const;

const ACTIVE_OPPORTUNITIES = [
  {
    id: 'lc-001',
    title: 'Highway 287 Corridor Expansion',
    county: 'Larimer County, CO',
    type: 'DOT-Corridor',
    value: '$30-45M',
    confidence: 94,
    discoveredDate: 'Jul 18, 2026',
    currentStage: 3,
    aiPrediction: '25-40% land appreciation within 24 months',
    signals: [
      { source: 'DOT Permits', detail: 'HWY-287-EXP-2026 filed', date: 'Jul 18', confidence: 99 },
      { source: 'County Planning', detail: 'Rezoning approved', date: 'Jul 15', confidence: 97 },
      { source: 'Xcel Energy', detail: 'Utility relocation notice', date: 'Jul 14', confidence: 91 },
      { source: 'Building Permits', detail: '3 demolition permits', date: 'Jul 10', confidence: 85 },
      { source: 'CIP Tracker', detail: '$12.4M budget approved', date: 'Jul 8', confidence: 96 },
    ],
    timeline: [
      { date: 'Jul 8', event: 'CIP budget approved — Discovery signal', stage: 0 },
      { date: 'Jul 10', event: 'Demolition permits issued — Discovery signal', stage: 0 },
      { date: 'Jul 14', event: 'Utility relocation filed — Validation confirmed', stage: 1 },
      { date: 'Jul 15', event: 'Rezoning approved — Validation confirmed', stage: 1 },
      { date: 'Jul 18', event: 'AI detection — 5 signals converged', stage: 2 },
      { date: 'Jul 19', event: 'Executive summary generated', stage: 2 },
      { date: 'Jul 20', event: 'Customer action initiated — Parcel research', stage: 3 },
    ],
    notes: [
      { author: 'Sarah Chen', text: 'Immediate follow-up required. Contact county planner.', date: 'Jul 20' },
      { author: 'Marcus Johnson', text: 'Comparable: Highway 34 showed +34% appreciation.', date: 'Jul 19' },
    ],
    reminders: [
      { task: 'Pull parcel records', due: 'Jul 21', status: 'pending' },
      { task: 'Contact county planner', due: 'Jul 22', status: 'pending' },
      { task: 'Site visit', due: 'Jul 24', status: 'pending' },
    ],
  },
  {
    id: 'lc-002',
    title: 'Weld County School Campus RFP',
    county: 'Weld County, CO',
    type: 'Public Contract',
    value: '$48M',
    confidence: 91,
    discoveredDate: 'Jul 17, 2026',
    currentStage: 4,
    aiPrediction: '65-75% win probability with proper preparation',
    signals: [
      { source: 'School Construction DB', detail: 'RFP issued — K-8, $48M', date: 'Jul 17', confidence: 99 },
      { source: 'Capital Improvement', detail: '$4.2M road extension', date: 'Jul 15', confidence: 94 },
      { source: 'Water Authority', detail: 'Sewer extension permit', date: 'Jul 14', confidence: 89 },
    ],
    timeline: [
      { date: 'Jul 14', event: 'Sewer permit approved', stage: 0 },
      { date: 'Jul 15', event: 'Road extension approved', stage: 0 },
      { date: 'Jul 17', event: 'RFP published — AI detection', stage: 1 },
      { date: 'Jul 19', event: 'Validation — 4 signals confirmed', stage: 1 },
      { date: 'Jul 20', event: 'Customer action — Bonding check', stage: 3 },
    ],
    notes: [
      { author: 'Marcus Johnson', text: 'Bonding capacity confirmed for $48M. JV partner identified.', date: 'Jul 20' },
    ],
    reminders: [
      { task: 'Verify bonding', due: 'Jul 23', status: 'completed' },
      { task: 'Pre-bid meeting', due: 'Aug 3', status: 'pending' },
      { task: 'Submit LOI', due: 'Aug 10', status: 'pending' },
    ],
  },
];

const COMPLETED_OPPORTUNITIES = [
  {
    id: 'comp-001',
    title: 'Highway 34, Greeley Corridor',
    county: 'Weld County, CO',
    type: 'DOT-Corridor',
    value: '$38M',
    discoveredDate: 'Jan 15, 2023',
    completedDate: 'Dec 2024',
    aiPrediction: '+30% land appreciation, 15 developments',
    actualOutcome: '+34% appreciation, 18 developments',
    accuracy: 94,
    customerAction: 'Early land acquisition + development partnerships',
    roi: '+$4.2M',
    lessons: 'Five-signal convergence pattern proved highly reliable. Early entry 60+ days before public announcement was critical.',
  },
  {
    id: 'comp-002',
    title: 'I-25 Frontage Road, Loveland',
    county: 'Larimer County, CO',
    type: 'DOT-Corridor',
    value: '$22M',
    discoveredDate: 'Mar 2022',
    completedDate: 'Jun 2024',
    aiPrediction: '+25% appreciation, 10 projects',
    actualOutcome: '+28% appreciation, 12 projects',
    accuracy: 96,
    customerAction: 'Strategic parcel assembly',
    roi: '+$2.8M',
    lessons: 'Utility relocation signals were the earliest indicator. DOT filings followed 45 days later.',
  },
  {
    id: 'comp-003',
    title: 'Thompson School District Campus',
    county: 'Larimer County, CO',
    type: 'Public Contract',
    value: '$38M',
    discoveredDate: 'Feb 2023',
    completedDate: 'Awarded Nov 2023',
    aiPrediction: '70% win probability with JV partnership',
    actualOutcome: 'Won via regional JV',
    accuracy: 100,
    customerAction: 'JV formation + pre-bid meeting attendance',
    roi: '$38M contract',
    lessons: 'Pre-bid meeting attendance was decisive. Bonding verification 14 days early provided strategic advantage.',
  },
];

const AI_EFFECTIVENESS = {
  totalTracked: 89,
  completed: 67,
  accuracyRate: 91,
  avgConfidence: 87,
  predictionsCorrect: 61,
  earlyAdvantage: '45-60 days average',
  customerSavings: '2,400 hours research time',
  totalValueIdentified: '$340M+',
};

export default function OpportunityLifecycleManager() {
  const [expandedId, setExpandedId] = useState<string | null>('lc-001');
  const [view, setView] = useState<'active' | 'completed'>('active');

  return (
    <div className="space-y-6">
      {/* AI Effectiveness Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-emerald-600" />
          <h4 className="text-sm font-bold text-emerald-800">AI Effectiveness — Measurable Results</h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'Tracked', value: AI_EFFECTIVENESS.totalTracked, icon: Target },
            { label: 'Completed', value: AI_EFFECTIVENESS.completed, icon: CheckCircle2 },
            { label: 'Accuracy', value: `${AI_EFFECTIVENESS.accuracyRate}%`, icon: TrendingUp },
            { label: 'Value', value: AI_EFFECTIVENESS.totalValueIdentified, icon: DollarSign },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-emerald-200 rounded-lg p-2.5 text-center">
              <s.icon className="w-4 h-4 text-emerald-600 mx-auto mb-0.5" />
              <div className="text-lg font-bold text-emerald-700">{s.value}</div>
              <div className="text-[8px] text-emerald-600">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="p-2 bg-white border border-emerald-200 rounded-lg text-center">
            <div className="text-[11px] font-bold text-emerald-700">{AI_EFFECTIVENESS.earlyAdvantage}</div>
            <div className="text-[8px] text-emerald-600">Early Entry Advantage</div>
          </div>
          <div className="p-2 bg-white border border-emerald-200 rounded-lg text-center">
            <div className="text-[11px] font-bold text-emerald-700">{AI_EFFECTIVENESS.customerSavings}</div>
            <div className="text-[8px] text-emerald-600">Customer Research Saved</div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-1 p-1 bg-canvas border border-ink-wash rounded-xl w-fit">
        <button
          onClick={() => setView('active')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
            view === 'active' ? 'bg-accent-indigo text-white' : 'text-ink-secondary hover:bg-surface'
          }`}
        >
          <Target className="w-3.5 h-3.5" /> Active ({ACTIVE_OPPORTUNITIES.length})
        </button>
        <button
          onClick={() => setView('completed')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
            view === 'completed' ? 'bg-accent-indigo text-white' : 'text-ink-secondary hover:bg-surface'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Completed ({COMPLETED_OPPORTUNITIES.length})
        </button>
      </div>

      {/* ── Active Opportunities ── */}
      {view === 'active' && (
        <div className="space-y-4">
          {ACTIVE_OPPORTUNITIES.map((opp) => {
            const expanded = expandedId === opp.id;
            return (
              <div key={opp.id} className="bg-surface border border-ink-wash rounded-2xl overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full uppercase">{opp.type}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${opp.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {opp.confidence}%
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full font-bold">
                      {LIFECYCLE_STAGES[opp.currentStage]}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-ink-primary mb-1">{opp.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-ink-tertiary mb-3">
                    <MapPin className="w-3 h-3" /> {opp.county}
                    <span>·</span>
                    <Calendar className="w-3 h-3" /> {opp.discoveredDate}
                    <span>·</span>
                    <span className="text-emerald-600 font-medium">{opp.value}</span>
                  </div>

                  {/* AI Prediction */}
                  <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg mb-3">
                    <p className="text-[10px] font-semibold text-blue-800 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> AI Prediction
                    </p>
                    <p className="text-[11px] text-blue-800">{opp.aiPrediction}</p>
                  </div>

                  {/* Stage Progress */}
                  <div className="mb-2">
                    <div className="flex items-center gap-0.5 mb-1">
                      {LIFECYCLE_STAGES.map((stage, i) => (
                        <div key={stage} className="flex-1 flex items-center">
                          <div className={`flex-1 h-1.5 rounded-full ${i <= opp.currentStage ? 'bg-accent-indigo' : 'bg-ink-wash/30'}`} />
                          {i < LIFECYCLE_STAGES.length - 1 && <div className="w-0.5" />}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      {LIFECYCLE_STAGES.map((stage, i) => (
                        <span key={stage} className={`text-[6px] leading-tight text-center flex-1 ${i <= opp.currentStage ? 'text-accent-indigo font-medium' : 'text-ink-tertiary'}`}>
                          {stage}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(expanded ? null : opp.id)}
                    className="text-[10px] text-accent-indigo font-medium flex items-center gap-1"
                  >
                    {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {expanded ? 'Less' : 'Details'}
                  </button>
                </div>

                {expanded && (
                  <div className="border-t border-ink-wash px-5 py-4 space-y-4">
                    <div>
                      <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3 h-3 text-accent-indigo" /> Supporting Signals
                      </h5>
                      <div className="space-y-1.5">
                        {opp.signals.map((s, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-canvas rounded-lg">
                            <div>
                              <span className="text-[10px] font-semibold text-accent-indigo">{s.source}</span>
                              <p className="text-[11px] text-ink-secondary">{s.detail}</p>
                            </div>
                            <span className="text-[9px] text-ink-tertiary flex-shrink-0">{s.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3 text-accent-indigo" /> Timeline
                      </h5>
                      <div className="relative pl-4 border-l-2 border-ink-wash space-y-2">
                        {opp.timeline.map((t, i) => (
                          <div key={i} className="relative">
                            <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full border-2 bg-surface border-accent-indigo/30" />
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-ink-secondary">{t.event}</span>
                              <span className="text-[9px] text-ink-tertiary">{t.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-accent-indigo" /> Notes
                        </h5>
                        <div className="space-y-1.5">
                          {opp.notes.map((n, i) => (
                            <div key={i} className="p-2 bg-canvas rounded-lg">
                              <p className="text-[11px] text-ink-secondary">{n.text}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] text-accent-indigo">{n.author}</span>
                                <span className="text-[9px] text-ink-tertiary">{n.date}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
                          <Bell className="w-3 h-3 text-accent-indigo" /> Reminders
                        </h5>
                        <div className="space-y-1.5">
                          {opp.reminders.map((r, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-canvas rounded-lg">
                              <div className="flex items-center gap-2">
                                {r.status === 'completed' ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-500" />
                                )}
                                <span className={`text-[11px] ${r.status === 'completed' ? 'text-ink-tertiary line-through' : 'text-ink-secondary'}`}>{r.task}</span>
                              </div>
                              <span className="text-[9px] text-accent-crimson">{r.due}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Completed Opportunities ── */}
      {view === 'completed' && (
        <div className="space-y-4">
          {COMPLETED_OPPORTUNITIES.map((opp) => (
            <div key={opp.id} className="bg-surface border border-ink-wash rounded-2xl p-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full uppercase">{opp.type}</span>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-2.5 h-2.5 inline mr-0.5" />
                  COMPLETED
                </span>
                <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full">
                  {opp.accuracy}% AI Accuracy
                </span>
              </div>

              <h4 className="text-sm font-bold text-ink-primary mb-1">{opp.title}</h4>
              <div className="flex items-center gap-2 text-[10px] text-ink-tertiary mb-3">
                <MapPin className="w-3 h-3" /> {opp.county}
                <span>·</span>
                <Calendar className="w-3 h-3" /> {opp.discoveredDate} → {opp.completedDate}
                <span>·</span>
                <span className="text-emerald-600 font-medium">{opp.value}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-[10px] font-semibold text-blue-800 mb-1 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> AI Prediction
                  </p>
                  <p className="text-[11px] text-blue-800">{opp.aiPrediction}</p>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-[10px] font-semibold text-emerald-800 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Actual Outcome
                  </p>
                  <p className="text-[11px] text-emerald-800">{opp.actualOutcome}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="p-2 bg-canvas rounded-lg text-center">
                  <div className="text-sm font-bold text-emerald-600">{opp.roi}</div>
                  <div className="text-[8px] text-ink-tertiary">Customer ROI</div>
                </div>
                <div className="p-2 bg-canvas rounded-lg text-center">
                  <div className="text-sm font-bold text-accent-indigo">{opp.accuracy}%</div>
                  <div className="text-[8px] text-ink-tertiary">AI Accuracy</div>
                </div>
                <div className="p-2 bg-canvas rounded-lg text-center">
                  <div className="text-sm font-bold text-ink-primary">{opp.customerAction}</div>
                  <div className="text-[8px] text-ink-tertiary">Action Taken</div>
                </div>
              </div>

              <div className="p-3 bg-accent-indigo/[0.03] rounded-lg">
                <p className="text-[10px] font-semibold text-accent-indigo mb-1 flex items-center gap-1">
                  <Star className="w-3 h-3" /> Lessons Learned
                </p>
                <p className="text-[11px] text-ink-secondary leading-relaxed">{opp.lessons}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
