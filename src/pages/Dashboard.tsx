import { useState } from 'react'
import { trpc } from '@/providers/trpc'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'
import { DashboardTour } from '@/components/tour/DashboardTour'
import { HelpWidget } from '@/components/help/HelpWidget'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  RefreshCw,
  ChevronDown,
  TrendingUp,
  AlertCircle,
  ClipboardList,
  Bell,
  Download,
  Plus,
  Activity,
  Zap,
  Clock,
  BarChart3,
  Inbox,
  RotateCcw,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Info,
} from 'lucide-react'

// ─── Color Palette ───────────────────────────────────────────────────
const COLORS = {
  deepNavy: 'var(--bs-text-primary)',
  signalBlue: 'var(--bs-action)',
  insightTeal: 'var(--bs-intelligence)',
  opportunityAmber: 'var(--bs-opportunity)',
  white: 'var(--bs-surface)',
  lightGrey: 'var(--bs-surface-hover)',
  darkGrey: 'var(--bs-text-primary)',
  errorRed: 'var(--bs-error)',
  borderGrey: 'var(--bs-border)',
}

// ─── Helpers ─────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function relativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHr < 24) return `${diffHr} hr ago`
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

function getHealthStatusColor(status: string | undefined) {
  const s = status?.toLowerCase() ?? 'unknown'
  if (s === 'healthy') return 'bg-accent-teal/10 text-accent-teal border-accent-teal/20'
  if (s === 'degraded') return 'bg-accent-amber/10 text-accent-amber border-accent-amber/20'
  return 'bg-accent-crimson/10 text-accent-crimson border-accent-crimson/20'
}

function getHealthDotColor(status: string | undefined) {
  const s = status?.toLowerCase() ?? 'unknown'
  if (s === 'healthy') return 'bg-accent-teal'
  if (s === 'degraded') return 'bg-accent-amber'
  return 'bg-accent-crimson'
}

function getNotificationBorderColor(type: string) {
  const t = type.toLowerCase()
  if (t.includes('critical') || t.includes('error')) return 'border-l-4 border-l-accent-crimson'
  if (t.includes('warn')) return 'border-l-4 border-l-accent-amber'
  return 'border-l-4 border-l-accent-indigo'
}

function getNotificationBgColor(type: string) {
  const t = type.toLowerCase()
  if (t.includes('critical') || t.includes('error')) return 'bg-red-500/5'
  if (t.includes('warn')) return 'bg-amber-500/5'
  return 'bg-blue-500/5'
}

function getConfidenceColor(confidence: number) {
  if (confidence >= 90) return COLORS.insightTeal
  if (confidence >= 80) return COLORS.signalBlue
  return COLORS.opportunityAmber
}

// ─── Skeleton Components ─────────────────────────────────────────────
function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4">
      <Skeleton className="h-4 w-28 bg-ink-tertiary/10 mb-2" />
      <Skeleton className="h-8 w-20 bg-ink-tertiary/10 mb-1" />
      <Skeleton className="h-3 w-32 bg-ink-tertiary/10 mt-1" />
    </div>
  )
}

function ChartPlaceholderSkeleton() {
  return (
    <Card className="rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)]">
      <CardHeader className="p-4 pb-0">
        <Skeleton className="h-6 w-32 bg-ink-tertiary/10" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-[200px] w-full bg-ink-tertiary/10 rounded-md" />
      </CardContent>
    </Card>
  )
}

function OpportunityRowSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-[var(--bs-border)]">
      <div className="col-span-4"><Skeleton className="h-4 w-full bg-ink-tertiary/10" /></div>
      <div className="col-span-3 hidden sm:block"><Skeleton className="h-4 w-20 bg-ink-tertiary/10" /></div>
      <div className="col-span-2 hidden md:block"><Skeleton className="h-5 w-16 bg-ink-tertiary/10" /></div>
      <div className="col-span-2"><Skeleton className="h-4 w-16 mx-auto bg-ink-tertiary/10" /></div>
      <div className="col-span-3 text-right sm:col-span-1"><Skeleton className="h-3 w-14 ml-auto bg-ink-tertiary/10" /></div>
    </div>
  )
}

function AlertItemSkeleton() {
  return (
    <div className="rounded-lg border border-[var(--bs-border)] p-3">
      <div className="flex items-start gap-3">
        <Skeleton className="h-2 w-2 rounded-full mt-1.5 shrink-0 bg-ink-tertiary/10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full bg-ink-tertiary/10" />
          <Skeleton className="h-3 w-24 bg-ink-tertiary/10" />
        </div>
      </div>
    </div>
  )
}

// ─── Error Card ──────────────────────────────────────────────────────
function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4 text-center">
      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-canvas flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-accent-amber" />
      </div>
      <p className="text-sm text-ink-secondary font-medium mb-1">Failed to load data</p>
      <p className="text-xs text-ink-tertiary mb-3">{message}</p>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="border-border text-ink-secondary hover:text-accent-indigo hover:border-accent-indigo/40"
      >
        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
        Retry
      </Button>
    </div>
  )
}

// ─── Empty Card ──────────────────────────────────────────────────────
function EmptyCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)] p-6 text-center">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-canvas flex items-center justify-center">
        {icon}
      </div>
      <p className="text-sm text-ink-secondary font-medium mb-1">{title}</p>
      <p className="text-xs text-ink-tertiary max-w-xs mx-auto">{description}</p>
    </div>
  )
}

export function Dashboard() {
  const [hoveredOpportunity, setHoveredOpportunity] = useState<number | null>(null)

  // ─── tRPC Queries ─────────────────────────────────────────────────
  const {
    data: countySummary,
    isLoading: countyLoading,
    error: countyError,
    refetch: refetchCounty,
  } = trpc.county.summary.useQuery()

  const {
    data: notificationHistory,
    isLoading: notificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
  } = trpc.notification.history.useQuery({ limit: 5 })

  const {
    data: patternData,
    isLoading: patternsLoading,
    error: patternsError,
    refetch: refetchPatterns,
  } = trpc.pattern.list.useQuery({ limit: 5 })

  const {
    data: healthScore,
    isLoading: healthLoading,
    error: healthError,
    refetch: refetchHealth,
  } = trpc.analytics.healthScore.useQuery()

  // Onboarding check — AFTER all hooks
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

  // ─── Derived Data ─────────────────────────────────────────────────
  const notifications = notificationHistory?.items?.slice(0, 3) ?? []
  const patterns = patternData?.patterns ?? []

  // ─── Render ───────────────────────────────────────────────────────
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
            className="inline-flex items-center gap-2 rounded-md border border-[var(--bs-border)] bg-[var(--bs-surface)] px-3 py-2 text-sm font-medium text-[var(--bs-text-primary)] transition-all duration-200 hover:bg-[var(--bs-surface-hover)] motion-reduce:transition-none"
            type="button"
          >
            Last 30 days
            <ChevronDown className="h-4 w-4 text-[var(--bs-text-tertiary)]" />
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100"
            style={{ borderColor: COLORS.signalBlue, color: COLORS.signalBlue, backgroundColor: COLORS.white }}
            type="button"
            onClick={() => {
              refetchCounty()
              refetchNotifications()
              refetchPatterns()
              refetchHealth()
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* ─── Data Freshness / Health Banner ─────────────────────────── */}
      {healthLoading ? (
        <div className="mb-6 rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Skeleton className="h-6 w-28 bg-ink-tertiary/10" />
            <Skeleton className="h-6 w-24 bg-ink-tertiary/10" />
            <Skeleton className="h-6 w-24 bg-ink-tertiary/10" />
          </div>
        </div>
      ) : healthError ? (
        <div className="mb-6 rounded-lg border border-accent-amber/20 bg-accent-amber/5 p-4">
          <div className="flex items-center gap-2 text-accent-amber">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium">Health check unavailable</span>
            <button
              onClick={() => refetchHealth()}
              className="ml-auto text-xs underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        </div>
      ) : healthScore ? (
        <div className="mb-6 rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4 transition-all duration-200 hover:shadow-sm">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent-indigo" />
              <span className="text-sm text-ink-secondary">Health Score:</span>
              <Badge
                variant="outline"
                className={`text-xs font-semibold ${getHealthStatusColor(healthScore.status)}`}
              >
                <span className={`mr-1.5 h-2 w-2 rounded-full ${getHealthDotColor(healthScore.status)}`} />
                {healthScore.overall ?? 'N/A'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent-teal" />
              <span className="text-sm text-ink-secondary">API Latency:</span>
              <span className="text-sm font-mono font-medium text-ink-primary">
                {healthScore.apiLatency ? `${healthScore.apiLatency}ms` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent-amber" />
              <span className="text-sm text-ink-secondary">Uptime:</span>
              <span className="text-sm font-mono font-medium text-ink-primary">
                {healthScore.uptime ? `${healthScore.uptime}%` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent-teal" />
              <span className="text-sm text-ink-secondary">Status:</span>
              <span className="text-sm font-medium capitalize" style={{
                color: healthScore.status === 'healthy' ? COLORS.insightTeal
                  : healthScore.status === 'degraded' ? COLORS.opportunityAmber
                  : COLORS.errorRed
              }}>
                {healthScore.status ?? 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {/* ─── Stats Row ───────────────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Markets Monitored */}
        {countyLoading ? (
          <StatCardSkeleton />
        ) : countyError ? (
          <ErrorCard
            message={countyError.message || 'Failed to load county data'}
            onRetry={() => refetchCounty()}
          />
        ) : (
          <div
            className="rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            style={{ borderLeftWidth: '4px', borderLeftColor: COLORS.signalBlue }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-[0.5px]"
              style={{ color: COLORS.darkGrey, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Markets Monitored
            </p>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="font-mono text-2xl font-medium md:text-[32px]" style={{ color: COLORS.deepNavy }}>
                {countySummary?.total ?? 0}
              </p>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                <TrendingUp className="mr-1 h-3 w-3" />
                {countySummary?.active ?? 0} active
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--bs-text-tertiary)]">counties across all coverage tiers</p>
          </div>
        )}

        {/* Patterns Detected */}
        {patternsLoading ? (
          <StatCardSkeleton />
        ) : patternsError ? (
          <ErrorCard
            message={patternsError.message || 'Failed to load pattern data'}
            onRetry={() => refetchPatterns()}
          />
        ) : (
          <div
            className="rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            style={{ borderLeftWidth: '4px', borderLeftColor: COLORS.opportunityAmber }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-[0.5px]"
              style={{ color: COLORS.darkGrey, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Patterns Detected
            </p>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="font-mono text-2xl font-medium md:text-[32px]" style={{ color: COLORS.deepNavy }}>
                {patternData?.total ?? 0}
              </p>
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-400">
                <AlertCircle className="mr-1 h-3 w-3" />
                Intelligence
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--bs-text-tertiary)]">across all monitored counties</p>
          </div>
        )}

        {/* Projects Tracked */}
        {countyLoading ? (
          <StatCardSkeleton />
        ) : countyError ? (
          <ErrorCard
            message={countyError.message || 'Failed to load project data'}
            onRetry={() => refetchCounty()}
          />
        ) : (
          <div
            className="rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            style={{ borderLeftWidth: '4px', borderLeftColor: COLORS.insightTeal }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-[0.5px]"
              style={{ color: COLORS.darkGrey, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Projects Tracked
            </p>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="font-mono text-2xl font-medium md:text-[32px]" style={{ color: COLORS.deepNavy }}>
                {countySummary?.totalEvents ?? 0}
              </p>
              <span className="text-xs font-medium text-[var(--bs-text-tertiary)]">events</span>
            </div>
            <p className="mt-1 text-xs text-[var(--bs-text-tertiary)]">from all active data feeds</p>
          </div>
        )}

        {/* Pipeline Value */}
        <div
          className="rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          style={{ borderLeftWidth: '4px', borderLeftColor: COLORS.deepNavy }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-[0.5px]"
            style={{ color: COLORS.darkGrey, fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Pipeline Value
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="font-mono text-2xl font-medium md:text-[32px]" style={{ color: COLORS.deepNavy }}>
              N/A
            </p>
            <Badge variant="outline" className="text-[10px] bg-ink-tertiary/5 text-ink-tertiary border-ink-tertiary/10">
              <Info className="mr-1 h-3 w-3" />
              Coming soon
            </Badge>
          </div>
          <p className="mt-1 text-xs text-[var(--bs-text-tertiary)]">Live financial data incoming</p>
        </div>
      </div>

      {/* ─── Charts Row (Placeholders) ───────────────────────────────── */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Opportunity Trend Placeholder */}
        {countyLoading ? (
          <ChartPlaceholderSkeleton />
        ) : (
          <Card className="rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
              <CardTitle
                className="text-lg font-semibold"
                style={{ color: COLORS.deepNavy, fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Opportunity Trend
              </CardTitle>
              <Badge variant="outline" className="text-[10px] bg-ink-tertiary/5 text-ink-tertiary border-ink-tertiary/10">
                <Clock className="mr-1 h-3 w-3" />
                Pending data
              </Badge>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart3 className="h-10 w-10 text-ink-tertiary/40 mb-3" />
                <p className="text-sm font-medium text-ink-secondary mb-1">
                  Monthly trend data will appear as more intelligence is collected.
                </p>
                <p className="text-xs text-ink-tertiary max-w-sm">
                  As counties are activated and events are processed, this chart will visualize opportunity trends over time.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Market Breakdown Placeholder */}
        {countyLoading ? (
          <ChartPlaceholderSkeleton />
        ) : (
          <Card className="rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
              <CardTitle
                className="text-lg font-semibold"
                style={{ color: COLORS.deepNavy, fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Market Breakdown
              </CardTitle>
              <Badge variant="outline" className="text-[10px] bg-ink-tertiary/5 text-ink-tertiary border-ink-tertiary/10">
                <Clock className="mr-1 h-3 w-3" />
                Pending data
              </Badge>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <PieChartPlaceholder className="h-10 w-10 text-ink-tertiary/40 mb-3" />
                <p className="text-sm font-medium text-ink-secondary mb-1">
                  Sector breakdown will appear as coverage expands.
                </p>
                <p className="text-xs text-ink-tertiary max-w-sm">
                  Once enough project data is collected, this chart will show distribution across commercial, residential, infrastructure, and industrial sectors.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ─── Opportunities + Alerts Row ──────────────────────────────── */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Opportunities Feed */}
        <div className="lg:col-span-2">
          <Card className="rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <div>
                <CardTitle
                  className="text-lg font-semibold"
                  style={{ color: COLORS.deepNavy, fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Recent Patterns
                </CardTitle>
                <p className="mt-1 text-xs text-[var(--bs-text-tertiary)]">Latest intelligence from monitored counties</p>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] bg-accent-indigo/5 text-accent-indigo border-accent-indigo/10"
              >
                Live
              </Badge>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              {/* Header row */}
              <div className="grid grid-cols-12 gap-4 border-b border-[var(--bs-border)] px-4 pb-2 text-xs font-semibold uppercase tracking-[0.5px] text-[var(--bs-text-tertiary)]">
                <div className="col-span-4">Pattern</div>
                <div className="col-span-3 hidden sm:block">Location</div>
                <div className="col-span-2 hidden md:block">Type</div>
                <div className="col-span-2 text-center">Confidence</div>
                <div className="col-span-3 text-right sm:col-span-1">ID</div>
              </div>

              {/* Loading */}
              {patternsLoading && (
                <div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <OpportunityRowSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Error */}
              {!patternsLoading && patternsError && (
                <div className="px-4 py-8">
                  <ErrorCard
                    message={patternsError.message || 'Failed to load patterns'}
                    onRetry={() => refetchPatterns()}
                  />
                </div>
              )}

              {/* Empty */}
              {!patternsLoading && !patternsError && patterns.length === 0 && (
                <div className="px-4 py-8">
                  <EmptyCard
                    icon={<Inbox className="w-5 h-5 text-ink-tertiary" />}
                    title="No patterns detected yet"
                    description="Pattern analysis runs as new data is ingested. Check back after your monitored counties begin receiving updates."
                  />
                </div>
              )}

              {/* Data rows */}
              {!patternsLoading && !patternsError && patterns.length > 0 && (
                <div>
                  {patterns.map((opp) => (
                    <div
                      key={opp.id}
                      className={`grid grid-cols-12 gap-4 items-center px-4 py-3 transition-colors duration-200 ${
                        hoveredOpportunity === opp.id ? 'bg-[var(--bs-surface-hover)]' : ''
                      }`}
                      style={{ borderBottom: '1px solid var(--bs-border)' }}
                      onMouseEnter={() => setHoveredOpportunity(opp.id)}
                      onMouseLeave={() => setHoveredOpportunity(null)}
                    >
                      <div className="col-span-4">
                        <p className="truncate text-sm font-semibold text-[var(--bs-text-primary)]">
                          {opp.title}
                        </p>
                        <p className="truncate text-xs text-[var(--bs-text-tertiary)] mt-0.5">
                          {opp.description?.slice(0, 60)}{opp.description && opp.description.length > 60 ? '...' : ''}
                        </p>
                      </div>
                      <div className="col-span-3 hidden sm:block">
                        <p className="text-sm text-[var(--bs-text-tertiary)] flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {opp.county}{opp.state ? `, ${opp.state}` : ''}
                        </p>
                      </div>
                      <div className="col-span-2 hidden md:block">
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-[var(--bs-action)]/10 text-[var(--bs-action)] border-[var(--bs-action)]/20">
                          {opp.type ?? 'Pattern'}
                        </span>
                      </div>
                      <div className="col-span-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--bs-border)]">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(opp.confidence ?? 0, 100)}%`,
                                backgroundColor: getConfidenceColor(opp.confidence ?? 0),
                              }}
                            />
                          </div>
                          <span className="font-mono text-xs font-medium text-[var(--bs-text-primary)]">
                            {opp.confidence ?? 0}%
                          </span>
                        </div>
                      </div>
                      <div className="col-span-3 text-right sm:col-span-1">
                        <p className="text-xs text-[var(--bs-text-tertiary)] font-mono">#{opp.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alert Summary */}
        <div>
          <Card className="h-full rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <CardTitle
                className="text-lg font-semibold"
                style={{ color: COLORS.deepNavy, fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Alert Summary
              </CardTitle>
              {notificationsLoading ? (
                <Skeleton className="h-5 w-12 bg-ink-tertiary/10" />
              ) : notificationHistory && notificationHistory.unreadCount > 0 ? (
                <Badge className="bg-accent-indigo text-white text-[10px]">
                  {notificationHistory.unreadCount} unread
                </Badge>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-2">
              {/* Loading */}
              {notificationsLoading && (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <AlertItemSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Error */}
              {!notificationsLoading && notificationsError && (
                <ErrorCard
                  message={notificationsError.message || 'Failed to load alerts'}
                  onRetry={() => refetchNotifications()}
                />
              )}

              {/* Empty */}
              {!notificationsLoading && !notificationsError && notifications.length === 0 && (
                <EmptyCard
                  icon={<Bell className="w-5 h-5 text-ink-tertiary" />}
                  title="No alerts yet"
                  description="You'll be notified when activity is detected in your monitored counties and watchlists."
                />
              )}

              {/* Data */}
              {!notificationsLoading && !notificationsError && notifications.length > 0 && (
                <>
                  {notifications.map((alert) => (
                    <div
                      key={alert.id}
                      className={`rounded-lg border p-3 transition-all duration-200 hover:shadow-sm motion-reduce:transition-none ${getNotificationBorderColor(alert.type)} ${getNotificationBgColor(alert.type)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 shrink-0">
                          {!alert.read ? (
                            <div className="h-2.5 w-2.5 rounded-full bg-accent-indigo" />
                          ) : (
                            <div className="h-2.5 w-2.5 rounded-full bg-ink-tertiary/30" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-ink-primary mb-0.5">
                            {alert.title}
                          </p>
                          <p className="text-xs text-ink-secondary leading-snug">
                            {alert.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium bg-[var(--bs-surface)]/60 text-ink-secondary border-ink-tertiary/10">
                              {alert.type}
                            </span>
                            <p className="text-[10px] text-ink-tertiary">{relativeTime(alert.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    className="mt-2 w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100"
                    style={{ backgroundColor: COLORS.signalBlue, color: COLORS.white }}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    View All Alerts
                  </Button>
                </>
              )}
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
          className="border border-[var(--bs-text-primary)] bg-[var(--bs-surface)] text-[var(--bs-text-primary)] transition-all duration-200 hover:scale-[1.02] hover:bg-[var(--bs-surface-hover)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          <Bell className="mr-2 h-4 w-4" />
          Manage Alerts
        </Button>
        <Button
          className="border border-[var(--bs-text-primary)] bg-[var(--bs-surface)] text-[var(--bs-text-primary)] transition-all duration-200 hover:scale-[1.02] hover:bg-[var(--bs-surface-hover)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
        <Button
          className="border border-[var(--bs-text-primary)] bg-[var(--bs-surface)] text-[var(--bs-text-primary)] transition-all duration-200 hover:scale-[1.02] hover:bg-[var(--bs-surface-hover)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100"
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

// ─── Simple Pie Chart Placeholder Icon ──────────────────────────────
function PieChartPlaceholder({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}