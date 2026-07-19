import { useState } from 'react';
import {
  Sunrise, FileText, Zap, Users2, Brain, TrendingUp,
  Activity, Shield
} from 'lucide-react';
import DailyExecutiveBriefing from '@/components/briefing/DailyExecutiveBriefing';
import ActionableRecommendations from '@/components/recommendations/ActionableRecommendations';
import WorkflowAutomation from '@/components/workflows/WorkflowAutomation';
import EnterpriseCollaboration from '@/components/collaboration/EnterpriseCollaboration';

// ═══════════════════════════════════════════════════════════════
// PI-19: Decision Platform, Enterprise Operations & Launch Readiness
// Capstone page with daily briefing, actionable recommendations,
// workflow automation, and enterprise collaboration.
// ═══════════════════════════════════════════════════════════════

const TABS = [
  { id: 'briefing', label: 'Briefing', icon: Sunrise },
  { id: 'recommendations', label: 'Reports', icon: FileText },
  { id: 'workflows', label: 'Workflows', icon: Zap },
  { id: 'collaboration', label: 'Team', icon: Users2 },
] as const;

function TabBadge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${color}`}>
      {children}
    </span>
  );
}

export default function DecisionPlatformPage() {
  const [activeTab, setActiveTab] = useState<string>('briefing');

  return (
    <div className="min-h-screen pb-20 md:pb-6">
      {/* Header */}
      <div className="px-3 sm:px-4 lg:px-6 pt-4 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-5 h-5 text-accent-indigo" />
              <h1 className="text-lg sm:text-xl font-bold text-ink-primary">
                Decision Platform
              </h1>
              <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-2 py-0.5 rounded-full uppercase tracking-wide">
                PI-19
              </span>
            </div>
            <p className="text-[12px] text-ink-tertiary">
              Enterprise decision-intelligence platform with daily briefings, analyst recommendations, and workflow automation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Activity className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] text-emerald-600 font-medium">Launch Ready</span>
              </div>
              <div className="text-[10px] text-ink-tertiary">All systems operational</div>
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Opportunities Today', value: '7', change: '+3 vs yesterday', positive: true },
            { label: 'Recommendations', value: '3', change: 'Analyst-grade', positive: true },
            { label: 'Active Workflows', value: '6', change: 'Running', positive: true },
            { label: 'Team Online', value: '3/5', change: 'Collaborating', positive: true },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-ink-wash rounded-lg p-2.5 text-center">
              <div className="text-sm font-bold text-ink-primary">{s.value}</div>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <span className={`text-[10px] font-medium ${s.positive ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {s.change}
                </span>
              </div>
              <div className="text-[9px] text-ink-tertiary">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] sm:text-[12px] font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-accent-indigo text-white shadow-sm'
                  : 'text-ink-secondary hover:bg-surface'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.id === 'briefing' && (
                <TabBadge color={activeTab === 'briefing' ? 'bg-white/20 text-white' : 'bg-accent-indigo/10 text-accent-indigo'}>
                  Jul 20
                </TabBadge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-3 sm:px-4 lg:px-6">
        {activeTab === 'briefing' && <DailyExecutiveBriefing />}
        {activeTab === 'recommendations' && <ActionableRecommendations />}
        {activeTab === 'workflows' && <WorkflowAutomation />}
        {activeTab === 'collaboration' && <EnterpriseCollaboration />}
      </div>
    </div>
  );
}
