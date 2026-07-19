import { useState } from 'react';
import {
  Brain, Target, FileText, Rocket,
  Sparkles, Zap, TrendingUp, Shield
} from 'lucide-react';
import AIDecisionAssistant from '@/components/ai-decision/AIDecisionAssistant';
import PredictiveIntelligence from '@/components/predictive/PredictiveIntelligence';
import ExecutiveBriefingGenerator from '@/components/briefing-generator/ExecutiveBriefingGenerator';
import LaunchReadinessDashboard from '@/components/launch-readiness/LaunchReadinessDashboard';

// ═══════════════════════════════════════════════════════════════
// PI-20: AI Launch Capstone
// AI Decision Assistant · Predictive Intelligence · Executive
// Briefing Generator · Launch Readiness Dashboard
// ═══════════════════════════════════════════════════════════════

const TABS = [
  { id: 'ai-decision', label: 'AI Decision', icon: Brain, desc: 'Analyst-grade opportunity analysis' },
  { id: 'predictive', label: 'Predictive', icon: Target, desc: 'Forecasted hotspots & probability' },
  { id: 'briefing', label: 'Briefing', icon: FileText, desc: 'Daily / weekly / monthly reports' },
  { id: 'launch-ready', label: 'Launch Ready', icon: Rocket, desc: 'Operations, CX & success criteria' },
] as const;

export default function AILaunchPage() {
  const [tab, setTab] = useState<typeof TABS[number]['id']>('ai-decision');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-accent-indigo" />
          <h1 className="text-xl font-bold text-ink-primary">AI Decision & Launch Intelligence</h1>
        </div>
        <p className="text-[13px] text-ink-secondary">
          AI-powered decision assistance, predictive opportunity forecasting,
          automated executive briefings, and launch readiness validation.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'AI Analyses', value: '2', icon: Brain, color: 'text-accent-indigo' },
          { label: 'Predicted Hotspots', value: '4', icon: Target, color: 'text-emerald-600' },
          { label: 'Launch Criteria', value: '36/36', icon: Shield, color: 'text-emerald-600' },
          { label: 'Avg Confidence', value: '92.5%', icon: TrendingUp, color: 'text-accent-indigo' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
            <kpi.icon className={`w-5 h-5 ${kpi.color} mx-auto mb-1`} />
            <div className="text-xl font-bold text-ink-primary">{kpi.value}</div>
            <div className="text-[10px] text-ink-tertiary">{kpi.label}</div>
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
      {tab === 'ai-decision' && <AIDecisionAssistant />}
      {tab === 'predictive' && <PredictiveIntelligence />}
      {tab === 'briefing' && <ExecutiveBriefingGenerator />}
      {tab === 'launch-ready' && <LaunchReadinessDashboard />}
    </div>
  );
}
