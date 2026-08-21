import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Calendar,
  Clock,
  Search,
  FileBarChart,
  Layers,
  Archive,
  RefreshCw,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { scrubUnknownPlaceText } from '@/signalcore/engine';

/* ------------------------------------------------------------------ */
/*  Types derived from brief API                                      */
/* ------------------------------------------------------------------ */

type ReportType = 'Market' | 'Pipeline' | 'Zoning' | 'Competitive' | 'Permits' | 'Summary';

interface ReportItem {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  lastGenerated: string;
  status: 'available' | 'scheduled' | 'archived';
  scheduled: boolean;
  sectionId: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function mapSectionTypeToReportType(sectionType: string): ReportType {
  switch (sectionType) {
    case 'executive_summary':
      return 'Summary';
    case 'top_opportunities':
      return 'Market';
    case 'new_signals':
      return 'Permits';
    case 'high_priority_counties':
      return 'Market';
    case 'provider_status':
      return 'Summary';
    case 'trend_summary':
      return 'Market';
    case 'upcoming_meetings':
      return 'Zoning';
    case 'watchlist_matches':
      return 'Competitive';
    default:
      return 'Summary';
  }
}

function typeBadgeColor(type: ReportType) {
  switch (type) {
    case 'Market':
      return 'bg-accent-indigo/10 text-accent-indigo border-accent-indigo/20';
    case 'Pipeline':
      return 'bg-accent-teal/10 text-accent-teal border-accent-teal/20';
    case 'Zoning':
      return 'bg-accent-amber/10 text-accent-amber border-accent-amber/20';
    case 'Competitive':
      return 'bg-rose-50 text-rose-600 border-rose-200';
    case 'Permits':
      return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'Summary':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

function formatBriefDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function ReportsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [activeTab, setActiveTab] = useState('all');

  const {
    data: brief,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.brief.today.useQuery();

  /* Derive reports from brief sections */
  const reports: ReportItem[] = useMemo(() => {
    if (!brief || !brief.sections) return [];
    const generatedDate = formatBriefDate(brief.date || brief.generatedAt);
    const items: ReportItem[] = [];

    if (Array.isArray(brief.sections)) {
      /* Legacy array-of-sections shape */
      const sections = brief.sections as any[];
      sections.forEach((section) => {
        if (!section.items || section.items.length === 0) {
          items.push({
            id: `${section.id}-overview`,
            title: scrubUnknownPlaceText(section.title),
            description: scrubUnknownPlaceText(section.summary || 'Daily intelligence briefing section.'),
            type: mapSectionTypeToReportType(section.type),
            lastGenerated: generatedDate,
            status: 'available',
            scheduled: false,
            sectionId: section.id,
          });
        } else {
          section.items.forEach((item) => {
            items.push({
              id: String(item.id || `${section.id}-${Math.random().toString(36).slice(2, 8)}`),
              title: scrubUnknownPlaceText(item.title || section.title),
              description: scrubUnknownPlaceText(item.description || section.summary || 'Intelligence report entry.'),
              type: mapSectionTypeToReportType(section.type),
              lastGenerated: generatedDate,
              status: 'available',
              scheduled: false,
              sectionId: section.id,
            });
          });
        }
      });
      return items;
    }

    /* Current brief.today shape: sections is an object of keyed arrays
       (opportunities, counties, providers, trends, meetings). */
    const sections = brief.sections as Record<string, unknown>;
    const pushAll = (
      arr: unknown,
      sectionId: string,
      type: ReportType,
      toItem: (x: any, i: number) => { title: string; description: string }
    ) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((x, i) => {
        const mapped = toItem(x, i);
        items.push({
          id: String(x?.id ?? `${sectionId}-${i}`),
          title: scrubUnknownPlaceText(mapped.title),
          description: scrubUnknownPlaceText(mapped.description),
          type,
          lastGenerated: generatedDate,
          status: 'available',
          scheduled: false,
          sectionId,
        });
      });
    };

    pushAll(sections.opportunities, 'opportunities', 'Market', (o) => ({
      title: o?.label || o?.title || 'Opportunity',
      description:
        o?.detail ||
        o?.description ||
        [o?.county, o?.state].filter(Boolean).join(', ') ||
        'Identified opportunity.',
    }));
    pushAll(sections.counties, 'counties', 'Market', (c) => ({
      title: c?.name || c?.county || c?.label || 'County activity',
      description: c?.detail || c?.description || c?.summary || 'County intelligence entry.',
    }));
    pushAll(sections.providers, 'providers', 'Summary', (p) => ({
      title: p?.name || p?.providerName || p?.label || 'Data provider',
      description: p?.detail || p?.description || p?.status || 'Provider status entry.',
    }));
    pushAll(sections.trends, 'trends', 'Market', (t) => ({
      title: t?.label || t?.title || 'Trend',
      description: t?.detail || t?.description || 'Trend entry.',
    }));
    pushAll(sections.meetings, 'meetings', 'Zoning', (m) => ({
      title: m?.label || m?.title || 'Upcoming meeting',
      description: m?.detail || m?.description || 'Meeting entry.',
    }));
    return items;
  }, [brief]);

  /* Dynamic stats */
  const availableCount = reports.filter((r) => r.status === 'available').length;
  const scheduledCount = reports.filter((r) => r.scheduled).length;
  const lastGenerated = brief ? formatBriefDate(brief.date || brief.generatedAt) : '—';
  const reportTypes = new Set(reports.map((r) => r.type)).size;

  /* Derived type options */
  const typeOptions = useMemo(() => {
    const types = Array.from(new Set(reports.map((r) => r.type)));
    return ['All Types', ...types];
  }, [reports]);

  /* Filter */
  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    const matchesTab =
      activeTab === 'all'
        ? r.status !== 'archived'
        : activeTab === 'scheduled'
          ? r.scheduled
          : r.status === 'archived';
    return matchesSearch && matchesType && matchesTab;
  });

  const isEmpty = !isLoading && !isError && reports.length === 0;

  return (
    <div className="bg-canvas min-h-screen pb-12">
      {/* Data freshness banner */}
      <div className="bg-accent-teal/5 border-b border-accent-teal/10">
        <div className="max-w-content mx-auto px-6 py-2 flex items-center gap-2">
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 text-accent-teal animate-spin" />
              <span className="text-sm text-accent-teal font-medium">Loading intelligence brief…</span>
            </>
          ) : isError ? (
            <>
              <AlertCircle className="w-4 h-4 text-accent-crimson" />
              <span className="text-sm text-accent-crimson font-medium">
                Unable to load brief — {error?.message || 'Unknown error'}
              </span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 text-accent-teal" />
              <span className="text-sm text-accent-teal font-medium">
                Live Data — Reports sourced from daily intelligence brief
                {brief?.generatedAt && (
                  <span className="ml-1 font-normal opacity-80">
                    (generated {formatBriefDate(brief.generatedAt)})
                  </span>
                )}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title text-ink-primary mb-2">Reports</h1>
          <p className="text-body text-ink-secondary">
            Intelligence reports derived from your daily brief
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-surface border-border hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-tertiary mb-1">Available Reports</p>
                  {isLoading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    <p className="text-3xl font-bold text-ink-primary">{availableCount}</p>
                  )}
                </div>
                <div className="p-2.5 rounded-lg bg-accent-indigo/10">
                  <FileText className="w-5 h-5 text-accent-indigo" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-tertiary mb-1">Scheduled</p>
                  {isLoading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    <p className="text-3xl font-bold text-ink-primary">{scheduledCount}</p>
                  )}
                </div>
                <div className="p-2.5 rounded-lg bg-accent-teal/10">
                  <Calendar className="w-5 h-5 text-accent-teal" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-tertiary mb-1">Last Generated</p>
                  {isLoading ? (
                    <Skeleton className="h-9 w-24" />
                  ) : (
                    <p className="text-2xl font-bold text-ink-primary">{lastGenerated}</p>
                  )}
                </div>
                <div className="p-2.5 rounded-lg bg-accent-amber/10">
                  <Clock className="w-5 h-5 text-accent-amber" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-tertiary mb-1">Report Types</p>
                  {isLoading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    <p className="text-3xl font-bold text-ink-primary">{reportTypes}</p>
                  )}
                </div>
                <div className="p-2.5 rounded-lg bg-slate-100">
                  <Layers className="w-5 h-5 text-ink-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {isError && (
          <div className="bg-accent-crimson/5 border border-accent-crimson/20 rounded-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-2.5 rounded-lg bg-accent-crimson/10">
                <AlertCircle className="w-6 h-6 text-accent-crimson" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-ink-primary mb-1">
                  Failed to load reports
                </h3>
                <p className="text-sm text-ink-secondary">
                  {error?.message || 'Unable to fetch the daily intelligence brief. Please try again.'}
                </p>
              </div>
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="border-accent-crimson/30 text-accent-crimson hover:bg-accent-crimson/5"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Honest Empty State */}
        {isEmpty && (
          <div className="bg-surface border border-border rounded-xl p-10 mb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-canvas flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-ink-tertiary" />
            </div>
            <h3 className="text-lg font-semibold text-ink-primary mb-2">
              No reports generated yet
            </h3>
            <p className="text-sm text-ink-secondary max-w-md mx-auto mb-6">
              Reports are created from daily intelligence briefings as data is collected.
              Once your monitored counties begin generating signals, reports will appear here automatically.
            </p>
            <Button
              onClick={() => navigate('/county-coverage')}
              className="bg-accent-indigo hover:bg-accent-indigo/90 text-white"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Check County Coverage
            </Button>
          </div>
        )}

        {/* Filters + Export (hide when empty or loading initial) */}
        {!isEmpty && !isError && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                  <Input
                    placeholder="Search reports..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-surface border-border text-ink-primary placeholder:text-ink-tertiary"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px] bg-surface border-border text-ink-primary">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            <Separator className="mb-6 bg-border" />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-surface border border-border mb-6">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-accent-indigo data-[state=active]:text-white"
                >
                  <FileBarChart className="w-4 h-4 mr-2" />
                  All Reports
                </TabsTrigger>
                <TabsTrigger
                  value="scheduled"
                  className="data-[state=active]:bg-accent-indigo data-[state=active]:text-white"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Scheduled
                </TabsTrigger>
                <TabsTrigger
                  value="archived"
                  className="data-[state=active]:bg-accent-indigo data-[state=active]:text-white"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archived
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                {isLoading ? (
                  <ReportGridSkeleton />
                ) : filtered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((report) => (
                      <ReportCard key={report.id} report={report} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No reports match your filters." />
                )}
              </TabsContent>

              <TabsContent value="scheduled" className="mt-0">
                {isLoading ? (
                  <ReportGridSkeleton />
                ) : filtered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((report) => (
                      <ReportCard key={report.id} report={report} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No scheduled reports found." />
                )}
              </TabsContent>

              <TabsContent value="archived" className="mt-0">
                {isLoading ? (
                  <ReportGridSkeleton />
                ) : filtered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((report) => (
                      <ReportCard key={report.id} report={report} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No archived reports found." />
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

function ReportCard({ report }: { report: ReportItem }) {
  return (
    <Card className="bg-surface border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-semibold text-ink-primary leading-tight">
            {report.title}
          </CardTitle>
          <Badge variant="outline" className={`text-xs font-medium ${typeBadgeColor(report.type)}`}>
            {report.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-ink-secondary mb-4 line-clamp-2">{report.description}</p>

        <div className="flex items-center justify-between text-xs text-ink-tertiary">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {report.lastGenerated}
          </span>
          {report.scheduled && (
            <span className="flex items-center gap-1 text-accent-teal">
              <Calendar className="w-3.5 h-3.5" />
              Scheduled
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-ink-tertiary" />
      </div>
      <h3 className="text-lg font-semibold text-ink-primary mb-1">{message}</h3>
      <p className="text-sm text-ink-secondary max-w-sm">
        Try adjusting your search or filter criteria to find what you are looking for.
      </p>
    </div>
  );
}

function ReportGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="bg-surface border-border">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-16" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-16" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 w-10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
