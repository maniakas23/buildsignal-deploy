import {
  Layers, Zap, FileText, Globe, BarChart3,
  TrendingUp, CheckCircle2, ArrowRight, Target,
  Activity, Building2, DollarSign, Users, Truck,
  Lightbulb, Shield
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-23: SignalCore Knowledge Graph
// Relationships between permits, planning, utilities, DOT,
// CIP, spending, economic dev, public meetings.
// Shows why multiple signals increase confidence.
// ═══════════════════════════════════════════════════════════════

const SIGNAL_TYPES = [
  { type: 'Permits', count: 847, trend: '+14%', icon: FileText, color: 'text-accent-indigo', description: 'Building, demolition, and construction permits' },
  { type: 'Planning Agendas', count: 234, trend: '+8%', icon: Globe, color: 'text-emerald-600', description: 'Zoning changes, rezoning approvals, land use' },
  { type: 'DOT Projects', count: 156, trend: '+22%', icon: Truck, color: 'text-amber-600', description: 'Highway expansions, road widening, bridge work' },
  { type: 'CIP Budgets', count: 89, trend: '+18%', icon: DollarSign, color: 'text-accent-indigo', description: 'Capital improvement plans and budget approvals' },
  { type: 'Utility Filings', count: 312, trend: '+11%', icon: Zap, color: 'text-blue-600', description: 'Power, water, sewer, gas relocations and upgrades' },
  { type: 'Public Meetings', count: 178, trend: '+15%', icon: Users, color: 'text-purple-600', description: 'Hearings, notices, community feedback sessions' },
  { type: 'School Contracts', count: 67, trend: '+31%', icon: Building2, color: 'text-emerald-600', description: 'RFPs, campus construction, district expansions' },
  { type: 'Gov Spending', count: 445, trend: '+12%', icon: BarChart3, color: 'text-accent-indigo', description: 'Procurement notices, awarded contracts, bids' },
];

const RELATIONSHIP_CLUSTERS = [
  {
    id: 'cluster-1',
    name: 'Highway 287 Corridor',
    signals: [
      { type: 'DOT', label: 'Expansion filing', weight: 28 },
      { type: 'Planning', label: 'Rezoning 6 parcels', weight: 24 },
      { type: 'Utility', label: 'Relocation notice', weight: 18 },
      { type: 'Permits', label: '3 demolition permits', weight: 16 },
      { type: 'CIP', label: '$12.4M budget', weight: 14 },
    ],
    totalConfidence: 94,
    county: 'Larimer County, CO',
  },
  {
    id: 'cluster-2',
    name: 'Weld County School Campus',
    signals: [
      { type: 'School', label: '$48M RFP issued', weight: 35 },
      { type: 'CIP', label: '$4.2M road extension', weight: 22 },
      { type: 'Utility', label: 'Sewer extension', weight: 20 },
      { type: 'Planning', label: 'Land use change', weight: 23 },
    ],
    totalConfidence: 91,
    county: 'Weld County, CO',
  },
  {
    id: 'cluster-3',
    name: 'Xcel Substation Upgrade',
    signals: [
      { type: 'Utility', label: 'Substation upgrade', weight: 45 },
      { type: 'DOT', label: 'Access road permit', weight: 25 },
      { type: 'Planning', label: 'Site approval', weight: 30 },
    ],
    totalConfidence: 89,
    county: 'Adams County, CO',
  },
];

const WHY_MULTIPLE_SIGNALS = [
  { count: '1 signal', confidence: '~45%', color: 'bg-blue-400' },
  { count: '2 signals', confidence: '~62%', color: 'bg-blue-500' },
  { count: '3 signals', confidence: '~75%', color: 'bg-accent-indigo' },
  { count: '4 signals', confidence: '~86%', color: 'bg-accent-indigo' },
  { count: '5+ signals', confidence: '~93%', color: 'bg-emerald-500' },
];

export default function SignalCoreKnowledgeGraph() {
  return (
    <div className="space-y-6">
      {/* Signal Type Overview */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent-indigo" /> Signal Sources
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SIGNAL_TYPES.map((st) => (
            <div key={st.type} className="bg-canvas border border-ink-wash rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <st.icon className={`w-4 h-4 ${st.color}`} />
                <span className="text-[11px] font-semibold text-ink-primary">{st.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-ink-primary">{st.count}</span>
                <span className="text-[10px] text-emerald-600 font-medium">{st.trend}</span>
              </div>
              <p className="text-[8px] text-ink-tertiary mt-0.5">{st.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Multiple Signals Increase Confidence */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-accent-indigo" /> Why Multiple Signals Increase Confidence
        </h4>
        <div className="flex items-end gap-1.5 h-20 px-2 mb-2">
          {WHY_MULTIPLE_SIGNALS.map((w) => (
            <div key={w.count} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] text-ink-secondary font-medium">{w.confidence}</span>
              <div className={`w-full ${w.color} rounded-t-sm`} style={{ height: `${parseInt(w.confidence) * 0.8}%` }} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 px-2">
          {WHY_MULTIPLE_SIGNALS.map((w) => (
            <div key={w.count} className="flex-1 text-center">
              <span className="text-[8px] text-ink-tertiary">{w.count}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-ink-secondary mt-3 leading-relaxed">
          Each independent signal source that confirms the same opportunity adds a multiplicative factor to confidence.
          Signals from different domains (e.g., DOT + Planning + Utility) carry more weight than multiple signals from
          the same source, as they represent independent validation chains.
        </p>
      </div>

      {/* Relationship Clusters */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-ink-primary flex items-center gap-2">
          <Target className="w-4 h-4 text-accent-indigo" /> Signal Convergence Clusters
        </h4>
        {RELATIONSHIP_CLUSTERS.map((cluster) => (
          <div key={cluster.id} className="bg-surface border border-ink-wash rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h5 className="text-sm font-bold text-ink-primary">{cluster.name}</h5>
                <span className="text-[10px] text-ink-tertiary">{cluster.county}</span>
              </div>
              <div className="text-right">
                <span className={`text-lg font-bold ${cluster.totalConfidence >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {cluster.totalConfidence}%
                </span>
                <span className="text-[9px] text-ink-tertiary block">confidence</span>
              </div>
            </div>

            <div className="space-y-2">
              {cluster.signals.map((s, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-accent-indigo">{s.type}</span>
                      <span className="text-[10px] text-ink-secondary">{s.label}</span>
                    </div>
                    <span className="text-[10px] font-bold text-ink-primary">{s.weight}%</span>
                  </div>
                  <div className="h-1.5 bg-ink-wash/30 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-indigo rounded-full" style={{ width: `${s.weight}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 p-2 bg-accent-indigo/[0.03] rounded-lg">
              <p className="text-[10px] text-ink-secondary">
                <span className="font-semibold">{cluster.signals.length} independent signals</span> from {new Set(cluster.signals.map((s) => s.type)).size} different source categories converge on this opportunity.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
