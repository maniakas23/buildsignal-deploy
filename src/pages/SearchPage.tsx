import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/providers/trpc";
import {
  ArrowLeft,
  Search,
  MapPin,
  Calendar,
  TrendingUp,
  Loader2,
  Filter,
  X,
} from "lucide-react";
import { format } from "date-fns";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  county: string;
  state: string;
  type: string;
  confidenceLabel: string | null;
  date: string | null;
}

// Maps a worker search.search result item (events / patterns /
// recommendations / counties) to the display shape. Internal provider IDs
// are never rendered. Missing fields stay absent — no fabricated values.
function mapResult(r: any): SearchResult {
  const confRaw = r.canonicalConfidence;
  const confNum =
    typeof confRaw === "number" ? confRaw :
    typeof r.confidence === "number" ? r.confidence : null;
  return {
    id: String(r.id ?? ""),
    title: r.title || r.name || r.targetType || "Untitled result",
    description: r.description || "",
    county: r.county || "",
    state: r.state || "",
    type: r.eventType || r.patternType || r._type || "result",
    confidenceLabel:
      r.confidenceStatus != null ? String(r.confidenceStatus) :
      confNum != null ? `${Math.round(confNum <= 1 ? confNum * 100 : confNum)}% confidence` : null,
    date: r.createdAt || r.ingestedAt || r.firstDetectedAt || null,
  };
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    county: "",
    type: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isError, refetch } = trpc.search.search.useQuery(
    { query, types: ["events", "patterns", "recommendations", "counties"], limit: 20 },
    { enabled: query.length > 1 }
  );

  const results: SearchResult[] = ((data as any)?.results ?? []).map(mapResult);
  const filtered = results.filter(
    (r) =>
      (!filters.county || r.county.toLowerCase().includes(filters.county.toLowerCase())) &&
      (!filters.type || r.type.toLowerCase().includes(filters.type.toLowerCase()))
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[var(--bs-canvas)]">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="gap-2 text-[var(--bs-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--bs-text-primary)]">Search</h1>
            <p className="text-sm text-[var(--bs-text-tertiary)]">
              Search across all opportunities and permits
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--bs-text-tertiary)]" />
              <Input
                placeholder="Search opportunities, permits, counties..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 bg-[var(--bs-surface)] border-[var(--bs-border)] text-[var(--bs-text-primary)]"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 border-[var(--bs-border)] text-[var(--bs-text-primary)]"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </form>

        {/* Filters */}
        {showFilters && (
          <Card className="bg-[var(--bs-surface)] border-[var(--bs-border)] mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--bs-text-primary)] mb-1 block">
                    County
                  </label>
                  <Input
                    placeholder="Filter by county..."
                    value={filters.county}
                    onChange={(e) => setFilters((f) => ({ ...f, county: e.target.value }))}
                    className="bg-[var(--bs-canvas)] border-[var(--bs-border)] text-[var(--bs-text-primary)]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--bs-text-primary)] mb-1 block">
                    Type
                  </label>
                  <Input
                    placeholder="Filter by type..."
                    value={filters.type}
                    onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
                    className="bg-[var(--bs-canvas)] border-[var(--bs-border)] text-[var(--bs-text-primary)]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="bg-[var(--bs-surface)] border-[var(--bs-border)]">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bs-surface-hover)] animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 bg-[var(--bs-surface-hover)] rounded animate-pulse" />
                      <div className="h-3 w-3/4 bg-[var(--bs-surface-hover)] rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bs-surface)] flex items-center justify-center">
              <Search className="w-7 h-7 text-[var(--bs-text-tertiary)]" />
            </div>
            <p className="text-lg font-medium text-[var(--bs-text-primary)] mb-2">
              Search is temporarily unavailable
            </p>
            <p className="text-sm text-[var(--bs-text-tertiary)] mb-4">
              The search service could not be reached. Your query was not lost.
            </p>
            <Button variant="outline" onClick={() => refetch()} className="gap-2 border-[var(--bs-border)] text-[var(--bs-text-primary)]">
              Try again
            </Button>
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((result) => (
              <Card
                key={result.id}
                className="bg-[var(--bs-surface)] border-[var(--bs-border)] hover:border-[var(--bs-action)]/30 transition-all cursor-pointer"
                onClick={() => navigate(`/opportunities/${result.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bs-action)]/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5 text-[var(--bs-action)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-[var(--bs-text-primary)]">
                          {result.title}
                        </h3>
                        <Badge variant="outline" className="text-[10px] text-[var(--bs-action)] border-[var(--bs-action)]/20">
                          {result.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--bs-text-secondary)] line-clamp-2 mb-2">
                        {result.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[var(--bs-text-tertiary)]">
                        {(result.county || result.state) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {[result.county, result.state].filter(Boolean).join(", ")}
                          </span>
                        )}
                        {result.date && !Number.isNaN(new Date(result.date).getTime()) && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(result.date), "MMM d, yyyy")}
                          </span>
                        )}
                        {result.confidenceLabel && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {result.confidenceLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : query.length > 1 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bs-surface)] flex items-center justify-center">
              <Search className="w-7 h-7 text-[var(--bs-text-tertiary)]" />
            </div>
            <p className="text-lg font-medium text-[var(--bs-text-primary)] mb-2">
              No results found
            </p>
            <p className="text-sm text-[var(--bs-text-tertiary)]">
              Try adjusting your search query or filters
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bs-surface)] flex items-center justify-center">
              <Search className="w-7 h-7 text-[var(--bs-text-tertiary)]" />
            </div>
            <p className="text-lg font-medium text-[var(--bs-text-primary)] mb-2">
              Start searching
            </p>
            <p className="text-sm text-[var(--bs-text-tertiary)]">
              Enter a query above to search across all opportunities and permits
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
