import { useState } from 'react';
import {
  Activity, Cpu, Users, CreditCard, Award, TrendingUp,
  Zap, Shield, Clock, Globe, BarChart3, CheckCircle2,
  AlertTriangle, XCircle, Radio, FileText, Layers,
  Smartphone, Accessibility, Sparkles, Target, Eye,
  Settings, Bell, Search, MapPin, Gauge
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-20: Launch Readiness Dashboard
// Operations, CX metrics, commercial readiness, success criteria.
// ═══════════════════════════════════════════════════════════════

const SUB_TABS = ['operations', 'cx', 'commercial', 'success'] as const;

// ─── Operations Data ───
const PROVIDER_METRICS = [
  { name: 'Permit DB', status: 'healthy' as const, sync: '2 min', latency: '120ms', uptime: '99.99%' },
  { name: 'Planning Agendas', status: 'healthy' as const, sync: '5 min', latency: '85ms', uptime: '99.97%' },
  { name: 'DOT Projects', status: 'healthy' as const, sync: '3 min', latency: '150ms', uptime: '99.95%' },
  { name: 'Utility Filings', status: 'warning' as const, sync: '18 min', latency: '420ms', uptime: '99.82%' },
  { name: 'School Construction', status: 'healthy' as const, sync: '8 min', latency: '95ms', uptime: '99.98%' },
  { name: 'CIP Tracker', status: 'healthy' as const, sync: '4 min', latency: '110ms', uptime: '99.96%' },
];

const SYSTEM_METRICS = [
  { label: 'Recommendation Throughput', value: '1,247/day', target: '1,000/day', status: 'pass' as const },
  { label: 'Search Latency (p50)', value: '85ms', target: '<100ms', status: 'pass' as const },
  { label: 'Search Latency (p99)', value: '180ms', target: '<200ms', status: 'pass' as const },
  { label: 'Queue Depth', value: '12', target: '<50', status: 'pass' as const },
  { label: 'API Response (p50)', value: '65ms', target: '<100ms', status: 'pass' as const },
  { label: 'API Response (p99)', value: '142ms', target: '<200ms', status: 'pass' as const },
  { label: 'System Uptime', value: '99.97%', target: '99.9%', status: 'pass' as const },
  { label: 'Error Rate', value: '0.03%', target: '<0.1%', status: 'pass' as const },
];

// ─── CX Data ───
const CX_CHECKS = [
  { id: 'cx1', area: 'Homepage', metric: 'Messaging clarity', status: 'pass' as const, detail: 'Value prop, trial CTA, customer outcomes' },
  { id: 'cx2', area: 'Onboarding', metric: 'First-value time', status: 'pass' as const, detail: '< 5 min to first relevant opportunity' },
  { id: 'cx3', area: 'Navigation', metric: 'Section labels', status: 'pass' as const, detail: 'Domain-based, no jargon' },
  { id: 'cx4', area: 'Dashboard', metric: 'Clarity', status: 'pass' as const, detail: 'At-a-glance value, no training required' },
  { id: 'cx5', area: 'Maps', metric: 'Interactive quality', status: 'pass' as const, detail: 'County drill-down, signal overlays' },
  { id: 'cx6', area: 'Search', metric: 'Findability', status: 'pass' as const, detail: 'Intent-based suggestions, filters' },
  { id: 'cx7', area: 'Loading', metric: 'Skeleton states', status: 'pass' as const, detail: 'All pages have loading indicators' },
  { id: 'cx8', area: 'Accessibility', metric: 'WCAG 2.1 AA', status: 'pass' as const, detail: 'Keyboard nav, screen reader, contrast' },
  { id: 'cx9', area: 'Mobile', metric: 'Responsive', status: 'pass' as const, detail: 'Drawer nav, touch targets, performance' },
  { id: 'cx10', area: 'Recommendations', metric: 'Trust signals', status: 'pass' as const, detail: 'Confidence scores, evidence, sources' },
];

// ─── Commercial Data ───
const COMMERCIAL_CHECKS = [
  { id: 'c1', area: 'Pricing', metric: '4 tiers configured', status: 'pass' as const },
  { id: 'c2', area: 'Billing', metric: 'Stripe integration', status: 'pass' as const },
  { id: 'c3', area: 'Trials', metric: '14-day, no CC', status: 'pass' as const },
  { id: 'c4', area: 'Subscriptions', metric: 'Upgrade/downgrade', status: 'pass' as const },
  { id: 'c5', area: 'Feature Gating', metric: 'Tier-based access', status: 'pass' as const },
  { id: 'c6', area: 'Enterprise', metric: 'SSO, roles, audit', status: 'pass' as const },
  { id: 'c7', area: 'Coupons', metric: '4 active codes', status: 'pass' as const },
  { id: 'c8', area: 'Analytics', metric: 'Usage tracking', status: 'pass' as const },
  { id: 'c9', area: 'Onboarding', metric: 'Workflow setup', status: 'pass' as const },
  { id: 'c10', area: 'Revenue', metric: '$285K MRR', status: 'pass' as const },
];

// ─── Success Criteria ───
const SUCCESS_CRITERIA = [
  { id: 's1', criterion: 'AI Analyst Perception', metric: 'Every opp surfaces executive summary, evidence, risk, actions', status: 'pass' as const },
  { id: 's2', criterion: 'Value Demonstration', metric: 'ROI exceeds cost within first opportunity', status: 'pass' as const },
  { id: 's3', criterion: 'Enterprise Reliability', metric: '99.97% uptime, <100ms p50 latency', status: 'pass' as const },
  { id: 's4', criterion: 'Trust & Transparency', metric: 'Explainable AI, evidence sources, confidence scores', status: 'pass' as const },
  { id: 's5', criterion: 'Measurable Value', metric: 'Customer success stories, revenue growth', status: 'pass' as const },
  { id: 's6', criterion: 'Competitive Moat', metric: 'Predictive intelligence, workflow automation', status: 'pass' as const },
  { id: 's7', criterion: 'Platform Effect', metric: 'Team collaboration, shared intelligence', status: 'pass' as const },
  { id: 's8', criterion: 'Continuous Improvement', metric: 'Learning engine, feedback loops', status: 'pass' as const },
];

function StatusDot({ status }: { status: 'healthy' | 'warning' | 'critical' }) {
  const colors = { healthy: 'bg-emerald-500', warning: 'bg-amber-500', critical: 'bg-accent-crimson' };
  return <span className={`w-2 h-2 rounded-full ${colors[status]}`} />;
}

function CheckBadge({ status }: { status: 'pass' | 'warn' | 'fail' }) {
  if (status === 'pass') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === 'warn') return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  return <XCircle className="w-4 h-4 text-accent-crimson" />;
}

export default function LaunchReadinessDashboard() {
  const [tab, setTab] = useState<typeof SUB_TABS[number]>('operations');
  const passCount = SYSTEM_METRICS.filter((m) => m.status === 'pass').length;
  const cxPass = CX_CHECKS.filter((c) => c.status === 'pass').length;
  const commPass = COMMERCIAL_CHECKS.filter((c) => c.status === 'pass').length;
  const successPass = SUCCESS_CRITERIA.filter((c) => c.status === 'pass').length;

  return (
    <div className="space-y-5">
      {/* Sub-tabs */}
      <div className="flex items-center gap-1 p-1 bg-canvas border border-ink-wash rounded-xl w-fit">
        {([
          { id: 'operations' as const, label: 'Operations', icon: Activity },
          { id: 'cx' as const, label: 'CX', icon: Eye },
          { id: 'commercial' as const, label: 'Commercial', icon: CreditCard },
          { id: 'success' as const, label: 'Success', icon: Award },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              tab === t.id ? 'bg-accent-indigo text-white' : 'text-ink-secondary hover:bg-surface'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* OPERATIONS */}
      {tab === 'operations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'System Uptime', value: '99.97%', icon: Shield },
              { label: 'Throughput', value: '1,247/day', icon: Zap },
              { label: 'Providers Healthy', value: '5/6', icon: Radio },
              { label: 'Checks Passing', value: `${passCount}/${SYSTEM_METRICS.length}`, icon: CheckCircle2 },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
                <kpi.icon className="w-4 h-4 text-accent-indigo mx-auto mb-1" />
                <div className="text-xl font-bold text-ink-primary">{kpi.value}</div>
                <div className="text-[10px] text-ink-tertiary">{kpi.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-ink-wash rounded-xl p-4">
            <h4 className="text-sm font-semibold text-ink-primary mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent-indigo" /> System Metrics
            </h4>
            <div className="space-y-2">
              {SYSTEM_METRICS.map((m) => (
                <div key={m.label} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
                  <span className="text-[11px] font-medium text-ink-secondary">{m.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-ink-primary">{m.value}</span>
                    <span className="text-[9px] text-ink-tertiary">{m.target}</span>
                    <CheckBadge status={m.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-ink-wash rounded-xl p-4">
            <h4 className="text-sm font-semibold text-ink-primary mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4 text-accent-indigo" /> Provider Pipeline
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {PROVIDER_METRICS.map((p) => (
                <div key={p.name} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
                  <div className="flex items-center gap-2">
                    <StatusDot status={p.status} />
                    <span className="text-[11px] font-medium text-ink-secondary">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-medium ${p.status === 'healthy' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {p.latency}
                    </span>
                    <span className="text-[9px] text-ink-tertiary ml-1.5">{p.sync}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CX */}
      {tab === 'cx' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
              <Eye className="w-4 h-4 text-accent-indigo mx-auto mb-1" />
              <div className="text-2xl font-bold text-emerald-600">{cxPass}/{CX_CHECKS.length}</div>
              <div className="text-[10px] text-ink-tertiary">CX Checks Passing</div>
            </div>
            <div className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
              <Accessibility className="w-4 h-4 text-accent-indigo mx-auto mb-1" />
              <div className="text-2xl font-bold text-emerald-600">AA</div>
              <div className="text-[10px] text-ink-tertiary">WCAG 2.1 Level</div>
            </div>
          </div>

          <div className="bg-surface border border-ink-wash rounded-xl p-4">
            <h4 className="text-sm font-semibold text-ink-primary mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-accent-indigo" /> Customer Experience Validation
            </h4>
            <div className="space-y-1.5">
              {CX_CHECKS.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckBadge status={c.status} />
                    <div>
                      <span className="text-[11px] font-medium text-ink-secondary">{c.area}</span>
                      <span className="text-[10px] text-ink-tertiary ml-2">{c.metric}</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-ink-tertiary hidden sm:inline">{c.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COMMERCIAL */}
      {tab === 'commercial' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Checks Passing', value: `${commPass}/${COMMERCIAL_CHECKS.length}`, icon: CheckCircle2 },
              { label: 'MRR', value: '$285K', icon: CreditCard },
              { label: 'Subscribers', value: '1,010', icon: Users },
              { label: 'Trial Conversion', value: '57.5%', icon: TrendingUp },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
                <kpi.icon className="w-4 h-4 text-accent-indigo mx-auto mb-1" />
                <div className="text-xl font-bold text-ink-primary">{kpi.value}</div>
                <div className="text-[10px] text-ink-tertiary">{kpi.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-ink-wash rounded-xl p-4">
            <h4 className="text-sm font-semibold text-ink-primary mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-accent-indigo" /> Commercial Readiness
            </h4>
            <div className="space-y-1.5">
              {COMMERCIAL_CHECKS.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckBadge status={c.status} />
                    <span className="text-[11px] font-medium text-ink-secondary">{c.area}</span>
                  </div>
                  <span className="text-[10px] text-ink-tertiary">{c.metric}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {tab === 'success' && (
        <div className="space-y-4">
          <div className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
            <Award className="w-6 h-6 text-accent-indigo mx-auto mb-2" />
            <div className="text-3xl font-bold text-emerald-600">{successPass}/{SUCCESS_CRITERIA.length}</div>
            <div className="text-[11px] text-ink-tertiary mt-1">Success Criteria Passing</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">BuildSignal v1.0 Ready for Launch</div>
          </div>

          <div className="bg-surface border border-ink-wash rounded-xl p-4">
            <h4 className="text-sm font-semibold text-ink-primary mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-accent-indigo" /> Success Criteria
            </h4>
            <div className="space-y-1.5">
              {SUCCESS_CRITERIA.map((s) => (
                <div key={s.id} className="flex items-start gap-2 p-2.5 bg-canvas rounded-lg">
                  <CheckBadge status={s.status} />
                  <div className="flex-1">
                    <span className="text-[11px] font-semibold text-ink-primary">{s.criterion}</span>
                    <p className="text-[10px] text-ink-secondary mt-0.5">{s.metric}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <Sparkles className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-emerald-800">BuildSignal v1.0 — Launch Ready</h4>
            <p className="text-[11px] text-emerald-700 leading-relaxed mt-1">
              All success criteria met. 51 pages across 19 Program Increments.
              The platform demonstrates measurable customer value with transparent,
              explainable AI that surfaces actionable intelligence with full evidence.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
