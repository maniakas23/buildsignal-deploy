import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, ExternalLink, FileText, RefreshCw, TrendingUp } from "lucide-react";

interface ChangeSource {
  title: string | null;
  publishedAt: number | null;
  sourceUrl: string | null;
  sourceName: string;
}

interface ChangeItem {
  changeId: string;
  category: "LIFECYCLE_ADVANCEMENT" | "NEW_OPPORTUNITY" | "CORROBORATION_ADDED";
  headline: string;
  opportunityId: string | null;
  sequenceId: string;
  title: string;
  location: string | null;
  county: string | null;
  state: string | null;
  previousStageLabel: string | null;
  newStageLabel: string | null;
  whatChanged: string;
  whyItMatters: string;
  evidenceStrength: string | null;
  sourceEventAt: number | null;
  detectedAt: number;
  watchNext: string | null;
  source?: ChangeSource | null;
}

interface ChangesResponse {
  changes: ChangeItem[];
  count: number;
  total?: number;
  offset?: number;
  window: string;
  emptyMeaning: string | null;
}

const WINDOWS = [
  { id: "24h", label: "Last 24 hours" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "all", label: "All time" },
];

const CATEGORY_STYLE: Record<string, { label: string; icon: typeof Activity; classes: string }> = {
  LIFECYCLE_ADVANCEMENT: {
    label: "Stage advanced",
    icon: TrendingUp,
    classes: "bg-[var(--bs-action)]/10 text-[var(--bs-action)] border-[var(--bs-action)]/20",
  },
  NEW_OPPORTUNITY: {
    label: "New opportunity",
    icon: FileText,
    classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  CORROBORATION_ADDED: {
    label: "New supporting evidence",
    icon: Activity,
    classes: "bg-[var(--bs-intelligence)]/10 text-[var(--bs-intelligence)] border-[var(--bs-intelligence)]/20",
  },
};

function strengthLabel(s: string | null): string {
  if (s === "VERY_STRONG") return "Very strong evidence";
  if (s === "STRONG") return "Strong evidence";
  if (s === "MODERATE") return "Moderate evidence";
  return s ? s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ") : "Evidence recorded";
}

function fmtDate(ms: number | null): string {
  if (!ms) return "Date not recorded";
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function WhatChangedPage() {
  const [window, setWindow] = useState("7d");
  const [data, setData] = useState<ChangesResponse | null>(null);
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPage = async (w: string, offset: number): Promise<ChangesResponse> => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch(`/api/v1/changes?window=${w}&limit=100&offset=${offset}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.json();
  };

  const load = async (w: string) => {
    setState("loading");
    try {
      setData(await fetchPage(w, 0));
      setState("ready");
    } catch {
      setData(null);
      setState("error");
    }
  };

  const loadMore = async () => {
    if (!data) return;
    setLoadingMore(true);
    try {
      const next = await fetchPage(window, data.changes.length);
      setData({
        ...next,
        changes: [...data.changes, ...next.changes],
        count: data.changes.length + next.count,
        emptyMeaning: null,
      });
    } catch {
      // Keep existing items; user can retry with the same button.
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    load(window);
  }, [window]);

  return (
    <div className="min-h-screen bg-[var(--bs-canvas)]">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--bs-text-primary)]">What changed</h1>
          <p className="mt-1 text-sm text-[var(--bs-text-secondary)]">
            Meaningful changes across your covered development markets — new qualified opportunities,
            stage advancements, and new supporting evidence from authoritative public sources.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-2 mb-6" role="group" aria-label="Time window">
          {WINDOWS.map((w) => (
            <button
              key={w.id}
              onClick={() => setWindow(w.id)}
              aria-pressed={window === w.id}
              className={`min-h-11 px-4 rounded-lg text-sm font-medium border transition-colors ${
                window === w.id
                  ? "bg-[var(--bs-action)] text-white border-[var(--bs-action)]"
                  : "bg-[var(--bs-surface)] text-[var(--bs-text-secondary)] border-[var(--bs-border)] hover:text-[var(--bs-text-primary)]"
              }`}
            >
              {w.label}
            </button>
          ))}
          <button
            onClick={() => load(window)}
            aria-label="Refresh changes"
            className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)] text-[var(--bs-text-secondary)] hover:text-[var(--bs-text-primary)] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {state === "loading" && (
          <div className="space-y-3" aria-busy="true" aria-label="Loading changes">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-[var(--bs-surface)] border border-[var(--bs-border)] animate-pulse" />
            ))}
          </div>
        )}

        {state === "error" && (
          <div className="rounded-xl border border-[var(--bs-border)] bg-[var(--bs-surface)] p-6 text-center">
            <p className="text-sm text-[var(--bs-text-primary)] font-medium">Change feed temporarily unavailable</p>
            <p className="mt-1 text-sm text-[var(--bs-text-secondary)]">
              We couldn't load recent changes. This does not mean there were no changes — please try again.
            </p>
            <button
              onClick={() => load(window)}
              className="mt-4 min-h-11 px-4 rounded-lg bg-[var(--bs-action)] text-white text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {state === "ready" && data && data.count === 0 && (
          <div className="rounded-xl border border-[var(--bs-border)] bg-[var(--bs-surface)] p-8 text-center">
            <p className="text-[var(--bs-text-primary)] font-medium">No material changes in this period</p>
            <p className="mt-1 text-sm text-[var(--bs-text-secondary)]">
              {data.emptyMeaning ||
                "No material development changes were detected in your selected markets during this period."}
            </p>
          </div>
        )}

        {state === "ready" && data && data.count > 0 && (
          <ol className="space-y-4" aria-label="Recent development changes">
            {data.changes.map((c) => {
              const style = CATEGORY_STYLE[c.category] || CATEGORY_STYLE.CORROBORATION_ADDED;
              const Icon = style.icon;
              return (
                <li
                  key={c.changeId}
                  className="rounded-xl border border-[var(--bs-border)] bg-[var(--bs-surface)] p-5"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style.classes}`}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {style.label}
                    </span>
                    <span className="text-xs text-[var(--bs-text-tertiary)]">{strengthLabel(c.evidenceStrength)}</span>
                  </div>

                  <h2 className="text-base font-semibold text-[var(--bs-text-primary)]">{c.title}</h2>
                  {(c.county || c.state) && (
                    <p className="text-sm text-[var(--bs-text-secondary)]">
                      {[c.location, c.county && `${c.county} County`, c.state].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(" · ")}
                    </p>
                  )}

                  <p className="mt-2 text-sm text-[var(--bs-text-primary)]">{c.whatChanged}</p>
                  <p className="mt-1 text-sm text-[var(--bs-text-secondary)]">{c.whyItMatters}</p>

                  <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-[var(--bs-text-tertiary)]">
                    <div className="flex gap-1">
                      <dt className="font-medium">Source record dated</dt>
                      <dd>{fmtDate(c.sourceEventAt)}</dd>
                    </div>
                    <div className="flex gap-1">
                      <dt className="font-medium">Detected by BuildSignal</dt>
                      <dd>{fmtDate(c.detectedAt)}</dd>
                    </div>
                  </dl>

                  {c.watchNext && (
                    <p className="mt-2 text-xs text-[var(--bs-text-secondary)]">
                      <span className="font-medium">Next evidence to monitor:</span> {c.watchNext}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <Link
                      to={`/opportunities/${c.sequenceId}`}
                      className="inline-flex items-center gap-1 min-h-11 text-[var(--bs-action)] hover:underline font-medium"
                    >
                      View opportunity <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                    {c.source?.sourceUrl && (
                      <a
                        href={c.source.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 min-h-11 text-[var(--bs-text-secondary)] hover:text-[var(--bs-text-primary)]"
                      >
                        {c.source.sourceName || "Authoritative source"}
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only">(opens in new tab)</span>
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        {state === "ready" && data && typeof data.total === "number" && data.changes.length < data.total && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="min-h-11 px-6 rounded-lg text-sm font-medium border border-[var(--bs-border)] bg-[var(--bs-surface)] text-[var(--bs-text-primary)] hover:bg-[var(--bs-surface-hover)] transition-colors disabled:opacity-60"
            >
              {loadingMore ? "Loading…" : "Load older changes"}
            </button>
            <p className="text-xs text-[var(--bs-text-tertiary)]" aria-live="polite">
              Showing {data.changes.length} of {data.total} changes
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
