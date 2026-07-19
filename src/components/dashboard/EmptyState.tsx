import { useStore } from '@/store/useStore';
import {
  MapPin, Search, Bell, ArrowRight, Sparkles,
  BarChart3, Radar, TrendingUp
} from 'lucide-react';

interface EmptyStateProps {
  type: 'no-opportunities' | 'no-counties' | 'first-visit' | 'no-alerts';
}

export default function EmptyState({ type }: EmptyStateProps) {
  const { setCurrentPage } = useStore();

  if (type === 'no-counties') {
    return (
      <div className="bg-surface border border-ink-wash rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent-indigo/10 flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-7 h-7 text-accent-indigo" />
        </div>
        <h3 className="text-base font-semibold text-ink-primary mb-2">
          No Counties Selected Yet
        </h3>
        <p className="text-sm text-ink-secondary max-w-[360px] mx-auto mb-5 leading-relaxed">
          Select counties to monitor and we will start detecting construction opportunities in those areas.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage('onboarding')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Set Up Monitoring
          </button>
          <button
            onClick={() => setCurrentPage('county-coverage')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-canvas border border-ink-wash text-sm font-medium text-ink-secondary hover:bg-surface-hover transition-all"
          >
            Browse Counties
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (type === 'no-alerts') {
    return (
      <div className="bg-surface border border-ink-wash rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent-amber/10 flex items-center justify-center mx-auto mb-4">
          <Bell className="w-7 h-7 text-accent-amber" />
        </div>
        <h3 className="text-base font-semibold text-ink-primary mb-2">
          No Alerts Configured
        </h3>
        <p className="text-sm text-ink-secondary max-w-[360px] mx-auto mb-5 leading-relaxed">
          Set up alerts to get notified when new opportunities match your criteria.
        </p>
        <button
          onClick={() => setCurrentPage('alerts')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all"
        >
          <Bell className="w-4 h-4" />
          Configure Alerts
        </button>
      </div>
    );
  }

  if (type === 'first-visit') {
    return (
      <div className="space-y-6">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-accent-indigo/10 to-accent-violet/10 border border-accent-indigo/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-indigo/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-accent-indigo" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink-primary mb-1">
                Your Intelligence Dashboard is Ready
              </h3>
              <p className="text-sm text-ink-secondary mb-4 leading-relaxed">
                BuildSignal monitors 2,400+ public data sources across 3,100+ counties. Here is how to get your first insight in under 5 minutes.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setCurrentPage('onboarding')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all"
                >
                  Start Guided Setup
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCurrentPage('search')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-canvas border border-ink-wash text-sm font-medium text-ink-secondary hover:bg-surface-hover transition-all"
                >
                  <Search className="w-3.5 h-3.5" />
                  Search Counties
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick-start cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setCurrentPage('map')}
            className="group bg-surface border border-ink-wash rounded-xl p-4 text-left hover:border-accent-indigo/30 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-accent-indigo/10 flex items-center justify-center mb-3 group-hover:bg-accent-indigo/20 transition-colors">
              <Radar className="w-4 h-4 text-accent-indigo" />
            </div>
            <p className="text-xs font-semibold text-ink-primary mb-0.5">Explore the Map</p>
            <p className="text-[11px] text-ink-secondary">Visualize opportunities geographically</p>
          </button>

          <button
            onClick={() => setCurrentPage('search')}
            className="group bg-surface border border-ink-wash rounded-xl p-4 text-left hover:border-accent-indigo/30 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-accent-indigo/10 flex items-center justify-center mb-3 group-hover:bg-accent-indigo/20 transition-colors">
              <Search className="w-4 h-4 text-accent-indigo" />
            </div>
            <p className="text-xs font-semibold text-ink-primary mb-0.5">Search & Filter</p>
            <p className="text-[11px] text-ink-secondary">Find projects by county or keyword</p>
          </button>

          <button
            onClick={() => setCurrentPage('alerts')}
            className="group bg-surface border border-ink-wash rounded-xl p-4 text-left hover:border-accent-indigo/30 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-accent-indigo/10 flex items-center justify-center mb-3 group-hover:bg-accent-indigo/20 transition-colors">
              <Bell className="w-4 h-4 text-accent-indigo" />
            </div>
            <p className="text-xs font-semibold text-ink-primary mb-0.5">Set Up Alerts</p>
            <p className="text-[11px] text-ink-secondary">Get notified about new opportunities</p>
          </button>
        </div>

        {/* Sample data teaser */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-accent-teal" />
            <span className="text-xs font-semibold text-ink-primary">Live Platform Stats</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Active Signals', value: '2,847' },
              { label: 'Counties Covered', value: '3,100+' },
              { label: 'Data Sources', value: '2,400+' },
              { label: 'Avg Lead Time', value: '60-90 days' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-lg font-semibold text-ink-primary font-mono">{stat.value}</p>
                <p className="text-[10px] text-ink-tertiary mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-ink-tertiary">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-accent-teal" />
            Results in 48 hours
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-accent-teal" />
            3,100+ US counties
          </span>
          <span className="flex items-center gap-1">
            <Bell className="w-3 h-3 text-accent-teal" />
            Real-time alerts
          </span>
        </div>
      </div>
    );
  }

  // Default: no-opportunities
  return (
    <div className="bg-surface border border-ink-wash rounded-2xl p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent-indigo/10 flex items-center justify-center mx-auto mb-4">
        <BarChart3 className="w-7 h-7 text-accent-indigo" />
      </div>
      <h3 className="text-base font-semibold text-ink-primary mb-2">
        Monitoring Your Counties
      </h3>
      <p className="text-sm text-ink-secondary max-w-[400px] mx-auto mb-5 leading-relaxed">
        No opportunities detected yet in your monitored areas. Our system checks every hour — new signals typically appear within 24-48 hours of county selection.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => setCurrentPage('onboarding')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Add More Counties
        </button>
        <button
          onClick={() => setCurrentPage('map')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-canvas border border-ink-wash text-sm font-medium text-ink-secondary hover:bg-surface-hover transition-all"
        >
          Explore Map
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
