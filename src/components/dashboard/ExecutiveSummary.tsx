/**
 * Executive Summary — "What changed today?"
 * Appears at the top of the dashboard. Answers:
 * - What changed today?
 * - Why does it matter?
 * - What should I do next?
 */

import { useMemo } from "react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { TrendingUp, AlertTriangle, Lightbulb, Bookmark, ArrowRight, Sun, Sunrise, Moon } from "lucide-react";
import { SkeletonCard } from "@/components/ui-custom/EngineStates";
import type { ReactNode } from "react";

interface ExecutiveSummaryProps {
  onViewOpportunity?: (id: number) => void;
  onViewAlerts?: () => void;
}

function getGreeting(): { text: string; icon: ReactNode } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", icon: <Sunrise className="w-5 h-5 text-accent-amber" /> };
  if (hour < 17) return { text: "Good afternoon", icon: <Sun className="w-5 h-5 text-accent-amber" /> };
  return { text: "Good evening", icon: <Moon className="w-5 h-5 text-accent-indigo" /> };
}

export function ExecutiveSummary({ onViewOpportunity, onViewAlerts }: ExecutiveSummaryProps) {
  const { user } = useAuth();
  const greeting = getGreeting();
  const { data: feed, isLoading } = trpc.pipeline.opportunities.feed.useQuery({ limit: 5 });
  const { data: alerts } = trpc.pipeline.telemetry.pipelineStatus.useQuery();

  const summary = useMemo(() => {
    if (!feed || feed.length === 0) return null;

    const highConfidence = feed.filter((o: any) => o.confidenceScore >= 80);
    const avgConfidence = Math.round(
      feed.reduce((sum: number, o: any) => sum + o.confidenceScore, 0) / feed.length
    );
    const totalEvents = alerts?.totals?.events || 0;
    const newEvents24h = alerts?.last24h?.events || 0;

    // Find the top county
    const countyCounts: Record<string, number> = {};
    for (const opp of feed) {
      const c = opp.county || "Unknown";
      countyCounts[c] = (countyCounts[c] || 0) + 1;
    }
    const topCounty = Object.entries(countyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

    return {
      totalOpportunities: feed.length,
      highConfidenceCount: highConfidence.length,
      avgConfidence,
      totalEvents,
      newEvents24h,
      topCounty,
      topOpportunity: feed[0],
    };
  }, [feed, alerts]);

  if (isLoading) {
    return (
      <div className="mb-8">
        <SkeletonCard />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-surface rounded-2xl border border-[#243444] p-6 mb-8">
        <p className="text-body text-ink-secondary">
          No infrastructure activity detected yet. We are monitoring your selected counties — check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-[#243444] p-6 mb-8 animate-fade-in-up">
      {/* Personalized greeting */}
      <div className="flex items-center gap-2 mb-4">
        {greeting.icon}
        <h2 className="text-h3 text-ink-primary">
          {greeting.text}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h2>
      </div>

      {/* Weekly activity summary */}
      <p className="text-[15px] text-ink-secondary mb-5">
        {summary.newEvents24h > 0
          ? `This period, we identified ${summary.totalOpportunities} new opportunities with an average confidence score of ${summary.avgConfidence}%.`
          : `You have ${summary.totalOpportunities} active opportunities with an average confidence score of ${summary.avgConfidence}%.`}
        {summary.topCounty && ` The most activity is in ${summary.topCounty} County.`}
      </p>

      {/* Primary headline */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-[18px] font-semibold text-ink-primary mb-2">
            {summary.newEvents24h > 0 ? (
              <>
                <TrendingUp className="w-5 h-5 text-accent-teal inline mr-2" />
                Infrastructure activity increased this period
              </>
            ) : (
              <>
                <Lightbulb className="w-5 h-5 text-accent-indigo inline mr-2" />
                {summary.highConfidenceCount} high-confidence {summary.highConfidenceCount === 1 ? "project" : "projects"} identified
              </>
            )}
          </h3>
          <p className="text-[14px] text-ink-secondary">
            {summary.highConfidenceCount > 0
              ? `${summary.highConfidenceCount} of ${summary.totalOpportunities} opportunities have high confidence scores.`
              : `${summary.totalOpportunities} opportunities are being tracked across your monitored counties.`}
            {summary.topCounty && ` Most activity in ${summary.topCounty}.`}
          </p>
        </div>
        {summary.topOpportunity && (
          <button
            onClick={() => onViewOpportunity?.(summary.topOpportunity.id)}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-accent-indigo text-white rounded-xl text-[13px] font-medium hover:bg-accent-indigo/90 transition-colors"
          >
            View Top Opportunity
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricBox
          icon={<TrendingUp className="w-4 h-4 text-accent-teal" />}
          label="Opportunities"
          value={String(summary.totalOpportunities)}
          sub={`${summary.highConfidenceCount} high confidence`}
        />
        <MetricBox
          icon={<Lightbulb className="w-4 h-4 text-accent-indigo" />}
          label="Avg Confidence"
          value={`${summary.avgConfidence}%`}
          sub="Across all active"
        />
        <MetricBox
          icon={<AlertTriangle className="w-4 h-4 text-accent-amber" />}
          label="New Signals"
          value={String(summary.newEvents24h)}
          sub="In last 24 hours"
        />
        <MetricBox
          icon={<Bookmark className="w-4 h-4 text-accent-violet" />}
          label="Data Points"
          value={String(summary.totalEvents)}
          sub="Total tracked"
        />
      </div>

      {/* Suggested next action */}
      <div className="mt-5 pt-4 border-t border-[#243444] flex items-center gap-3 flex-wrap">
        <span className="text-caption">Suggested next step:</span>
        {summary.topOpportunity && (
          <button
            onClick={() => onViewOpportunity?.(summary.topOpportunity.id)}
            className="text-[13px] text-accent-indigo hover:underline flex items-center gap-1"
          >
            Review {summary.topOpportunity.county || "top"} opportunity
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={onViewAlerts}
          className="text-[13px] text-ink-secondary hover:text-ink-primary flex items-center gap-1"
        >
          Set up alerts
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function MetricBox({ icon, label, value, sub }: {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-canvas rounded-xl p-4 border border-[#243444]">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-caption">{label}</span>
      </div>
      <div className="text-data text-ink-primary tabular-nums">{value}</div>
      <div className="text-[12px] text-ink-tertiary mt-1">{sub}</div>
    </div>
  );
}
