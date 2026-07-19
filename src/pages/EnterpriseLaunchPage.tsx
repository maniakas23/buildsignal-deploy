import { useState } from 'react';
import {
  Brain, BarChart3, Zap, Users, Building2, Shield,
  Activity, TrendingUp
} from 'lucide-react';
import DecisionIntelligencePanel from '@/components/decision/DecisionIntelligencePanel';
import ExecutiveDashboard from '@/components/executive/ExecutiveDashboard';
import CustomerProductivityHub from '@/components/productivity/CustomerProductivityHub';
import EnterpriseFeaturesPanel from '@/components/enterprise/EnterpriseFeaturesPanel';

// ═══════════════════════════════════════════════════════════════
// PI-18: Enterprise Launch, Decision Intelligence & Competitive Moat
// Capstone page with executive dashboard, decision intelligence,
// customer productivity, and enterprise features.
// ═══════════════════════════════════════════════════════════════

const TABS = [
  { id: 'executive', label: 'Executive', icon: BarChart3 },
  { id: 'intelligence', label: 'Decisions', icon: Brain },
  { id: 'productivity', label: 'Productivity', icon: Zap },
  { id: 'enterprise', label: 'Enterprise', icon: Building2 },
] as const;

function TabBadge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${color}`}>
      {children}
    </span>
  );
}

export default function EnterpriseLaunchPage() {
  const [activeTab, setActiveTab] = useState<string>('executive');

  return (
    <div className="min-h-screen pb-20 md:pb-6">
      {/* Header */}
      <div className="px-3 sm:px-4 lg:px-6 pt-4 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5 text-accent-indigo" />
              <h1 className="text-lg sm:text-xl font-bold text-ink-primary">
                Enterprise Launch
              </h1>
              <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-2 py-0.5 rounded-full uppercase tracking-wide">
                PI-18
              </span>
            </div>
            <p className="text-[12px] text-ink-tertiary">
              Decision intelligence, executive dashboard, productivity tools, and enterprise features.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Activity className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] text-emerald-600 font-medium">All Systems Operational</span>
              </div>
              <div className="text-[10px] text-ink-tertiary">99.97% uptime</div>
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Opportunities', value: '127', change: '+12 this week', positive: true },
            { label: 'Confidence', value: '91%', change: '+3.2% avg', positive: true },
            { label: 'Active Users', value: '342', change: '+24 this week', positive: true },
            { label: 'Team Members', value: '5', change: '3 active now', positive: true },
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
              {tab.id === 'intelligence' && (
                <TabBadge color={activeTab === 'intelligence' ? 'bg-white/20 text-white' : 'bg-accent-indigo/10 text-accent-indigo'}>
                  3
                </TabBadge>
              )}
              {tab.id === 'enterprise' && (
                <TabBadge color={activeTab === 'enterprise' ? 'bg-white/20 text-white' : 'bg-accent-indigo/10 text-accent-indigo'}>
                  5
                </TabBadge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-3 sm:px-4 lg:px-6">
        {activeTab === 'executive' && <ExecutiveDashboard />}
        {activeTab === 'intelligence' && <DecisionIntelligencePanel />}
        {activeTab === 'productivity' && <CustomerProductivityHub />}
        {activeTab === 'enterprise' && <EnterpriseFeaturesPanel />}
      </div>
    </div>
  );
}
