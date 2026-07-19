import { useState } from 'react';
import {
  CheckCircle2, Circle, AlertTriangle, Shield, Server,
  Database, FileText, Users, ChevronDown, ChevronUp,
  Zap, HardDrive, RefreshCw, Lock, Eye, BarChart3,
  ArrowRight, RotateCcw
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

interface ChecklistSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  items: ChecklistItem[];
}

const CHECKLIST: ChecklistSection[] = [
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    icon: <Server className="w-4 h-4" />,
    color: 'text-accent-indigo',
    items: [
      { id: 'infra_1', label: 'Production environment provisioned', description: 'All Cloudflare resources created and configured', required: true },
      { id: 'infra_2', label: 'D1 database deployed with schema', description: 'All 30 tables created with correct indexes', required: true },
      { id: 'infra_3', label: 'KV namespaces configured', description: 'Caching and session storage KV bindings active', required: true },
      { id: 'infra_4', label: 'R2 buckets provisioned', description: 'File storage and exports buckets ready', required: false },
      { id: 'infra_5', label: 'DNS and SSL configured', description: 'Custom domain with valid SSL certificate', required: true },
      { id: 'infra_6', label: 'Load balancing enabled', description: 'Global edge distribution active', required: true },
    ],
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Alerting',
    icon: <Eye className="w-4 h-4" />,
    color: 'text-accent-teal',
    items: [
      { id: 'mon_1', label: 'Health check endpoint active', description: '/api/health returns 200 OK', required: true },
      { id: 'mon_2', label: 'Ready check endpoint active', description: '/api/ready validates all dependencies', required: true },
      { id: 'mon_3', label: 'Error tracking configured', description: 'ErrorBoundary logs to telemetry', required: true },
      { id: 'mon_4', label: 'Performance monitoring enabled', description: 'Core Web Vitals tracked', required: true },
      { id: 'mon_5', label: 'Uptime alerts configured', description: 'Notifications for downtime events', required: true },
      { id: 'mon_6', label: 'Log aggregation active', description: 'Structured logs with correlation IDs', required: false },
    ],
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    icon: <Shield className="w-4 h-4" />,
    color: 'text-accent-crimson',
    items: [
      { id: 'sec_1', label: 'Security headers set', description: 'CSP, HSTS, X-Frame-Options configured', required: true },
      { id: 'sec_2', label: 'Input validation on all APIs', description: 'Zod schemas validate every input', required: true },
      { id: 'sec_3', label: 'Authentication enforced', description: 'Protected routes require valid session', required: true },
      { id: 'sec_4', label: 'Rate limiting active', description: 'Per-IP and per-user rate limits', required: true },
      { id: 'sec_5', label: 'Secrets management verified', description: 'No secrets in source code, env vars used', required: true },
      { id: 'sec_6', label: 'Audit logging enabled', description: 'All mutations logged with user ID', required: true },
      { id: 'sec_7', label: 'GDPR compliance verified', description: 'Data deletion and export functions work', required: true },
    ],
  },
  {
    id: 'database',
    title: 'Database & Data',
    icon: <Database className="w-4 h-4" />,
    color: 'text-accent-amber',
    items: [
      { id: 'db_1', label: 'Migrations tested', description: 'Forward and rollback migrations verified', required: true },
      { id: 'db_2', label: 'Indexes optimized', description: 'Query performance < 100ms for common queries', required: true },
      { id: 'db_3', label: 'Seed data validated', description: 'Initial data loads correctly', required: true },
      { id: 'db_4', label: 'Backup strategy confirmed', description: 'Automated backups with 30-day retention', required: true },
      { id: 'db_5', label: 'Data integrity checks pass', description: 'Foreign keys and constraints verified', required: true },
    ],
  },
  {
    id: 'performance',
    title: 'Performance',
    icon: <Zap className="w-4 h-4" />,
    color: 'text-accent-indigo',
    items: [
      { id: 'perf_1', label: 'LCP under 2.5s', description: 'Largest Contentful Paint target met', required: true },
      { id: 'perf_2', label: 'FID under 100ms', description: 'First Input Delay target met', required: true },
      { id: 'perf_3', label: 'CLS under 0.1', description: 'Cumulative Layout Shift target met', required: true },
      { id: 'perf_4', label: 'API P95 latency < 200ms', description: '95th percentile API response time', required: true },
      { id: 'perf_5', label: 'Bundle size optimized', description: 'Code-split with lazy loading', required: true },
      { id: 'perf_6', label: 'Caching strategy validated', description: 'CDN and client-side caches working', required: true },
    ],
  },
  {
    id: 'rollback',
    title: 'Rollback & Recovery',
    icon: <RefreshCw className="w-4 h-4" />,
    color: 'text-accent-crimson',
    items: [
      { id: 'rb_1', label: 'Rollback procedure documented', description: 'Step-by-step rollback guide', required: true },
      { id: 'rb_2', label: 'Previous version archived', description: 'Last stable build tagged and stored', required: true },
      { id: 'rb_3', label: 'Database rollback tested', description: 'Down migrations verified in staging', required: true },
      { id: 'rb_4', label: 'Feature flags configured', description: 'Critical features can be toggled off', required: false },
      { id: 'rb_5', label: 'Incident response plan ready', description: 'On-call rotation and escalation defined', required: true },
    ],
  },
  {
    id: 'testing',
    title: 'Testing & Validation',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'text-accent-teal',
    items: [
      { id: 'test_1', label: 'All customer workflows pass', description: '13 end-to-end workflows validated', required: true },
      { id: 'test_2', label: 'API endpoints certified', description: 'All 15 endpoints respond correctly', required: true },
      { id: 'test_3', label: 'Error boundaries tested', description: 'Error recovery works in all pages', required: true },
      { id: 'test_4', label: 'Mobile responsiveness verified', description: 'All pages work on 320px+ screens', required: true },
      { id: 'test_5', label: 'Accessibility audit passed', description: 'WCAG 2.1 AA compliance', required: true },
      { id: 'test_6', label: 'Cross-browser tested', description: 'Chrome, Firefox, Safari, Edge', required: true },
    ],
  },
  {
    id: 'documentation',
    title: 'Documentation',
    icon: <FileText className="w-4 h-4" />,
    color: 'text-accent-amber',
    items: [
      { id: 'doc_1', label: 'API documentation complete', description: 'All endpoints documented with examples', required: true },
      { id: 'doc_2', label: 'Runbook created', description: 'Operational procedures documented', required: true },
      { id: 'doc_3', label: 'User guide published', description: 'Customer-facing help content ready', required: true },
      { id: 'doc_4', label: 'Changelog prepared', description: 'Release notes for all changes', required: true },
      { id: 'doc_5', label: 'Support scripts ready', description: 'FAQ and troubleshooting guides', required: false },
    ],
  },
];

export default function ReleaseChecklistPage() {
  const [checked, setChecked] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('buildsignal_release_checklist');
    return new Set(stored ? JSON.parse(stored) : []);
  });
  const [expanded, setExpanded] = useState<Set<string>>(new Set(CHECKLIST.map((s) => s.id)));

  const toggleItem = (id: string) => {
    const updated = new Set(checked);
    if (updated.has(id)) updated.delete(id);
    else updated.add(id);
    setChecked(updated);
    localStorage.setItem('buildsignal_release_checklist', JSON.stringify([...updated]));
  };

  const toggleSection = (id: string) => {
    setExpanded((prev) => { const updated = new Set(prev); if (updated.has(id)) updated.delete(id); else updated.add(id); return updated; });
  };

  const resetAll = () => { setChecked(new Set()); localStorage.removeItem('buildsignal_release_checklist'); };

  const sectionProgress = CHECKLIST.map((section) => {
    const total = section.items.length;
    const done = section.items.filter((i) => checked.has(i.id)).length;
    const required = section.items.filter((i) => i.required);
    const requiredDone = required.filter((i) => checked.has(i.id)).length;
    return { id: section.id, done, total, requiredDone, requiredTotal: required.length, pct: Math.round((done / total) * 100) };
  });

  const totalItems = CHECKLIST.reduce((s, c) => s + c.items.length, 0);
  const totalDone = checked.size;
  const totalRequired = CHECKLIST.reduce((s, c) => s + c.items.filter((i) => i.required).length, 0);
  const totalRequiredDone = CHECKLIST.reduce((s, c) => s + c.items.filter((i) => i.required && checked.has(i.id)).length, 0);
  const overallPct = Math.round((totalDone / totalItems) * 100);
  const allRequiredDone = totalRequiredDone === totalRequired;

  return (
    <div className="min-h-screen bg-canvas">
      <section className="bg-surface border-b border-ink-wash">
        <div className="max-w-content mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-accent-indigo/10 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5 text-accent-indigo" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-ink-primary">Release Candidate Checklist</h1>
              <p className="text-[11px] text-ink-tertiary">Production readiness validation</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-content mx-auto px-6 py-6 space-y-6">
        <div className="bg-surface rounded-xl p-5 border border-ink-wash">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-semibold text-ink-primary">Overall Progress</h2>
              <p className="text-[11px] text-ink-tertiary">{totalDone}/{totalItems} items · {totalRequiredDone}/{totalRequired} required</p>
            </div>
            <div className="flex items-center gap-2">
              {allRequiredDone && <span className="flex items-center gap-1 text-xs text-accent-teal font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> All required complete</span>}
              <button onClick={resetAll} className="p-1.5 rounded-lg hover:bg-canvas transition-colors" title="Reset all"><RotateCcw className="w-3.5 h-3.5 text-ink-tertiary" /></button>
            </div>
          </div>
          <div className="h-3 bg-canvas rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full transition-all ${allRequiredDone ? 'bg-accent-teal' : overallPct > 50 ? 'bg-accent-indigo' : 'bg-accent-amber'}`} style={{ width: `${overallPct}%` }} />
          </div>
          <p className="text-[11px] text-ink-tertiary">{overallPct}% complete</p>
        </div>

        {CHECKLIST.map((section) => {
          const progress = sectionProgress.find((p) => p.id === section.id)!;
          const isExpanded = expanded.has(section.id);
          return (
            <div key={section.id} className="bg-surface rounded-xl border border-ink-wash overflow-hidden">
              <button onClick={() => toggleSection(section.id)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-canvas/30 transition-colors">
                <span className={section.color}>{section.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-ink-primary">{section.title}</h3>
                    <span className="text-[10px] text-ink-tertiary">{progress.done}/{progress.total}</span>
                  </div>
                  <div className="h-1.5 bg-canvas rounded-full overflow-hidden mt-1.5 max-w-[200px]">
                    <div className={`h-full rounded-full ${progress.pct === 100 ? 'bg-accent-teal' : 'bg-accent-indigo'}`} style={{ width: `${progress.pct}%` }} />
                  </div>
                </div>
                <span className="text-[11px] font-mono text-ink-tertiary">{progress.pct}%</span>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-ink-tertiary" /> : <ChevronDown className="w-4 h-4 text-ink-tertiary" />}
              </button>

              {isExpanded && (
                <div className="border-t border-ink-wash divide-y divide-ink-wash">
                  {section.items.map((item) => {
                    const isChecked = checked.has(item.id);
                    return (
                      <button key={item.id} onClick={() => toggleItem(item.id)}
                        className={`w-full flex items-start gap-3 p-3 text-left hover:bg-canvas/30 transition-colors ${isChecked ? 'bg-accent-teal/[0.02]' : ''}`}>
                        <div className="mt-0.5 flex-shrink-0">
                          {isChecked ? <CheckCircle2 className="w-4 h-4 text-accent-teal" /> : <Circle className="w-4 h-4 text-ink-wash" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${isChecked ? 'text-ink-tertiary line-through' : 'text-ink-primary font-medium'}`}>{item.label}</span>
                            {item.required && <span className="px-1 py-0.5 rounded bg-accent-crimson/10 text-accent-crimson text-[9px] font-medium">Required</span>}
                          </div>
                          <p className="text-[11px] text-ink-secondary mt-0.5">{item.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {allRequiredDone && (
          <div className="bg-accent-teal/[0.04] border border-accent-teal/20 rounded-xl p-5 text-center">
            <CheckCircle2 className="w-8 h-8 text-accent-teal mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-accent-teal">Release Candidate Ready</h3>
            <p className="text-xs text-ink-secondary mt-1">All required items are complete. The platform is ready for formal RC testing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
