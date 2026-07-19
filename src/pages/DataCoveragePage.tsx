import { MapPin, Database, Clock, Globe, CheckCircle2 } from 'lucide-react';

const COVERAGE_STATS = [
  { value: '3,143', label: 'Counties Monitored', icon: <MapPin className="w-5 h-5 text-accent-indigo" /> },
  { value: '2,400+', label: 'Data Sources', icon: <Database className="w-5 h-5 text-accent-teal" /> },
  { value: '<4hrs', label: 'Avg. Refresh Rate', icon: <Clock className="w-5 h-5 text-accent-amber" /> },
  { value: '50', label: 'States + DC', icon: <Globe className="w-5 h-5 text-accent-crimson" /> },
];

const SOURCE_TYPES = [
  { name: 'Permit Filings', description: 'Building, electrical, plumbing, and mechanical permits', refresh: '4-6 hours', coverage: '98%' },
  { name: 'Zoning Changes', description: 'Rezoning applications, variances, and amendments', refresh: '12-24 hours', coverage: '95%' },
  { name: 'Utility Filings', description: 'Water, sewer, gas, and electric service requests', refresh: '6-12 hours', coverage: '92%' },
  { name: 'Planning Documents', description: 'Site plans, master plans, and development agreements', refresh: '24-48 hours', coverage: '88%' },
  { name: 'Public Notices', description: 'Hearing notices, RFQs, and government announcements', refresh: '12-24 hours', coverage: '90%' },
  { name: 'Transportation', description: 'Road projects, transit expansions, and port activity', refresh: '24-48 hours', coverage: '85%' },
];

const SAMPLE_COUNTIES = [
  'Harris County, TX', 'Travis County, TX', 'Dallas County, TX', 'King County, WA',
  'Los Angeles County, CA', 'Cook County, IL', 'Miami-Dade County, FL', 'Denver County, CO',
  'Maricopa County, AZ', ' Fulton County, GA', 'Mecklenburg County, NC', 'Orange County, CA',
];

export default function DataCoveragePage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero */}
      <section className="bg-surface border-b border-ink-wash">
        <div className="max-w-content mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-accent-indigo" />
            </div>
            <span className="text-xs text-ink-tertiary uppercase tracking-wider">Data Coverage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary mb-3">
            Nationwide Data Coverage
          </h1>
          <p className="text-sm text-ink-secondary leading-relaxed max-w-2xl">
            BuildSignal monitors 3,143 counties across all 50 states and DC, ingesting data from 
            2,400+ sources with refresh rates as fast as 4 hours.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-content mx-auto px-6 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {COVERAGE_STATS.map((stat) => (
            <div key={stat.label} className="bg-surface rounded-2xl p-5 shadow-card border border-ink-wash text-center">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <p className="text-xl font-bold text-ink-primary font-mono">{stat.value}</p>
              <p className="text-xs text-ink-tertiary">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Source Types */}
      <section className="bg-surface border-y border-ink-wash">
        <div className="max-w-content mx-auto px-6 py-10">
          <h2 className="text-lg font-semibold text-ink-primary mb-5">Data Sources & Refresh Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-wash">
                  <th className="text-left py-3 px-4 text-xs font-medium text-ink-tertiary uppercase tracking-wider">Source Type</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-ink-tertiary uppercase tracking-wider">Description</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-ink-tertiary uppercase tracking-wider">Refresh Rate</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-ink-tertiary uppercase tracking-wider">Coverage</th>
                </tr>
              </thead>
              <tbody>
                {SOURCE_TYPES.map((source) => (
                  <tr key={source.name} className="border-b border-ink-wash hover:bg-canvas/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent-teal flex-shrink-0" />
                        <span className="font-medium text-ink-primary">{source.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-ink-secondary">{source.description}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-accent-indigo/10 text-accent-indigo text-xs font-medium">
                        {source.refresh}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-accent-teal font-mono text-xs">{source.coverage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sample Counties */}
      <section className="max-w-content mx-auto px-6 py-10">
        <h2 className="text-lg font-semibold text-ink-primary mb-5">Sample Coverage Areas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {SAMPLE_COUNTIES.map((county) => (
            <div key={county} className="flex items-center gap-2 p-3 rounded-xl bg-surface border border-ink-wash">
              <MapPin className="w-3.5 h-3.5 text-accent-indigo flex-shrink-0" />
              <span className="text-xs text-ink-primary">{county}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-tertiary mt-4 text-center">
          And 3,131 more counties across all 50 states. Contact us for specific coverage questions.
        </p>
      </section>
    </div>
  );
}
