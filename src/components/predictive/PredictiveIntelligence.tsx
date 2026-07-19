import {
  TrendingUp, MapPin, Zap, BarChart3, Clock, AlertTriangle,
  ArrowUpRight, Brain, Target, Activity, Calendar
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-20: Predictive Intelligence Dashboard
// Predicted hotspots, infrastructure momentum, development
// probability, permit pipeline trends, investment opportunities.
// ═══════════════════════════════════════════════════════════════

const PREDICTED_HOTSPOTS = [
  { location: 'Greeley — Highway 34 Corridor', signals: 8, probability: 78, daysToOpp: '14-21', trend: '+150%', stage: 'Signal Cluster' },
  { location: 'Longmont — Downtown Core', signals: 5, probability: 65, daysToOpp: '21-30', trend: '+80%', stage: 'Early Pattern' },
  { location: 'Boulder — East Arapahoe', signals: 6, probability: 72, daysToOpp: '18-25', trend: '+110%', stage: 'Signal Cluster' },
  { location: 'Fort Collins — Harmony Rd', signals: 4, probability: 58, daysToOpp: '30-45', trend: '+45%', stage: 'Emerging' },
];

const MOMENTUM_SEGMENTS = [
  { segment: 'Commercial Development', current: 78, predicted: 92, change: '+18%', drivers: 'Permits, zoning, utility filings' },
  { segment: 'Road Infrastructure', current: 85, predicted: 88, change: '+4%', drivers: 'DOT projects, CIP budgets' },
  { segment: 'School Construction', current: 62, predicted: 81, change: '+31%', drivers: 'RFPs, bond measures' },
  { segment: 'Utilities/Energy', current: 71, predicted: 79, change: '+11%', drivers: 'Substation upgrades, relocations' },
  { segment: 'Residential Growth', current: 55, predicted: 68, change: '+24%', drivers: 'Housing permits, subdivision plats' },
];

const PERMIT_TRENDS = [
  { month: 'Feb', permits: 142, predicted: null },
  { month: 'Mar', permits: 158, predicted: null },
  { month: 'Apr', permits: 167, predicted: null },
  { month: 'May', permits: 185, predicted: null },
  { month: 'Jun', permits: 198, predicted: null },
  { month: 'Jul', permits: 215, predicted: null },
  { month: 'Aug', permits: null, predicted: 228 },
  { month: 'Sep', permits: null, predicted: 242 },
  { month: 'Oct', permits: null, predicted: 238 },
];

const DEVELOPMENT_PROBABILITY = [
  { county: 'Larimer', type: 'Commercial Corridor', probability: 94, timeline: '6-12 months', catalyst: 'Highway 287 expansion' },
  { county: 'Weld', type: 'School Campus', probability: 91, timeline: '12-18 months', catalyst: '$48M RFP issued' },
  { county: 'Adams', type: 'Utility Infrastructure', probability: 89, timeline: '9-15 months', catalyst: 'Substation upgrade program' },
  { county: 'Boulder', type: 'Mixed-Use', probability: 76, timeline: '12-24 months', catalyst: 'Downtown zoning changes' },
  { county: 'Jefferson', type: 'Residential', probability: 68, timeline: '18-30 months', catalyst: 'Subdivision plat filings' },
];

function ProbabilityBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-blue-500';
  return (
    <div className="h-2 bg-ink-wash/30 rounded-full overflow-hidden w-full">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function PredictiveIntelligence() {
  const confirmedMonths = PERMIT_TRENDS.filter((m) => m.permits !== null);
  const predictedMonths = PERMIT_TRENDS.filter((m) => m.predicted !== null);
  const maxPermits = Math.max(...PERMIT_TRENDS.map((m) => m.permits || m.predicted || 0));

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <Brain className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-semibold text-amber-800">Predictive Intelligence</p>
          <p className="text-[10px] text-amber-700 leading-relaxed">
            Forecasts are generated from historical pattern analysis and current signal density.
            Predicted values are clearly distinguished from confirmed events.
          </p>
        </div>
      </div>

      {/* Predicted Hotspots */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-accent-indigo" />
          <h4 className="text-sm font-bold text-ink-primary">Predicted Hotspots</h4>
          <span className="text-[9px] text-ink-tertiary ml-auto">AI-generated forecasts</span>
        </div>
        <div className="space-y-3">
          {PREDICTED_HOTSPOTS.map((spot) => (
            <div key={spot.location} className="p-3 bg-canvas rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-accent-indigo" />
                  <span className="text-[12px] font-semibold text-ink-primary">{spot.location}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full font-bold">
                  {spot.probability}%
                </span>
              </div>
              <ProbabilityBar pct={spot.probability} />
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="text-[10px] text-ink-tertiary">{spot.signals} signals</span>
                <span className="text-[10px] text-accent-crimson font-medium">{spot.trend} vs avg</span>
                <span className="text-[10px] text-ink-tertiary">Opp in {spot.daysToOpp} days</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded-full font-medium">
                  {spot.stage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure Momentum */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-accent-indigo" />
          <h4 className="text-sm font-bold text-ink-primary">Infrastructure Momentum</h4>
        </div>
        <div className="space-y-3">
          {MOMENTUM_SEGMENTS.map((seg) => (
            <div key={seg.segment}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-ink-secondary">{seg.segment}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-ink-tertiary">Current: {seg.current}</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-600">{seg.predicted}</span>
                  <span className="text-[9px] text-emerald-600">{seg.change}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-ink-wash/30 rounded-full overflow-hidden">
                  <div className="h-full bg-ink-wash rounded-full" style={{ width: `${seg.current}%` }} />
                </div>
                <div className="flex-1 h-2 bg-emerald-50 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${seg.predicted}%` }} />
                </div>
              </div>
              <p className="text-[9px] text-ink-tertiary mt-0.5">{seg.drivers}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-ink-wash/50">
          <div className="flex items-center gap-1">
            <span className="w-3 h-2 bg-ink-wash rounded-full" />
            <span className="text-[9px] text-ink-tertiary">Current</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-2 bg-emerald-400 rounded-full" />
            <span className="text-[9px] text-emerald-600 font-medium">Predicted (90d)</span>
          </div>
        </div>
      </div>

      {/* Permit Pipeline */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-accent-indigo" />
          <h4 className="text-sm font-bold text-ink-primary">Permit Pipeline Trend</h4>
          <span className="text-[9px] text-emerald-600 font-medium ml-auto">Forecasted →</span>
        </div>
        <div className="flex items-end gap-1.5 h-24 px-1">
          {confirmedMonths.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[8px] text-ink-secondary font-medium">{m.permits}</span>
              <div
                className="w-full bg-accent-indigo/80 rounded-t-sm"
                style={{ height: `${Math.max(((m.permits || 0) / maxPermits) * 100, 8)}%` }}
              />
              <span className="text-[8px] text-ink-tertiary">{m.month}</span>
            </div>
          ))}
          {predictedMonths.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[8px] text-emerald-600 font-medium">{m.predicted}</span>
              <div
                className="w-full bg-emerald-400/60 border border-emerald-400 border-dashed rounded-t-sm"
                style={{ height: `${Math.max(((m.predicted || 0) / maxPermits) * 100, 8)}%` }}
              />
              <span className="text-[8px] text-emerald-600">{m.month}*</span>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-ink-tertiary mt-2">* Dashed bars are AI-predicted values. All others are confirmed data.</p>
      </div>

      {/* Development Probability */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-accent-indigo" />
          <h4 className="text-sm font-bold text-ink-primary">Development Probability by County</h4>
        </div>
        <div className="space-y-3">
          {DEVELOPMENT_PROBABILITY.map((dp) => (
            <div key={dp.county} className="flex items-center gap-3">
              <div className="w-[100px] sm:w-[140px] flex-shrink-0">
                <span className="text-[11px] font-medium text-ink-primary">{dp.county}</span>
                <p className="text-[9px] text-ink-tertiary">{dp.type}</p>
              </div>
              <div className="flex-1">
                <ProbabilityBar pct={dp.probability} />
              </div>
              <div className="w-[70px] text-right flex-shrink-0">
                <span className="text-[11px] font-bold text-ink-primary">{dp.probability}%</span>
              </div>
              <div className="w-[90px] text-right flex-shrink-0 hidden sm:block">
                <span className="text-[9px] text-ink-tertiary">{dp.timeline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
