import { useState } from 'react';
import { Database, CheckCircle2, AlertTriangle, Clock, TrendingUp, Shield, RefreshCw, Filter, FileCheck, ChevronDown, ChevronUp } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-12: Data Quality Panel
// Coverage, scheduling, dedup, freshness, error reporting.
// ═══════════════════════════════════════════════════════════════

interface QualityMetric {
  label: string;
  value: string;
  target: string;
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
}

const METRICS: QualityMetric[] = [
  { label: 'Coverage', value: '3,143 counties', target: '3,143', status: 'good', icon: <Database className="w-4 h-4" /> },
  { label: 'Freshness', value: '< 4 hours', target: '< 6 hours', status: 'good', icon: <Clock className="w-4 h-4" /> },
  { label: 'Duplicate Rate', value: '0.3%', target: '< 1%', status: 'good', icon: <Filter className="w-4 h-4" /> },
  { label: 'Retry Success', value: '99.7%', target: '> 99%', status: 'good', icon: <RefreshCw className="w-4 h-4" /> },
  { label: 'Pipeline Uptime', value: '99.94%', target: '> 99.9%', status: 'warning', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Error Rate', value: '0.08%', target: '< 0.1%', status: 'good', icon: <Shield className="w-4 h-4" /> },
];

interface ProviderQuality {
  name: string;
  records: number;
  duplicates: number;
  lastRun: string;
  nextRun: string;
  freshness: string;
  errors: number;
}

const PROVIDER_QUALITY: ProviderQuality[] = [
  { name: 'Permit Database', records: 482000, duplicates: 1240, lastRun: '3 min ago', nextRun: 'in 57 min', freshness: '2.1 hrs', errors: 3 },
  { name: 'Zoning Board', records: 45200, duplicates: 89, lastRun: '12 min ago', nextRun: 'in 48 min', freshness: '1.8 hrs', errors: 0 },
  { name: 'Utility API', records: 891000, duplicates: 2100, lastRun: '7 min ago', nextRun: 'in 23 min', freshness: '3.4 hrs', errors: 1 },
  { name: 'Planning Docs', records: 12800, duplicates: 34, lastRun: '45 min ago', nextRun: 'in 15 min', freshness: '5.2 hrs', errors: 7 },
  { name: 'Public Notices', records: 67800, duplicates: 156, lastRun: '18 min ago', nextRun: 'in 42 min', freshness: '2.8 hrs', errors: 0 },
  { name: 'Transportation', records: 23400, duplicates: 67, lastRun: '22 min ago', nextRun: 'in 38 min', freshness: '4.1 hrs', errors: 2 },
  { name: 'County Records', records: 1200000, duplicates: 3400, lastRun: '5 min ago', nextRun: 'in 55 min', freshness: '1.2 hrs', errors: 1 },
  { name: 'Federal Registry', records: 5400, duplicates: 0, lastRun: '6 hrs ago', nextRun: 'in 18 hrs', freshness: '22.1 hrs', errors: 12 },
];

export default function DataQualityPanel() {
  const [expanded, setExpanded] = useState(false);

  const allGood = METRICS.every((m) => m.status === 'good');

  return (
    <div className="bg-surface rounded-xl border border-ink-wash overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-canvas/30 transition-colors"
      >
        <FileCheck className="w-4 h-4 text-accent-teal" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink-primary">Data Quality</span>
            {allGood ? (
              <span className="flex items-center gap-1 text-[10px] text-accent-teal">
                <CheckCircle2 className="w-3 h-3" /> All metrics good
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-accent-amber">
                <AlertTriangle className="w-3 h-3" /> Needs attention
              </span>
            )}
          </div>
          <p className="text-[11px] text-ink-secondary">Coverage, freshness, deduplication, errors</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-ink-tertiary" /> : <ChevronDown className="w-4 h-4 text-ink-tertiary" />}
      </button>

      {expanded && (
        <div className="border-t border-ink-wash px-4 pb-4">
          {/* Summary metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {METRICS.map((m) => (
              <div key={m.label} className="p-3 rounded-lg bg-canvas border border-ink-wash">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={m.status === 'good' ? 'text-accent-teal' : 'text-accent-amber'}>{m.icon}</span>
                  <span className="text-[10px] text-ink-tertiary">{m.label}</span>
                </div>
                <p className={`text-sm font-semibold font-mono ${m.status === 'good' ? 'text-accent-teal' : 'text-accent-amber'}`}>{m.value}</p>
                <p className="text-[9px] text-ink-tertiary">Target: {m.target}</p>
              </div>
            ))}
          </div>

          {/* Provider breakdown */}
          <div className="mt-4">
            <p className="text-xs font-medium text-ink-primary mb-2">Per-Provider Quality</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-ink-wash">
                    <th className="text-left py-2 px-2 text-ink-tertiary font-medium">Provider</th>
                    <th className="text-right py-2 px-2 text-ink-tertiary font-medium">Records</th>
                    <th className="text-right py-2 px-2 text-ink-tertiary font-medium">Dup %</th>
                    <th className="text-left py-2 px-2 text-ink-tertiary font-medium">Freshness</th>
                    <th className="text-right py-2 px-2 text-ink-tertiary font-medium">Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {PROVIDER_QUALITY.map((p) => {
                    const dupRate = ((p.duplicates / p.records) * 100).toFixed(2);
                    return (
                      <tr key={p.name} className="border-b border-ink-wash/50 hover:bg-canvas/30">
                        <td className="py-2 px-2 text-ink-primary font-medium">{p.name}</td>
                        <td className="py-2 px-2 text-right font-mono text-ink-primary">{p.records.toLocaleString()}</td>
                        <td className="py-2 px-2 text-right font-mono">
                          <span className={parseFloat(dupRate) < 1 ? 'text-accent-teal' : 'text-accent-amber'}>{dupRate}%</span>
                        </td>
                        <td className="py-2 px-2">
                          <span className={parseFloat(p.freshness) < 6 ? 'text-accent-teal' : 'text-accent-amber'}>{p.freshness}</span>
                        </td>
                        <td className="py-2 px-2 text-right font-mono">
                          <span className={p.errors === 0 ? 'text-accent-teal' : p.errors < 5 ? 'text-accent-amber' : 'text-accent-crimson'}>{p.errors}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
