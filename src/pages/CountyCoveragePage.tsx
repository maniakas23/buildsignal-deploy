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
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Database,
  FileCheck,
  Activity,
  ShieldCheck,
  Info,
  ArrowRight,
  BarChart3,
  Clock,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Sample Data — clearly marked                                      */
/* ------------------------------------------------------------------ */

interface County {
  id: string;
  name: string;
  state: string;
  coverage: 'Full' | 'Partial' | 'Limited';
  permitCount: number;
  trend: 'up' | 'down' | 'flat';
  trendValue: string;
  lastUpdate: string;
  dataSources: number;
}

const SAMPLE_COUNTIES: County[] = [
  {
    id: 'travis-tx',
    name: 'Travis County',
    state: 'TX',
    coverage: 'Full',
    permitCount: 1247,
    trend: 'up',
    trendValue: '+12%',
    lastUpdate: 'Jun 12, 2025',
    dataSources: 6,
  },
  {
    id: 'maricopa-az',
    name: 'Maricopa County',
    state: 'AZ',
    coverage: 'Full',
    permitCount: 3892,
    trend: 'up',
    trendValue: '+8%',
    lastUpdate: 'Jun 11, 2025',
    dataSources: 7,
  },
  {
    id: 'dallas-tx',
    name: 'Dallas County',
    state: 'TX',
    coverage: 'Partial',
    permitCount: 2156,
    trend: 'down',
    trendValue: '-3%',
    lastUpdate: 'Jun 10, 2025',
    dataSources: 5,
  },
  {
    id: 'hillsborough-fl',
    name: 'Hillsborough County',
    state: 'FL',
    coverage: 'Full',
    permitCount: 1678,
    trend: 'up',
    trendValue: '+5%',
    lastUpdate: 'Jun 9, 2025',
    dataSources: 6,
  },
  {
    id: 'king-wa',
    name: 'King County',
    state: 'WA',
    coverage: 'Partial',
    permitCount: 983,
    trend: 'flat',
    trendValue: '0%',
    lastUpdate: 'Jun 8, 2025',
    dataSources: 4,
  },
  {
    id: 'orange-ca',
    name: 'Orange County',
    state: 'CA',
    coverage: 'Limited',
    permitCount: 754,
    trend: 'down',
    trendValue: '-7%',
    lastUpdate: 'Jun 5, 2025',
    dataSources: 3,
  },
  {
    id: 'wake-nc',
    name: 'Wake County',
    state: 'NC',
    coverage: 'Full',
    permitCount: 1421,
    trend: 'up',
    trendValue: '+15%',
    lastUpdate: 'Jun 12, 2025',
    dataSources: 5,
  },
  {
    id: 'denver-co',
    name: 'Denver County',
    state: 'CO',
    coverage: 'Partial',
    permitCount: 1102,
    trend: 'up',
    trendValue: '+2%',
    lastUpdate: 'Jun 7, 2025',
    dataSources: 4,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function coverageBadge(coverage: County['coverage']) {
  switch (coverage) {
    case 'Full':
      return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'Partial':
      return 'bg-accent-amber/10 text-accent-amber border-accent-amber/20';
    case 'Limited':
      return 'bg-rose-50 text-rose-600 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

function TrendIcon({ trend, value }: { trend: County['trend']; value: string }) {
  if (trend === 'up') {
    return (
      <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
        <TrendingUp className="w-4 h-4" />
        {value}
      </span>
    );
  }
  if (trend === 'down') {
    return (
      <span className="flex items-center gap-1 text-rose-600 text-sm font-medium">
        <TrendingDown className="w-4 h-4" />
        {value}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-ink-tertiary text-sm font-medium">
      <Minus className="w-4 h-4" />
      {value}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function CountyCoveragePage() {
  const [search, setSearch] = useState('');
  const [coverageFilter, setCoverageFilter] = useState<'All' | 'Full' | 'Partial' | 'Limited'>('All');

  const countiesMonitored = SAMPLE_COUNTIES.length;
  const dataSources = 8;
  const avgPermits = Math.round(
    SAMPLE_COUNTIES.reduce((sum, c) => sum + c.permitCount, 0) / SAMPLE_COUNTIES.length
  );
  const coverageScore = 87;

  const filtered = SAMPLE_COUNTIES.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase());
    const matchesCoverage = coverageFilter === 'All' || c.coverage === coverageFilter;
    return matchesSearch && matchesCoverage;
  });

  return (
    <div className="bg-canvas min-h-screen pb-12">
      {/* Top banner indicating sample data */}
      <div className="bg-accent-indigo/5 border-b border-accent-indigo/10">
        <div className="max-w-content mx-auto px-6 py-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-accent-indigo" />
          <span className="text-sm text-accent-indigo font-medium">
            Sample Data — All counties and metrics shown below are placeholder examples for UI demonstration.
          </span>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title text-ink-primary mb-2">County Coverage</h1>
          <p className="text-body text-ink-secondary">
            Explore data coverage and infrastructure activity across all monitored counties
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-surface border-border hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-tertiary mb-1">Counties Monitored</p>
                  <p className="text-3xl font-bold text-ink-primary">{countiesMonitored}</p>
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
                  <p className="text-sm text-ink-tertiary mb-1">Data Sources</p>
                  <p className="text-3xl font-bold text-ink-primary">{dataSources}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-accent-teal/10">
                  <Database className="w-5 h-5 text-accent-teal" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-tertiary mb-1">Avg. Permits/Month</p>
                  <p className="text-3xl font-bold text-ink-primary">{avgPermits.toLocaleString()}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-accent-amber/10">
                  <BarChart3 className="w-5 h-5 text-accent-amber" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-tertiary mb-1">Coverage Score</p>
                  <p className="text-3xl font-bold text-ink-primary">{coverageScore}%</p>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
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
          <div className="flex gap-2">
            {(['All', 'Full', 'Partial', 'Limited'] as const).map((level) => (
              <Button
                key={level}
                variant={coverageFilter === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCoverageFilter(level)}
                className={
                  coverageFilter === level
                    ? 'bg-accent-indigo hover:bg-accent-indigo/90 text-white'
                    : 'border-border text-ink-secondary hover:bg-surface hover:text-ink-primary'
                }
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="mb-6 bg-border" />

        {/* County Grid */}
        {filtered.length > 0 ? (
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                <div className="mt-0.5">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                    Full
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-primary">Full Coverage</p>
                  <p className="text-xs text-ink-secondary mt-0.5">
                    All major data sources are actively monitored with real-time or near real-time ingestion.
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
                  <p className="text-sm font-medium text-ink-primary">Partial Coverage</p>
                  <p className="text-xs text-ink-secondary mt-0.5">
                    Core data sources are connected; some supplementary feeds may be delayed or pending integration.
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
                  <p className="text-sm font-medium text-ink-primary">Limited Coverage</p>
                  <p className="text-xs text-ink-secondary mt-0.5">
                    Only basic data is available. Additional source partnerships are in progress to expand coverage.
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

function CountyCard({ county }: { county: County }) {
  const handleNavigate = () => {
    window.location.href = `/counties/${county.id}`;
  };

  return (
    <Card className="bg-surface border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer" onClick={handleNavigate}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-accent-indigo" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink-primary leading-tight">
                {county.name}
              </h3>
              <p className="text-xs text-ink-tertiary">{county.state}</p>
            </div>
          </div>
          <Badge variant="outline" className={`text-xs font-medium ${coverageBadge(county.coverage)}`}>
            {county.coverage}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-canvas">
            <p className="text-xs text-ink-tertiary mb-1">Permits</p>
            <p className="text-lg font-bold text-ink-primary">{county.permitCount.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg bg-canvas">
            <p className="text-xs text-ink-tertiary mb-1">Trend (MoM)</p>
            <TrendIcon trend={county.trend} value={county.trendValue} />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-ink-tertiary mb-4">
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5" />
            {county.dataSources} sources
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {county.lastUpdate}
          </span>
        </div>

        <Button
          size="sm"
          className="w-full bg-accent-indigo hover:bg-accent-indigo/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
