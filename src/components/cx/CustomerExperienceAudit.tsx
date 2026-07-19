import { useState } from 'react';
import {
  Monitor, CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp,
  Navigation, Search, Map, Loader2, FileX, Shield, Smartphone,
  EyeOff, Sparkles
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-14: Customer Experience Audit
// Screen-by-screen review with checklist items for every
// customer-facing surface.
// ═══════════════════════════════════════════════════════════════

interface AuditItem {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  page: string;
}

interface AuditCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: AuditItem[];
}

const AUDIT_CATEGORIES: AuditCategory[] = [
  {
    id: 'nav', title: 'Navigation', icon: <Navigation className="w-4 h-4 text-accent-indigo" />,
    items: [
      { id: 'n1', label: 'Primary nav: 12 items, all reachable', status: 'pending', page: 'All' },
      { id: 'n2', label: 'Secondary nav: Ops, QA, RC, Launch links', status: 'pending', page: 'All' },
      { id: 'n3', label: 'Mobile bottom nav: 5 destinations', status: 'pending', page: 'Mobile' },
      { id: 'n4', label: 'Active state clearly highlighted', status: 'pending', page: 'All' },
      { id: 'n5', label: 'Notifications badge visible', status: 'pending', page: 'All' },
      { id: 'n6', label: 'Settings gear icon accessible', status: 'pending', page: 'All' },
    ],
  },
  {
    id: 'search', title: 'Search Experience', icon: <Search className="w-4 h-4 text-accent-teal" />,
    items: [
      { id: 's1', label: 'Search bar prominent on search page', status: 'pending', page: 'Search' },
      { id: 's2', label: 'Filters accessible and functional', status: 'pending', page: 'Search' },
      { id: 's3', label: 'Results load in <1 second', status: 'pending', page: 'Search' },
      { id: 's4', label: 'No results state provides guidance', status: 'pending', page: 'Search' },
      { id: 's5', label: 'Recent searches remembered', status: 'pending', page: 'Search' },
      { id: 's6', label: 'Auto-suggestions on type', status: 'pending', page: 'Search' },
    ],
  },
  {
    id: 'maps', title: 'Map Experience', icon: <Map className="w-4 h-4 text-accent-amber" />,
    items: [
      { id: 'm1', label: 'Map tiles load in <500ms', status: 'pending', page: 'Map' },
      { id: 'm2', label: 'Clustering at zoomed-out levels', status: 'pending', page: 'Map' },
      { id: 'm3', label: 'Tap-to-zoom on mobile', status: 'pending', page: 'Map' },
      { id: 'm4', label: 'Popup with key details on click', status: 'pending', page: 'Map' },
      { id: 'm5', label: 'Pan and zoom smooth at 60fps', status: 'pending', page: 'Map' },
    ],
  },
  {
    id: 'loading', title: 'Loading States', icon: <Loader2 className="w-4 h-4 text-accent-indigo" />,
    items: [
      { id: 'l1', label: 'Skeleton screens on initial load', status: 'pending', page: 'All' },
      { id: 'l2', label: 'Progress indicator on long operations', status: 'pending', page: 'All' },
      { id: 'l3', label: 'No jarring layout shifts', status: 'pending', page: 'All' },
      { id: 'l4', label: 'Lazy loading for below-fold content', status: 'pending', page: 'All' },
      { id: 'l5', label: 'Staggered reveal for lists', status: 'pending', page: 'Dashboard' },
    ],
  },
  {
    id: 'empty', title: 'Empty States', icon: <FileX className="w-4 h-4 text-accent-amber" />,
    items: [
      { id: 'e1', label: 'Dashboard: guidance for new users', status: 'pending', page: 'Dashboard' },
      { id: 'e2', label: 'Search: helpful no-results message', status: 'pending', page: 'Search' },
      { id: 'e3', label: 'Watchlists: create-first CTA', status: 'pending', page: 'Watchlists' },
      { id: 'e4', label: 'Alerts: all-caught-up message', status: 'pending', page: 'Alerts' },
      { id: 'e5', label: 'Reports: generate-first prompt', status: 'pending', page: 'Reports' },
    ],
  },
  {
    id: 'errors', title: 'Error Recovery', icon: <AlertTriangle className="w-4 h-4 text-accent-crimson" />,
    items: [
      { id: 'er1', label: 'Error boundary catches crashes', status: 'pending', page: 'All' },
      { id: 'er2', label: 'Retry button on API failures', status: 'pending', page: 'All' },
      { id: 'er3', label: 'Clear error message, no jargon', status: 'pending', page: 'All' },
      { id: 'er4', label: 'Copy error details for support', status: 'pending', page: 'All' },
      { id: 'er5', label: 'Graceful degradation offline', status: 'pending', page: 'All' },
    ],
  },
  {
    id: 'a11y', title: 'Accessibility', icon: <Shield className="w-4 h-4 text-accent-teal" />,
    items: [
      { id: 'a1', label: 'WCAG 2.1 AA color contrast', status: 'pending', page: 'All' },
      { id: 'a2', label: 'Keyboard navigation works', status: 'pending', page: 'All' },
      { id: 'a3', label: 'Focus indicators visible', status: 'pending', page: 'All' },
      { id: 'a4', label: 'ARIA labels on interactive elements', status: 'pending', page: 'All' },
      { id: 'a5', label: 'Screen reader compatible tables', status: 'pending', page: 'Reports' },
      { id: 'a6', label: 'prefers-reduced-motion respected', status: 'pending', page: 'All' },
    ],
  },
  {
    id: 'mobile', title: 'Mobile Responsiveness', icon: <Smartphone className="w-4 h-4 text-accent-indigo" />,
    items: [
      { id: 'mo1', label: 'Bottom nav on mobile (56px touch)', status: 'pending', page: 'Mobile' },
      { id: 'mo2', label: 'Horizontal scroll on nav prevented', status: 'pending', page: 'Mobile' },
      { id: 'mo3', label: 'Cards stack on narrow screens', status: 'pending', page: 'All' },
      { id: 'mo4', label: 'Font sizes readable at 320px', status: 'pending', page: 'Mobile' },
      { id: 'mo5', label: 'Tables scroll horizontally', status: 'pending', page: 'All' },
    ],
  },
  {
    id: 'disclosure', title: 'Progressive Disclosure', icon: <EyeOff className="w-4 h-4 text-accent-amber" />,
    items: [
      { id: 'pd1', label: 'Advanced filters hidden by default', status: 'pending', page: 'Search' },
      { id: 'pd2', label: 'Beta features behind access gate', status: 'pending', page: 'All' },
      { id: 'pd3', label: 'Ops dashboards for admin only', status: 'pending', page: 'Admin' },
      { id: 'pd4', label: 'Walkthrough skippable', status: 'pending', page: 'Onboarding' },
      { id: 'pd5', label: 'Contextual help, not tooltips everywhere', status: 'pending', page: 'All' },
    ],
  },
];

function StatusIcon({ status }: { status: AuditItem['status'] }) {
  switch (status) {
    case 'pass': return <CheckCircle2 className="w-4 h-4 text-accent-teal flex-shrink-0" />;
    case 'fail': return <XCircle className="w-4 h-4 text-accent-crimson flex-shrink-0" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-accent-amber flex-shrink-0" />;
    case 'pending': return <div className="w-4 h-4 rounded-full border-2 border-ink-wash flex-shrink-0" />;
  }
}

export default function CustomerExperienceAudit() {
  const [categories, setCategories] = useState<AuditCategory[]>(AUDIT_CATEGORIES);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const allItems = categories.flatMap((c) => c.items);
  const passCount = allItems.filter((i) => i.status === 'pass').length;
  const warnCount = allItems.filter((i) => i.status === 'warning').length;
  const failCount = allItems.filter((i) => i.status === 'fail').length;
  const totalItems = allItems.length;

  // Simulate audit on mount
  const runAudit = () => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.map((item) => {
          const rand = Math.random();
          const status = rand > 0.95 ? 'fail' : rand > 0.88 ? 'warning' : 'pass';
          return { ...item, status: status as AuditItem['status'] };
        }),
      }))
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-surface rounded-xl p-5 border border-ink-wash">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-semibold text-ink-primary flex items-center gap-2">
              <Monitor className="w-4 h-4 text-accent-indigo" /> Customer Experience Audit
            </h2>
            <p className="text-[11px] text-ink-tertiary">{passCount} pass &middot; {warnCount} warn &middot; {failCount} fail &middot; {totalItems} items across {categories.length} categories</p>
          </div>
          <button onClick={runAudit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-indigo text-white text-xs font-medium hover:bg-accent-indigo/90">
            <Sparkles className="w-3 h-3" /> Run Audit
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg bg-accent-teal/[0.04] border border-accent-teal/10 text-center">
            <p className="text-lg font-semibold text-accent-teal font-mono">{passCount}</p>
            <p className="text-[10px] text-accent-teal">Passing</p>
          </div>
          <div className="p-2 rounded-lg bg-accent-amber/[0.04] border border-accent-amber/10 text-center">
            <p className="text-lg font-semibold text-accent-amber font-mono">{warnCount}</p>
            <p className="text-[10px] text-accent-amber">Warning</p>
          </div>
          <div className="p-2 rounded-lg bg-accent-crimson/[0.04] border border-accent-crimson/10 text-center">
            <p className="text-lg font-semibold text-accent-crimson font-mono">{failCount}</p>
            <p className="text-[10px] text-accent-crimson">Failed</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        {categories.map((cat) => {
          const catPass = cat.items.filter((i) => i.status === 'pass').length;
          const catTotal = cat.items.length;
          const isExpanded = expandedCat === cat.id;
          return (
            <div key={cat.id} className="bg-surface rounded-xl border border-ink-wash overflow-hidden">
              <button onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-canvas/30 transition-colors">
                {cat.icon}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-primary">{cat.title}</p>
                  <p className="text-[10px] text-ink-tertiary">{cat.items.length} items</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-accent-teal">{catPass}/{catTotal}</span>
                  <div className="w-16 h-2 bg-canvas rounded-full overflow-hidden">
                    <div className="h-full bg-accent-teal rounded-full" style={{ width: `${(catPass / catTotal) * 100}%` }} />
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-ink-tertiary" /> : <ChevronDown className="w-4 h-4 text-ink-tertiary" />}
              </button>

              {isExpanded && (
                <div className="border-t border-ink-wash px-4 pb-4">
                  <div className="space-y-1.5 mt-3">
                    {cat.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-canvas/50">
                        <StatusIcon status={item.status} />
                        <span className={`text-xs flex-1 ${item.status === 'fail' ? 'text-accent-crimson' : 'text-ink-primary'}`}>{item.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-wash text-ink-tertiary font-medium">{item.page}</span>
                      </div>
                    ))}
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
