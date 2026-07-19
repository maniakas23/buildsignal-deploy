import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Users, UserPlus, CheckCircle2, Clock,
  Target, Bell, Activity, ArrowUpRight, ArrowDownRight, Minus,
  BarChart3, Zap, ChevronDown, ChevronUp
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-14: Product Analytics Dashboard
// Funnel metrics, engagement, retention — displayed in Operations.
// ═══════════════════════════════════════════════════════════════

interface FunnelStage {
  stage: string;
  count: number;
  prevCount: number;
  conversion: number;
  color: string;
}

interface WeeklyPoint {
  week: string;
  visitors: number;
  signups: number;
  active: number;
}

const FUNNEL: FunnelStage[] = [
  { stage: 'Visitors', count: 12400, prevCount: 10800, conversion: 100, color: '#4f46e5' },
  { stage: 'Signup Start', count: 3120, prevCount: 2700, conversion: 25.2, color: '#6366f1' },
  { stage: 'Signup Complete', count: 1872, prevCount: 1512, conversion: 60.0, color: '#818cf8' },
  { stage: 'Onboarding Start', count: 1685, prevCount: 1360, conversion: 90.0, color: '#0d9488' },
  { stage: 'Onboarding Complete', count: 1264, prevCount: 952, conversion: 75.0, color: '#14b8a6' },
  { stage: 'First Value', count: 948, prevCount: 714, conversion: 75.0, color: '#2dd4bf' },
];

const WEEKLY: WeeklyPoint[] = [
  { week: 'W1', visitors: 2100, signups: 420, active: 180 },
  { week: 'W2', visitors: 2300, signups: 510, active: 210 },
  { week: 'W3', visitors: 1950, signups: 380, active: 195 },
  { week: 'W4', visitors: 2600, signups: 620, active: 245 },
  { week: 'W5', visitors: 2800, signups: 680, active: 270 },
  { week: 'W6', visitors: 3100, signups: 740, active: 310 },
  { week: 'W7', visitors: 3400, signups: 820, active: 345 },
  { week: 'W8', visitors: 3800, signups: 910, active: 390 },
];

const RETENTION_COHORTS = [
  { cohort: 'Week 1', w1: 100, w2: 72, w3: 58, w4: 48 },
  { cohort: 'Week 2', w1: 100, w2: 74, w3: 61, w4: 0 },
  { cohort: 'Week 3', w1: 100, w2: 76, w3: 0, w4: 0 },
  { cohort: 'Week 4', w1: 100, w2: 0, w3: 0, w4: 0 },
];

function TrendIndicator({ value }: { value: number }) {
  if (value > 0) return <span className="flex items-center gap-0.5 text-[10px] text-accent-teal"><ArrowUpRight className="w-3 h-3" />+{value}%</span>;
  if (value < 0) return <span className="flex items-center gap-0.5 text-[10px] text-accent-crimson"><ArrowDownRight className="w-3 h-3" />{value}%</span>;
  return <span className="flex items-center gap-0.5 text-[10px] text-ink-tertiary"><Minus className="w-3 h-3" />0%</span>;
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="flex-shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProductAnalyticsDashboard() {
  const [expandedFunnel, setExpandedFunnel] = useState(false);

  const totalVisitors = FUNNEL[0].count;
  const totalSignups = FUNNEL[2].count;
  const signupRate = ((totalSignups / totalVisitors) * 100).toFixed(1);
  const onboardingRate = ((FUNNEL[4].count / FUNNEL[2].count) * 100).toFixed(1);
  const ttfvHours = '2.4'; // time to first value

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Weekly Active Users', value: '1,247', change: 14, icon: <Users className="w-4 h-4 text-accent-indigo" />, spark: WEEKLY.map((w) => w.active), color: '#4f46e5' },
          { label: 'Signup Rate', value: `${signupRate}%`, change: 3.2, icon: <UserPlus className="w-4 h-4 text-accent-teal" />, spark: WEEKLY.map((w) => w.signups), color: '#0d9488' },
          { label: 'Onboarding Complete', value: `${onboardingRate}%`, change: 5.1, icon: <CheckCircle2 className="w-4 h-4 text-accent-teal" />, spark: FUNNEL.slice(0, 5).map((f) => f.count / 20), color: '#14b8a6' },
          { label: 'Time to First Value', value: `${ttfvHours}hrs`, change: -18, icon: <Clock className="w-4 h-4 text-accent-amber" />, spark: [4.2, 3.8, 3.5, 3.1, 2.8, 2.6, 2.5, 2.4], color: '#d97706' },
        ].map((m) => (
          <div key={m.label} className="bg-surface rounded-xl p-4 border border-ink-wash">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                {m.icon}
                <span className="text-[10px] text-ink-tertiary">{m.label}</span>
              </div>
              <TrendIndicator value={m.change} />
            </div>
            <div className="flex items-end justify-between">
              <p className="text-xl font-semibold text-ink-primary font-mono">{m.value}</p>
              <MiniSparkline data={m.spark} color={m.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Conversion Funnel */}
      <div className="bg-surface rounded-xl p-5 border border-ink-wash">
        <button onClick={() => setExpandedFunnel(!expandedFunnel)} className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-accent-indigo" />
            <h3 className="text-sm font-semibold text-ink-primary">Conversion Funnel</h3>
            <span className="text-[10px] text-ink-tertiary">Visitor → First Value</span>
          </div>
          {expandedFunnel ? <ChevronUp className="w-4 h-4 text-ink-tertiary" /> : <ChevronDown className="w-4 h-4 text-ink-tertiary" />}
        </button>

        <div className="space-y-2">
          {FUNNEL.map((stage, i) => {
            const widthPct = (stage.count / FUNNEL[0].count) * 100;
            const prevWidth = ((stage.prevCount || 1) / FUNNEL[0].count) * 100;
            return (
              <div key={stage.stage} className="flex items-center gap-3">
                <span className="text-[10px] text-ink-tertiary w-28 text-right truncate">{stage.stage}</span>
                <div className="flex-1 h-6 bg-canvas rounded-md overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 bg-ink-wash/50 rounded-md transition-all" style={{ width: `${prevWidth}%` }} />
                  <div className="absolute inset-y-0 left-0 rounded-md transition-all flex items-center px-2" style={{ width: `${widthPct}%`, backgroundColor: stage.color + '20', borderRight: `2px solid ${stage.color}` }}>
                    <span className="text-[10px] font-medium font-mono" style={{ color: stage.color }}>{stage.count.toLocaleString()}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-ink-tertiary w-12 text-right">{stage.conversion}%</span>
              </div>
            );
          })}
        </div>

        {expandedFunnel && (
          <div className="mt-4 pt-4 border-t border-ink-wash">
            <p className="text-[11px] text-ink-secondary mb-2">Overall conversion: <strong className="text-accent-indigo">{((FUNNEL[FUNNEL.length - 1].count / FUNNEL[0].count) * 100).toFixed(1)}%</strong> of visitors reach first value</p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] text-ink-tertiary"><div className="w-3 h-3 rounded bg-ink-wash/50" /> Previous period</span>
              <span className="flex items-center gap-1 text-[10px] text-ink-tertiary"><div className="w-3 h-3 rounded" style={{ backgroundColor: '#4f46e520', borderRight: '2px solid #4f46e5' }} /> Current period</span>
            </div>
          </div>
        )}
      </div>

      {/* Weekly trend chart */}
      <div className="bg-surface rounded-xl p-5 border border-ink-wash">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-accent-teal" />
          <h3 className="text-sm font-semibold text-ink-primary">Weekly Trends</h3>
          <span className="text-[10px] text-ink-tertiary ml-auto">8 weeks</span>
        </div>
        <div className="overflow-x-auto">
          <svg viewBox="0 0 600 140" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
            {/* Grid lines */}
            {[0, 35, 70, 105, 140].map((y) => (
              <line key={y} x1="40" y1={y} x2="580" y2={y} stroke="#e5e7eb" strokeWidth="1" />
            ))}
            {/* Y axis labels */}
            <text x="35" y="10" textAnchor="end" className="text-[8px]" fill="#9ca3af">4k</text>
            <text x="35" y="45" textAnchor="end" className="text-[8px]" fill="#9ca3af">3k</text>
            <text x="35" y="80" textAnchor="end" className="text-[8px]" fill="#9ca3af">2k</text>
            <text x="35" y="115" textAnchor="end" className="text-[8px]" fill="#9ca3af">1k</text>
            <text x="35" y="140" textAnchor="end" className="text-[8px]" fill="#9ca3af">0</text>
            {/* X axis labels */}
            {WEEKLY.map((w, i) => (
              <text key={w.week} x={50 + (i / (WEEKLY.length - 1)) * 520} y="155" textAnchor="middle" className="text-[8px]" fill="#9ca3af">{w.week}</text>
            ))}
            {/* Visitors line */}
            <polyline
              points={WEEKLY.map((w, i) => `${50 + (i / (WEEKLY.length - 1)) * 520},${140 - (w.visitors / 4000) * 140}`).join(' ')}
              fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Signups line */}
            <polyline
              points={WEEKLY.map((w, i) => `${50 + (i / (WEEKLY.length - 1)) * 520},${140 - (w.signups / 4000) * 140}`).join(' ')}
              fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Active line */}
            <polyline
              points={WEEKLY.map((w, i) => `${50 + (i / (WEEKLY.length - 1)) * 520},${140 - (w.active / 4000) * 140}`).join(' ')}
              fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Legend */}
            <g transform="translate(400, 10)">
              <rect x="0" y="0" width="8" height="3" rx="1" fill="#4f46e5" />
              <text x="12" y="5" className="text-[8px]" fill="#6b7280">Visitors</text>
              <rect x="60" y="0" width="8" height="3" rx="1" fill="#0d9488" />
              <text x="72" y="5" className="text-[8px]" fill="#6b7280">Signups</text>
              <rect x="120" y="0" width="8" height="3" rx="1" fill="#d97706" />
              <text x="132" y="5" className="text-[8px]" fill="#6b7280">Active</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Retention Cohorts */}
      <div className="bg-surface rounded-xl p-5 border border-ink-wash">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-accent-amber" />
          <h3 className="text-sm font-semibold text-ink-primary">Retention Cohorts</h3>
          <span className="text-[10px] text-ink-tertiary ml-auto">Weekly</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-ink-wash">
                <th className="text-left py-2 px-2 text-ink-tertiary font-medium">Cohort</th>
                <th className="text-center py-2 px-2 text-ink-tertiary font-medium">Users</th>
                <th className="text-center py-2 px-2 text-ink-tertiary font-medium">Week 1</th>
                <th className="text-center py-2 px-2 text-ink-tertiary font-medium">Week 2</th>
                <th className="text-center py-2 px-2 text-ink-tertiary font-medium">Week 3</th>
                <th className="text-center py-2 px-2 text-ink-tertiary font-medium">Week 4</th>
              </tr>
            </thead>
            <tbody>
              {RETENTION_COHORTS.map((c) => {
                const users = Math.round(FUNNEL[2].count / 4);
                return (
                  <tr key={c.cohort} className="border-b border-ink-wash/50">
                    <td className="py-2 px-2 text-ink-primary font-medium">{c.cohort}</td>
                    <td className="py-2 px-2 text-center font-mono text-ink-secondary">{users}</td>
                    {[c.w1, c.w2, c.w3, c.w4].map((v, i) => (
                      <td key={i} className="py-2 px-2 text-center">
                        {v > 0 ? (
                          <span className={`inline-block px-2 py-0.5 rounded font-medium ${
                            v >= 70 ? 'bg-accent-teal/10 text-accent-teal' :
                            v >= 50 ? 'bg-accent-indigo/10 text-accent-indigo' :
                            v >= 30 ? 'bg-accent-amber/10 text-accent-amber' :
                            'bg-accent-crimson/10 text-accent-crimson'
                          }`}>
                            {v}%
                          </span>
                        ) : (
                          <span className="text-ink-wash">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface rounded-xl p-4 border border-ink-wash">
          <h4 className="text-xs font-medium text-ink-primary mb-3 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-accent-indigo" /> Recommendation Engagement
          </h4>
          <div className="space-y-2">
            {[
              { label: 'Views', value: '8,421', change: 23 },
              { label: 'Helpful votes', value: '1,247', change: 12 },
              { label: 'Saves', value: '342', change: 8 },
              { label: 'Dismissals', value: '156', change: -5 },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-[11px] text-ink-secondary">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-ink-primary">{item.value}</span>
                  <TrendIndicator value={item.change} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-ink-wash">
          <h4 className="text-xs font-medium text-ink-primary mb-3 flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-accent-amber" /> Alert Engagement
          </h4>
          <div className="space-y-2">
            {[
              { label: 'Alerts sent', value: '3,847', change: 18 },
              { label: 'Open rate', value: '68.2%', change: 4 },
              { label: 'Acknowledge rate', value: '54.1%', change: 7 },
              { label: 'Setting changes', value: '234', change: 12 },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-[11px] text-ink-secondary">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-ink-primary">{item.value}</span>
                  <TrendIndicator value={item.change} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
