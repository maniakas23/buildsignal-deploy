import {
  Sunrise, TrendingUp, MapPin, FileText, Zap, AlertTriangle,
  Lightbulb, BarChart3, Calendar, ArrowUpRight, CheckCircle2,
  Clock, Globe, Building2, Truck, Droplets, School
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-19: Daily Executive Briefing
// Personalized daily intelligence summary with highest-priority
// opportunities, infrastructure activity, trends, and AI recommendations.
// ═══════════════════════════════════════════════════════════════

const TODAY = 'Monday, July 20, 2026';

const BRIEFING_STATS = {
  newOpportunities: 7,
  highConfidence: 3,
  permitFilings: 23,
  planningActions: 4,
  dotProjects: 2,
  utilityUpdates: 3,
  emergingHotspots: 2,
};

const PRIORITY_OPPORTUNITIES = [
  {
    rank: 1,
    title: 'Highway 287 Expansion — Commercial Corridor',
    county: 'Larimer County, CO',
    type: 'DOT Project',
    confidence: 94,
    value: '$30-45M',
    summary: 'CDOT expansion plans filed with commercial rezoning. 5 correlated signals detected across DOT, planning, and utility sources.',
    action: 'Review corridor parcels within 0.5 miles',
    icon: Truck,
  },
  {
    rank: 2,
    title: 'Weld County School District — New K-8 Campus',
    county: 'Weld County, CO',
    type: 'School Construction',
    confidence: 91,
    value: '$48M',
    summary: 'RFP issued for $48M campus construction. Pre-qualification window opens in 14 days. Road and sewer extensions approved.',
    action: 'Download RFP and review pre-qual requirements',
    icon: School,
  },
  {
    rank: 3,
    title: 'Xcel Energy — Substation Upgrade Program',
    county: 'Adams County, CO',
    type: 'Utilities',
    confidence: 89,
    value: '$22M',
    summary: 'Major substation upgrade with associated commercial development signals. 3 new permits filed within 0.3 miles.',
    action: 'Monitor permit activity near substation site',
    icon: Droplets,
  },
];

const INFRASTRUCTURE_ACTIVITY = [
  { category: 'Building Permits', count: 23, trend: '+8', detail: '12 commercial, 8 residential, 3 demolition' },
  { category: 'Planning Agendas', count: 4, trend: '+1', detail: '2 rezoning, 1 site plan, 1 variance' },
  { category: 'DOT Projects', count: 2, trend: '0', detail: '1 road widening, 1 bridge repair' },
  { category: 'Utility Filings', count: 3, trend: '+2', detail: '2 relocations, 1 new tap' },
  { category: 'School Construction', count: 1, trend: '+1', detail: '1 new campus RFP' },
];

const EMERGING_HOTSPOTS = [
  {
    location: 'Greeley — Highway 34 Corridor',
    signals: 8,
    trend: '+150% vs 30-day avg',
    description: 'Unusual cluster of permits, utility filings, and planning agendas suggesting coordinated development initiative.',
  },
  {
    location: 'Longmont — Downtown Core',
    signals: 5,
    trend: '+80% vs 30-day avg',
    description: 'Mixed-use development pattern emerging with 3 contiguous parcel transactions and zoning changes.',
  },
];

const AI_RECOMMENDATIONS = [
  {
    title: 'Prioritize Highway 287 corridor parcels',
    reasoning: 'Highest confidence score (94%) with strongest historical precedent. Similar corridor expansions yielded 25-40% land appreciation.',
    urgency: 'high',
  },
  {
    title: 'Schedule Weld County site visit before pre-bid',
    reasoning: 'Pre-qualification window is 14 days. Early site visit strengthens JV partnership discussions.',
    urgency: 'high',
  },
  {
    title: 'Add Greeley corridor to automated watchlist',
    reasoning: 'Emerging hotspot with 150% above-normal signal density. Automated alerts will catch new filings in real-time.',
    urgency: 'medium',
  },
  {
    title: 'Review team alert thresholds',
    reasoning: '3 high-confidence opportunities this week suggests your current thresholds are well-calibrated.',
    urgency: 'low',
  },
];

function UrgencyDot({ level }: { level: string }) {
  const colors: Record<string, string> = {
    high: 'bg-accent-crimson',
    medium: 'bg-amber-500',
    low: 'bg-blue-500',
  };
  return <span className={`w-2 h-2 rounded-full ${colors[level] || colors.low}`} />;
}

export default function DailyExecutiveBriefing() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center">
            <Sunrise className="w-5 h-5 text-accent-indigo" />
          </div>
          <div>
            <h3 className="text-base font-bold text-ink-primary">Daily Executive Briefing</h3>
            <p className="text-[11px] text-ink-tertiary flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {TODAY}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'New Opportunities', value: BRIEFING_STATS.newOpportunities, change: '+3 vs yesterday', color: 'text-accent-indigo' },
            { label: 'High-Confidence', value: BRIEFING_STATS.highConfidence, change: 'Action required', color: 'text-emerald-600' },
            { label: 'Permit Filings', value: BRIEFING_STATS.permitFilings, change: '+8 vs avg', color: 'text-blue-600' },
            { label: 'Hotspots', value: BRIEFING_STATS.emergingHotspots, change: 'Emerging', color: 'text-amber-600' },
          ].map((s) => (
            <div key={s.label} className="bg-canvas border border-ink-wash rounded-xl p-3 text-center">
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-ink-tertiary mt-0.5">{s.label}</div>
              <div className="text-[9px] text-emerald-600 font-medium mt-0.5">{s.change}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Opportunities */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-accent-indigo" />
          <h4 className="text-sm font-bold text-ink-primary">Top 3 Priority Opportunities</h4>
        </div>
        <div className="space-y-3">
          {PRIORITY_OPPORTUNITIES.map((opp) => (
            <div key={opp.rank} className="flex items-start gap-3 p-3 bg-canvas rounded-xl">
              <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-accent-indigo text-white flex items-center justify-center text-xs font-bold">
                {opp.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <opp.icon className="w-3.5 h-3.5 text-accent-indigo" />
                  <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full">
                    {opp.type}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    opp.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {opp.confidence}%
                  </span>
                </div>
                <p className="text-[12px] font-semibold text-ink-primary">{opp.title}</p>
                <p className="text-[10px] text-ink-tertiary flex items-center gap-1 mt-0.5">
                  <MapPin className="w-2.5 h-2.5" /> {opp.county} · <span className="text-emerald-600 font-medium">{opp.value}</span>
                </p>
                <p className="text-[11px] text-ink-secondary leading-relaxed mt-1.5">{opp.summary}</p>
                <div className="flex items-center gap-1.5 mt-2 p-2 bg-amber-50/50 border border-amber-200/50 rounded-lg">
                  <ArrowUpRight className="w-3 h-3 text-amber-600 flex-shrink-0" />
                  <span className="text-[10px] text-amber-800 font-medium">{opp.action}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two column: Infrastructure + Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Infrastructure Activity */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-accent-indigo" />
            <h4 className="text-sm font-bold text-ink-primary">Infrastructure Activity</h4>
          </div>
          <div className="space-y-2.5">
            {INFRASTRUCTURE_ACTIVITY.map((ia) => (
              <div key={ia.category} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-medium text-ink-secondary">{ia.category}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-bold text-ink-primary">{ia.count}</span>
                      {ia.trend !== '0' && (
                        <span className="text-[9px] text-emerald-600 font-medium">{ia.trend}</span>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-ink-wash/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-indigo rounded-full"
                      style={{ width: `${Math.min((ia.count / 25) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-ink-tertiary mt-0.5">{ia.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emerging Hotspots */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-ink-primary">Emerging Hotspots</h4>
          </div>
          <div className="space-y-3">
            {EMERGING_HOTSPOTS.map((spot) => (
              <div key={spot.location} className="p-3 bg-amber-50/30 border border-amber-200/40 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[12px] font-semibold text-ink-primary">{spot.location}</span>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold">
                    {spot.signals} signals
                  </span>
                  <span className="text-[10px] text-accent-crimson font-medium">{spot.trend}</span>
                </div>
                <p className="text-[11px] text-ink-secondary leading-relaxed">{spot.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-accent-indigo" />
          <h4 className="text-sm font-bold text-ink-primary">AI Recommendations</h4>
        </div>
        <div className="space-y-2.5">
          {AI_RECOMMENDATIONS.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-canvas rounded-xl">
              <UrgencyDot level={rec.urgency} />
              <div className="flex-1">
                <p className="text-[12px] font-medium text-ink-primary">{rec.title}</p>
                <p className="text-[11px] text-ink-secondary leading-relaxed mt-0.5">{rec.reasoning}</p>
                <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                  rec.urgency === 'high' ? 'bg-accent-crimson/10 text-accent-crimson' :
                  rec.urgency === 'medium' ? 'bg-amber-50 text-amber-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {rec.urgency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
