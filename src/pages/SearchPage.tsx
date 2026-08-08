import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  MapPin,
  Clock,
  TrendingUp,
  Filter,
  X,
  Zap,
  Building2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type ResultType = "event" | "pattern" | "recommendation" | "county";

const typeConfig: Record<
  ResultType,
  { label: string; icon: React.ReactNode; badgeClass: string }
> = {
  event: {
    label: "Event",
    icon: <Zap className="w-3.5 h-3.5" />,
    badgeClass: "bg-accent-indigo/10 text-accent-indigo border-accent-indigo/20",
  },
  pattern: {
    label: "Pattern",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    badgeClass: "bg-accent-teal/10 text-accent-teal border-accent-teal/20",
  },
  recommendation: {
    label: "Recommendation",
    icon: <Building2 className="w-3.5 h-3.5" />,
    badgeClass: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
  },
  county: {
    label: "County",
    icon: <MapPin className="w-3.5 h-3.5" />,
    badgeClass: "bg-[#0B1F33]/10 text-[#0B1F33] border-[#0B1F33]/20",
  },
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [activeType, setActiveType] = useState<ResultType | "all">("all");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce query for suggestions (300ms)
  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery("");
      return;
    }
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── tRPC Queries ─────────────────────────────────────────────────

  const { data: suggestions, isLoading: suggestionsLoading } =
    trpc.search.suggestions.useQuery(
      { query: debouncedQuery, limit: 5 },
      { enabled: debouncedQuery.length > 0 && !hasSearched }
    );

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = trpc.search.search.useQuery(
    {
      query: query.trim(),
      types:
        activeType === "all"
          ? undefined
          : ([activeType] as Array<"events" | "patterns" | "recommendations" | "counties">),
      state: selectedState || undefined,
      limit: 20,
    },
    { enabled: hasSearched && query.trim().length > 0 }
  );

  const { data: recentSearches, isLoading: recentLoading } =
    trpc.search.recentSearches.useQuery({ limit: 10 });

  const { data: facets, isLoading: facetsLoading } =
    trpc.search.facets.useQuery();

  // ── Handlers ─────────────────────────────────────────────────────

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setHasSearched(true);
    setShowSuggestions(false);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion);
    setDebouncedQuery(suggestion);
    setHasSearched(true);
    setShowSuggestions(false);
  }, []);

  const handleRecentClick = useCallback((recentQuery: string) => {
    setQuery(recentQuery);
    setDebouncedQuery(recentQuery);
    setHasSearched(true);
    setShowSuggestions(false);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setHasSearched(false);
    setActiveType("all");
    setSelectedState(null);
  }, []);

  const results = searchData?.results ?? [];
  const total = searchData?.total ?? 0;

  return (
    <div className="bg-canvas min-h-screen">
      <div className="max-w-content mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="section-title text-ink-primary mb-2">Search</h1>
          <p className="text-body text-ink-secondary">
            Search across all infrastructure data.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-tertiary" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
              if (hasSearched && e.target.value.trim() === "") {
                setHasSearched(false);
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search permits, projects, counties, companies..."
            className="pl-12 pr-28 py-6 text-base bg-surface border-border rounded-xl shadow-sm placeholder:text-ink-tertiary focus-visible:ring-accent-indigo focus-visible:ring-2"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-[88px] top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-canvas transition-colors"
            >
              <X className="w-4 h-4 text-ink-tertiary" />
            </button>
          )}
          <Button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent-indigo hover:bg-accent-indigo/90 text-white"
            size="sm"
          >
            Search
          </Button>

          {/* Suggestions Dropdown */}
          {showSuggestions && debouncedQuery.length > 0 && !hasSearched && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-2 bg-surface border border-border rounded-xl shadow-lg overflow-hidden"
            >
              {suggestionsLoading ? (
                <div className="p-4 space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-8 w-5/6" />
                </div>
              ) : suggestions && suggestions.length > 0 ? (
                <div className="py-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-canvas transition-colors"
                    >
                      <Search className="w-4 h-4 text-ink-tertiary shrink-0" />
                      <span className="text-sm text-ink-primary">{s}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-ink-tertiary">
                  No suggestions
                </div>
              )}
            </div>
          )}
        </div>

        {/* Facet Filter Chips */}
        {!facetsLoading && facets && (
          <div className="mb-6 space-y-3">
            {/* State filters */}
            {facets.states.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-ink-tertiary shrink-0" />
                <span className="text-xs font-medium text-ink-tertiary uppercase tracking-wide mr-1">
                  States
                </span>
                {facets.states.slice(0, 8).map((s) => (
                  <button
                    key={s.state}
                    onClick={() =>
                      setSelectedState(
                        selectedState === s.state ? null : s.state
                      )
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                      selectedState === s.state
                        ? "bg-accent-indigo text-white border-accent-indigo"
                        : "bg-surface text-ink-secondary border-border hover:border-accent-indigo/40 hover:text-accent-indigo"
                    }`}
                  >
                    {s.state} ({s.count})
                  </button>
                ))}
              </div>
            )}
            {/* Event type filters */}
            {facets.eventTypes.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-ink-tertiary shrink-0" />
                <span className="text-xs font-medium text-ink-tertiary uppercase tracking-wide mr-1">
                  Event Types
                </span>
                {facets.eventTypes.slice(0, 8).map((t) => (
                  <Badge
                    key={t.type}
                    variant="outline"
                    className="bg-surface text-ink-secondary border-border hover:border-accent-indigo/40 cursor-default"
                  >
                    {t.type} ({t.count})
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
        {facetsLoading && (
          <div className="mb-6 flex flex-wrap gap-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-7 w-16" />
          </div>
        )}

        {/* Type Tabs (only after search) */}
        {hasSearched && (
          <div className="mb-6">
            <Tabs
              value={activeType}
              onValueChange={(v) => setActiveType(v as ResultType | "all")}
            >
              <TabsList className="bg-surface border border-border">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="event">Events</TabsTrigger>
                <TabsTrigger value="pattern">Patterns</TabsTrigger>
                <TabsTrigger value="recommendation">
                  Recommendations
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Error State */}
        {searchError && (
          <div className="mb-8 text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>
            <p className="text-ink-secondary mb-1">
              Something went wrong with your search
            </p>
            <p className="text-sm text-ink-tertiary mb-4">
              {searchError.message}
            </p>
            <Button
              onClick={() => refetchSearch()}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && !searchError && (
          <div>
            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-ink-secondary">
                {searchLoading ? (
                  <span>Searching...</span>
                ) : (
                  <span>
                    Showing{" "}
                    <strong className="text-ink-primary">
                      {results.length}
                    </strong>{" "}
                    of{" "}
                    <strong className="text-ink-primary">{total}</strong>{" "}
                    results for{" "}
                    <span className="text-accent-indigo font-medium">
                      &ldquo;{query}&rdquo;
                    </span>
                  </span>
                )}
              </p>
            </div>

            {/* Loading Skeletons */}
            {searchLoading && (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="bg-surface border-border">
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Results List */}
            {!searchLoading && results.length > 0 && (
              <div className="space-y-4">
                {results.map((result, idx) => {
                  const type = (result._type as ResultType) || "event";
                  const config = typeConfig[type];
                  const title =
                    (result.title as string) ||
                    (result.name as string) ||
                    (result.targetProduct as string) ||
                    "Untitled";
                  const description =
                    (result.description as string) ||
                    (result.summary as string) ||
                    (result.rationale as string) ||
                    "";
                  const location =
                    (result.county as string)
                      ? `${result.county as string}, ${(result.state as string) || ""}`
                      : (result.jurisdiction as string) || "";
                  const dateStr = result.createdAt
                    ? new Date(
                        result.createdAt as string
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "";

                  return (
                    <Card
                      key={idx}
                      className="bg-surface border-border hover:border-accent-indigo/30 transition-colors"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge
                                variant="outline"
                                className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 ${config.badgeClass}`}
                              >
                                {config.icon}
                                {config.label}
                              </Badge>
                              {location && (
                                <span className="text-xs text-ink-tertiary flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {location}
                                </span>
                              )}
                            </div>
                            <h3 className="text-base font-semibold text-ink-primary mb-1">
                              {title}
                            </h3>
                            <p className="text-sm text-ink-secondary leading-relaxed">
                              {description}
                            </p>
                            {dateStr && (
                              <p className="text-xs text-ink-tertiary mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {dateStr}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0 border-accent-indigo text-accent-indigo hover:bg-accent-indigo hover:text-white"
                          >
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {!searchLoading && results.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-canvas flex items-center justify-center">
                  <Search className="w-7 h-7 text-ink-tertiary" />
                </div>
                <p className="text-ink-secondary mb-1">
                  No results found for your search
                </p>
                <p className="text-sm text-ink-tertiary">
                  Try a different term or filter
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State (before search) */}
        {!hasSearched && (
          <div className="mb-10">
            {/* Recent Searches */}
            {!recentLoading && recentSearches && recentSearches.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-ink-tertiary" />
                  <span className="text-sm font-semibold text-ink-secondary uppercase tracking-wide">
                    Recent Searches
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleRecentClick(r.query)}
                      className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-ink-secondary hover:border-accent-indigo/40 transition-colors"
                    >
                      <Search className="w-3.5 h-3.5 text-ink-tertiary" />
                      {r.query}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {recentLoading && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-9 w-36" />
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-9 w-40" />
                </div>
              </div>
            )}

            {/* Empty State Message */}
            <div className="mt-10 text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-indigo/10 flex items-center justify-center">
                <Search className="w-7 h-7 text-accent-indigo" />
              </div>
              <p className="text-ink-secondary text-base max-w-md mx-auto">
                Enter a search term to explore infrastructure intelligence across
                all monitored counties
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
