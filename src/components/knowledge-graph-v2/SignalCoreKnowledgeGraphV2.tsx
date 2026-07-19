import { useState } from 'react';
import {
  Layers, Zap, FileText, Globe, BarChart3, TrendingUp,
  CheckCircle2, ArrowRight, Target, Activity, Building2,
  DollarSign, Users, Truck, Lightbulb, Home, Factory,
  ChevronDown, ChevronUp, Shield, Star
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-25: SignalCore Knowledge Graph v2
// Strengthened relationships between 11 infrastructure domains.
// Recommendations explain how multiple independent signals support conclusions.
// ═══════════════════════════════════════════════════════════════

const DOMAINS = [
  { name: 'Infrastructure', icon: Layers, color: 'text-accent-indigo', count: 2847 },
  { name: 'Utilities', icon: Zap, color: 'text-blue-600', count: 1892 },
  { name: 'Permits', icon: FileText, color: 'text-emerald-600', count: 2847 },
  { name: 'Planning', icon: Globe, color: 'text-purple-600', count: 2101 },
  { name: 'Transportation', icon: Truck, color: 'text-amber-600', count: 567 },
  { name: 'Gov Investment', icon: DollarSign, color: 'text-accent-indigo', count: 2579 },
  { name: 'Commercial Dev', icon: Building2, color: 'text-emerald-600', count: 1179 },
  { name: 'Population Growth', icon: Users, color: 'text-blue-600', count: 534 },
  { name: 'Housing', icon: Home, color: 'text-amber-600', count: 867 },
  { name: 'Industrial', icon: Factory, color: 'text-purple-600', count: 312 },
  { name: 'Public Meetings', icon: Users, color: 'text-accent-indigo', count: 978 },
];

const CONVERGENCE_CLUSTERS = [
  {
    id: 'cc1',
    name: 'Highway 287 Corridor',
    confidence: 94,
    domains: [
      { domain: 'Transportation', signal: 'DOT expansion filing', weight: 22 },
      { domain: 'Planning', signal: 'Rezoning 6 parcels', weight: 18 },
      { domain: 'Utilities', signal: 'Relocation notice', weight: 16 },
      { domain: 'Permits', signal: '3 demolition permits', weight: 14 },
      { domain: 'Gov Investment', signal: '$12.4M CIP budget', weight: 16 },
      { domain: 'Infrastructure', signal: 'Road widening plan', weight: 14 },
    ],
    explanation: 'Six independent domains converge on this opportunity. Transportation and planning signals carry the highest weight because they represent regulatory commitment. Utility relocation indicates preparatory work already underway.',
  },
  {
    id: 'cc2',
    name: 'Weld County School Campus',
    confidence: 91,
    domains: [
      { domain: 'Gov Investment', signal: '$48M RFP issued', weight: 28 },
      { domain: 'Infrastructure', signal: '$4.2M road extension', weight: 18 },
      { domain: 'Utilities', signal: 'Sewer extension permit', weight: 16 },
      { domain: 'Planning', signal: 'Land use change approved', weight: 18 },
      { domain: 'Commercial Dev', signal: 'Site prep permits', weight: 12 },
      { domain: 'Public Meetings', signal: 'Board approval recorded', weight: 8 },
    ],
    explanation: 'Government investment signal dominates at 28% weight because the RFP represents committed public funding. Infrastructure and utility signals confirm site readiness. Planning approval validates the project pathway.',
  },
  {
    id: 'cc3',
    name: 'Xcel Substation Upgrade Program',
    confidence: 89,
    domains: [
      { domain: 'Utilities', signal: 'Substation upgrade filing', weight: 32 },
      { domain: 'Transportation', signal: 'Access road permit', weight: 18 },
      { domain: 'Planning', signal: 'Site approval', weight: 20 },
      { domain: 'Gov Investment', signal: 'Rate case approval', weight: 16 },
      { domain: 'Permits', signal: 'Electrical work permits', weight: 14 },
    ],
    explanation: 'Utility signals dominate at 32% weight because this is fundamentally a utility project. Government investment via rate case approval provides funding certainty. Transportation and planning signals confirm site logistics.',
  },
];

const CROSS_DOMAIN_INSIGHTS = [
  { insight: 'Projects with 5+ converging domains have 94% prediction accuracy vs. 62% for single-domain signals.', source: 'SignalCore Analysis' },
  { insight: 'Utility signals precede DOT filings by an average of 45 days, making them the earliest reliable indicator.', source: 'Historical Pattern Library' },
  { insight: 'Government investment signals (CIP, RFP, budget) carry 2.3x more weight than permit signals alone.', source: 'Confidence Engine' },
  { insight: 'Cross-domain validation from planning + infrastructure + utilities produces the highest-confidence recommendations.', source: 'Knowledge Graph' },
];

export default function SignalCoreKnowledgeGraphV2() {
  const [expandedCluster, setExpandedCluster] = useState<string | null>('cc1');

  return (
    <div className="space-y-6">
      {/* Domain Overview */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent-indigo" /> 11 Intelligence Domains
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {DOMAINS.map((d) => (
            <div key={d.name} className="bg-canvas border border-ink-wash rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <d.icon className={`w-4 h-4 ${d.color}`} />
                <span className="text-[11px] font-semibold text-ink-primary">{d.name}</span>
              </div>
              <div className="text-lg font-bold text-ink-primary">{d.count.toLocaleString()}</div>
              <div className="text-[8px] text-ink-tertiary">signals tracked</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Domain Insights */}
      <div className="bg-accent-indigo/[0.03] border border-accent-indigo/10 rounded-2xl p-5">
        <h4 className="text-sm font-bold text-accent-indigo mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" /> Cross-Domain Validation Insights
        </h4>
        <div className="space-y-2">
          {CROSS_DOMAIN_INSIGHTS.map((ci, i) => (
            <div key={i} className="p-3 bg-surface rounded-lg">
              <p className="text-[11px] text-ink-secondary leading-relaxed">{ci.insight}</p>
              <span className="text-[9px] text-accent-indigo font-medium">{ci.source}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Convergence Clusters */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-ink-primary flex items-center gap-2">
          <Target className="w-4 h-4 text-accent-indigo" /> Multi-Domain Convergence Clusters
        </h4>
        {CONVERGENCE_CLUSTERS.map((cc) => {
          const expanded = expandedCluster === cc.id;
          return (
            <div key={cc.id} className="bg-surface border border-ink-wash rounded-2xl overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className="text-sm font-bold text-ink-primary">{cc.name}</h5>
                    <span className={`text-lg font-bold ${cc.confidence >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{cc.confidence}%</span>
                    <span className="text-[9px] text-ink-tertiary ml-1">confidence</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full font-bold">
                    {cc.domains.length} domains
                  </span>
                </div>
                <p className="text-[11px] text-ink-secondary mb-3">{cc.explanation}</p>
                <button
                  onClick={() => setExpandedCluster(expanded ? null : cc.id)}
                  className="text-[10px] text-accent-indigo font-medium flex items-center gap-1"
                >
                  {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {expanded ? 'Hide' : 'View'} domain breakdown
                </button>
              </div>
              {expanded && (
                <div className="border-t border-ink-wash px-5 py-4">
                  <div className="space-y-2">
                    {cc.domains.map((d, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-accent-indigo">{d.domain}</span>
                            <span className="text-[10px] text-ink-secondary">{d.signal}</span>
                          </div>
                          <span className="text-[10px] font-bold text-ink-primary">{d.weight}%</span>
                        </div>
                        <div className="h-1.5 bg-ink-wash/30 rounded-full overflow-hidden">
                          <div className="h-full bg-accent-indigo rounded-full" style={{ width: `${d.weight * 2.5}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-[10px] text-emerald-700">
                      <span className="font-semibold">Cross-domain validation:</span> Signals from {cc.domains.length} independent domains converge.
                      Each domain represents a separate validation chain, dramatically increasing confidence.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
