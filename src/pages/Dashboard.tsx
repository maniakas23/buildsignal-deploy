import { useState } from 'react'
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

// ─── Color Palette ───────────────────────────────────────────────────
const COLORS = {
  deepNavy: '#0B1F33',
  signalBlue: '#1F5EFF',
  insightTeal: '#18A999',
  opportunityAmber: '#F4A261',
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
    message: 'New permit filed in Austin, TX \u2014 $42M mixed-use project',
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
const severityStyles = {
  critical:
    'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  warning:
    'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  info:
    'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
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
function TrendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className='rounded-lg border bg-white px-3 py-2 shadow-md dark:bg-slate-900 dark:border-slate-700'>
      <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>{label}</p>
      <p className='text-sm font-bold' style={{ color: COLORS.signalBlue }}>
        {payload[0].value.toLocaleString()} opportunities
      </p>
    </div>
  )
}

// ─── Custom Tooltip for PieChart ────────────────────────────────────
function SectorTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className='rounded-lg border bg-white px-3 py-2 shadow-md dark:bg-slate-900 dark:border-slate-700'>
      <p className='text-sm font-bold' style={{ color: data.color }}>{data.name}</p>
      <p className='text-sm text-slate-600 dark:text-slate-300'>{data.value} opportunities</p>
      <p className='text-xs text-slate-400'>
        {Math.round((data.value / 1247) * 100)}% of total
      </p>
    </div>
  )
}

export function Dashboard() {
  const [hoveredOpportunity, setHoveredOpportunity] = useState<number | null>(null)

  return (
    <div className='container mx-auto py-8 px-4 max-w-7xl'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight' style={{ color: COLORS.deepNavy }}>
          Dashboard
        </h1>
        <p className='text-muted-foreground mt-1'>
          AI-powered infrastructure intelligence overview
        </p>
      </div>

      {/* ─── Stats Row ─────────────────────────────────────────────────── */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {/* Total Opportunities */}
        <Card
          className='relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-l-4'
          style={{ borderLeftColor: COLORS.signalBlue }}
        >
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Total Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-baseline justify-between'>
              <p className='text-3xl font-bold' style={{ color: COLORS.deepNavy }}>
                1,247
              </p>
              <span className='text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700'>
                +12%
              </span>
            </div>
            <p className='text-xs text-muted-foreground mt-2'>vs. previous 30 days</p>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card
          className='relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-l-4'
          style={{ borderLeftColor: COLORS.opportunityAmber }}
        >
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-baseline justify-between'>
              <p className='text-3xl font-bold' style={{ color: COLORS.deepNavy }}>
                34
              </p>
              <Badge className='text-xs font-semibold bg-red-100 text-red-700 border-transparent hover:bg-red-100'>
                3 critical
              </Badge>
            </div>
            <p className='text-xs text-muted-foreground mt-2'>across all markets</p>
          </CardContent>
        </Card>

        {/* Markets Tracked */}
        <Card
          className='relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-l-4'
          style={{ borderLeftColor: COLORS.insightTeal }}
        >
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Markets Tracked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-baseline justify-between'>
              <p className='text-3xl font-bold' style={{ color: COLORS.deepNavy }}>
                156
              </p>
              <span className='text-xs text-muted-foreground font-medium'>counties</span>
            </div>
            <p className='text-xs text-muted-foreground mt-2'>15 states monitored</p>
          </CardContent>
        </Card>

        {/* Pipeline Value */}
        <Card
          className='relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-l-4'
          style={{ borderLeftColor: COLORS.deepNavy }}
        >
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Pipeline Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-baseline justify-between'>
              <p className='text-3xl font-bold' style={{ color: COLORS.deepNavy }}>
                $4.2M
              </p>
              <span className='text-xs text-muted-foreground font-medium'>est.</span>
            </div>
            <p className='text-xs text-muted-foreground mt-2'>year-to-date potential</p>
          </CardContent>
        </Card>
      </div>

      {/* ─── Charts Section ─────────────────────────────────────────────── */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        {/* Opportunity Trend */}
        <Card className='transition-all duration-300 hover:shadow-md'>
          <CardHeader>
            <CardTitle className='text-base font-semibold' style={{ color: COLORS.deepNavy }}>
              Opportunity Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={280}>
              <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' />
                <XAxis
                  dataKey='month'
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v.toLocaleString()}
                />
                <Tooltip content={<TrendTooltip />} />
                <Line
                  type='monotone'
                  dataKey='opportunities'
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
        <Card className='transition-all duration-300 hover:shadow-md'>
          <CardHeader>
            <CardTitle className='text-base font-semibold' style={{ color: COLORS.deepNavy }}>
              Market Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <ResponsiveContainer width='100%' height={280}>
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx='50%'
                    cy='50%'
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey='value'
                    animationDuration={1500}
                  >
                    {sectorData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke='none' />
                    ))}
                  </Pie>
                  <Tooltip content={<SectorTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className='flex flex-col gap-3 min-w-[140px] -ml-4'>
                {sectorData.map((s) => (
                  <div key={s.name} className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full' style={{ backgroundColor: s.color }} />
                    <div>
                      <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>
                        {s.name}
                      </p>
                      <p className='text-xs text-muted-foreground'>{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Recent Opportunities + Alerts Row ─────────────────────────── */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
        {/* Recent Opportunities Feed */}
        <div className='lg:col-span-2'>
          <Card className='transition-all duration-300 hover:shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-base font-semibold' style={{ color: COLORS.deepNavy }}>
                Recent Opportunities
              </CardTitle>
              <Button
                variant='link'
                className='text-xs h-auto p-0'
                style={{ color: COLORS.signalBlue }}
              >
                View all
              </Button>
            </CardHeader>
            <CardContent className='px-0'>
              {/* Header row */}
              <div className='grid grid-cols-12 gap-4 px-6 pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b'>
                <div className='col-span-4'>Project</div>
                <div className='col-span-3 hidden sm:block'>Location</div>
                <div className='col-span-2 hidden md:block'>Sector</div>
                <div className='col-span-2 text-center'>Confidence</div>
                <div className='col-span-3 sm:col-span-1 text-right'>Date</div>
              </div>
              {/* Data rows */}
              <div className='divide-y'>
                {recentOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer transition-colors duration-200 ${
                      hoveredOpportunity === opp.id
                        ? 'bg-slate-50 dark:bg-slate-800/50'
                        : ''
                    }`}
                    onMouseEnter={() => setHoveredOpportunity(opp.id)}
                    onMouseLeave={() => setHoveredOpportunity(null)}
                  >
                    <div className='col-span-4'>
                      <p className='text-sm font-semibold text-slate-800 dark:text-slate-100 truncate'>
                        {opp.projectName}
                      </p>
                    </div>
                    <div className='col-span-3 hidden sm:block'>
                      <p className='text-sm text-muted-foreground'>{opp.location}</p>
                    </div>
                    <div className='col-span-2 hidden md:block'>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${sectorBadgeStyles[opp.sector]}`}
                      >
                        {opp.sector}
                      </span>
                    </div>
                    <div className='col-span-2 text-center'>
                      <div className='flex items-center justify-center gap-2'>
                        <div className='w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden dark:bg-slate-700'>
                          <div
                            className='h-full rounded-full transition-all duration-500'
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
                        <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
                          {opp.confidence}%
                        </span>
                      </div>
                    </div>
                    <div className='col-span-3 sm:col-span-1 text-right'>
                      <p className='text-xs text-muted-foreground'>{formatDate(opp.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Summary */}
        <div>
          <Card className='transition-all duration-300 hover:shadow-md h-full'>
            <CardHeader>
              <CardTitle className='text-base font-semibold' style={{ color: COLORS.deepNavy }}>
                Alert Summary
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-sm ${severityStyles[alert.severity]}`}
                >
                  <div className='flex items-start gap-3'>
                    <div className='mt-1 min-w-[8px]'>
                      <div
                        className='w-2 h-2 rounded-full'
                        style={{
                          backgroundColor:
                            alert.severity === 'critical'
                              ? '#dc2626'
                              : alert.severity === 'warning'
                                ? '#d97706'
                                : COLORS.signalBlue,
                        }}
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium leading-snug'>{alert.message}</p>
                      <p className='text-xs mt-1 opacity-70'>{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              <Button className='w-full mt-2' style={{ backgroundColor: COLORS.deepNavy }}>
                Manage Alerts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ─── Quick Actions ──────────────────────────────────────────────── */}
      <div className='flex flex-wrap gap-3'>
        <Button
          className='transition-all duration-200 hover:shadow-md'
          style={{ backgroundColor: COLORS.signalBlue }}
        >
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
            />
          </svg>
          View All Opportunities
        </Button>
        <Button
          variant='outline'
          className='transition-all duration-200 hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800'
          style={{ borderColor: COLORS.opportunityAmber, color: COLORS.deepNavy }}
        >
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
            />
          </svg>
          Manage Alerts
        </Button>
        <Button
          variant='outline'
          className='transition-all duration-200 hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800'
          style={{ borderColor: COLORS.insightTeal, color: COLORS.deepNavy }}
        >
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
            />
          </svg>
          Export Report
        </Button>
        <Button
          variant='outline'
          className='transition-all duration-200 hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800'
          style={{ borderColor: COLORS.deepNavy, color: COLORS.deepNavy }}
        >
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          Add to Watchlist
        </Button>
      </div>
    </div>
  )
}
