/**
 * National Intelligence Dashboard — Gate 18 Capstone
 * The complete national network view: 50 states, knowledge graph,
 * historical validation, expanded pattern library, confidence engine.
 */

import { useState } from "react";
import { trpc } from "@/providers/trpc";
import {
  Globe, MapPin, Activity, Network, TrendingUp, Shield,
  Zap, Clock, CheckCircle, AlertTriangle, BarChart3,
  Cpu, ChevronDown, ChevronUp, Server, Database, Home,
  Building2, Factory, Layers, ShoppingBag, Heart, School,
  Train, HardDrive, Link2, Target, Award
} from "lucide-react";

const PATTERN_ICONS: Record<string, React.ElementType> = {
  residential_growth: Home, commercial_growth: Building2, industrial_growth: Factory,
  mixed_use: Layers, retail_expansion: ShoppingBag, healthcare: Heart,
  school_construction: School, transportation: Train, utility_expansion: Zap,
  data_center: HardDrive, logistics_hub: Factory, retail_district: ShoppingBag,
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-accent-teal", partial: "bg-accent-amber",
  limited: "bg-accent-crimson/70", planned: "bg-ink-wash",
};

const TABS = [
  { id: "overview", label: "National Overview", icon: Globe },
  { id: "states", label: "50 States", icon: MapPin },
  { id: "knowledge", label: "Knowledge Graph", icon: Network },
  { id: "patterns", label: "Signal Library", icon: Activity },
  { id: "validation", label: "Historical", icon: Target },
] as const;

export default function NationalIntelligencePage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("overview");
  const { data: geoData } = trpc.geographic.list.useQuery();
  const { data: geoSumm } = trpc.geographic.summary.useQuery();
  const { data: kgStats } = trpc.knowledgeGraph.stats.useQuery();
  const { data: histSumm } = trpc.historicalValidation.summary.useQuery();
  const { data: providerSumm } = trpc.provider.summary.useQuery();
  const { data: health } = trpc.analytics.healthScore.useQuery();

  const states = (geoData?.zones || []).filter((z: any) => z.type === "state");
  const activeStates = states.filter((s: any) => s.healthStatus === "active").length;
  const partialStates = states.filter((s: any) => s.healthStatus === "partial").length;
  const plannedStates = states.filter((s: any) => s.healthStatus === "planned").length;

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-5 h-5 text-accent-indigo" />
          <span className="text-[12px] text-accent-indigo font-medium uppercase tracking-wider">Gate 18 — Capstone</span>
        </div>
        <h1 className="text-h2 text-ink-primary">National Intelligence Network</h1>
        <p className="text-body text-ink-tertiary mt-1">
          {states.length} states monitored · {((geoSumm?.totalPopulation || 0) / 1000000).toFixed(0)}M population covered · {providerSumm?.total || 0} provider types
        </p>
      </div>

      <div className="flex items-center gap-1 mb-6 bg-canvas border border-[#243444] rounded-xl p-1 w-fit overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors ${activeTab === t.id ? "bg-accent-indigo text-white" : "text-ink-secondary hover:text-ink-primary"}`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewTab states={states} activeStates={activeStates} partialStates={partialStates} plannedStates={plannedStates} geoSumm={geoSumm} providerSumm={providerSumm} health={health} kgStats={kgStats} histSumm={histSumm} />}
      {activeTab === "states" && <StatesTab states={states} />}
      {activeTab === "knowledge" && <KnowledgeTab />}
      {activeTab === "patterns" && <PatternsTab />}
      {activeTab === "validation" && <ValidationTab />}
    </div>
  );
}

function OverviewTab({ states, activeStates, partialStates, plannedStates, geoSumm, providerSumm, health, kgStats, histSumm }: any) {
  const nationalCoverage = states.length > 0 ? Math.round(states.reduce((s: number, z: any) => s + z.coveragePercentage, 0) / states.length) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "States", value: `${activeStates}+${partialStates}`, sub: `${plannedStates} planned`, icon: Globe, color: "text-accent-indigo" },
          { label: "Population", value: `${((geoSumm?.totalPopulation || 0) / 1000000).toFixed(0)}M`, sub: "covered", icon: MapPin, color: "text-accent-teal" },
          { label: "National Coverage", value: `${nationalCoverage}%`, sub: "avg across states", icon: Shield, color: nationalCoverage >= 50 ? "text-accent-teal" : "text-accent-amber" },
          { label: "Providers", value: `${providerSumm?.total || 0}`, sub: `${providerSumm?.active || 0} active`, icon: Server, color: "text-accent-indigo" },
          { label: "Avg Accuracy", value: `${histSumm?.avgAccuracy || 0}%`, sub: "historical", icon: Target, color: "text-accent-teal" },
          { label: "Health Score", value: `${health?.overall || 0}%`, sub: "platform", icon: Activity, color: (health?.overall || 0) >= 80 ? "text-accent-teal" : "text-accent-amber" },
        ].map((m) => (
          <div key={m.label} className="bg-surface border border-[#243444] rounded-xl p-4 text-center">
            <m.icon className={`w-4 h-4 ${m.color} mx-auto mb-1.5`} />
            <p className={`text-[18px] font-semibold ${m.color}`}>{m.value}</p>
            <p className="text-[11px] text-ink-tertiary">{m.label}</p>
            {m.sub && <p className="text-[10px] text-ink-tertiary">{m.sub}</p>}
          </div>
        ))}
      </div>

      <div className="bg-surface border border-[#243444] rounded-xl p-5">
        <h3 className="text-[14px] font-semibold text-ink-primary mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-accent-indigo" />United States Coverage Map
        </h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          {states.sort((a: any, b: any) => a.state.localeCompare(b.state)).map((s: any) => (
            <div key={s.id} className="relative group">
              <div className={`h-8 rounded-md ${STATUS_COLORS[s.healthStatus] || "bg-ink-wash"} flex items-center justify-center cursor-default transition-all hover:opacity-80`}>
                <span className="text-[10px] font-bold text-white">{s.state}</span>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10 bg-surface border border-[#243444] rounded-lg p-2 whitespace-nowrap shadow-lg">
                <p className="text-[11px] font-medium text-ink-primary">{s.name}</p>
                <p className="text-[10px] text-ink-tertiary">{s.coveragePercentage}% coverage · {(s.population / 1000000).toFixed(1)}M</p>
                <p className="text-[10px] text-ink-tertiary capitalize">{s.healthStatus} · {s.providerCount} providers</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[11px] text-ink-tertiary">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-teal" /> Active ({activeStates})</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-amber" /> Partial ({partialStates})</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-crimson/70" /> Limited</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-ink-wash" /> Planned ({plannedStates})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-[#243444] rounded-xl p-5">
          <h3 className="text-[14px] font-semibold text-ink-primary mb-4 flex items-center gap-2">
            <Network className="w-4 h-4 text-accent-indigo" />Knowledge Graph
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Nodes", value: kgStats?.nodeCount || 0 },
              { label: "Edges", value: kgStats?.edgeCount || 0 },
              { label: "Avg Correlation", value: `${kgStats?.avgCorrelationStrength || 0}%` },
              { label: "Avg Confidence", value: `${kgStats?.avgNodeConfidence || 0}%` },
            ].map((m) => (
              <div key={m.label} className="bg-canvas rounded-lg p-3 text-center">
                <p className="text-[16px] font-semibold text-ink-primary">{m.value}</p>
                <p className="text-[11px] text-ink-tertiary">{m.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1">
            {(kgStats?.nodeTypes || []).map((nt: any) => (
              <div key={nt.nodeType} className="flex items-center justify-between py-1">
                <span className="text-[11px] text-ink-secondary capitalize">{nt.nodeType?.replace(/_/g, " ")}</span>
                <span className="text-[11px] text-ink-primary font-medium">{nt.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-[#243444] rounded-xl p-5">
          <h3 className="text-[14px] font-semibold text-ink-primary mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-accent-indigo" />Historical Validation
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Confirmed", value: histSumm?.confirmed || 0, color: "text-accent-teal" },
              { label: "Partially Confirmed", value: histSumm?.partiallyConfirmed || 0, color: "text-accent-amber" },
              { label: "Pending", value: histSumm?.pending || 0, color: "text-ink-tertiary" },
              { label: "Avg Accuracy", value: `${histSumm?.avgAccuracy || 0}%`, color: "text-accent-teal" },
            ].map((m) => (
              <div key={m.label} className="bg-canvas rounded-lg p-3 text-center">
                <p className={`text-[16px] font-semibold ${m.color}`}>{m.value}</p>
                <p className="text-[11px] text-ink-tertiary">{m.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <p className="text-[11px] text-ink-tertiary mb-1">Avg Time to Impact: {histSumm?.avgTimeToImpact || 0} days</p>
            <p className="text-[11px] text-ink-tertiary">Avg Return Score: {histSumm?.avgReturnScore || 0}/100</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatesTab({ states }: { states: any[] }) {
  const [sortBy, setSortBy] = useState<"coverage" | "population">("coverage");
  const sorted = [...states].sort((a, b) => sortBy === "coverage" ? b.coveragePercentage - a.coveragePercentage : b.population - a.population);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1 bg-canvas border border-[#243444] rounded-lg p-0.5">
          {(["coverage", "population"] as const).map((s) => (
            <button key={s} onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium capitalize transition-colors ${sortBy === s ? "bg-accent-indigo text-white" : "text-ink-secondary"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-[#243444] rounded-xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_60px_80px_80px_80px_80px] gap-3 px-5 py-3 border-b border-[#243444] text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">
          <span>State</span><span>Status</span><span>Coverage</span><span>Population</span><span>Providers</span><span>Events</span>
        </div>
        <div className="divide-y divide-[#243444]/30 max-h-[600px] overflow-y-auto">
          {sorted.map((s) => (
            <div key={s.id} className="grid sm:grid-cols-[1fr_60px_80px_80px_80px_80px] gap-2 sm:gap-3 px-5 py-3 items-center hover:bg-canvas/20 transition-colors">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[s.healthStatus]}`} />
                <span className="text-[13px] font-medium text-ink-primary">{s.name}</span>
                <span className="text-[11px] text-ink-tertiary">{s.state}</span>
              </div>
              <span className={`text-[11px] capitalize ${s.healthStatus === "active" ? "text-accent-teal" : s.healthStatus === "partial" ? "text-accent-amber" : "text-ink-tertiary"}`}>{s.healthStatus}</span>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1.5 bg-canvas rounded-full overflow-hidden">
                  <div className="h-full bg-accent-indigo rounded-full" style={{ width: `${s.coveragePercentage}%` }} />
                </div>
                <span className="text-[11px] text-ink-secondary">{s.coveragePercentage}%</span>
              </div>
              <span className="text-[12px] text-ink-secondary">{(s.population / 1000000).toFixed(1)}M</span>
              <span className="text-[12px] text-ink-secondary">{s.providerCount}</span>
              <span className="text-[12px] text-ink-secondary">{s.totalEvents?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KnowledgeTab() {
  const { data: kgStats } = trpc.knowledgeGraph.stats.useQuery();
  const { data: correlations } = trpc.knowledgeGraph.correlations.useQuery();
  const corrs = correlations?.correlations || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Nodes", value: kgStats?.nodeCount || 0, icon: Database },
          { label: "Total Edges", value: kgStats?.edgeCount || 0, icon: Link2 },
          { label: "Avg Correlation", value: `${kgStats?.avgCorrelationStrength || 0}%`, icon: TrendingUp },
          { label: "Avg Confidence", value: `${kgStats?.avgNodeConfidence || 0}%`, icon: Shield },
        ].map((m) => (
          <div key={m.label} className="bg-surface border border-[#243444] rounded-xl p-4 text-center">
            <m.icon className="w-4 h-4 text-accent-indigo mx-auto mb-1.5" />
            <p className="text-[18px] font-semibold text-ink-primary">{m.value}</p>
            <p className="text-[11px] text-ink-tertiary">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-[#243444] rounded-xl p-5">
        <h3 className="text-[14px] font-semibold text-ink-primary mb-4">Infrastructure Correlations</h3>
        {corrs.length === 0 ? (
          <p className="text-[13px] text-ink-tertiary">No correlations found.</p>
        ) : (
          <div className="space-y-2">
            {corrs.slice(0, 15).map((c: any) => (
              <div key={c.id} className="flex items-center gap-3 py-2 border-b border-[#243444]/30 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[12px]">
                    <span className="text-ink-primary font-medium">{c.sourceLabel}</span>
                    <span className="text-[10px] text-ink-tertiary capitalize">({c.sourceType})</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className="h-px w-8 bg-accent-indigo/30" />
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${c.strength >= 85 ? "bg-accent-teal/10 text-accent-teal" : "bg-accent-amber/10 text-accent-amber"}`}>{c.strength}%</span>
                  <div className="h-px w-8 bg-accent-indigo/30" />
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center gap-1.5 text-[12px] justify-end">
                    <span className="text-[10px] text-ink-tertiary capitalize">({c.targetType})</span>
                    <span className="text-ink-primary font-medium">{c.targetLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PatternsTab() {
  const EXPANDED_PATTERNS = [
    { id: "residential_growth", name: "Residential Growth", description: "New residential construction clusters, subdivision approvals, population density shifts", accuracy: 89, matches: 24, confidence: 84, trend: "up" },
    { id: "commercial_growth", name: "Commercial Growth", description: "Office park expansions, retail corridor development, commercial permit clustering", accuracy: 92, matches: 31, confidence: 88, trend: "up" },
    { id: "industrial_growth", name: "Industrial Growth", description: "Warehouse district growth, manufacturing facility permits, logistics hub development", accuracy: 85, matches: 12, confidence: 80, trend: "stable" },
    { id: "mixed_use", name: "Mixed Use Development", description: "Live-work-play districts, zoning changes enabling mixed use, transit-oriented development", accuracy: 88, matches: 18, confidence: 83, trend: "up" },
    { id: "retail_expansion", name: "Retail Expansion", description: "Shopping center renovations, new retail permits, big-box store infrastructure", accuracy: 90, matches: 15, confidence: 85, trend: "stable" },
    { id: "healthcare", name: "Healthcare Expansion", description: "Hospital campus growth, medical office buildings, healthcare facility permits", accuracy: 87, matches: 9, confidence: 82, trend: "up" },
    { id: "school_construction", name: "School Construction", description: "New school campuses, expansion projects, educational facility improvements", accuracy: 93, matches: 7, confidence: 90, trend: "stable" },
    { id: "transportation", name: "Transportation Improvements", description: "Road widening, intersection upgrades, transit projects, bridge construction", accuracy: 94, matches: 22, confidence: 91, trend: "up" },
    { id: "utility_expansion", name: "Utility Expansion", description: "Water/sewer extensions, electrical upgrades, fiber optic deployment", accuracy: 91, matches: 28, confidence: 86, trend: "up" },
    { id: "data_center", name: "Data Center Development", description: "Hyperscale facility permits, power upgrades, cooling infrastructure", accuracy: 86, matches: 4, confidence: 81, trend: "stable" },
    { id: "logistics_hub", name: "Logistics Hub Development", description: "Distribution centers, intermodal facilities, rail yard expansions, freight corridors", accuracy: 88, matches: 11, confidence: 84, trend: "up" },
    { id: "retail_district", name: "Retail District Formation", description: "Entertainment districts, food halls, lifestyle centers, experiential retail", accuracy: 84, matches: 8, confidence: 79, trend: "stable" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Active Patterns", value: "12", icon: Activity },
          { label: "Avg Accuracy", value: `${Math.round(EXPANDED_PATTERNS.reduce((s, p) => s + p.accuracy, 0) / EXPANDED_PATTERNS.length)}%`, icon: Target, color: "text-accent-teal" },
          { label: "Total Matches", value: EXPANDED_PATTERNS.reduce((s, p) => s + p.matches, 0).toString(), icon: CheckCircle },
          { label: "Avg Confidence", value: `${Math.round(EXPANDED_PATTERNS.reduce((s, p) => s + p.confidence, 0) / EXPANDED_PATTERNS.length)}%`, icon: Zap, color: "text-accent-indigo" },
        ].map((m) => (
          <div key={m.label} className="bg-surface border border-[#243444] rounded-xl p-4 text-center">
            <m.icon className={`w-4 h-4 ${m.color || "text-accent-indigo"} mx-auto mb-1.5`} />
            <p className={`text-[18px] font-semibold ${m.color || "text-ink-primary"}`}>{m.value}</p>
            <p className="text-[11px] text-ink-tertiary">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {EXPANDED_PATTERNS.map((p) => {
          const Icon = PATTERN_ICONS[p.id] || Activity;
          return (
            <div key={p.id} className="bg-surface border border-[#243444] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-accent-indigo" />
                <span className="text-[13px] font-medium text-ink-primary">{p.name}</span>
              </div>
              <p className="text-[11px] text-ink-secondary mb-3">{p.description}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-ink-tertiary">Accuracy</span>
                    <span className={`text-[11px] font-medium ${p.accuracy >= 90 ? "text-accent-teal" : "text-accent-amber"}`}>{p.accuracy}%</span>
                  </div>
                  <div className="h-1.5 bg-canvas rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${p.accuracy >= 90 ? "bg-accent-teal" : p.accuracy >= 80 ? "bg-accent-amber" : "bg-accent-crimson"}`} style={{ width: `${p.accuracy}%` }} />
                  </div>
                </div>
                <span className="text-[10px] text-ink-tertiary flex-shrink-0">{p.matches} matches</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ValidationTab() {
  const { data: histSumm } = trpc.historicalValidation.summary.useQuery();
  const { data: histList } = trpc.historicalValidation.list.useQuery();
  const validations = histList?.validations || [];
  const byPattern = histSumm?.accuracyByPattern || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Tracked", value: histSumm?.total || 0, icon: Target },
          { label: "Confirmed", value: histSumm?.confirmed || 0, icon: CheckCircle, color: "text-accent-teal" },
          { label: "Avg Accuracy", value: `${histSumm?.avgAccuracy || 0}%`, icon: TrendingUp, color: "text-accent-teal" },
          { label: "Avg Time to Impact", value: `${histSumm?.avgTimeToImpact || 0}d`, icon: Clock, color: "text-accent-indigo" },
        ].map((m) => (
          <div key={m.label} className="bg-surface border border-[#243444] rounded-xl p-4 text-center">
            <m.icon className={`w-4 h-4 ${m.color || "text-accent-indigo"} mx-auto mb-1.5`} />
            <p className={`text-[18px] font-semibold ${m.color || "text-ink-primary"}`}>{m.value}</p>
            <p className="text-[11px] text-ink-tertiary">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-[#243444] rounded-xl p-5">
          <h3 className="text-[14px] font-semibold text-ink-primary mb-4">Accuracy by Pattern</h3>
          <div className="space-y-2">
            {byPattern.map((p: any) => (
              <div key={p.patternType} className="flex items-center gap-3">
                <span className="text-[11px] text-ink-secondary w-32 truncate capitalize flex-shrink-0">{p.patternType?.replace(/_/g, " ")}</span>
                <div className="flex-1 h-2.5 bg-canvas rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.avgAccuracy >= 90 ? "bg-accent-teal" : p.avgAccuracy >= 80 ? "bg-accent-amber" : "bg-accent-crimson"}`} style={{ width: `${p.avgAccuracy}%` }} />
                </div>
                <span className={`text-[11px] font-medium w-8 text-right ${p.avgAccuracy >= 90 ? "text-accent-teal" : p.avgAccuracy >= 80 ? "text-accent-amber" : "text-accent-crimson"}`}>{Math.round(p.avgAccuracy)}%</span>
                <span className="text-[10px] text-ink-tertiary w-4">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-[#243444] rounded-xl p-5">
          <h3 className="text-[14px] font-semibold text-ink-primary mb-4">Recent Validations</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {validations.slice(0, 10).map((v: any) => (
              <div key={v.id} className="py-2 border-b border-[#243444]/30 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${v.currentStatus === "confirmed_development" ? "bg-accent-teal" : v.currentStatus === "partially_confirmed" ? "bg-accent-amber" : "bg-ink-wash"}`} />
                  <span className="text-[12px] font-medium text-ink-primary capitalize">{v.patternType?.replace(/_/g, " ")}</span>
                  <span className="text-[10px] text-accent-indigo">{v.county}, {v.state}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 ml-3">
                  <span className="text-[10px] text-ink-tertiary capitalize">{v.currentStatus?.replace(/_/g, " ")}</span>
                  {v.accuracy && <span className="text-[10px] text-accent-teal">{v.accuracy}%</span>}
                  {v.infrastructureProgress && <span className="text-[10px] text-ink-tertiary">Infra: {v.infrastructureProgress}%</span>}
                  {v.developmentCompletion && <span className="text-[10px] text-ink-tertiary">Dev: {v.developmentCompletion}%</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
