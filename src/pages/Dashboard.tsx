import { useState } from 'react'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'
import { DashboardTour } from '@/components/tour/DashboardTour'
import { HelpWidget } from '@/components/help/HelpWidget'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  RefreshCw,
  ChevronDown,
  TrendingUp,
  AlertCircle,
  ClipboardList,
  Bell,
  Download,
  Plus,
  Info,
} from 'lucide-react'

// ─── Color Palette ───────────────────────────────────────────────────
const COLORS = {
  deepNavy: '#0B1F33',
  signalBlue: '#1F5EFF',
  insightTeal: '#18A999',
  opportunityAmber: '#F4A261',
  white: '#FFFFFF',
  lightGrey: '#F5F5F5',
  darkGrey: '#333333',
  errorRed: '#D32F2F',
  chartIndigo: '#6366F1',
  borderGrey: '#E2E8F0',
}

// ─── Mock Data ───────────────────────────────────────────────────────
const trendData = [
  { month: 'Jan', opportunities: 980 },
  { month: 'Feb', opportunities: 1050 },
  { month: 'Mar', opportunities: 1120 },
  { month: 'Apr', opportunities: 1180 },
  { month: 'May', opportunities: 1247 },
  { month: 'Jun', opportunities: 1398 },
]

const sectorData = [
  { name: 'Commercial', value: 487, color: COLORS.signalBlue },
  { name: 'Residential', value: 356, color: COLORS.insightTeal },
  { name: 'Infrastructure', value: 284, color: COLORS.opportunityAmber },
  { name: 'Industrial', value: 120, color: COLORS.deepNavy },
]

const recentOpportunities = [
  {
    id: 1,
    projectName: 'Austin Metro Rail Extension',
    location: 'Austin, TX',
    sector: 'Infrastructure',
    confidence: 94,
    date: '2025-01-14',
  },
  {
    id: 2,
    projectName: 'Denver Tech Center Tower B',
    location: 'Denver, CO',
    sector: 'Commercial',
    confidence: 88,
    date: '2025-01-13',
  },
  {
    id: 3,
    projectName: 'Riverside Mixed-Use Development',
    location: 'Portland, OR',
    sector: 'Residential',
    confidence: 91,
    date: '2025-01-12',
  },
  {
    id: 4,
    projectName: 'Phoenix Solar Farm Phase 2',
    location: 'Phoenix, AZ',
    sector: 'Industrial',
    confidence: 85,
    date: '2025-01-11',
  },
  {
    id: 5,
    projectName: 'Seattle Waterfront Revitalization',
    location: 'Seattle, WA',
    sector: 'Infrastructure',
    confidence: 79,
    date: '2025-01-10',
  },
]

const alerts = [
  {
    id: 1,
    severity: 'critical' as const,
    message: 'New permit filed in Austin, TX — $42M mixed-use project',
    time: '2 hours ago',
  },
  {
    id: 2,
    severity: 'warning' as const,
    message: 'Zoning change detected in Denver metro area',
    time: '5 hours ago',
  },
  {
    id: 3,
    severity: 'info' as const,
    message: 'Pre-bid meeting scheduled for Portland highway project',
    time: '1 day ago',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────
const severityDotStyles = {
  critical: COLORS.errorRed,
  warning: COLORS.opportunityAmber,
  info: COLORS.signalBlue,
}

const sectorBadgeStyles: Record<string, string> = {
  Commercial: 'bg-[#1F5EFF]/10 text-[#1F5EFF] border-[#1F5EFF]/20',
  Residential: 'bg-[#18A999]/10 text-[#18A999] border-[#18A999]/20',
  Infrastructure: 'bg-[#F4A261]/10 text-[#F4A261] border-[#F4A261]/20',
  Industrial: 'bg-[#0B1F33]/10 text-[#0B1F33] border-[#0B1F33]/20 dark:bg-white/10 dark:text-white/80',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Custom Tooltip for LineChart ───────────────────────────────────
function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 shadow-md">
      <p className="text-sm font-medium text-[#333333]">{label}</p>
      <p className="text-sm font-bold" style={{ color: COLORS.signalBlue }}>
        {payload[0].value.toLocaleString()} opportunities
      </p>
    </div>
  )
}

// ─── Custom Tooltip for PieChart ────────────────────────────────────
function SectorTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; color: string } }> }) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 shadow-md">
      <p className="text-sm font-bold" style={{ color: data.color }}>{data.name}</p>
      <p className="text-sm text-[#333333]">{data.value} opportunities</p>
      <p className="text-xs text-[#9AA5B1]">
        {Math.round((data.value / 1247) * 100)}% of total
      </p>
    </div>
  )
}

export function Dashboard() {
  // ALL hooks must be called BEFORE any conditional return
  const [hoveredOpportunity, setHoveredOpportunity] = useState<number | null>(null)

  // Onboarding check — AFTER all hooks, using IIFE pattern
  const onboardingComplete = (() => {
    try {
      return localStorage.getItem('buildsignal_onboarding_complete')
    } catch {
      return 'skipped'
    }
  })()

  if (onboardingComplete === null) {
    return <OnboardingWizard />
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6">
      {/* ─── Page Header ─────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            className="text-[32px] font-bold leading-tight tracking-[-0.5px]"
            style={{ color: COLORS.deepNavy, fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Dashboard
          </h1>
          <p
            className="mt-1 text-[15px] leading-relaxed"
            style={{ color: COLORS.darkGrey, fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Infrastructure intelligence overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#333333] transition-all duration-200 hover:bg-[#F5F5F5] motion-reduce:transition-none"
            type="button"
          >
            Last 30 days
            <ChevronDown className="h-4 w-4 text-[#9AA5B1]" />
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100"
            style={{ borderColor: COLORS.signalBlue, color: COLORS.signalBlue, backgroundColor: COLORS.white }}
            type="button"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* ─── Sample Data Banner ────────────────────────────────────── */}
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:bg-amber-950/30 dark:border-amber-900">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
          <Info className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">Sample Data — Illustrative Example</span>
        </div>
        <p className="ml-7 mt-1 text-xs text-amber-700 dark:text-amber-400">
          This dashboard shows example data for demonstration purposes. Your actual dashboard will display real opportunities, alerts, and metrics from your subscribed markets after account activation.
        </p>
      </div>

      {/* ─── Stats Row ───────────────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Opportunities */}
        <div
          className="rounded-lg border border-[#E2E8F0] bg-white p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          style={{ borderLeftWidth: '4px', borderLeftColor: COLORS.signalBlue }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-[0.5px]"
            style={{ color: COLORS.darkGrey, fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Total Opportunities
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <p
              className="font-mono text-2xl font-medium md:text-[32px]"
              style={{ color: COLORS.deepNavy }}
            >
              1,247
            </p>
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12%
            </span>
          </div>
          <p className="mt-1 text-xs text-[#9AA5B1]">vs. previous 30 days</p>
          <p className="mt-3 border-t border-[#E2E8F0] pt-2 text-[10px] font-semibold uppercase tracking-wider text-[#9AA5B1]">
            Sample
          </p>
        </div>

        {/* Active Alerts */}
        <div
          className="rounded-lg border border-[#E2E8F0] bg-white p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          style={{ borderLeftWidth: '4px', borderLeftColor: COLORS.opportunityAmber }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-[0.5px]"
            style={{ color: COLORS.darkGrey, fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Active Alerts
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <p
              className="font-mono text-2xl font-medium md:text-[32px]"
              style={{ color: COLORS.deepNavy }}
            >
              34
            </p>
            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              <AlertCircle className="mr-1 h-3 w-3" />
              3 critical
            </span>
          </div>
          <p className="mt-1 text-xs text-[#9AA5B1]">across all markets</p>
          <p className="mt-3 border-t border-[#E2E8F0] pt-2 text-[10px] font-semibold uppercase tracking-wider text-[#9AA5B1]">
            Sample
          </p>
        </div>

        {/* Markets Tracked */}
        <div
          className="rounded-lg border border-[#E2E8F0] bg-white p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          style={{ borderLeftWidth: '4px', borderLeftColor: COLORS.insightTeal }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-[0.5px]"
            style={{ color: COLORS.darkGrey, fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Markets Tracked
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <p
              className="font-mono text-2xl font-medium md:text-[32px]"
              style={{ color: COLORS.deepNavy }}
            >
              156
            </p>
            <span className="text-xs font-medium text-[#9AA5B1]">counties</span>
          </div>
          <p className="mt-1 text-xs text-[#9AA5B1]">15 states monitored</p>
          <p className="mt-3 border-t border-[#E2E8F0] pt-2 text-[10px] font-semibold uppercase tracking-wider text-[#9AA5B1]">
            Sample
          </p>
        </div>

        {/* Pipeline Value */}
        <div
          className="rounded-lg border border-[#E2E8F0] bg-white p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          style={{ borderLeftWidth: '4px', borderLeftColor: COLORS.deepNavy }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-[0.5px]"
            style={{ color: COLORS.darkGrey, fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Pipeline Value
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <p
              className="font-mono text-2xl font-medium md:text-[32px]"
              style={{ color: COLORS.deepNavy }}
            >
              $4.2M
            </p>
            <span className="text-xs font-medium text-[#9AA5B1]">est.</span>
          </div>
          <p className="mt-1 text-xs text-[#9AA5B1]">year-to-date potential</p>
          <p className="mt-3 border-t border-[#E2E8F0] pt-2 text-[10px] font-semibold uppercase tracking-wider text-[#9AA5B1]">
            Sample
          </p>
        </div>
      </div>

      {/* ─── Charts Row ──────────────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Opportunity Trend */}
        <Card className="rounded-lg border border-[#E2E8F0] bg-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
            <CardTitle
              className="text-lg font-semibold"
              style={{ color: COLORS.deepNavy, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Opportunity Trend
            </CardTitle>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9AA5B1]">
              Sample
            </span>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#9AA5B1', fontFamily: 'Inter, system-ui, sans-serif' }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#9AA5B1', fontFamily: 'JetBrains Mono, monospace' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => v.toLocaleString()}
                />
                <Tooltip content={<TrendTooltip />} />
                <Line
                  type="monotone"
                  dataKey="opportunities"
                  stroke={COLORS.signalBlue}
                  strokeWidth={3}
                  dot={{ r: 5, fill: COLORS.signalBlue, stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: COLORS.signalBlue, stroke: '#fff', strokeWidth: 3 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Market Breakdown */}
        <Card className="rounded-lg border border-[#E2E8F0] bg-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
            <CardTitle
              className="text-lg font-semibold"
              style={{ color: COLORS.deepNavy, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Market Breakdown
            </CardTitle>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9AA5B1]">
              Sample
            </span>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {sectorData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<SectorTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex min-w-[140px] flex-col gap-3">
                {sectorData.map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                    <div>
                      <p className="text-sm font-medium text-[#333333]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {s.name}
                      </p>
                      <p className="font-mono text-xs text-[#9AA5B1]">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Opportunities + Alerts Row ──────────────────────────────── */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Opportunities Feed */}
        <div className="lg:col-span-2">
          <Card className="rounded-lg border border-[#E2E8F0] bg-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <div>
                <CardTitle
                  className="text-lg font-semibold"
                  style={{ color: COLORS.deepNavy, fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Recent Opportunities
                </CardTitle>
                <p className="mt-1 text-xs text-[#9AA5B1]">Example projects for demonstration</p>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9AA5B1]">
                Sample
              </span>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              {/* Header row */}
              <div className="grid grid-cols-12 gap-4 border-b border-[#E2E8F0] px-4 pb-2 text-xs font-semibold uppercase tracking-[0.5px] text-[#9AA5B1]">
                <div className="col-span-4">Project</div>
                <div className="col-span-3 hidden sm:block">Location</div>
                <div className="col-span-2 hidden md:block">Sector</div>
                <div className="col-span-2 text-center">Confidence</div>
                <div className="col-span-3 text-right sm:col-span-1">Date</div>
              </div>
              {/* Data rows */}
              <div>
                {recentOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className={`grid grid-cols-12 gap-4 items-center px-4 py-3 transition-colors duration-200 ${
                      hoveredOpportunity === opp.id ? 'bg-[#F5F5F5]' : ''
                    }`}
                    style={{ borderBottom: '1px solid #E2E8F0' }}
                    onMouseEnter={() => setHoveredOpportunity(opp.id)}
                    onMouseLeave={() => setHoveredOpportunity(null)}
                  >
                    <div className="col-span-4">
                      <p className="truncate text-sm font-semibold text-[#0B1F33]">
                        {opp.projectName}
                      </p>
                    </div>
                    <div className="col-span-3 hidden sm:block">
                      <p className="text-sm text-[#9AA5B1]">{opp.location}</p>
                    </div>
                    <div className="col-span-2 hidden md:block">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${sectorBadgeStyles[opp.sector]}`}
                      >
                        {opp.sector}
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#E2E8F0]">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${opp.confidence}%`,
                              backgroundColor:
                                opp.confidence >= 90
                                  ? COLORS.insightTeal
                                  : opp.confidence >= 80
                                    ? COLORS.signalBlue
                                    : COLORS.opportunityAmber,
                            }}
                          />
                        </div>
                        <span className="font-mono text-xs font-medium text-[#333333]">
                          {opp.confidence}%
                        </span>
                      </div>
                    </div>
                    <div className="col-span-3 text-right sm:col-span-1">
                      <p className="text-xs text-[#9AA5B1]">{formatDate(opp.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Summary */}
        <div>
          <Card className="h-full rounded-lg border border-[#E2E8F0] bg-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <CardTitle
                className="text-lg font-semibold"
                style={{ color: COLORS.deepNavy, fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Alert Summary
              </CardTitle>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9AA5B1]">
                Sample
              </span>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-lg border p-3 transition-all duration-200 hover:shadow-sm motion-reduce:transition-none"
                  style={{
                    borderColor:
                      alert.severity === 'critical'
                        ? '#FECACA'
                        : alert.severity === 'warning'
                          ? '#FDE68A'
                          : '#BFDBFE',
                    backgroundColor:
                      alert.severity === 'critical'
                        ? '#FEF2F2'
                        : alert.severity === 'warning'
                          ? '#FFFBEB'
                          : '#EFF6FF',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1.5 shrink-0">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: severityDotStyles[alert.severity] }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug text-[#333333]">
                        {alert.message}
                      </p>
                      <p className="mt-1 text-xs text-[#9AA5B1]">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                className="mt-2 w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100"
                style={{ backgroundColor: COLORS.signalBlue, color: COLORS.white }}
              >
                <Bell className="mr-2 h-4 w-4" />
                Manage Alerts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ─── Quick Actions Row ──────────────────────────────────────── */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Button
          className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100"
          style={{ backgroundColor: COLORS.signalBlue, color: COLORS.white }}
        >
          <ClipboardList className="mr-2 h-4 w-4" />
          View All Opportunities
        </Button>
        <Button
          className="border border-[#0B1F33] bg-white text-[#0B1F33] transition-all duration-200 hover:scale-[1.02] hover:bg-[#F5F5F5] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          <Bell className="mr-2 h-4 w-4" />
          Manage Alerts
        </Button>
        <Button
          className="border border-[#0B1F33] bg-white text-[#0B1F33] transition-all duration-200 hover:scale-[1.02] hover:bg-[#F5F5F5] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
        <Button
          className="border border-[#0B1F33] bg-white text-[#0B1F33] transition-all duration-200 hover:scale-[1.02] hover:bg-[#F5F5F5] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add to Watchlist
        </Button>
      </div>

      {/* ─── Tour & Help Widget ────────────────────────────────────── */}
      <DashboardTour />
      <HelpWidget />
    </div>
  )
}
