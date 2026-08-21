import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/providers/trpc';
import {
  MapPin,
  Search,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  ArrowUpDown,
  ArrowRight,
  Info,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type HealthStatus = 'active' | 'partial' | 'limited' | 'planned';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function healthStatusBadge(healthStatus: HealthStatus) {
  switch (healthStatus) {
    case 'active':
      return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'partial':
      return 'bg-accent-amber/10 text-accent-amber border-accent-amber/20';
    case 'limited':
      return 'bg-rose-50 text-rose-600 border-rose-200';
    case 'planned':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

function healthStatusLabel(healthStatus: HealthStatus) {
  return healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1);
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function CountyCoveragePage() {
  const [search, setSearch] = useState('');
  const [healthStatusFilter, setHealthStatusFilter] = useState<HealthStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'coverage' | 'population' | 'priority' | 'events'>('coverage');

  const {
    data: summaryData,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary,
  } = trpc.county.summary.useQuery();

  const {
    data: listData,
    isLoading: listLoading,
    isError: listError,
    refetch: refetchList,
  } = trpc.county.list.useQuery(
    {
      ...(healthStatusFilter !== 'all' ? { healthStatus: healthStatusFilter } : {}),
      sortBy,
    },
    { enabled: !summaryError }
  );

  const isLoading = summaryLoading || listLoading;
  const isError = summaryError || listError;

  const refetch = () => {
    refetchSummary();
    refetchList();
  };

  const counties = listData?.counties ?? [];

  const filtered = useMemo(() => {
    if (!search.trim()) return counties;
    const q = search.toLowerCase();
    return counties.filter(
      (c) =>
        c.county.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q)
    );
  }, [counties, search]);

  return (
    <div className="bg-canvas min-h-screen pb-12">
      <div className="max-w-content mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title text-ink-primary mb-2">County Coverage</h1>
          <p className="text-body text-ink-secondary">
            Explore data coverage and infrastructure activity across all monitored counties
          </p>
        </div>

        {/* Error State */}
        {isError && (
          <div className="mb-8 p-6 rounded-lg bg-rose-50 border border-rose-200 flex flex-col items-center gap-3 text-center">
            <AlertTriangle className="w-8 h-8 text-rose-600" />
            <div>
              <p className="text-sm font-medium text-rose-700">Failed to load county data</p>
              <p className="text-xs text-rose-600 mt-1">
                Something went wrong while fetching county coverage information.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              className="border-rose-300 text-rose-700 hover:bg-rose-100"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-surface border-border hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-tertiary mb-1">Counties Monitored</p>
                  {summaryLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <p className="text-3xl font-bold text-ink-primary">
                      {summaryData?.total ?? 0}
                    </p>
                  )}
                </div>
                <div className="p-2.5 rounded-lg bg-accent-indigo/10">
                  <MapPin className="w-5 h-5 text-accent-indigo" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-tertiary mb-1">Active Counties</p>
                  {summaryLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <p className="text-3xl font-bold text-ink-primary">
                      {summaryData?.active ?? 0}
                    </p>
                  )}
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-tertiary mb-1">Avg. Coverage</p>
                  {summaryLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <p className="text-3xl font-bold text-ink-primary">
                      {Math.round(summaryData?.avgCoverage ?? 0)}%
                    </p>
                  )}
                </div>
                <div className="p-2.5 rounded-lg bg-accent-teal/10">
                  <TrendingUp className="w-5 h-5 text-accent-teal" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-tertiary mb-1">Total Events</p>
                  {summaryLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <p className="text-3xl font-bold text-ink-primary">
                      {(summaryData?.totalEvents ?? 0).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="p-2.5 rounded-lg bg-accent-amber/10">
                  <AlertTriangle className="w-5 h-5 text-accent-amber" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
            <Input
              placeholder="Search counties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-surface border-border text-ink-primary placeholder:text-ink-tertiary"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-ink-tertiary" />
              <div className="flex gap-2">
                {(['all', 'active', 'partial', 'limited', 'planned'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={healthStatusFilter === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setHealthStatusFilter(level)}
                    className={
                      healthStatusFilter === level
                        ? 'bg-accent-indigo hover:bg-accent-indigo/90 text-white'
                        : 'border-border text-ink-secondary hover:bg-surface hover:text-ink-primary'
                    }
                  >
                    {level === 'all' ? 'All' : healthStatusLabel(level)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-ink-tertiary" />
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as typeof sortBy)}
              >
                <SelectTrigger className="w-[160px] bg-surface border-border text-ink-primary text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coverage">Coverage</SelectItem>
                  <SelectItem value="population">Population</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator className="mb-6 bg-border" />

        {/* County Grid */}
        {listLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-surface border-border">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-canvas space-y-2">
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="p-3 rounded-lg bg-canvas space-y-2">
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
            {filtered.map((county) => (
              <CountyCard key={county.id} county={county} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-ink-tertiary" />
            </div>
            <h3 className="text-lg font-semibold text-ink-primary mb-1">No counties found</h3>
            <p className="text-sm text-ink-secondary max-w-sm">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Coverage Legend */}
        <Card className="bg-surface border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-ink-primary flex items-center gap-2">
              <Info className="w-4 h-4 text-ink-tertiary" />
              Coverage Legend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                <div className="mt-0.5">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                    Active
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-primary">Active</p>
                  <p className="text-xs text-ink-secondary mt-0.5">
                    Full data coverage with real-time or near real-time ingestion across all major sources.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-accent-amber/5 border border-accent-amber/15">
                <div className="mt-0.5">
                  <Badge variant="outline" className="bg-accent-amber/10 text-accent-amber border-accent-amber/20">
                    Partial
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-primary">Partial</p>
                  <p className="text-xs text-ink-secondary mt-0.5">
                    Core data sources connected; some supplementary feeds may be delayed or pending.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-50/50 border border-rose-100">
                <div className="mt-0.5">
                  <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200">
                    Limited
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-primary">Limited</p>
                  <p className="text-xs text-ink-secondary mt-0.5">
                    Only basic data available. Additional source partnerships are in progress.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50/50 border border-slate-100">
                <div className="mt-0.5">
                  <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">
                    Planned
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-primary">Planned</p>
                  <p className="text-xs text-ink-secondary mt-0.5">
                    County is queued for onboarding. Coverage will begin once integrations are complete.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

interface CountyCoverage {
  id: number;
  county: string;
  state: string;
  population: number;
  parcelCount: number;
  providerCount: number;
  availableDataTypes: string;
  infrastructureSources: string;
  healthStatus: HealthStatus;
  coveragePercentage: number;
  expansionPriority: number;
  lastDataRefresh: string | null;
  totalEvents: number;
  totalPatterns: number;
  totalRecommendations: number;
  createdAt: string;
  updatedAt: string;
}

function CountyCard({ county }: { county: CountyCoverage }) {
  // NOTE: /counties/:id is a stub route. Until a real county-detail
  // experience exists, these cards are informational only — no customer
  // visible action may lead to a nonfunctional page.
  return (
    <Card
      className="bg-surface border-border transition-all duration-200"
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-accent-indigo" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink-primary leading-tight">
                {county.county}
              </h3>
              <p className="text-xs text-ink-tertiary">{county.state}</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`text-xs font-medium ${healthStatusBadge(county.healthStatus)}`}
          >
            {healthStatusLabel(county.healthStatus)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-canvas">
            <p className="text-xs text-ink-tertiary mb-1">Coverage</p>
            <p className="text-lg font-bold text-ink-primary">{county.coveragePercentage}%</p>
          </div>
          <div className="p-3 rounded-lg bg-canvas">
            <p className="text-xs text-ink-tertiary mb-1">Population</p>
            <p className="text-lg font-bold text-ink-primary">
              {county.population >= 1_000_000
                ? `${(county.population / 1_000_000).toFixed(1)}M`
                : county.population >= 1_000
                ? `${(county.population / 1_000).toFixed(0)}K`
                : county.population.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-canvas">
            <p className="text-xs text-ink-tertiary mb-1">Events</p>
            <p className="text-lg font-bold text-ink-primary">{county.totalEvents.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg bg-canvas">
            <p className="text-xs text-ink-tertiary mb-1">Patterns</p>
            <p className="text-lg font-bold text-ink-primary">{county.totalPatterns.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-ink-tertiary mb-4">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Priority {county.expansionPriority}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {county.lastDataRefresh
              ? new Date(county.lastDataRefresh).toLocaleDateString()
              : 'Never'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
