import { useStore } from '@/store/useStore';
import {
  Globe, Database, MapPin, FileText, TrendingUp,
  Building2, Zap, Road, Droplets, HardHat, Check,
  ArrowRight, Activity, Clock, Shield
} from 'lucide-react';

const COVERAGE_STATS = [
  { value: '3,143', label: 'US Counties', icon: Globe, color: 'text-accent-indigo' },
  { value: '2,400+', label: 'Data Sources', icon: Database, color: 'text-accent-teal' },
  { value: '50', label: 'States + DC', icon: MapPin, color: 'text-accent-violet' },
  { value: '99.7%', label: 'Uptime SLA', icon: Activity, color: 'text-accent-teal' },
];

const SOURCE_TYPES = [
  { icon: Building2, label: 'County Planning Boards', count: '1,200+', description: 'Zoning changes, subdivision approvals, site plans' },
  { icon: FileText, label: 'Permit Databases', count: '680+', description: 'Building permits, demolition permits, occupancy certificates' },
  { icon: Road, label: 'DOT Filings', count: '240+', description: 'Highway projects, bridge work, traffic studies' },
  { icon: Zap, label: 'Utility Records', count: '180+', description: 'Electrical, gas, water, sewer infrastructure projects' },
  { icon: Droplets, label: 'Environmental Filings', count: '100+', description: 'Environmental impact assessments, wetland permits' },
  { icon: HardHat, label: 'Federal & State', count: '40+', description: 'Federal contracts, state infrastructure programs' },
];

const REFRESH_RATES = [
  { type: 'Permits', frequency: 'Hourly', sources: '680+' },
  { type: 'Zoning Changes', frequency: 'Every 6 hours', sources: '1,200+' },
  { type: 'DOT Filings', frequency: 'Daily', sources: '240+' },
  { type: 'Utility Records', frequency: 'Hourly', sources: '180+' },
  { type: 'Environmental', frequency: 'Daily', sources: '100+' },
  { type: 'Federal/State', frequency: 'Daily', sources: '40+' },
];

const SAMPLE_COUNTIES = [
  'Wake County, NC', 'Mecklenburg County, NC', 'Hillsborough County, FL',
  'Dallas County, TX', 'Maricopa County, AZ', 'Orange County, CA',
  'Fairfax County, VA', 'King County, WA', 'Cook County, IL',
  'Harris County, TX', 'San Diego County, CA', 'Miami-Dade County, FL',
];

export default function DataCoveragePage() {
  const { setCurrentPage } = useStore();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-[800px] mx-auto px-6 pt-10 pb-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent-indigo/10 flex items-center justify-center mx-auto mb-4">
          <Globe className="w-7 h-7 text-accent-indigo" />
        </div>
        <h1 className="text-3xl font-semibold text-ink-primary tracking-tight mb-3">
          Data Coverage
        </h1>
        <p className="text-sm text-ink-secondary max-w-[480px] mx-auto leading-relaxed">
          BuildSignal monitors public records across every US county. Here is exactly what we cover and how often it updates.
        </p>
      </div>

      {/* Coverage Stats */}
      <div className="max-w-[800px] mx-auto px-6 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COVERAGE_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-surface rounded-xl border border-ink-wash p-4 text-center"
              >
                <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <p className="text-xl font-semibold text-ink-primary font-mono tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[11px] text-ink-tertiary mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Source Types */}
      <div className="border-y border-ink-wash bg-surface/50">
        <div className="max-w-[800px] mx-auto px-6 py-10">
          <h2 className="text-xl font-semibold text-ink-primary mb-6 text-center">
            Data Sources by Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SOURCE_TYPES.map((source) => {
              const Icon = source.icon;
              return (
                <div
                  key={source.label}
                  className="flex items-start gap-3 p-4 bg-surface rounded-xl border border-ink-wash"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent-indigo/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-accent-indigo" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-sm font-semibold text-ink-primary">
                        {source.label}
                      </h3>
                      <span className="text-[11px] font-mono text-accent-teal font-medium">
                        {source.count}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-secondary leading-relaxed">
                      {source.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Refresh Rates */}
      <div className="max-w-[800px] mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold text-ink-primary mb-6 text-center">
          Data Refresh Schedule
        </h2>
        <div className="bg-surface rounded-2xl border border-ink-wash overflow-hidden">
          <div className="grid grid-cols-3 gap-px bg-ink-wash/30 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider">
            <div className="bg-surface px-4 py-2.5">Data Type</div>
            <div className="bg-surface px-4 py-2.5">Refresh Rate</div>
            <div className="bg-surface px-4 py-2.5">Sources</div>
          </div>
          {REFRESH_RATES.map((row) => (
            <div
              key={row.type}
              className="grid grid-cols-3 gap-px bg-ink-wash/30"
            >
              <div className="bg-surface px-4 py-3 text-xs text-ink-primary">{row.type}</div>
              <div className="bg-surface px-4 py-3 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-accent-indigo" />
                <span className="text-xs text-ink-secondary">{row.frequency}</span>
              </div>
              <div className="bg-surface px-4 py-3 text-xs text-ink-secondary font-mono">
                {row.sources}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Counties */}
      <div className="max-w-[800px] mx-auto px-6 pb-10">
        <h2 className="text-xl font-semibold text-ink-primary mb-4 text-center">
          Covered Counties (Sample)
        </h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {SAMPLE_COUNTIES.map((county) => (
            <span
              key={county}
              className="px-3 py-1.5 rounded-lg bg-surface border border-ink-wash text-xs text-ink-secondary"
            >
              {county}
            </span>
          ))}
        </div>
        <p className="text-center text-[11px] text-ink-tertiary mt-3">
          ...and 3,131 more counties across all 50 states and DC
        </p>
      </div>

      {/* CTA */}
      <div className="border-y border-ink-wash bg-surface/50">
        <div className="max-w-[800px] mx-auto px-6 py-10 text-center">
          <h2 className="text-xl font-semibold text-ink-primary mb-3">
            Need a Specific County?
          </h2>
          <p className="text-sm text-ink-secondary mb-5 max-w-[400px] mx-auto">
            If you need coverage in a specific county or data source type, let us know and we will prioritize it.
          </p>
          <button
            onClick={() => setCurrentPage('contact')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all"
          >
            Request Coverage
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
