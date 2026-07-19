import { Shield, Lock, Eye, Database, Clock, TrendingUp, Globe, Server } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: Shield, label: 'SOC 2 Type II', color: 'text-accent-teal' },
  { icon: Lock, label: 'AES-256 Encrypted', color: 'text-accent-teal' },
  { icon: Eye, label: 'Transparent AI', color: 'text-accent-indigo' },
  { icon: Database, label: 'Public Data Only', color: 'text-accent-indigo' },
];

const LIVE_STATS = [
  { icon: Globe, label: 'Counties Covered', value: '3,100+' },
  { icon: Database, label: 'Data Sources', value: '2,400+' },
  { icon: Clock, label: 'Avg. Lead Time', value: '60-90 days' },
  { icon: Server, label: 'Platform Uptime', value: '99.7%' },
  { icon: TrendingUp, label: 'Confidence Score', value: '94%' },
];

export default function TrustMetrics() {
  return (
    <div className="bg-surface border border-ink-wash rounded-2xl overflow-hidden">
      {/* Trust badges row */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-3 border-b border-ink-wash/50 bg-canvas/30">
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-1.5">
              <Icon className={`w-3.5 h-3.5 ${item.color}`} />
              <span className="text-[11px] text-ink-secondary font-medium">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 px-4 py-3">
        {LIVE_STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Icon className="w-3 h-3 text-ink-tertiary" />
                <span className="text-[10px] text-ink-tertiary uppercase tracking-wider">{s.label}</span>
              </div>
              <p className="text-sm font-semibold text-ink-primary font-mono">{s.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
