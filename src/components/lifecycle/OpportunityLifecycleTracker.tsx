import { useState } from 'react';
import {
  Target, Clock, CheckCircle2, AlertTriangle, MapPin,
  ChevronDown, ChevronUp, Zap, Bookmark, FileText,
  Bell, TrendingUp, ArrowRight, Calendar, Tag,
  UserCircle, MessageSquare, BarChart3, Layers
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-23: Opportunity Lifecycle Tracker
// Track opportunities from discovery through completion.
// Discovery, signals, timeline, status, notes, reminders, outcomes.
// ═══════════════════════════════════════════════════════════════

const STAGES = ['Discovered', 'Qualified', 'Active', 'Closing', 'Won', 'Lost'] as const;

const OPPORTUNITIES = [
  {
    id: 'lc-001',
    title: 'Highway 287 Corridor Expansion',
    county: 'Larimer County, CO',
    type: 'DOT-Corridor',
    value: '$30-45M',
    confidence: 94,
    discoveredDate: 'Jul 18, 2026',
    currentStage: 1,
    signals: [
      { source: 'DOT Permits', detail: 'HWY-287-EXP-2026 filed', date: 'Jul 18', confidence: 99 },
      { source: 'County Planning', detail: 'Rezoning approved', date: 'Jul 15', confidence: 97 },
      { source: 'Xcel Energy', detail: 'Utility relocation notice', date: 'Jul 14', confidence: 91 },
      { source: 'Building Permits', detail: '3 demolition permits', date: 'Jul 10', confidence: 85 },
      { source: 'CIP Tracker', detail: '$12.4M budget approved', date: 'Jul 8', confidence: 96 },
    ],
    timeline: [
      { date: 'Jul 8', event: 'CIP budget approved', stage: 0 },
      { date: 'Jul 10', event: 'Demolition permits issued', stage: 0 },
      { date: 'Jul 14', event: 'Utility relocation filed', stage: 0 },
      { date: 'Jul 15', event: 'Rezoning approved', stage: 0 },
      { date: 'Jul 18', event: 'Detected by AI — 5 signals', stage: 0 },
      { date: 'Jul 19', event: 'Executive summary generated', stage: 0 },
      { date: 'Jul 20', event: 'Qualified — high confidence', stage: 1 },
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
    currentStage: 2,
    signals: [
      { source: 'School Construction DB', detail: 'RFP issued — K-8, $48M', date: 'Jul 17', confidence: 99 },
      { source: 'Capital Improvement', detail: '$4.2M road extension', date: 'Jul 15', confidence: 94 },
      { source: 'Water Authority', detail: 'Sewer extension permit', date: 'Jul 14', confidence: 89 },
    ],
    timeline: [
      { date: 'Jul 14', event: 'Sewer permit approved', stage: 0 },
      { date: 'Jul 15', event: 'Road extension approved', stage: 0 },
      { date: 'Jul 17', event: 'RFP published', stage: 0 },
      { date: 'Jul 18', event: 'AI detection', stage: 0 },
      { date: 'Jul 19', event: 'Qualified', stage: 1 },
      { date: 'Jul 20', event: 'RFP downloaded, bonding check started', stage: 2 },
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
  {
    id: 'lc-003',
    title: 'Xcel Substation Upgrade Program',
    county: 'Adams County, CO',
    type: 'Utilities',
    value: '$22M',
    confidence: 89,
    discoveredDate: 'Jul 15, 2026',
    currentStage: 0,
    signals: [
      { source: 'Xcel Energy', detail: 'Substation upgrade filing', date: 'Jul 15', confidence: 94 },
      { source: 'DOT Permits', detail: 'Road access permit', date: 'Jul 12', confidence: 88 },
    ],
    timeline: [
      { date: 'Jul 12', event: 'Road access permit filed', stage: 0 },
      { date: 'Jul 15', event: 'AI detection — 2 signals', stage: 0 },
    ],
    notes: [
      { author: 'Sarah Chen', text: 'Lower priority than highway projects. Monitor for now.', date: 'Jul 16' },
    ],
    reminders: [
      { task: 'Review scope documents', due: 'Jul 25', status: 'pending' },
    ],
  },
];

export default function OpportunityLifecycleTracker() {
  const [expandedId, setExpandedId] = useState<string | null>('lc-001');

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {[
          { label: 'Discovered', value: '2', color: 'text-accent-indigo' },
          { label: 'Qualified', value: '1', color: 'text-amber-600' },
          { label: 'Active', value: '1', color: 'text-emerald-600' },
          { label: 'Closing', value: '0', color: 'text-ink-tertiary' },
          { label: 'Won', value: '0', color: 'text-emerald-600' },
          { label: 'Lost', value: '0', color: 'text-ink-tertiary' },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-ink-wash rounded-xl p-3 text-center">
            <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[8px] text-ink-tertiary">{s.label}</div>
          </div>
        ))}
      </div>

      {OPPORTUNITIES.map((opp) => {
        const expanded = expandedId === opp.id;
        return (
          <div key={opp.id} className="bg-surface border border-ink-wash rounded-2xl overflow-hidden">
            <div className="p-5">
              {/* Header */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full uppercase">{opp.type}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${opp.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {opp.confidence}%
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full font-bold">
                  {STAGES[opp.currentStage]}
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

              {/* Stage Progress */}
              <div className="flex items-center gap-1 mb-3">
                {STAGES.map((stage, i) => (
                  <div key={stage} className="flex-1 flex items-center gap-1">
                    <div className={`flex-1 h-2 rounded-full ${i <= opp.currentStage ? 'bg-accent-indigo' : 'bg-ink-wash/30'}`} />
                    {i < STAGES.length - 1 && <div className="w-1" />}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mb-3">
                {STAGES.map((stage, i) => (
                  <span key={stage} className={`text-[7px] ${i <= opp.currentStage ? 'text-accent-indigo font-medium' : 'text-ink-tertiary'}`}>
                    {stage}
                  </span>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] text-ink-tertiary flex items-center gap-1"><Zap className="w-3 h-3" /> {opp.signals.length} signals</span>
                <span className="text-[10px] text-ink-tertiary flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {opp.notes.length} notes</span>
                <span className="text-[10px] text-ink-tertiary flex items-center gap-1"><Bell className="w-3 h-3" /> {opp.reminders.filter((r) => r.status === 'pending').length} reminders</span>
                <button
                  onClick={() => setExpandedId(expanded ? null : opp.id)}
                  className="text-[10px] text-accent-indigo font-medium ml-auto flex items-center gap-1"
                >
                  {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {expanded ? 'Less' : 'Details'}
                </button>
              </div>
            </div>

            {expanded && (
              <div className="border-t border-ink-wash px-5 py-4 space-y-4">
                {/* Signals */}
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

                {/* Timeline */}
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

                {/* Notes & Reminders */}
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
  );
}
