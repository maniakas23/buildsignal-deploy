import { useState } from "react";
import {
  Search,
  MapPin,
  Clock,
  TrendingUp,
  FileText,
  Building2,
  Landmark,
  Briefcase,
  ArrowRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

type FilterType = "All" | "Permits" | "Projects" | "Counties" | "Companies" | "Zoning";
type ResultType = "Permit" | "Project" | "Zoning Change" | "County Update";

interface SearchResult {
  id: string;
  title: string;
  type: ResultType;
  description: string;
  location: string;
  date: string;
}

const filters: FilterType[] = ["All", "Permits", "Projects", "Counties", "Companies", "Zoning"];

const recentSearches = [
  "Travis County permits",
  "Maricopa zoning",
  "Dallas commercial",
];

const trendingSearches = [
  { label: "King County surge", count: "2.4k searches" },
  { label: "Florida commercial permits", count: "1.8k searches" },
  { label: "Arizona residential", count: "1.5k searches" },
];

const sampleResults: SearchResult[] = [
  {
    id: "1",
    title: "Commercial Building Permit #2024-0892",
    type: "Permit",
    description:
      "New commercial construction permit for a 12-story mixed-use development in downtown Austin. Includes electrical, plumbing, and structural approvals.",
    location: "Austin, TX — Travis County",
    date: "Dec 12, 2024",
  },
  {
    id: "2",
    title: "Riverside Mixed-Use Development",
    type: "Project",
    description:
      "Large-scale mixed-use project spanning 45 acres with residential towers, retail space, and underground parking. Phase 1 breaking ground Q1 2025.",
    location: "Phoenix, AZ — Maricopa County",
    date: "Dec 10, 2024",
  },
  {
    id: "3",
    title: "Zoning Change Request: R-1 to C-2",
    type: "Zoning Change",
    description:
      "Proposed rezoning of 8 parcels from residential to commercial designation. Public hearing scheduled for January 15, 2025.",
    location: "Dallas, TX — Dallas County",
    date: "Dec 8, 2024",
  },
  {
    id: "4",
    title: "Travis County Infrastructure Update",
    type: "County Update",
    description:
      "Quarterly infrastructure report released: 340 new permits issued, $1.2B in total project value, and 15 major utility upgrades completed.",
    location: "Austin, TX — Travis County",
    date: "Dec 5, 2024",
  },
  {
    id: "5",
    title: "Highway 101 Utility Upgrade Permit",
    type: "Permit",
    description:
      "Underground utility relocation permit for fiber optic and gas line upgrades along Highway 101 corridor. Estimated duration: 6 months.",
    location: "San Jose, CA — Santa Clara County",
    date: "Dec 3, 2024",
  },
];

const typeConfig: Record<
  ResultType,
  { icon: React.ReactNode; badgeClass: string }
> = {
  Permit: {
    icon: <FileText className="w-4 h-4" />,
    badgeClass: "bg-accent-indigo/10 text-accent-indigo border-accent-indigo/20",
  },
  Project: {
    icon: <Building2 className="w-4 h-4" />,
    badgeClass: "bg-accent-teal/10 text-accent-teal border-accent-teal/20",
  },
  "Zoning Change": {
    icon: <Landmark className="w-4 h-4" />,
    badgeClass: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
  },
  "County Update": {
    icon: <Briefcase className="w-4 h-4" />,
    badgeClass: "bg-[#0B1F33]/10 text-[#0B1F33] border-[#0B1F33]/20",
  },
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [recents, setRecents] = useState(recentSearches);

  const filteredResults =
    query.length > 0
      ? sampleResults.filter((r) =>
          activeFilter === "All"
            ? true
            : activeFilter === "Permits"
            ? r.type === "Permit"
            : activeFilter === "Projects"
            ? r.type === "Project"
            : activeFilter === "Zoning"
            ? r.type === "Zoning Change"
            : activeFilter === "Counties"
            ? r.type === "County Update"
            : true
        )
      : [];

  const hasResults = filteredResults.length > 0;
  const isSearching = query.length > 0;

  const removeRecent = (item: string) => {
    setRecents((prev) => prev.filter((r) => r !== item));
  };

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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search permits, projects, counties, companies..."
            className="pl-12 pr-4 py-6 text-base bg-surface border-border rounded-xl shadow-sm placeholder:text-ink-tertiary focus-visible:ring-accent-indigo focus-visible:ring-2"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                activeFilter === f
                  ? "bg-accent-indigo text-white border-accent-indigo"
                  : "bg-surface text-ink-secondary border-border hover:border-accent-indigo/40 hover:text-accent-indigo"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {!isSearching && (
          <div className="mb-10">
            {/* Recent Searches */}
            {recents.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-ink-tertiary" />
                  <span className="text-sm font-semibold text-ink-secondary uppercase tracking-wide">
                    Recent Searches
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recents.map((r) => (
                    <div
                      key={r}
                      className="group flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-ink-secondary hover:border-accent-indigo/40 transition-colors"
                    >
                      <button
                        onClick={() => setQuery(r)}
                        className="flex items-center gap-2"
                      >
                        <Search className="w-3.5 h-3.5 text-ink-tertiary" />
                        {r}
                      </button>
                      <button
                        onClick={() => removeRecent(r)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5 text-ink-tertiary hover:text-ink-secondary" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <Card className="bg-surface border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-ink-primary">
                  <TrendingUp className="w-4 h-4 text-accent-teal" />
                  Trending Searches
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {trendingSearches.map((t) => (
                    <button
                      key={t.label}
                      onClick={() => setQuery(t.label)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-canvas transition-colors text-left"
                    >
                      <div>
                        <p className="text-sm font-medium text-ink-primary">
                          {t.label}
                        </p>
                        <p className="text-xs text-ink-tertiary mt-0.5">
                          {t.count}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-ink-tertiary" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

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

        {/* Results */}
        {isSearching && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-ink-secondary">
                {hasResults ? (
                  <span>
                    Showing <strong className="text-ink-primary">{filteredResults.length}</strong> results for{" "}
                    <span className="text-accent-indigo font-medium">"{query}"</span>
                  </span>
                ) : (
                  <span>
                    No results for{" "}
                    <span className="text-accent-indigo font-medium">"{query}"</span>
                  </span>
                )}
              </p>
              <Badge variant="outline" className="text-ink-tertiary border-border">
                Sample Results
              </Badge>
            </div>

            {hasResults ? (
              <div className="space-y-4">
                {filteredResults.map((result) => {
                  const config = typeConfig[result.type];
                  return (
                    <Card
                      key={result.id}
                      className="bg-surface border-border hover:border-accent-indigo/30 transition-colors"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 ${config.badgeClass}`}
                              >
                                {config.icon}
                                {result.type}
                              </Badge>
                              <span className="text-xs text-ink-tertiary flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {result.location}
                              </span>
                            </div>
                            <h3 className="text-base font-semibold text-ink-primary mb-1">
                              {result.title}
                            </h3>
                            <p className="text-sm text-ink-secondary leading-relaxed">
                              {result.description}
                            </p>
                            <p className="text-xs text-ink-tertiary mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {result.date}
                            </p>
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
            ) : (
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
      </div>
    </div>
  );
}
