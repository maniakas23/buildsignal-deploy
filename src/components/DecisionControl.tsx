import { useCallback, useEffect, useRef, useState } from "react";
import { Bookmark, Eye, Search, CheckCircle2, XCircle, Loader2 } from "lucide-react";

type DecisionState = "WATCHED" | "SHORTLISTED" | "INVESTIGATING" | "ACTED" | "PASSED";

const STATES: { id: DecisionState; label: string; icon: typeof Eye }[] = [
  { id: "WATCHED", label: "Watching", icon: Eye },
  { id: "SHORTLISTED", label: "Shortlisted", icon: Bookmark },
  { id: "INVESTIGATING", label: "Investigating", icon: Search },
  { id: "ACTED", label: "Acted", icon: CheckCircle2 },
  { id: "PASSED", label: "Passed", icon: XCircle },
];

async function decisionCall(proc: string, input: Record<string, unknown>, token: string) {
  const res = await fetch(`/api/trpc/${proc}?batch=1`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ "0": { json: input } }),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const json = await res.json();
  const item = Array.isArray(json) ? json[0] : null;
  if (item?.error) {
    const code = item.error?.data?.code || item.error?.code || "ERROR";
    const e = new Error(item.error?.message || "Request failed") as Error & { code?: string };
    e.code = code;
    throw e;
  }
  return item?.result?.data;
}

/**
 * Decision Memory V1 — "What am I doing with this opportunity?"
 * Server-authoritative: the displayed state only changes after the server
 * confirms persistence. Fails independently: if Decision Memory is
 * unavailable, the underlying intelligence on the page is unaffected.
 */
export function DecisionControl({ opportunityId }: { opportunityId: string }) {
  const [current, setCurrent] = useState<DecisionState | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable" | "hidden">("loading");
  const [pending, setPending] = useState<DecisionState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setStatus("hidden");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const data = await decisionCall("decision.get", { opportunityId }, token);
      if (!mounted.current) return;
      setCurrent((data?.state as DecisionState | null) ?? null);
      setStatus("ready");
    } catch (e) {
      if (!mounted.current) return;
      const code = (e as { code?: string }).code;
      if (code === "UNAUTHORIZED") {
        setStatus("hidden");
      } else {
        setStatus("unavailable");
      }
    }
  }, [opportunityId]);

  useEffect(() => {
    load();
  }, [load]);

  const choose = async (next: DecisionState) => {
    if (pending || next === current) return;
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setStatus("hidden");
      return;
    }
    setPending(next);
    setError(null);
    try {
      const data = await decisionCall("decision.set", { opportunityId, state: next }, token);
      if (!mounted.current) return;
      // Server-authoritative: only reflect what the server persisted.
      setCurrent((data?.state as DecisionState | null) ?? null);
    } catch (e) {
      if (!mounted.current) return;
      const code = (e as { code?: string }).code;
      if (code === "UNAUTHORIZED") {
        setStatus("hidden");
        return;
      }
      setError("Couldn't save your decision. Nothing was changed — please try again.");
    } finally {
      if (mounted.current) setPending(null);
    }
  };

  if (status === "hidden") return null;

  if (status === "unavailable") {
    return (
      <section
        aria-label="Your decision"
        className="rounded-xl border border-[var(--bs-border)] bg-[var(--bs-surface)] px-4 py-3 mb-4 flex flex-wrap items-center gap-3"
      >
        <p className="text-sm text-[var(--bs-text-secondary)]">Your decision tracking is temporarily unavailable.</p>
        <button
          type="button"
          onClick={load}
          className="min-h-11 rounded-lg border border-[var(--bs-border)] px-4 text-sm font-medium text-[var(--bs-text-primary)] hover:bg-[var(--bs-surface-hover)] transition-colors"
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="decision-heading"
      className="rounded-xl border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4 mb-4"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 id="decision-heading" className="text-sm font-semibold text-[var(--bs-text-primary)] whitespace-nowrap">
          Your decision
        </h2>
        {status === "loading" ? (
          <span className="inline-flex items-center gap-2 text-sm text-[var(--bs-text-tertiary)]" aria-busy="true">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading…
          </span>
        ) : (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Set your decision for this opportunity">
            {STATES.map((s) => {
              const Icon = s.icon;
              const isCurrent = current === s.id;
              const isPending = pending === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={isCurrent}
                  disabled={pending != null}
                  onClick={() => choose(s.id)}
                  className={`inline-flex items-center gap-1.5 min-h-11 rounded-lg border px-3 text-sm font-medium transition-colors disabled:opacity-60 ${
                    isCurrent
                      ? s.id === "PASSED"
                        ? "border-[var(--bs-text-tertiary)]/40 bg-[var(--bs-surface-hover)] text-[var(--bs-text-primary)]"
                        : "border-[var(--bs-action)]/40 bg-[var(--bs-action)]/10 text-[var(--bs-action)]"
                      : "border-[var(--bs-border)] text-[var(--bs-text-secondary)] hover:bg-[var(--bs-surface-hover)] hover:text-[var(--bs-text-primary)]"
                  }`}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  )}
                  {s.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {status === "ready" && (
        <p className="mt-2 text-xs text-[var(--bs-text-tertiary)]">
          {current == null
            ? "No decision recorded yet. This only tracks what you decided — it never changes the underlying intelligence."
            : current === "PASSED"
              ? "You passed on this opportunity. It stays right here — tap Watching anytime to pick it back up."
              : "Saved. Only you can see this; it never changes the underlying intelligence."}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-xs text-[var(--bs-warning,#b45309)]">
          {error}
        </p>
      )}
    </section>
  );
}
