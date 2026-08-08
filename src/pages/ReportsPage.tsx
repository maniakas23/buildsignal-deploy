import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Download,
  Search,
  FileBarChart,
  Layers,
  Archive,
  FileSpreadsheet,
  FileDigit,
  ChevronRight,
  Info,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Sample Data — clearly marked                                      */
/* ------------------------------------------------------------------ */

interface ReportItem {
  id: string;
  title: string;
  description: string;
  type: 'Market' | 'Pipeline' | 'Zoning' | 'Competitive' | 'Permits' | 'Summary';
  lastGenerated: string;
  status: 'available' | 'scheduled' | 'archived';
  scheduled?: boolean;
}

const SAMPLE_REPORTS: ReportItem[] = [
  {
    id: 'r-1',
    title: 'Market Surge Report',
    description: 'Weekly analysis of market momentum, pricing trends, and demand signals across monitored counties.',
    type: 'Market',
    lastGenerated: 'Jun 12, 2025',
    status: 'available',
    scheduled: true,
  },
  {
    id: 'r-2',
    title: 'County Activity Summary',
    description: 'Aggregated permit, zoning, and development activity grouped by county and region.',
    type: 'Summary',
    lastGenerated: 'Jun 10, 2025',
    status: 'available',
    scheduled: false,
  },
  {
    id: 'r-3',
    title: 'Pipeline Forecast',
    description: 'Forward-looking pipeline projection based on current permits, zoning changes, and historical trends.',
    type: 'Pipeline',
    lastGenerated: 'Jun 8, 2025',
    status: 'available',
    scheduled: true,
  },
  {
    id: 'r-4',
    title: 'Zoning Change Alert',
    description: 'Real-time alert digest of zoning amendments, hearings, and approved map changes.',
    type: 'Zoning',
    lastGenerated: 'Jun 5, 2025',
    status: 'available',
    scheduled: false,
  },
  {
    id: 'r-5',
    title: 'Competitive Landscape',
    description: 'Competitor activity map showing new filings, expansions, and market share shifts.',
    type: 'Competitive',
    lastGenerated: 'Jun 1, 2025',
    status: 'available',
    scheduled: true,
  },
  {
    id: 'r-6',
    title: 'Permit Trend Analysis',
    description: 'Deep-dive into permit issuance patterns, approval velocities, and category breakdowns.',
    type: 'Permits',
    lastGenerated: 'May 28, 2025',
    status: 'available',
    scheduled: false,
  },
  {
    id: 'r-7',
    title: 'Q1 Historical Review',
    description: 'Archived quarterly rollup for Q1 2025 with benchmark comparisons.',
    type: 'Summary',
    lastGenerated: 'Mar 31, 2025',
    status: 'archived',
    scheduled: false,
  },
  {
    id: 'r-8',
    title: '2024 Annual Overview',
    description: 'Year-end archive containing consolidated metrics and coverage score history.',
    type: 'Summary',
    lastGenerated: 'Dec 31, 2024',
    status: 'archived',
    scheduled: false,
  },
];

const TYPE_OPTIONS = ['All Types', 'Market', 'Pipeline', 'Zoning', 'Competitive', 'Permits', 'Summary'];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function typeBadgeColor(type: ReportItem['type']) {
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

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function ReportsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [activeTab, setActiveTab] = useState('all');

  const availableCount = SAMPLE_REPORTS.filter((r) => r.status === 'available').length;
  const scheduledCount = SAMPLE_REPORTS.filter((r) => r.scheduled).length;
  const lastGenerated = 'Jun 12, 2025';
  const reportTypes = new Set(SAMPLE_REPORTS.map((r) => r.type)).size;

  const filtered = SAMPLE_REPORTS.filter((r) => {
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

  return (
    <div className="bg-canvas min-h-screen pb-12">
      {/* Top banner indicating sample data */}
      <div className="bg-accent-indigo/5 border-b border-accent-indigo/10">
        <div className="max-w-content mx-auto px-6 py-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-accent-indigo" />
          <span className="text-sm text-accent-indigo font-medium">
            Sample Data — All reports shown below are placeholder examples for UI demonstration.
          </span>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title text-ink-primary mb-2">Reports</h1>
          <p className="text-body text-ink-secondary">
            Generate, schedule, and download intelligence reports
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-surface border-border hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-tertiary mb-1">Available Reports</p>
                  <p className="text-3xl font-bold text-ink-primary">{availableCount}</p>
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
                  <p className="text-3xl font-bold text-ink-primary">{scheduledCount}</p>
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
                  <p className="text-2xl font-bold text-ink-primary">{lastGenerated}</p>
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
                  <p className="text-3xl font-bold text-ink-primary">{reportTypes}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-100">
                  <Layers className="w-5 h-5 text-ink-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters + Export */}
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
                {TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-border text-ink-secondary hover:bg-surface hover:text-ink-primary"
            >
              <FileDigit className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              className="border-border text-ink-secondary hover:bg-surface hover:text-ink-primary"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
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
            {filtered.length > 0 ? (
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
            {filtered.length > 0 ? (
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
            {filtered.length > 0 ? (
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

        <div className="flex items-center justify-between text-xs text-ink-tertiary mb-4">
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

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="flex-1 bg-accent-indigo hover:bg-accent-indigo/90 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-border text-ink-secondary hover:bg-surface"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
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
