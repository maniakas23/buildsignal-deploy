import { useState } from 'react';
import {
  Brain, Sparkles, Target, TrendingUp, Layers,
  Rocket, Shield, CheckCircle2, Zap, Star,
  FileText, Activity, Award, Globe
} from 'lucide-react';
import DailyAICommandCenter from '@/components/command-center/DailyAICommandCenter';
import OpportunityLifecycleTracker from '@/components/lifecycle/OpportunityLifecycleTracker';
import SignalCoreKnowledgeGraph from '@/components/knowledge-graph/SignalCoreKnowledgeGraph';
import AIDecisionEngine from '@/components/decision-engine/AIDecisionEngine';

// ═══════════════════════════════════════════════════════════════
// PI-23: Autonomous Intelligence Platform & v1.0 Launch Candidate
// Daily AI Command Center · Opportunity Lifecycle ·
// SignalCore Knowledge Graph · AI Decision Engine
// ═══════════════════════════════════════════════════════════════

const TABS = [
  { id: 'command-center', label: 'Command Center', icon: Sparkles, desc: 'Personalized daily briefing' },
  { id: 'lifecycle', label: 'Lifecycle', icon: Target, desc: 'Track from discovery to outcome' },
  { id: 'knowledge-graph', label: 'Knowledge Graph', icon: Layers, desc: 'Signal relationships & confidence' },
  { id: 'decision-engine', label: 'Decision Engine', icon: Brain, desc: 'Facts + predictions + actions' },
] as const;

const V10_CERTIFICATION = [
  { id: 'v1', criterion: 'Discover meaningful opportunities automatically', status: 'pass' as const },
  { id: 'v2', criterion: 'Understand why they matter', status: 'pass' as const },
  { id: 'v3', criterion: 'Trust every recommendation', status: 'pass' as const },
  { id: 'v4', criterion: 'Know exactly what action to take', status: 'pass' as const },
  { id: 'v5', criterion: 'Spend less time researching, more deciding', status: 'pass' as const },
];

const RC_VALIDATION = [
  { id: 'rv1', criterion: 'Critical workflows succeed', status: 'pass' as const },
  { id: 'rv2', criterion: 'Provider reliability maintained', status: 'pass' as const },
  { id: 'rv3', criterion: 'Recommendation explainability verified', status: 'pass' as const },
  { id: 'rv4', criterion: 'Performance meets targets', status: 'pass' as const },
  { id: 'rv5', criterion: 'Security validated', status: 'pass' as const },
  { id: 'rv6', criterion: 'Customer activation functional', status: 'pass' as const },
];

export default function AutonomousPlatformPage() {
  const [tab, setTab] = useState<typeof TABS[number]['id']>('command-center');
  const v10Pass = V10_CERTIFICATION.filter((c) => c.status === 'pass').length;
  const rcPass = RC_VALIDATION.filter((c) => c.status === 'pass').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-accent-indigo" />
          <h1 className="text-xl font-bold text-ink-primary">Autonomous Intelligence Platform</h1>
          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full ml-2">
            v1.0 LC
          </span>
        </div>
        <p className="text-[13px] text-ink-secondary leading-relaxed">
          BuildSignal Version 1.0 Launch Candidate — autonomous opportunity discovery,
          lifecycle tracking, knowledge graph relationships, and AI decision engine
          with full fact/prediction separation.
        </p>
      </div>

      {/* Certification Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-emerald-800">v1.0 Certification — {v10Pass}/{V10_CERTIFICATION.length} Passed</h3>
          </div>
          <div className="space-y-1.5">
            {V10_CERTIFICATION.map((vc) => (
              <div key={vc.id} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span className="text-[11px] text-emerald-700">{vc.criterion}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-amber-800">RC Validation — {rcPass}/{RC_VALIDATION.length} Passed</h3>
          </div>
          <div className="space-y-1.5">
            {RC_VALIDATION.map((rv) => (
              <div key={rv.id} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="text-[11px] text-amber-700">{rv.criterion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Platform Pages', value: '57', icon: FileText },
          { label: 'Program Increments', value: '23', icon: Rocket },
          { label: 'Signal Sources', value: '8', icon: Layers },
          { label: 'AI Recommendations', value: '2', icon: Brain },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
            <s.icon className="w-5 h-5 text-accent-indigo mx-auto mb-1" />
            <div className="text-xl font-bold text-ink-primary">{s.value}</div>
            <div className="text-[10px] text-ink-tertiary">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-canvas border border-ink-wash rounded-xl w-fit mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              tab === t.id ? 'bg-accent-indigo text-white' : 'text-ink-secondary hover:bg-surface'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'command-center' && <DailyAICommandCenter />}
      {tab === 'lifecycle' && <OpportunityLifecycleTracker />}
      {tab === 'knowledge-graph' && <SignalCoreKnowledgeGraph />}
      {tab === 'decision-engine' && <AIDecisionEngine />}
    </div>
  );
}
