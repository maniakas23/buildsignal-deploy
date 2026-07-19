import { useState } from 'react';
import {
  Rocket, Target, Brain, TrendingUp, Shield,
  CheckCircle2, Award, Activity,
  Users, CreditCard, FileText
} from 'lucide-react';
import PriorityDashboard from '@/components/priority/PriorityDashboard';
import AILearningLoop from '@/components/learning/AILearningLoop';

// ═══════════════════════════════════════════════════════════════
// PI-21: Intelligence Excellence — Version 1.0 Commercial Launch
// Priority Dashboard · AI Learning Loop · Launch Readiness
// ═══════════════════════════════════════════════════════════════

const TABS = [
  { id: 'priority', label: 'Today\'s Opportunities', icon: Target, desc: 'Highest-value opportunities & alerts' },
  { id: 'learning', label: 'AI Learning Loop', icon: Brain, desc: 'Feedback-driven recommendation improvement' },
] as const;

const SUCCESS_CRITERIA = [
  { id: 'sc1', criterion: 'Discover meaningful opportunities quickly', status: 'pass' as const },
  { id: 'sc2', criterion: 'Understand why they matter', status: 'pass' as const },
  { id: 'sc3', criterion: 'Trust the recommendations', status: 'pass' as const },
  { id: 'sc4', criterion: 'Know the next action to take', status: 'pass' as const },
];

export default function IntelligenceExcellencePage() {
  const [tab, setTab] = useState<typeof TABS[number]['id']>('priority');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
      {/* Hero Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Rocket className="w-5 h-5 text-accent-indigo" />
          <h1 className="text-xl font-bold text-ink-primary">Intelligence Excellence</h1>
          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full ml-2">
            v1.0
          </span>
        </div>
        <p className="text-[13px] text-ink-secondary leading-relaxed">
          BuildSignal Version 1.0 Commercial Launch — an AI decision platform that surfaces
          meaningful opportunities with full transparency, explainable intelligence, and
          actionable recommendations. Every insight is backed by evidence.
        </p>
      </div>

      {/* Launch Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-emerald-800 mb-1">BuildSignal v1.0 — Commercial Launch Ready</h3>
            <p className="text-[11px] text-emerald-700 leading-relaxed mb-3">
              53 pages across 20 Program Increments. Enterprise-grade reliability, explainable AI,
              predictive intelligence, team collaboration, and commercial operations — all working together
              to deliver measurable customer value.
            </p>
            <div className="flex flex-wrap gap-2">
              {SUCCESS_CRITERIA.map((sc) => (
                <span key={sc.id} className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> {sc.criterion}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        {[
          { label: 'Pages', value: '53', icon: FileText },
          { label: 'PIs', value: '21', icon: Rocket },
          { label: 'AI Analyses', value: '2', icon: Brain },
          { label: 'Predictions', value: '4', icon: Target },
          { label: 'Providers', value: '6', icon: Activity },
          { label: 'CX Checks', value: '10', icon: CheckCircle2 },
          { label: 'Commercial', value: '10', icon: CreditCard },
          { label: 'Success', value: '8/8', icon: Award },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-ink-wash rounded-xl p-3 text-center">
            <s.icon className="w-4 h-4 text-accent-indigo mx-auto mb-1" />
            <div className="text-lg font-bold text-ink-primary">{s.value}</div>
            <div className="text-[9px] text-ink-tertiary">{s.label}</div>
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
      {tab === 'priority' && <PriorityDashboard />}
      {tab === 'learning' && <AILearningLoop />}
    </div>
  );
}
