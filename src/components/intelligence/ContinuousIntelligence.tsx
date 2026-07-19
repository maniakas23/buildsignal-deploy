import { useState } from 'react';
import {
  Sun, Calendar, BarChart3, TrendingUp, Clock,
  CheckCircle2, AlertTriangle, ArrowRight, Target,
  Zap, FileText, MapPin, DollarSign, Users,
  Star, ChevronDown, ChevronUp, Brain, Layers,
  Globe, Activity, Shield, Sparkles
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-24: Continuous Intelligence
// Morning Brief · Weekly Summary · Monthly Executive Report
// Quarterly Trend Review · Annual Infrastructure Outlook
// Every report explains why the information matters.
// ═══════════════════════════════════════════════════════════════

const REPORT_PERIODS = [
  { id: 'morning', label: 'Morning Brief', icon: Sun, desc: 'Daily intelligence summary' },
  { id: 'weekly', label: 'Weekly', icon: Calendar, desc: '7-day intelligence review' },
  { id: 'monthly', label: 'Monthly', icon: BarChart3, desc: 'Executive report' },
  { id: 'quarterly', label: 'Quarterly', icon: TrendingUp, desc: 'Trend analysis' },
  { id: 'annual', label: 'Annual', icon: Globe, desc: 'Infrastructure outlook' },
] as const;

// ── Morning Brief ──────────────────────────────────────────
const MORNING_BRIEF = {
  date: 'Monday, July 20, 2026',
  newOpportunities: 3,
  updatedProjects: 7,
  priorityAction: 'Pull parcel records — Highway 287 (due today)',
  headlines: [
    { text: 'Highway 287: 5 signals now converged — confidence raised to 94%', why: 'DOT filing + rezoning + utility relocation creates highest-confidence pattern' },
    { text: 'Weld County $48M RFP: Pre-qual deadline in 13 days', why: 'Early preparation increases win probability by 25-40%' },
    { text: 'Denver Metro: 12 new hot signals in past 24 hours', why: 'Regional momentum accelerating — I-25 expansion entering planning phase' },
  ],
  todaysActions: [
    { task: 'Pull parcel records — Highway 287', deadline: 'Today', priority: 'critical', impact: 'Miss window = 25-40% appreciation lost' },
    { task: 'Verify bonding capacity for $48M RFP', deadline: 'Today', priority: 'high', impact: 'Determines JV strategy' },
    { task: 'Review weekly infrastructure report', deadline: 'Today', priority: 'medium', impact: 'Stay current on regional activity' },
  ],
};

// ── Weekly Summary ─────────────────────────────────────────
const WEEKLY_SUMMARY = {
  period: 'Jul 13 — Jul 20, 2026',
  newOpportunities: 12,
  qualifiedOpportunities: 5,
  projectsUpdated: 23,
  signalsDetected: 47,
  topRegions: [
    { region: 'Denver Metro', newProjects: 8, trend: '+24%', why: 'I-25 expansion planning driving multi-agency coordination' },
    { region: 'Larimer County', newProjects: 5, trend: '+18%', why: 'Highway 287 corridor attracting concentrated investment' },
    { region: 'Weld County', newProjects: 4, trend: '+31%', why: 'School district capital program entering active phase' },
  ],
  keyDevelopments: [
    { event: 'CDOT filed HWY-287-EXP-2026 expansion plan', impact: 'Creates $30-45M land acquisition opportunity', type: 'opportunity' },
    { event: 'WCSD issued $48M K-8 campus RFP', impact: 'Largest public contract in Weld County this year', type: 'opportunity' },
    { event: 'Xcel Energy filed substation upgrade notice', impact: 'Multi-phase $22M utility project starting', type: 'opportunity' },
    { event: 'Boulder County approved downtown rezoning', impact: 'Commercial development opportunity, 15-25M', type: 'planning' },
  ],
  recommendations: [
    { action: 'Prioritize Highway 287 land acquisition', rationale: 'Highest confidence score (94%) with closing window', urgency: 'immediate' },
    { action: 'Begin Weld RFP pre-qualification', rationale: '13-day deadline requires immediate action', urgency: 'this-week' },
    { action: 'Expand Denver Metro monitoring', rationale: '24% growth signals emerging opportunities', urgency: 'this-week' },
  ],
};

// ── Monthly Executive Report ───────────────────────────────
const MONTHLY_REPORT = {
  month: 'July 2026',
  totalOpportunities: 34,
  highConfidenceOpps: 12,
  averageConfidence: 87,
  totalValue: '$340M+',
  newRegionsAdded: 2,
  signalSources: 8,
  pipelineHealth: 'strong',
  keyMetrics: [
    { label: 'Discovery Rate', value: '+18%', trend: 'up', why: 'New DOT and utility data sources added' },
    { label: 'Qualification Speed', value: '2.3 days', trend: 'improved', why: 'AI confidence scoring reducing manual review' },
    { label: 'Signal Convergence', value: '4.2 avg', trend: 'up', why: 'More independent sources confirming each opportunity' },
    { label: 'Customer Actions', value: '23', trend: 'up', why: 'Higher confidence driving more follow-through' },
  ],
  topOpportunities: [
    { rank: 1, title: 'Highway 287 Corridor', value: '$30-45M', confidence: 94, stage: 'Qualified', why: '5-signal convergence, acquisition window open' },
    { rank: 2, title: 'Weld School Campus RFP', value: '$48M', confidence: 91, stage: 'Active', why: 'Public contract, pre-qualification underway' },
    { rank: 3, title: 'Xcel Substation Upgrade', value: '$22M', confidence: 89, stage: 'Discovered', why: 'Multi-phase utility project, early entry' },
  ],
  outlook: 'Pipeline remains strong with 34 active opportunities. Denver Metro and Front Range North showing accelerating momentum. Recommend increasing monitoring capacity for corridor expansions.',
};

// ── Quarterly Trend Review ─────────────────────────────────
const QUARTERLY_REVIEW = {
  quarter: 'Q2 2026 (Apr — Jun)',
  opportunitiesTracked: 89,
  avgConfidence: 84,
  completionRate: 72,
  accuracyRate: 91,
  customerSatisfaction: 4.6,
  trends: [
    { category: 'DOT/Corridor', count: 23, trend: '+35%', why: 'Infrastructure bill funding reaching state DOTs' },
    { category: 'Public Contracts', count: 18, trend: '+22%', why: 'School districts accelerating capital programs' },
    { category: 'Utility Projects', count: 15, trend: '+18%', why: 'Grid modernization driving upgrade filings' },
    { category: 'Commercial Dev', count: 21, trend: '+28%', why: 'Rezoning activity increasing in growth corridors' },
    { category: 'Housing', count: 12, trend: '+15%', why: 'Population growth driving residential permits' },
  ],
  performance: [
    { metric: 'Discovery Accuracy', actual: '91%', target: '85%', status: 'exceeds' },
    { metric: 'Qualification Speed', actual: '2.3 days', target: '3 days', status: 'exceeds' },
    { metric: 'Customer Actions', actual: '67', target: '50', status: 'exceeds' },
    { metric: 'Signal Coverage', actual: '8 sources', target: '6 sources', status: 'exceeds' },
  ],
  strategicInsights: [
    'DOT corridor expansions are the highest-value opportunity category, with 35% quarterly growth and average project values of $30-50M.',
    'Signal convergence from 4+ independent sources produces 91% accuracy rate — continuing to expand data sources is the top priority.',
    'Customer action rate correlates directly with confidence scores above 85%. Recommend prioritizing opportunities that reach this threshold.',
  ],
};

// ── Annual Infrastructure Outlook ──────────────────────────
const ANNUAL_OUTLOOK = {
  year: '2026 Outlook',
  theme: 'Infrastructure Investment Acceleration',
  projectedOpportunities: 420,
  projectedValue: '$2.8B',
  keyDrivers: [
    { driver: 'Federal Infrastructure Bill', impact: '$1.2T over 5 years', effect: 'State DOT funding increasing 40% YoY' },
    { driver: 'Population Growth', impact: '+2.4% annually', effect: 'Housing and school construction demand rising' },
    { driver: 'Grid Modernization', impact: '$15B program', effect: 'Utility upgrade projects accelerating' },
    { driver: 'Climate Resilience', impact: 'New funding streams', effect: 'Flood control and resilience projects emerging' },
  ],
  regionalForecast: [
    { region: 'Denver Metro', projection: '$850M', confidence: 'high', drivers: 'I-25, airport expansion, rail' },
    { region: 'Front Range North', projection: '$620M', confidence: 'high', drivers: 'Hwy 287, Poudre corridor' },
    { region: 'Colorado Springs', projection: '$480M', confidence: 'medium', drivers: 'Pikes Peak, military facilities' },
    { region: 'Western Slope', projection: '$310M', confidence: 'medium', drivers: 'Energy, recreation infrastructure' },
  ],
  strategicRecommendations: [
    'Expand SignalCore coverage to 12+ signal sources by Q3 2026',
    'Develop corridor-specific monitoring for I-25, Highway 287, and Pikes Peak',
    'Build predictive models for 6-month opportunity forecasting',
    'Establish partnerships with regional planning organizations',
  ],
};

export default function ContinuousIntelligence() {
  const [period, setPeriod] = useState<typeof REPORT_PERIODS[number]['id']>('morning');

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex flex-wrap gap-1 p-1 bg-canvas border border-ink-wash rounded-xl w-fit">
        {REPORT_PERIODS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              period === p.id ? 'bg-accent-indigo text-white' : 'text-ink-secondary hover:bg-surface'
            }`}
          >
            <p.icon className="w-3.5 h-3.5" />
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Morning Brief ── */}
      {period === 'morning' && (
        <div className="space-y-4">
          <div className="bg-accent-indigo/[0.03] border border-accent-indigo/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sun className="w-5 h-5 text-accent-indigo" />
              <h3 className="text-sm font-bold text-accent-indigo">Morning Brief — {MORNING_BRIEF.date}</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-surface border border-ink-wash rounded-lg p-2.5 text-center">
                <div className="text-lg font-bold text-accent-indigo">{MORNING_BRIEF.newOpportunities}</div>
                <div className="text-[8px] text-ink-tertiary">New Opportunities</div>
              </div>
              <div className="bg-surface border border-ink-wash rounded-lg p-2.5 text-center">
                <div className="text-lg font-bold text-accent-indigo">{MORNING_BRIEF.updatedProjects}</div>
                <div className="text-[8px] text-ink-tertiary">Updated Projects</div>
              </div>
              <div className="bg-surface border border-ink-wash rounded-lg p-2.5 text-center">
                <div className="text-[11px] font-bold text-accent-crimson leading-tight">Action Required</div>
                <div className="text-[8px] text-ink-tertiary mt-0.5">Priority task today</div>
              </div>
            </div>
            <div className="p-2.5 bg-accent-crimson/5 border border-accent-crimson/20 rounded-lg">
              <p className="text-[11px] font-semibold text-accent-crimson flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> {MORNING_BRIEF.priorityAction}
              </p>
            </div>
          </div>

          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-indigo" /> Key Headlines
            </h4>
            <div className="space-y-3">
              {MORNING_BRIEF.headlines.map((h, i) => (
                <div key={i} className="p-3 bg-canvas rounded-lg">
                  <p className="text-[12px] font-semibold text-ink-primary mb-1">{h.text}</p>
                  <p className="text-[10px] text-ink-secondary leading-relaxed"><span className="text-accent-indigo font-medium">Why it matters:</span> {h.why}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-indigo" /> Today's Actions
            </h4>
            <div className="space-y-2">
              {MORNING_BRIEF.todaysActions.map((a, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 bg-canvas rounded-lg">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-indigo text-white flex items-center justify-center text-[9px] font-bold">{i + 1}</span>
                  <div className="flex-1">
                    <span className="text-[11px] font-medium text-ink-primary">{a.task}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] text-accent-crimson font-medium">{a.deadline}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${a.priority === 'critical' ? 'bg-accent-crimson/10 text-accent-crimson' : 'bg-amber-50 text-amber-700'}`}>
                        {a.priority}
                      </span>
                    </div>
                    <p className="text-[10px] text-ink-secondary mt-1"><span className="text-accent-indigo font-medium">Impact:</span> {a.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Weekly Summary ── */}
      {period === 'weekly' && (
        <div className="space-y-4">
          <div className="bg-accent-indigo/[0.03] border border-accent-indigo/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-accent-indigo" />
              <h3 className="text-sm font-bold text-accent-indigo">Weekly Intelligence — {WEEKLY_SUMMARY.period}</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'New Opps', value: WEEKLY_SUMMARY.newOpportunities },
                { label: 'Qualified', value: WEEKLY_SUMMARY.qualifiedOpportunities },
                { label: 'Updated', value: WEEKLY_SUMMARY.projectsUpdated },
                { label: 'Signals', value: WEEKLY_SUMMARY.signalsDetected },
              ].map((s) => (
                <div key={s.label} className="bg-surface border border-ink-wash rounded-lg p-2.5 text-center">
                  <div className="text-lg font-bold text-accent-indigo">{s.value}</div>
                  <div className="text-[8px] text-ink-tertiary">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-accent-indigo" /> Top Regions
            </h4>
            <div className="space-y-2">
              {WEEKLY_SUMMARY.topRegions.map((r, i) => (
                <div key={i} className="p-3 bg-canvas rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-ink-primary">{r.region}</span>
                    <span className="text-[10px] font-bold text-emerald-600">{r.trend}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] text-ink-tertiary">{r.newProjects} new projects</span>
                  </div>
                  <p className="text-[10px] text-ink-secondary"><span className="text-accent-indigo font-medium">Why:</span> {r.why}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-surface border border-ink-wash rounded-2xl p-5">
              <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent-indigo" /> Key Developments
              </h4>
              <div className="space-y-2">
                {WEEKLY_SUMMARY.keyDevelopments.map((d, i) => (
                  <div key={i} className="p-2.5 bg-canvas rounded-lg">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${d.type === 'opportunity' ? 'bg-emerald-50 text-emerald-700' : 'bg-accent-indigo/10 text-accent-indigo'}`}>
                      {d.type.toUpperCase()}
                    </span>
                    <p className="text-[11px] text-ink-secondary font-medium mt-1">{d.event}</p>
                    <p className="text-[10px] text-emerald-600">{d.impact}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-ink-wash rounded-2xl p-5">
              <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-accent-indigo" /> Recommendations
              </h4>
              <div className="space-y-2">
                {WEEKLY_SUMMARY.recommendations.map((r, i) => (
                  <div key={i} className="p-2.5 bg-canvas rounded-lg">
                    <p className="text-[11px] font-medium text-ink-primary">{r.action}</p>
                    <p className="text-[10px] text-ink-secondary mt-0.5">{r.rationale}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block ${r.urgency === 'immediate' ? 'bg-accent-crimson/10 text-accent-crimson' : 'bg-amber-50 text-amber-700'}`}>
                      {r.urgency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Monthly Report ── */}
      {period === 'monthly' && (
        <div className="space-y-4">
          <div className="bg-accent-indigo/[0.03] border border-accent-indigo/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-accent-indigo" />
              <h3 className="text-sm font-bold text-accent-indigo">Executive Report — {MONTHLY_REPORT.month}</h3>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full ml-auto">
                {MONTHLY_REPORT.pipelineHealth.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Total Opps', value: MONTHLY_REPORT.totalOpportunities },
                { label: 'High Confidence', value: MONTHLY_REPORT.highConfidenceOpps },
                { label: 'Avg Confidence', value: `${MONTHLY_REPORT.averageConfidence}%` },
                { label: 'Total Value', value: MONTHLY_REPORT.totalValue },
              ].map((s) => (
                <div key={s.label} className="bg-surface border border-ink-wash rounded-lg p-2.5 text-center">
                  <div className="text-lg font-bold text-accent-indigo">{s.value}</div>
                  <div className="text-[8px] text-ink-tertiary">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent-indigo" /> Key Metrics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MONTHLY_REPORT.keyMetrics.map((m, i) => (
                <div key={i} className="p-3 bg-canvas rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-ink-primary">{m.label}</span>
                    <span className="text-[10px] font-bold text-emerald-600">{m.value}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">{m.trend}</span>
                  <p className="text-[10px] text-ink-secondary mt-1">{m.why}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-accent-indigo" /> Top Opportunities
            </h4>
            <div className="space-y-2">
              {MONTHLY_REPORT.topOpportunities.map((o) => (
                <div key={o.rank} className="p-3 bg-canvas rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-indigo text-white flex items-center justify-center text-[9px] font-bold">{o.rank}</span>
                    <span className="text-[11px] font-semibold text-ink-primary">{o.title}</span>
                    <span className="text-[10px] font-bold text-emerald-600 ml-auto">{o.value}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">{o.confidence}%</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full">{o.stage}</span>
                  </div>
                  <p className="text-[10px] text-ink-secondary">{o.why}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-canvas border border-ink-wash rounded-xl">
            <p className="text-[11px] text-ink-secondary leading-relaxed">
              <span className="text-accent-indigo font-semibold">Outlook:</span> {MONTHLY_REPORT.outlook}
            </p>
          </div>
        </div>
      )}

      {/* ── Quarterly Review ── */}
      {period === 'quarterly' && (
        <div className="space-y-4">
          <div className="bg-accent-indigo/[0.03] border border-accent-indigo/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-accent-indigo" />
              <h3 className="text-sm font-bold text-accent-indigo">Trend Review — {QUARTERLY_REVIEW.quarter}</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Tracked', value: QUARTERLY_REVIEW.opportunitiesTracked },
                { label: 'Avg Confidence', value: `${QUARTERLY_REVIEW.avgConfidence}%` },
                { label: 'Completion', value: `${QUARTERLY_REVIEW.completionRate}%` },
                { label: 'Accuracy', value: `${QUARTERLY_REVIEW.accuracyRate}%` },
              ].map((s) => (
                <div key={s.label} className="bg-surface border border-ink-wash rounded-lg p-2.5 text-center">
                  <div className="text-lg font-bold text-accent-indigo">{s.value}</div>
                  <div className="text-[8px] text-ink-tertiary">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-surface border border-ink-wash rounded-2xl p-5">
              <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent-indigo" /> Opportunity Trends by Category
              </h4>
              <div className="space-y-2">
                {QUARTERLY_REVIEW.trends.map((t, i) => (
                  <div key={i} className="p-3 bg-canvas rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-ink-primary">{t.category}</span>
                      <span className="text-[10px] font-bold text-emerald-600">{t.trend}</span>
                    </div>
                    <span className="text-[9px] text-ink-tertiary">{t.count} opportunities</span>
                    <p className="text-[10px] text-ink-secondary mt-1"><span className="text-accent-indigo font-medium">Why:</span> {t.why}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-ink-wash rounded-2xl p-5">
              <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-accent-indigo" /> Performance vs. Targets
              </h4>
              <div className="space-y-2">
                {QUARTERLY_REVIEW.performance.map((p, i) => (
                  <div key={i} className="p-3 bg-canvas rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-ink-primary">{p.metric}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${p.status === 'exceeds' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {p.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-ink-tertiary">Actual: <span className="font-bold text-accent-indigo">{p.actual}</span></span>
                      <span className="text-[9px] text-ink-tertiary">Target: {p.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-accent-indigo" /> Strategic Insights
            </h4>
            <div className="space-y-2">
              {QUARTERLY_REVIEW.strategicInsights.map((si, i) => (
                <div key={i} className="p-3 bg-canvas rounded-lg">
                  <p className="text-[11px] text-ink-secondary leading-relaxed">{si}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Annual Outlook ── */}
      {period === 'annual' && (
        <div className="space-y-4">
          <div className="bg-accent-indigo/[0.03] border border-accent-indigo/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-accent-indigo" />
              <h3 className="text-sm font-bold text-accent-indigo">{ANNUAL_OUTLOOK.year}</h3>
            </div>
            <p className="text-[13px] font-bold text-ink-primary mb-3">{ANNUAL_OUTLOOK.theme}</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface border border-ink-wash rounded-lg p-2.5 text-center">
                <div className="text-lg font-bold text-accent-indigo">{ANNUAL_OUTLOOK.projectedOpportunities}</div>
                <div className="text-[8px] text-ink-tertiary">Projected Opportunities</div>
              </div>
              <div className="bg-surface border border-ink-wash rounded-lg p-2.5 text-center">
                <div className="text-lg font-bold text-emerald-600">{ANNUAL_OUTLOOK.projectedValue}</div>
                <div className="text-[8px] text-ink-tertiary">Projected Value</div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-indigo" /> Key Market Drivers
            </h4>
            <div className="space-y-2">
              {ANNUAL_OUTLOOK.keyDrivers.map((d, i) => (
                <div key={i} className="p-3 bg-canvas rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-ink-primary">{d.driver}</span>
                    <span className="text-[10px] font-bold text-emerald-600">{d.impact}</span>
                  </div>
                  <p className="text-[10px] text-ink-secondary">{d.effect}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-indigo" /> Regional Forecast
            </h4>
            <div className="space-y-2">
              {ANNUAL_OUTLOOK.regionalForecast.map((r, i) => (
                <div key={i} className="p-3 bg-canvas rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-ink-primary">{r.region}</span>
                    <span className="text-[10px] font-bold text-emerald-600">{r.projection}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${r.confidence === 'high' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {r.confidence} confidence
                  </span>
                  <p className="text-[10px] text-ink-secondary mt-1">{r.drivers}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-accent-indigo" /> Strategic Recommendations
            </h4>
            <div className="space-y-2">
              {ANNUAL_OUTLOOK.strategicRecommendations.map((sr, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 bg-canvas rounded-lg">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-indigo text-white flex items-center justify-center text-[9px] font-bold">{i + 1}</span>
                  <span className="text-[11px] text-ink-secondary">{sr}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
