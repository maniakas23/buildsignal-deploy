import { useState } from 'react';
import {
  FileText, Calendar, TrendingUp, MapPin, Zap, Clock,
  BarChart3, Globe, ArrowRight, Download, CheckCircle2,
  AlertTriangle, Sunrise, Layers, Building2, Users
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-20: Executive Briefing Generator
// Daily brief, weekly summary, monthly executive report.
// ═══════════════════════════════════════════════════════════════

const BRIEFING_TABS = ['daily', 'weekly', 'monthly'] as const;

const DAILY_BRIEF = {
  date: 'Monday, July 20, 2026',
  newOpportunities: 7,
  highConfidence: 3,
  majorProjects: [
    { title: 'Highway 287 Expansion', county: 'Larimer County', type: 'DOT', value: '$30-45M', confidence: 94 },
    { title: 'Weld County School Campus', county: 'Weld County', type: 'School', value: '$48M', confidence: 91 },
    { title: 'Xcel Substation Upgrade', county: 'Adams County', type: 'Utilities', value: '$22M', confidence: 89 },
  ],
  trends: [
    { label: 'Permit filings', value: '+12%', direction: 'up' as const },
    { label: 'Planning agendas', value: '+8%', direction: 'up' as const },
    { label: 'Utility filings', value: '+18%', direction: 'up' as const },
    { label: 'Average confidence', value: '+3.2%', direction: 'up' as const },
  ],
  infrastructureChanges: [
    { change: 'Commercial rezoning approved — Larimer County', impact: 'high' as const },
    { change: 'Road widening budget approved — $12.4M', impact: 'high' as const },
    { change: 'Sewer extension permit issued — Weld County', impact: 'medium' as const },
    { change: 'New school RFP published — $48M', impact: 'high' as const },
  ],
  regional: [
    { region: 'Denver Metro', projects: 67, trend: '+24%' },
    { region: 'Front Range North', projects: 42, trend: '+18%' },
    { region: 'Front Range South', projects: 31, trend: '+12%' },
    { region: 'Western Slope', projects: 22, trend: '+15%' },
    { region: 'Eastern Plains', projects: 14, trend: '+8%' },
  ],
};

const WEEKLY_SUMMARY = {
  period: 'July 14 — July 20, 2026',
  totalOpportunities: 18,
  highConfidence: 5,
  totalPermits: 156,
  newProjectsByType: [
    { type: 'DOT Projects', count: 3, trend: '+1' },
    { type: 'School Construction', count: 2, trend: '+2' },
    { type: 'Commercial Development', count: 8, trend: '+3' },
    { type: 'Utilities', count: 3, trend: '+1' },
    { type: 'Residential', count: 2, trend: '-1' },
  ],
  topInsights: [
    'Highway 287 corridor showing strongest signal convergence in 18 months',
    'Weld County emerging as top public contract region with $48M school RFP',
    'Permit filing velocity up 12% week-over-week across all monitored counties',
    'Greeley Highway 34 corridor flagged as emerging hotspot — 150% above normal',
  ],
  confidenceDistribution: [
    { range: '90-100%', count: 5, pct: 28 },
    { range: '75-89%', count: 8, pct: 44 },
    { range: '60-74%', count: 3, pct: 17 },
    { range: 'Below 60%', count: 2, pct: 11 },
  ],
};

const MONTHLY_REPORT = {
  period: 'July 2026',
  totalOpportunities: 64,
  highConfidence: 18,
  avgConfidence: 84.2,
  totalProjects: 312,
  permitVolume: 847,
  topCounties: [
    { county: 'Larimer', opportunities: 14, permits: 198, trend: '+22%' },
    { county: 'Weld', opportunities: 12, permits: 156, trend: '+31%' },
    { county: 'Denver', opportunities: 18, permits: 267, trend: '+18%' },
    { county: 'Adams', opportunities: 8, permits: 112, trend: '+15%' },
    { county: 'Boulder', opportunities: 6, permits: 89, trend: '+12%' },
  ],
  keyMetrics: [
    { label: 'Total Opportunities', value: '64', change: '+18% vs June' },
    { label: 'High-Confidence', value: '18', change: '+5 vs June' },
    { label: 'Avg Confidence', value: '84.2%', change: '+2.1%' },
    { label: 'Permit Volume', value: '847', change: '+14%' },
    { label: 'New Hotspots', value: '4', change: '+2 vs June' },
    { label: 'Team Engagement', value: '342 users', change: '+24' },
  ],
};

function ImpactBadge({ impact }: { impact: 'high' | 'medium' | 'low' }) {
  const colors = { high: 'bg-accent-crimson/10 text-accent-crimson', medium: 'bg-amber-50 text-amber-700', low: 'bg-blue-50 text-blue-700' };
  return <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${colors[impact]}`}>{impact.toUpperCase()}</span>;
}

export default function ExecutiveBriefingGenerator() {
  const [tab, setTab] = useState<typeof BRIEFING_TABS[number]>('daily');

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-canvas border border-ink-wash rounded-xl w-fit">
          {BRIEFING_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors capitalize ${
                tab === t ? 'bg-accent-indigo text-white' : 'text-ink-secondary hover:bg-surface'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-ink-wash rounded-lg text-[11px] font-medium text-ink-secondary hover:bg-canvas transition-colors">
          <Download className="w-3.5 h-3.5" /> Export PDF
        </button>
      </div>

      {/* DAILY */}
      {tab === 'daily' && (
        <div className="space-y-4">
          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sunrise className="w-4 h-4 text-accent-indigo" />
              <h4 className="text-sm font-bold text-ink-primary">Daily Brief — {DAILY_BRIEF.date}</h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { label: 'New Opportunities', value: DAILY_BRIEF.newOpportunities },
                { label: 'High-Confidence', value: DAILY_BRIEF.highConfidence },
                { label: 'Permits Filed', value: '23' },
                { label: 'Hotspots', value: '2' },
              ].map((s) => (
                <div key={s.label} className="bg-canvas border border-ink-wash rounded-lg p-2.5 text-center">
                  <div className="text-lg font-bold text-ink-primary">{s.value}</div>
                  <div className="text-[9px] text-ink-tertiary">{s.label}</div>
                </div>
              ))}
            </div>

            <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3" /> Major Projects Today
            </h5>
            <div className="space-y-2">
              {DAILY_BRIEF.majorProjects.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
                  <div>
                    <span className="text-[11px] font-medium text-ink-primary">{p.title}</span>
                    <span className="text-[9px] text-ink-tertiary ml-2">{p.county}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-1.5 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full">{p.type}</span>
                    <span className="text-[10px] text-emerald-600 font-medium">{p.value}</span>
                    <span className="text-[9px] font-bold text-emerald-700">{p.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Trends */}
            <div className="bg-surface border border-ink-wash rounded-2xl p-4">
              <h5 className="text-[10px] font-bold text-ink-secondary mb-3 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Key Trends
              </h5>
              <div className="space-y-2">
                {DAILY_BRIEF.trends.map((t) => (
                  <div key={t.label} className="flex items-center justify-between p-2 bg-canvas rounded-lg">
                    <span className="text-[11px] text-ink-secondary">{t.label}</span>
                    <span className="text-[11px] font-bold text-emerald-600">{t.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Infrastructure Changes */}
            <div className="bg-surface border border-ink-wash rounded-2xl p-4">
              <h5 className="text-[10px] font-bold text-ink-secondary mb-3 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Infrastructure Changes
              </h5>
              <div className="space-y-2">
                {DAILY_BRIEF.infrastructureChanges.map((ic, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-canvas rounded-lg">
                    <span className="text-[11px] text-ink-secondary">{ic.change}</span>
                    <ImpactBadge impact={ic.impact} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regional */}
          <div className="bg-surface border border-ink-wash rounded-2xl p-4">
            <h5 className="text-[10px] font-bold text-ink-secondary mb-3 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3" /> Regional Rankings
            </h5>
            <div className="space-y-2">
              {DAILY_BRIEF.regional.map((r) => (
                <div key={r.region} className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-ink-secondary w-[140px] flex-shrink-0">{r.region}</span>
                  <div className="flex-1 h-2 bg-ink-wash/30 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-indigo rounded-full" style={{ width: `${Math.min((r.projects / 80) * 100, 100)}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-ink-primary w-6 text-right">{r.projects}</span>
                  <span className="text-[10px] text-emerald-600 w-10 text-right">{r.trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WEEKLY */}
      {tab === 'weekly' && (
        <div className="space-y-4">
          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-accent-indigo" />
              <h4 className="text-sm font-bold text-ink-primary">Weekly Summary — {WEEKLY_SUMMARY.period}</h4>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: 'Opportunities', value: WEEKLY_SUMMARY.totalOpportunities },
                { label: 'High-Confidence', value: WEEKLY_SUMMARY.highConfidence },
                { label: 'Permits Tracked', value: WEEKLY_SUMMARY.totalPermits },
              ].map((s) => (
                <div key={s.label} className="bg-canvas border border-ink-wash rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-ink-primary">{s.value}</div>
                  <div className="text-[9px] text-ink-tertiary">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider">By Type</h5>
                <div className="space-y-1.5">
                  {WEEKLY_SUMMARY.newProjectsByType.map((pt) => (
                    <div key={pt.type} className="flex items-center justify-between p-2 bg-canvas rounded-lg">
                      <span className="text-[11px] text-ink-secondary">{pt.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-ink-primary">{pt.count}</span>
                        <span className="text-[9px] text-emerald-600">{pt.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider">Confidence Distribution</h5>
                <div className="space-y-1.5">
                  {WEEKLY_SUMMARY.confidenceDistribution.map((cd) => (
                    <div key={cd.range}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-ink-secondary">{cd.range}</span>
                        <span className="text-[10px] font-bold text-ink-primary">{cd.count}</span>
                      </div>
                      <div className="h-1.5 bg-ink-wash/30 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-indigo rounded-full" style={{ width: `${cd.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-ink-wash rounded-2xl p-4">
            <h5 className="text-[10px] font-bold text-ink-secondary mb-3 uppercase tracking-wider flex items-center gap-1">
              <Lightbulb className="w-3 h-3" /> Top Insights
            </h5>
            <div className="space-y-2">
              {WEEKLY_SUMMARY.topInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 bg-canvas rounded-lg">
                  <ArrowRight className="w-3 h-3 text-accent-indigo flex-shrink-0 mt-0.5" />
                  <span className="text-[11px] text-ink-secondary leading-relaxed">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MONTHLY */}
      {tab === 'monthly' && (
        <div className="space-y-4">
          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-accent-indigo" />
              <h4 className="text-sm font-bold text-ink-primary">Executive Report — {MONTHLY_REPORT.period}</h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {MONTHLY_REPORT.keyMetrics.map((m) => (
                <div key={m.label} className="bg-canvas border border-ink-wash rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-ink-primary">{m.value}</div>
                  <div className="text-[9px] text-emerald-600 font-medium">{m.change}</div>
                  <div className="text-[9px] text-ink-tertiary">{m.label}</div>
                </div>
              ))}
            </div>

            <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider">Top Counties</h5>
            <div className="space-y-2">
              {MONTHLY_REPORT.topCounties.map((tc) => (
                <div key={tc.county} className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-ink-secondary w-[80px] flex-shrink-0">{tc.county}</span>
                  <div className="flex-1 h-2 bg-ink-wash/30 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-indigo rounded-full" style={{ width: `${Math.min((tc.opportunities / 20) * 100, 100)}%` }} />
                  </div>
                  <span className="text-[10px] text-ink-primary w-6 text-right">{tc.opportunities}</span>
                  <span className="text-[10px] text-ink-tertiary w-8 text-right">{tc.permits}p</span>
                  <span className="text-[10px] text-emerald-600 w-10 text-right">{tc.trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
