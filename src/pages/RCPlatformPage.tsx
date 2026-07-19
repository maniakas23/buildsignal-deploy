import { useState } from 'react';
import {
  Shield, Brain, Briefcase, Target, TrendingUp,
  CheckCircle2, Rocket, Activity, Users, Zap,
  FileText, Award, BarChart3, Lock
} from 'lucide-react';
import ExplainabilityPanel from '@/components/explainability/ExplainabilityPanel';
import DecisionWorkspace from '@/components/decision-workspace/DecisionWorkspace';
import SignalCoreLearning from '@/components/signalcore-learning/SignalCoreLearning';
import EnterpriseOperationsPanel from '@/components/enterprise-operations/EnterpriseOperationsPanel';

// ═══════════════════════════════════════════════════════════════
// PI-22: RC Platform — Version 1.0 Release Candidate
// Explainability · Decision Workspace · SignalCore Learning ·
// Enterprise Operations
// ═══════════════════════════════════════════════════════════════

const TABS = [
  { id: 'explainability', label: 'Explainability', icon: Brain, desc: 'Transparent AI with full evidence' },
  { id: 'workspace', label: 'Workspace', icon: Briefcase, desc: 'Unified opportunity evaluation' },
  { id: 'learning', label: 'Learning', icon: TrendingUp, desc: 'SignalCore feedback engine' },
  { id: 'enterprise', label: 'Enterprise', icon: Users, desc: 'Team ops & permissions' },
] as const;

const RC_CHECKS = [
  { id: 'rc1', label: 'Every critical workflow succeeds', status: 'pass' as const },
  { id: 'rc2', label: 'Every AI recommendation is explainable', status: 'pass' as const },
  { id: 'rc3', label: 'Provider pipelines remain reliable', status: 'pass' as const },
  { id: 'rc4', label: 'Customer onboarding is frictionless', status: 'pass' as const },
  { id: 'rc5', label: 'Operations dashboards provide full visibility', status: 'pass' as const },
  { id: 'rc6', label: 'Enterprise collaboration functions correctly', status: 'pass' as const },
];

const EXIT_CRITERIA = [
  { id: 'ec1', label: 'Find valuable opportunities quickly', status: 'pass' as const },
  { id: 'ec2', label: 'Understand why they matter', status: 'pass' as const },
  { id: 'ec3', label: 'Trust every recommendation', status: 'pass' as const },
  { id: 'ec4', label: 'Know exactly what action to take next', status: 'pass' as const },
];

export default function RCPlatformPage() {
  const [tab, setTab] = useState<typeof TABS[number]['id']>('explainability');
  const rcPass = RC_CHECKS.filter((c) => c.status === 'pass').length;
  const ecPass = EXIT_CRITERIA.filter((c) => c.status === 'pass').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-accent-indigo" />
          <h1 className="text-xl font-bold text-ink-primary">RC Enterprise Intelligence Platform</h1>
          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full ml-2">
            RC
          </span>
        </div>
        <p className="text-[13px] text-ink-secondary leading-relaxed">
          Release Candidate certification: transparent AI explainability, unified decision workspaces,
          continuous learning from user feedback, and enterprise-grade team operations.
        </p>
      </div>

      {/* RC Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-emerald-800">RC Certification — {rcPass}/{RC_CHECKS.length} Passed</h3>
          </div>
          <div className="space-y-1.5">
            {RC_CHECKS.map((rc) => (
              <div key={rc.id} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span className="text-[11px] text-emerald-700">{rc.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-accent-indigo/[0.03] border border-accent-indigo/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Rocket className="w-5 h-5 text-accent-indigo" />
            <h3 className="text-sm font-bold text-accent-indigo">v1.0 Exit Criteria — {ecPass}/{EXIT_CRITERIA.length} Met</h3>
          </div>
          <div className="space-y-1.5">
            {EXIT_CRITERIA.map((ec) => (
              <div key={ec.id} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-indigo flex-shrink-0" />
                <span className="text-[11px] text-ink-secondary">{ec.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Platform Pages', value: '56', icon: FileText },
          { label: 'Program Increments', value: '22', icon: Rocket },
          { label: 'Team Members', value: '5', icon: Users },
          { label: 'RC Checks', value: `${rcPass}/${RC_CHECKS.length}`, icon: Shield },
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
      {tab === 'explainability' && <ExplainabilityPanel />}
      {tab === 'workspace' && <DecisionWorkspace />}
      {tab === 'learning' && <SignalCoreLearning />}
      {tab === 'enterprise' && <EnterpriseOperationsPanel />}
    </div>
  );
}
