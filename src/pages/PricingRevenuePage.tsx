import { useState } from 'react';
import {
  CreditCard, BarChart3, Layers, ToggleLeft, Timer,
  TicketPercent, TrendingUp, Users, Activity
} from 'lucide-react';
import PricingTiers from '@/components/pricing/PricingTiers';
import FeatureComparisonTable from '@/components/pricing/FeatureComparisonTable';
import PricingAdminPanel from '@/components/pricing/PricingAdminPanel';
import RevenueOperationsDashboard from '@/components/pricing/RevenueOperationsDashboard';

// ═══════════════════════════════════════════════════════════════
// PI-17: Pricing, Packaging & Revenue Optimization
// Capstone page with tabbed navigation across pricing tiers,
// feature comparison, admin panel, and revenue operations.
// ═══════════════════════════════════════════════════════════════

const TABS = [
  { id: 'pricing', label: 'Pricing', icon: CreditCard },
  { id: 'compare', label: 'Compare', icon: Layers },
  { id: 'revenue', label: 'Revenue', icon: TrendingUp },
  { id: 'funnel', label: 'Funnel', icon: Users },
  { id: 'admin', label: 'Admin', icon: Activity },
] as const;

function TabBadge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${color}`}>
      {children}
    </span>
  );
}

export default function PricingRevenuePage() {
  const [activeTab, setActiveTab] = useState<string>('pricing');

  return (
    <div className="min-h-screen pb-20 md:pb-6">
      {/* Header */}
      <div className="px-3 sm:px-4 lg:px-6 pt-4 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-5 h-5 text-accent-indigo" />
              <h1 className="text-lg sm:text-xl font-bold text-ink-primary">
                Pricing & Revenue
              </h1>
              <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-2 py-0.5 rounded-full uppercase tracking-wide">
                PI-17
              </span>
            </div>
            <p className="text-[12px] text-ink-tertiary">
              Commercial pricing, packaging, and revenue optimization for launch readiness.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-lg font-bold text-emerald-600">$285K</div>
              <div className="text-[10px] text-ink-tertiary">MRR · +12.4%</div>
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { label: 'MRR', value: '$285,113', change: '+12.4%', positive: true },
            { label: 'ARR', value: '$3.42M', change: '+15.2%', positive: true },
            { label: 'Subscribers', value: '1,010', change: '+8.2%', positive: true },
            { label: 'Churn', value: '4.2%', change: '-1.3%', positive: true },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-ink-wash rounded-lg p-2.5 text-center">
              <div className="text-sm font-bold text-ink-primary">{s.value}</div>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <span className={`text-[10px] font-medium ${s.positive ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {s.change}
                </span>
                <span className="text-[9px] text-ink-tertiary">{s.label}</span>
              </div>
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
              {tab.id === 'pricing' && (
                <TabBadge color="bg-white/20 text-white">4 Tiers</TabBadge>
              )}
              {tab.id === 'admin' && (
                <TabBadge color={activeTab === 'admin' ? 'bg-white/20 text-white' : 'bg-accent-indigo/10 text-accent-indigo'}>
                  Tools
                </TabBadge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-3 sm:px-4 lg:px-6">
        {activeTab === 'pricing' && <PricingTiers />}

        {activeTab === 'compare' && <FeatureComparisonTable />}

        {activeTab === 'revenue' && <RevenueOperationsDashboard />}

        {activeTab === 'funnel' && (
          <div className="space-y-6">
            {/* Re-use the revenue dashboard for the full funnel view */}
            <RevenueOperationsDashboard />
          </div>
        )}

        {activeTab === 'admin' && <PricingAdminPanel />}
      </div>
    </div>
  );
}
