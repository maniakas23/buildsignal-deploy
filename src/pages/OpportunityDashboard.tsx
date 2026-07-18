import { useStore } from '@/store/useStore';
import { lazy, Suspense, useMemo, useState } from 'react';
import { ConfidenceBadge, SectionHeader } from '@/components/ui-custom/EngineStates';
import OnboardingChecklist from '@/components/ui-custom/OnboardingChecklist';
import { track, recordFirstOpportunity } from '@/hooks/useAnalytics';

// FlowCanvas loads Three.js — keep it isolated in its own chunk
const FlowCanvas = lazy(() => import('@/components/FlowCanvas'));
import { SparkleIcon, ClockIcon } from '@/components/ui-custom/Icons';
import { formatRelativeTime, fetchDashboard, fetchRecommendations } from '@/signalcore/engine';
import { useEngineQuery, useEngineListQuery } from '@/hooks/useEngine';
import { SkeletonGrid, SkeletonRow, ErrorState, EmptyState } from '@/components/ui-custom/EngineStates';
import type { Zone, SurgeAlert, Pattern } from '@/types';
import type { DashboardMetrics, Recommendation } from '@/signalcore/engine';
import { Clock, BookOpen, FolderOpen, TrendingUp, MapPin, Zap, CheckCircle2, AlertTriangle, Eye, ArrowRight, Activity, Shield, Sparkles } from 'lucide-react';
import { OpportunityFeed } from '@/components/intelligence/OpportunityFeed';
import { IntelligenceWorkspace } from '@/components/workspace/IntelligenceWorkspace';
import { ExecutiveSummary } from '@/components/dashboard/ExecutiveSummary';
import { SilentErrorBoundary } from '@/components/ErrorBoundary';

const LIFECYCLE_STAGES: { id: string; label: string; color: string; bg: string }[] = [
  { id: 'new', label: 'New', color: 'text-ink-tertiary', bg: 'bg-ink-tertiary' },
  { id: 'reviewing', label: 'Review', color: 'text-accent-indigo', bg: 'bg-accent-indigo' },
  { id: 'qualified', label: 'Qualified', color: 'text-accent-teal', bg: 'bg-accent-teal' },
  { id: 'contacted', label: 'Contacted', color: 'text-accent-indigo', bg: 'bg-accent-indigo' },
  { id: 'active', label: 'Active', color: 'text-accent-teal', bg: 'bg-accent-teal' },
  { id: 'pursuing', label: 'Pursuing', color: 'text-accent-amber', bg: 'bg-accent-amber' },
  { id: 'closed', label: 'Closed', color: 'text-accent-crimson', bg: 'bg-accent-crimson' },
  { id: 'archived', label: 'Archived', color: 'text-ink-tertiary', bg: 'bg-ink-tertiary' },
];

function LifecycleBar({ currentStage }: { currentStage?: string }) {
  if (!currentStage) return null;
  const currentIndex = LIFECYCLE_STAGES.findIndex((s) => s.id === currentStage);
  if (currentIndex === -1) return null;
  return (
    <div className="mb-3">
      <div className="flex items-center gap-0.5">
        {LIFECYCLE_STAGES.map((stage, i) => {
          const isCurrent = i === currentIndex;
          const isPast = i < currentIndex;
          return (
            <div key={stage.id} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full h-1.5 rounded-full transition-all ${isCurrent ? stage.bg : isPast ? 'bg-ink-wash' : 'bg-canvas'}`} />
              <span className={`text-[9px] font-medium whitespace-nowrap ${isCurrent ? stage.color : 'text-ink-tertiary'}`}>{isCurrent ? stage.label : ''}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecentlyViewed() {
  const { recentlyViewed, setCurrentPage } = useStore();
  if (recentlyViewed.length === 0) return null;
  return (
    <section className="max-w-content mx-auto px-6 pb-4">
      <div className="bg-surface rounded-2xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-ink-primary mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-ink-tertiary" /> Recently Viewed</h3>
        <div className="flex flex-wrap gap-2">
          {recentlyViewed.slice(0, 6).map((item) => (
            <button key={`${item.type}-${item.id}`} onClick={() => setCurrentPage(item.type === 'story' ? 'growth-stories' : 'projects')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas hover:bg-accent-indigo/5 border border-ink-wash text-xs text-ink-primary transition-colors">
              {item.type === 'story' ? <BookOpen className="w-3 h-3 text-accent-indigo" /> : <FolderOpen className="w-3 h-3 text-accent-teal" />}
              <span className="truncate max-w-[200px]">{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExecutiveBrief({ dashboard, dashState, onNavigate }: { dashboard: DashboardMetrics | null; dashState: string; onNavigate: (page: string) => void }) {
  const newSignals = dashState === 'success' && dashboard ? dashboard.recentSurges.length : 0;
  const highConf = dashState === 'success' && dashboard ? dashboard.zones.reduce((sum, z) => sum + z.projectCount, 0) : 0;
  const attentionNeeded = dashState === 'success' && dashboard ? dashboard.recentSurges.filter((s) => s.scoreChange > 5).length : 0;
  return (
    <section className="relative w-full overflow-hidden" style={{ height: '280px' }}>
      <div className="absolute inset-0 z-0"><Suspense fallback={<div className="w-full h-full bg-accent-indigo/5" />}><FlowCanvas /></Suspense></div>
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(180deg, rgba(8,12,16,0.5) 0%, rgba(8,12,16,0.7) 60%, rgba(8,12,16,0.88) 100%)' }} />
      <div className="relative z-[2] max-w-content mx-auto px-6 h-full flex flex-col justify-center">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white font-semibold text-xl sm:text-2xl tracking-tight">Executive Intelligence Brief</h1>
          <span className="text-white/40 text-xs font-mono hidden sm:block">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'New Signals', value: newSignals || '—', icon: <Zap className="w-3.5 h-3.5" />, color: 'text-accent-indigo', action: 'alerts' },
            { label: 'High Confidence', value: highConf || '—', icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'text-accent-teal', action: 'projects' },
            { label: 'Needs Review', value: attentionNeeded || '—', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-accent-amber', action: 'alerts' },
            { label: 'Active Areas', value: dashboard?.zones.length || '—', icon: <MapPin className="w-3.5 h-3.5" />, color: 'text-accent-teal', action: 'map' },
          ].map((kpi) => (
            <button key={kpi.label} onClick={() => onNavigate(kpi.action)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.1] transition-colors text-left">
              <span className={`${kpi.color}`}>{kpi.icon}</span>
              <div><p className="text-white font-mono text-lg leading-tight">{kpi.value}</p><p className="text-white/50 text-[11px]">{kpi.label}</p></div>
            </button>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => { track({ type: 'page_view', page: 'projects' }); onNavigate('projects'); }} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-indigo text-white text-sm font-medium hover:bg-accent-indigo/90 transition-colors shadow-lg shadow-accent-indigo/20"><Eye className="w-4 h-4" /> Review Opportunities <ArrowRight className="w-3.5 h-3.5" /></button>
          <button onClick={() => { track({ type: 'page_view', page: 'map' }); onNavigate('map'); }} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.1] backdrop-blur text-white text-sm font-medium hover:bg-white/[0.15] transition-colors border border-white/[0.15]"><MapPin className="w-4 h-4" /> Explore Map</button>
        </div>
      </div>
    </section>
  );
}

function TodaySummary({ dashboard }: { dashboard: DashboardMetrics | null }) {
  if (!dashboard) return null;
  const newPermits = dashboard.recentSurges.filter((s) => s.signalType === 'permit').length;
  const zoningItems = dashboard.recentSurges.filter((s) => s.signalType === 'zoning_change').length;
  const utilityReqs = dashboard.recentSurges.filter((s) => s.signalType === 'utility_request').length;
  const totalNew = dashboard.recentSurges.length;
  return (
    <section className="max-w-content mx-auto px-6 pt-6">
      <div className="bg-surface rounded-2xl p-5 shadow-card border border-ink-wash">
        <div className="flex items-center gap-2 mb-4"><Zap className="w-4 h-4 text-accent-teal" /><h2 className="text-sm font-semibold text-ink-primary">Today&apos;s Activity</h2><span className="text-xs text-ink-tertiary ml-auto">Last 24h</span></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'New Permits', value: newPermits || '—', icon: <FolderOpen className="w-4 h-4 text-accent-indigo" /> },
            { label: 'Zoning Changes', value: zoningItems || '—', icon: <MapPin className="w-4 h-4 text-accent-amber" /> },
            { label: 'Utility Requests', value: utilityReqs || '—', icon: <Zap className="w-4 h-4 text-accent-teal" /> },
            { label: 'Total Signals', value: totalNew || '—', icon: <TrendingUp className="w-4 h-4 text-accent-crimson" />, highlight: true },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl p-3 ${stat.highlight ? 'bg-accent-indigo/[0.04] border border-accent-indigo/10' : 'bg-canvas'}`}>
              <div className="flex items-center gap-2 mb-1.5">{stat.icon}<span className="text-xs text-ink-tertiary uppercase tracking-wider">{stat.label}</span></div>
              <span className={`font-mono text-xl ${stat.highlight ? 'text-accent-indigo' : 'text-ink-primary'}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ZoneCard({ zone, index }: { zone: Zone; index: number }) {
  const sparklinePath = zone.sparklineData.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (zone.sparklineData.length - 1)) * 80} ${24 - (v / 35) * 24}`).join(' ');
  return (
    <div className="bg-surface rounded-2xl p-5 shadow-card hover:shadow-md transition-all cursor-pointer" style={{ animationDelay: `${index * 0.08}s` }}>
      <div className="flex items-start justify-between mb-3"><h3 className="text-base font-semibold text-ink-primary">{zone.name}</h3><span className="font-mono text-xl text-accent-indigo">{zone.signalCount}</span></div>
      <svg viewBox="0 0 80 24" className="w-20 h-6 mb-3"><path d={sparklinePath} fill="none" stroke="#595950" strokeWidth="1.5" /></svg>
      <p className="text-sm text-ink-secondary">{zone.projectCount} opportunities detected</p>
    </div>
  );
}

function SurgeItem({ alert, index }: { alert: SurgeAlert; index: number }) {
  const { setCurrentPage } = useStore();
  const handleClick = () => { track({ type: 'alert_opened', alertId: alert.id }); setCurrentPage('alerts'); };
  return (
    <div className="flex items-center gap-3 py-3 border-l-2 border-accent-crimson pl-3 cursor-pointer hover:bg-canvas/50 rounded-r transition-colors" style={{ animationDelay: `${index * 0.08}s` }} onClick={handleClick}>
      <span className="pill-surface text-xs capitalize">{alert.signalType.replace('_', ' ')}</span>
      <div className="flex-1 min-w-0"><p className="text-sm text-ink-primary truncate font-medium">{alert.projectName}</p><p className="text-xs text-ink-tertiary">{alert.location}</p></div>
      <span className="font-mono text-xs text-ink-tertiary whitespace-nowrap">{formatRelativeTime(alert.timestamp)}</span>
    </div>
  );
}

function PatternCard({ pattern, index }: { pattern: Pattern; index: number }) {
  const { setCurrentPage } = useStore();
  return (
    <div className="bg-surface rounded-2xl p-5 shadow-card hover:shadow-md transition-all cursor-pointer" style={{ animationDelay: `${index * 0.1}s` }} onClick={() => setCurrentPage('patterns')}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-full bg-accent-indigo/10 flex items-center justify-center"><SparkleIcon className="w-4 h-4 text-accent-indigo" /></div>
        <span className={pattern.status === 'active' ? 'pill-teal text-xs' : 'pill-amber text-xs'}>{pattern.status === 'active' ? 'Active Pattern' : 'Learning'}</span>
      </div>
      <h3 className="text-base font-semibold text-ink-primary mb-2">{pattern.name}</h3>
      <p className="text-sm text-ink-secondary mb-3 leading-relaxed line-clamp-2">{pattern.description}</p>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-ink-tertiary uppercase tracking-wider">Historical Accuracy</span>
        <span className="font-mono text-lg text-accent-teal">{pattern.confidence}%</span>
      </div>
      <div className="h-1 bg-canvas rounded-full overflow-hidden"><div className="h-full bg-accent-indigo rounded-full transition-all" style={{ width: `${pattern.maturity}%` }} /></div>
    </div>
  );
}

function ExplainabilityChecklist({ items }: { items: string[] }) {
  return (<div className="space-y-1.5">{items.map((item, i) => (<div key={i} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-accent-teal mt-0.5 flex-shrink-0" /><span className="text-xs text-ink-secondary">{item}</span></div>))}</div>);
}

function ActionBadge({ action }: { action: string }) {
  const actions: Record<string, { label: string; color: string }> = {
    monitor: { label: 'Monitor', color: 'bg-accent-indigo/10 text-accent-indigo' },
    investigate: { label: 'Investigate', color: 'bg-accent-amber/10 text-accent-amber' },
    contact: { label: 'Contact', color: 'bg-accent-teal/10 text-accent-teal' },
    'visit-site': { label: 'Visit Site', color: 'bg-accent-indigo/10 text-accent-indigo' },
    'watch-utilities': { label: 'Watch Utilities', color: 'bg-accent-teal/10 text-accent-teal' },
    'review-planning': { label: 'Review Planning', color: 'bg-accent-amber/10 text-accent-amber' },
  };
  const config = actions[action] || { label: action, color: 'bg-canvas text-ink-secondary' };
  return (<span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${config.color}`}>{config.label}</span>);
}

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const handleClick = () => { track({ type: 'recommendation_clicked', recId: rec.id, category: rec.category }); recordFirstOpportunity(); };
  const explainItems = [rec.why, `${rec.relatedSignals} correlated signals detected`, `${rec.sourceCount} verified data sources`, `${rec.roi}% projected ROI`];
  const marketContext = useMemo(() => {
    if (!rec.contributingSignals?.length) return null;
    const signals = rec.contributingSignals;
    const refTime = new Date(rec.lastUpdated).getTime() || 0;
    const byType = (type: string) => signals.filter(s => s.type === type).sort((a, b) => b.influence - a.influence);
    const permits = byType('permit'); const zoning = byType('zoning'); const utility = byType('utility');
    const economic = byType('economic'); const demographic = byType('demographic'); const environmental = byType('environmental');
    const project = byType('project'); const transportation = byType('transportation'); const commercial = byType('commercial');
    const items: { label: string; description: string; influence: number }[] = [];
    if (permits.length) items.push({ label: 'Government Approvals', description: permits[0].description, influence: permits[0].influence });
    if (utility.length) items.push({ label: 'Utility Expansion', description: utility[0].description, influence: utility[0].influence });
    if (transportation.length) items.push({ label: 'Transportation', description: transportation[0].description, influence: transportation[0].influence });
    if (commercial.length) items.push({ label: 'Commercial Activity', description: commercial[0].description, influence: commercial[0].influence });
    if (demographic.length) items.push({ label: 'Growth Trends', description: demographic[0].description, influence: demographic[0].influence });
    if (economic.length) items.push({ label: 'Investment', description: economic[0].description, influence: economic[0].influence });
    if (project.length) items.push({ label: 'Development Momentum', description: project[0].description, influence: project[0].influence });
    if (zoning.length) items.push({ label: 'Zoning', description: zoning[0].description, influence: zoning[0].influence });
    if (environmental.length) items.push({ label: 'Environmental', description: environmental[0].description, influence: environmental[0].influence });
    const recentCount = refTime > 0 ? signals.filter(s => { const sigTime = new Date(s.date).getTime(); const days = (refTime - sigTime) / (1000 * 60 * 60 * 24); return days >= 0 && days < 7; }).length : 0;
    const timing = recentCount >= 3 ? `${recentCount} of ${signals.length} signals detected within the past 7 days — activity is accelerating.` : undefined;
    return { items, timing, avgInfluence: Math.round(signals.reduce((s, c) => s + c.influence, 0) / signals.length) };
  }, [rec.contributingSignals, rec.lastUpdated]);

  const infrastructureSignals = useMemo(() => {
    if (!rec.contributingSignals?.length) return [];
    return rec.contributingSignals.filter(s => s.type === 'utility' || s.type === 'transportation' || s.type === 'project').sort((a, b) => b.influence - a.influence);
  }, [rec.contributingSignals]);

  const completeness = rec.completeness ?? (() => { let score = 0; const checks = [rec.title?.length > 0, rec.description?.length > 0, rec.confidence > 0, rec.roi > 0, rec.why?.length > 0, (rec.sources?.length ?? 0) > 0, (rec.contributingSignals?.length ?? 0) > 0, (rec.riskFactors?.length ?? 0) > 0, rec.nextAction?.length > 0, rec.impact?.length > 0]; checks.forEach(passed => { if (passed) score += 10; }); return score; })();
  const completenessLabel = completeness >= 90 ? 'Complete' : completeness >= 70 ? 'Strong' : completeness >= 50 ? 'Moderate' : 'Partial';

  return (
    <article className="bg-surface rounded-2xl p-5 sm:p-6 shadow-card hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-accent-indigo/20" style={{ animationDelay: `${index * 0.1}s` }} onClick={handleClick} aria-label={`Recommendation: ${rec.title}. ${rec.category}. ${rec.confidence}% confidence.`} role="article" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><ConfidenceBadge score={rec.confidence} /><span className="pill-indigo text-[11px]">{rec.category}</span></div>
        <ActionBadge action={rec.nextAction?.toLowerCase().includes('contact') ? 'contact' : rec.nextAction?.toLowerCase().includes('monitor') ? 'monitor' : 'investigate'} />
      </div>
      <LifecycleBar currentStage={rec.lifecycleStage} />
      <h3 className="text-base sm:text-lg font-semibold text-ink-primary mb-1.5 leading-snug group-hover:text-accent-indigo transition-colors">{rec.title}</h3>
      <p className="text-sm text-ink-secondary mb-3 leading-relaxed line-clamp-3">{rec.description}</p>
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2 py-2 px-3 bg-canvas rounded-lg border border-ink-wash">
          <span className="text-[11px] text-ink-tertiary"><strong className="text-ink-primary">{rec.relatedSignals}</strong> signals</span>
          <span className="w-px h-3 bg-ink-wash" />
          <span className="text-[11px] text-ink-tertiary"><strong className="text-ink-primary">{rec.sourceCount}</strong> sources</span>
          <span className="w-px h-3 bg-ink-wash" />
          <span className="text-[11px] text-ink-tertiary">{rec.roi}% ROI</span>
        </div>
        <div className="flex items-center gap-2 px-1">
          <div className="flex-1 h-1 bg-canvas rounded-full overflow-hidden"><div className={`h-full rounded-full ${completeness >= 90 ? 'bg-accent-teal' : completeness >= 70 ? 'bg-accent-indigo' : completeness >= 50 ? 'bg-accent-amber' : 'bg-accent-crimson'}`} style={{ width: `${completeness}%` }} /></div>
          <span className={`text-[10px] font-medium ${completeness >= 90 ? 'text-accent-teal' : completeness >= 70 ? 'text-accent-indigo' : completeness >= 50 ? 'text-accent-amber' : 'text-accent-crimson'}`}>{completenessLabel} ({completeness}%)</span>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-[11px] text-ink-tertiary uppercase tracking-wider mb-2">Opportunity overview</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-canvas rounded-lg p-2.5 border border-ink-wash"><span className="text-[10px] text-ink-tertiary uppercase tracking-wider">Projected ROI</span><p className="font-mono text-lg text-accent-indigo">{rec.roi}%</p></div>
          <div className="bg-canvas rounded-lg p-2.5 border border-ink-wash"><span className="text-[10px] text-ink-tertiary uppercase tracking-wider">Impact</span><p className="text-sm font-medium text-ink-primary truncate">{rec.impact}</p></div>
          <div className="bg-canvas rounded-lg p-2.5 border border-ink-wash"><span className="text-[10px] text-ink-tertiary uppercase tracking-wider">Signals</span><p className="font-mono text-lg text-accent-teal">{rec.relatedSignals}</p></div>
          <div className="bg-canvas rounded-lg p-2.5 border border-ink-wash"><span className="text-[10px] text-ink-tertiary uppercase tracking-wider">Sources</span><p className="font-mono text-lg text-accent-teal">{rec.sourceCount}</p></div>
        </div>
      </div>
      {marketContext && marketContext.items.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] text-ink-tertiary uppercase tracking-wider mb-2">Market context</p>
          <div className="bg-canvas rounded-lg p-3 border border-ink-wash space-y-2">
            {marketContext.items.map((item, i) => (<div key={i} className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent-indigo mt-1.5 flex-shrink-0" /><div className="flex-1 min-w-0"><span className="text-[11px] font-medium text-ink-primary">{item.label}:</span>{' '}<span className="text-[11px] text-ink-secondary">{item.description}</span></div></div>))}
            {marketContext.timing && (<div className="flex items-start gap-2 pt-1.5 border-t border-ink-wash mt-1.5"><Clock className="w-3 h-3 text-accent-teal mt-0.5 flex-shrink-0" /><span className="text-[11px] text-accent-teal font-medium">{marketContext.timing}</span></div>)}
          </div>
        </div>
      )}
      <div className="mb-4">
        <p className="text-[11px] text-ink-tertiary uppercase tracking-wider mb-2">Why this opportunity</p>
        <ExplainabilityChecklist items={explainItems} />
      </div>
      {infrastructureSignals.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] text-ink-tertiary uppercase tracking-wider mb-2">Infrastructure activity</p>
          <div className="space-y-2">
            {infrastructureSignals.map((sig, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-canvas rounded-lg p-2.5 border border-ink-wash">
                <Zap className="w-3.5 h-3.5 text-accent-teal flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="text-[12px] font-medium text-ink-primary">{sig.name}</span><span className="pill-teal text-[10px] capitalize">{sig.type}</span></div>
                  <p className="text-[11px] text-ink-tertiary leading-relaxed">{sig.description}</p>
                </div>
                <span className="text-[10px] font-mono text-ink-tertiary w-7 text-right">{sig.influence}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {rec.contributingSignals && rec.contributingSignals.filter(s => s.type !== 'utility' && s.type !== 'transportation' && s.type !== 'project').length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] text-ink-tertiary uppercase tracking-wider mb-2">Contributing signals (ranked by influence)</p>
          <div className="space-y-2">
            {rec.contributingSignals.filter(s => s.type !== 'utility' && s.type !== 'transportation' && s.type !== 'project').map((sig, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="flex-shrink-0 mt-0.5"><Activity className="w-3.5 h-3.5 text-accent-indigo" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="text-[12px] font-medium text-ink-primary">{sig.name}</span><span className="pill-surface text-[10px] capitalize">{sig.type}</span></div>
                  <p className="text-[11px] text-ink-tertiary leading-relaxed">{sig.description}</p>
                  <div className="mt-1 flex items-center gap-2"><div className="flex-1 h-1.5 bg-canvas rounded-full overflow-hidden"><div className="h-full rounded-full bg-accent-indigo" style={{ width: `${sig.influence}%` }} /></div><span className="text-[10px] font-mono text-ink-tertiary w-7 text-right">{sig.influence}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {rec.sources && rec.sources.length > 0 && (
        <div className="mb-3">
          <p className="text-[11px] text-ink-tertiary uppercase tracking-wider mb-1.5">Data sources</p>
          <div className="flex flex-wrap gap-1.5">{rec.sources.map((src, i) => (<span key={i} className="pill-surface text-[10px]">{src}</span>))}</div>
        </div>
      )}
      {rec.riskFactors && rec.riskFactors.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] text-ink-tertiary uppercase tracking-wider mb-2">Risk factors to consider</p>
          <div className="space-y-2">
            {rec.riskFactors.map((risk, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-canvas rounded-lg p-2.5 border border-ink-wash">
                <Shield className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${risk.severity === 'high' ? 'text-accent-crimson' : risk.severity === 'medium' ? 'text-accent-amber' : 'text-accent-teal'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="text-[12px] font-medium text-ink-primary">{risk.label}</span><span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${risk.severity === 'high' ? 'bg-accent-crimson/10 text-accent-crimson' : risk.severity === 'medium' ? 'bg-accent-amber/10 text-accent-amber' : 'bg-accent-teal/10 text-accent-teal'}`}>{risk.severity}</span></div>
                  <p className="text-[11px] text-ink-tertiary leading-relaxed">{risk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="bg-accent-indigo/[0.04] rounded-lg p-3 mb-4 border border-accent-indigo/10">
        <p className="text-xs text-ink-secondary"><span className="font-medium text-accent-indigo">Next step:</span>{' '}{rec.nextAction}</p>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-ink-wash">
        <span className="text-[11px] text-ink-tertiary">Impact: <span className="font-medium text-ink-primary">{rec.impact}</span></span>
        <span className="text-[11px] text-ink-tertiary flex items-center gap-1.5"><Clock className="w-3 h-3" />{new Date(rec.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </article>
  );
}

function TrustBar({ dashboard }: { dashboard: DashboardMetrics | null }) {
  if (!dashboard) return null;
  return (
    <div className="bg-accent-indigo/[0.03] border-y border-accent-indigo/10">
      <div className="max-w-content mx-auto px-6 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="flex items-center gap-1.5 text-ink-secondary"><CheckCircle2 className="w-3.5 h-3.5 text-accent-teal" /><span className="font-medium text-ink-primary">{dashboard.activeSignals.toLocaleString()}</span> live signals</span>
        <span className="w-px h-3 bg-ink-wash hidden sm:block" />
        <span className="text-ink-tertiary">{dashboard.zones.length} areas monitored</span>
        <span className="w-px h-3 bg-ink-wash hidden sm:block" />
        <span className="flex items-center gap-1.5 text-ink-tertiary"><span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" />Processing</span>
        <span className="ml-auto text-ink-tertiary text-xs hidden sm:inline">Updated continuously</span>
      </div>
    </div>
  );
}

export default function OpportunityDashboard() {
  const { setCurrentPage } = useStore();
  const [selectedOpp, setSelectedOpp] = useState<number | null>(null);
  const { data: dashboard, state: dashState, error: dashError, refetch: dashRefetch } = useEngineQuery<DashboardMetrics>(fetchDashboard, []);
  const { data: recommendations, state: recState, error: recError, refetch: recRefetch } = useEngineListQuery(fetchRecommendations, []);

  return (
    <div className="relative">
      <ExecutiveBrief dashboard={dashboard} dashState={dashState} onNavigate={setCurrentPage} />
      <TrustBar dashboard={dashboard} />

      {/* Executive Summary — What changed today? */}
      <section className="max-w-content mx-auto px-6 pt-6" aria-label="Executive summary">
        <SilentErrorBoundary>
          <ExecutiveSummary onViewOpportunity={(id) => setSelectedOpp(id)} onViewAlerts={() => setCurrentPage('alerts')} />
        </SilentErrorBoundary>
      </section>

      {/* Recommended Actions */}
      <section className="max-w-content mx-auto px-6 pt-2 pb-4" aria-label="Recommended actions">
        <SectionHeader title="Recommended Actions" subtitle="Highest-confidence opportunities based on your monitored areas" />
        {(recState === 'loading' || recState === 'idle') && <SkeletonGrid count={3} />}
        {recState === 'error' && <ErrorState message={recError || 'Failed to load recommendations'} onRetry={recRefetch} />}
        {recState === 'success' && recommendations && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="feed" aria-label="Recommendations">
            {recommendations.length === 0 && (
              <div className="col-span-full">
                <EmptyState title="Analyzing your areas" message="SignalCore is processing permits, zoning changes, and utility filings. Recommendations typically appear within 24 hours." />
                <div className="flex justify-center gap-3 mt-4">
                  <button onClick={() => setCurrentPage('map')} className="px-4 py-2 rounded-lg bg-accent-indigo text-white text-sm font-medium hover:bg-accent-indigo/90 transition-colors">Explore the Map</button>
                  <button onClick={() => setCurrentPage('projects')} className="px-4 py-2 rounded-lg bg-surface border border-ink-wash text-ink-secondary text-sm font-medium hover:bg-canvas transition-colors">Browse All Projects</button>
                </div>
              </div>
            )}
            {recommendations.map((rec, i) => (<RecommendationCard key={rec.id} rec={rec} index={i} />))}
          </div>
        )}
      </section>

      {/* Today's Activity Summary */}
      <TodaySummary dashboard={dashboard} />

      {/* Opportunities by Area */}
      <section className="max-w-content mx-auto px-6 py-10">
        <SectionHeader title="Opportunities by Area" subtitle="Live monitoring across all coverage areas" />
        {(dashState === 'loading' || dashState === 'idle') && <SkeletonGrid count={4} />}
        {dashState === 'error' && <ErrorState message={dashError || 'Failed to load zones'} onRetry={dashRefetch} />}
        {dashState === 'success' && dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {dashboard.zones.length === 0 && <EmptyState title="No coverage areas yet" message="BuildSignal is establishing coverage. Check back in 24 hours or contact support." />}
              {dashboard.zones.map((zone: Zone, i: number) => (<ZoneCard key={zone.id} zone={zone} index={i} />))}
            </div>
            <div className="bg-surface rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4"><h3 className="text-base font-semibold text-ink-primary">Recent Activity</h3><ConfidenceBadge score={92} /></div>
              {dashboard.recentSurges.length === 0 && <EmptyState title="No activity detected" message="BuildSignal is monitoring for activity." icon="bell" />}
              <div className="divide-y divide-ink-wash">{dashboard.recentSurges.map((alert: SurgeAlert, i: number) => (<SurgeItem key={alert.id} alert={alert} index={i} />))}</div>
            </div>
          </div>
        )}
      </section>

      {/* Intelligence Summary */}
      <section className="max-w-content mx-auto px-6 py-10 border-t border-ink-wash">
        <SectionHeader title="Intelligence Summary" subtitle="Overview of current market conditions" />
        {(dashState === 'loading' || dashState === 'idle') && <SkeletonRow />}
        {dashState === 'error' && <ErrorState message="Failed to load summary" onRetry={dashRefetch} />}
        {dashState === 'success' && dashboard?.summary && (
          <div className="bg-surface rounded-2xl p-6 shadow-card">
            <ConfidenceBadge score={91} />
            <p className="text-base text-ink-secondary leading-relaxed mt-4">{dashboard.summary.content}</p>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-ink-wash">
              <div className="flex items-center gap-2 text-xs text-ink-tertiary font-mono"><ClockIcon className="w-3.5 h-3.5" />Last updated: {new Date(dashboard.summary.generatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
              <button onClick={() => setCurrentPage('summary')} className="btn-secondary">View Full Report</button>
            </div>
          </div>
        )}
      </section>

      {/* Growth Patterns */}
      <section className="bg-canvas border-t border-ink-wash">
        <div className="max-w-content mx-auto px-6 py-10">
          <SectionHeader title="Growth Patterns" subtitle="Validated patterns that predict development activity" />
          {(dashState === 'loading' || dashState === 'idle') && <SkeletonGrid count={3} />}
          {dashState === 'error' && <ErrorState message="Failed to load patterns" onRetry={dashRefetch} />}
          {dashState === 'success' && dashboard && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboard.patterns.length === 0 && <EmptyState title="No growth patterns active" />}
              {dashboard.patterns.slice(0, 3).map((pattern: Pattern, i: number) => (<PatternCard key={pattern.id} pattern={pattern} index={i} />))}
            </div>
          )}
        </div>
      </section>

      {/* Onboarding Checklist */}
      <section className="max-w-content mx-auto px-6 pt-6"><OnboardingChecklist /></section>

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Intelligence Feed */}
      <section className="max-w-content mx-auto px-6 py-10 border-t border-ink-wash">
        <div className="flex items-center gap-3 mb-2"><Sparkles className="w-5 h-5 text-accent-indigo" /><div><SectionHeader title="Intelligence Feed" subtitle="Ranked opportunities with full context and explainability" /></div></div>
        <OpportunityFeed limit={5} onSelectOpportunity={(opp) => { setSelectedOpp(opp.id); }} />
      </section>

      {/* Intelligence Workspace */}
      {selectedOpp && (
        <section className="border-t border-ink-wash bg-canvas min-h-screen">
          <IntelligenceWorkspace recommendationId={selectedOpp} onBack={() => setSelectedOpp(null)} />
        </section>
      )}
    </div>
  );
}
