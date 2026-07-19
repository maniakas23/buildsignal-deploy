import { Check, Minus, HelpCircle } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-17: Feature Comparison Table
// Outcome-based comparison across all 4 tiers.
// ═══════════════════════════════════════════════════════════════

interface ComparisonRow {
  outcome: string;
  description?: string;
  scout: 'full' | 'partial' | 'none';
  professional: 'full' | 'partial' | 'none';
  business: 'full' | 'partial' | 'none';
  enterprise: 'full' | 'partial' | 'none';
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    outcome: 'Discover projects before competitors',
    description: 'Early access to permits, planning agendas, and DOT projects',
    scout: 'full', professional: 'full', business: 'full', enterprise: 'full',
  },
  {
    outcome: 'Monitor multiple counties',
    description: 'Track growth signals across your target markets',
    scout: 'partial', professional: 'full', business: 'full', enterprise: 'full',
  },
  {
    outcome: 'Receive AI-ranked opportunities',
    description: 'Know which opportunities deserve your attention first',
    scout: 'full', professional: 'full', business: 'full', enterprise: 'full',
  },
  {
    outcome: 'Infrastructure growth alerts',
    description: 'Never miss another infrastructure project',
    scout: 'full', professional: 'full', business: 'full', enterprise: 'full',
  },
  {
    outcome: 'Utilities & CIP intelligence',
    description: 'Capital improvement plans, school construction, gov spending',
    scout: 'none', professional: 'full', business: 'full', enterprise: 'full',
  },
  {
    outcome: 'Team collaboration',
    description: 'Share watchlists, alerts, and reports with your team',
    scout: 'none', professional: 'partial', business: 'full', enterprise: 'full',
  },
  {
    outcome: 'Executive reporting',
    description: 'Professional reports for stakeholders and leadership',
    scout: 'none', professional: 'partial', business: 'full', enterprise: 'full',
  },
  {
    outcome: 'API access',
    description: 'Integrate intelligence into your existing workflows',
    scout: 'none', professional: 'none', business: 'full', enterprise: 'full',
  },
  {
    outcome: 'Organization management',
    description: 'Manage teams, permissions, and billing centrally',
    scout: 'none', professional: 'none', business: 'full', enterprise: 'full',
  },
  {
    outcome: 'Custom data sources',
    description: 'Add proprietary or industry-specific data feeds',
    scout: 'none', professional: 'none', business: 'none', enterprise: 'full',
  },
  {
    outcome: 'Dedicated support',
    description: 'Priority response and dedicated success manager',
    scout: 'none', professional: 'none', business: 'partial', enterprise: 'full',
  },
  {
    outcome: 'White-label options',
    description: 'Brand intelligence under your own identity',
    scout: 'none', professional: 'none', business: 'none', enterprise: 'full',
  },
];

const TIER_HEADERS = [
  { key: 'scout' as const, label: 'Scout', price: '$99/mo', color: 'text-ink-secondary' },
  { key: 'professional' as const, label: 'Professional', price: '$249/mo', color: 'text-accent-indigo', popular: true },
  { key: 'business' as const, label: 'Business', price: '$599/mo', color: 'text-ink-secondary' },
  { key: 'enterprise' as const, label: 'Enterprise', price: 'Custom', color: 'text-amber-600' },
];

function StatusCell({ status }: { status: 'full' | 'partial' | 'none' }) {
  if (status === 'full') {
    return <Check className="w-4 h-4 text-emerald-500 mx-auto" />;
  }
  if (status === 'partial') {
    return (
      <div className="flex items-center justify-center gap-1" title="Limited">
        <Check className="w-4 h-4 text-amber-500" />
      </div>
    );
  }
  return <Minus className="w-4 h-4 text-ink-wash mx-auto" />;
}

export default function FeatureComparisonTable() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-base font-semibold text-ink-primary">Compare Plans</h3>
        <p className="text-[12px] text-ink-tertiary mt-1">
          Every plan is designed around outcomes that grow your business.
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-ink-wash">
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider w-[30%]">
                Outcome
              </th>
              {TIER_HEADERS.map((tier) => (
                <th key={tier.key} className="text-center py-3 px-3 min-w-[120px]">
                  <div className={`text-sm font-bold ${tier.color}`}>{tier.label}</div>
                  <div className="text-[11px] text-ink-tertiary mt-0.5">{tier.price}</div>
                  {tier.popular && (
                    <span className="inline-block mt-1 text-[9px] font-semibold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full">
                      BEST VALUE
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <tr
                key={row.outcome}
                className={`border-b border-ink-wash/50 ${i % 2 === 0 ? 'bg-canvas/30' : ''}`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-start gap-1.5">
                    <span className="text-[12px] font-medium text-ink-primary">{row.outcome}</span>
                    {row.description && (
                      <span title={row.description} className="mt-0.5">
                        <HelpCircle className="w-3 h-3 text-ink-tertiary cursor-help" />
                      </span>
                    )}
                  </div>
                  {row.description && (
                    <p className="text-[10px] text-ink-tertiary mt-0.5 leading-relaxed">{row.description}</p>
                  )}
                </td>
                <td className="py-3 px-3 text-center"><StatusCell status={row.scout} /></td>
                <td className="py-3 px-3 text-center"><StatusCell status={row.professional} /></td>
                <td className="py-3 px-3 text-center"><StatusCell status={row.business} /></td>
                <td className="py-3 px-3 text-center"><StatusCell status={row.enterprise} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {COMPARISON_ROWS.map((row) => (
          <div key={row.outcome} className="bg-surface border border-ink-wash rounded-xl p-4">
            <div className="flex items-start gap-1.5 mb-2">
              <p className="text-[12px] font-medium text-ink-primary">{row.outcome}</p>
              {row.description && (
                <span title={row.description}>
                  <HelpCircle className="w-3 h-3 text-ink-tertiary mt-0.5" />
                </span>
              )}
            </div>
            {row.description && (
              <p className="text-[10px] text-ink-tertiary mb-3">{row.description}</p>
            )}
            <div className="grid grid-cols-4 gap-2">
              {TIER_HEADERS.map((tier) => (
                <div key={tier.key} className="text-center">
                  <div className={`text-[9px] font-semibold mb-1 ${tier.color}`}>{tier.label.slice(0, 4)}</div>
                  <StatusCell status={row[tier.key]} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-ink-tertiary">
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          Included
        </div>
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-amber-500" />
          Limited
        </div>
        <div className="flex items-center gap-1.5">
          <Minus className="w-3.5 h-3.5 text-ink-wash" />
          Not included
        </div>
      </div>
    </div>
  );
}
