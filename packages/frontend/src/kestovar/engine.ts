import { useState, useEffect } from "react";

// ─── Types ───
export interface SignalData {
  id: string;
  title: string;
  description: string;
  location: string;
  confidence: number;
  stage: "early" | "developing" | "advanced" | "awarded";
  projectType: string;
  signals: number;
  estimatedValue: number;
  firstDetected: string;
  sources: string[];
  patternMatch: string[];
  opportunityScore: number;
  recommendedAction: string;
}

export interface GrowthPattern {
  id: string;
  name: string;
  description: string;
  confidence: number;
  evidence: number;
  sectors: string[];
  locations: string[];
  trend: "up" | "stable" | "down";
  avgConfidence: number;
  historicalAccuracy: number;
  lastUpdated: string;
  signals: number;
}

export interface Provider {
  id: string;
  name: string;
  type: string;
  status: "active" | "paused" | "error";
  lastUpdate: string;
  recordsIngested: number;
  successRate: number;
  avgLatency: number;
  errors24h: number;
}

// ─── Default Data ───
const defaultSignals: SignalData[] = [
  {
    id: "sig-001",
    title: "Apex Town Center Phase 2",
    description: "42-acre mixed-use development permit filed. Strong permit velocity and utility expansion signals indicate significant upcoming construction activity.",
    location: "Apex, Wake County, NC",
    confidence: 92,
    stage: "advanced",
    projectType: "Mixed-Use Development",
    signals: 47,
    estimatedValue: 45_000_000,
    firstDetected: "2026-06-15",
    sources: ["Wake County Permits", "NC DOT", "Duke Energy"],
    patternMatch: ["Transit-Oriented Development", "Utility Expansion Precedes Zoning"],
    opportunityScore: 94,
    recommendedAction: "Contact developer immediately — zoning hearing scheduled",
  },
  {
    id: "sig-002",
    title: "Morrisville Station District",
    description: "Transit-adjacent commercial development showing strong early signals with consistent permit filing velocity.",
    location: "Morrisville, Wake County, NC",
    confidence: 78,
    stage: "developing",
    projectType: "Commercial/Retail",
    signals: 31,
    estimatedValue: 28_000_000,
    firstDetected: "2026-05-28",
    sources: ["Morrisville Planning", "GoTriangle"],
    patternMatch: ["Transit-Oriented Development"],
    opportunityScore: 76,
    recommendedAction: "Monitor for RFP release — expected within 60 days",
  },
  {
    id: "sig-003",
    title: "Duke Energy Regional Substation",
    description: "Major electrical infrastructure upgrade serving Research Triangle area. Multiple associated commercial permits detected.",
    location: "Durham County, NC",
    confidence: 85,
    stage: "active",
    projectType: "Infrastructure",
    signals: 23,
    estimatedValue: 32_000_000,
    firstDetected: "2026-04-10",
    sources: ["Duke Energy", "NC Utilities Commission"],
    patternMatch: ["Utility Expansion Precedes Zoning"],
    opportunityScore: 88,
    recommendedAction: "Bid on associated commercial electrical work",
  },
];

const defaultPatterns: GrowthPattern[] = [
  {
    id: "pat-001",
    name: "Transit-Oriented Development",
    description: "New transit infrastructure correlates with 3-5x permit filings within 0.5 miles within 12 months.",
    confidence: 94,
    evidence: 47,
    sectors: ["Mixed-Use", "Commercial", "Residential"],
    locations: ["Wake County, NC", "Mecklenburg County, NC"],
    trend: "up",
    avgConfidence: 89,
    historicalAccuracy: 0.94,
    lastUpdated: "2026-07-20",
    signals: 47,
  },
  {
    id: "pat-002",
    name: "Utility Expansion Precedes Zoning",
    description: "Utility upgrade requests predict zoning changes 6-9 months in advance with 89% accuracy.",
    confidence: 89,
    evidence: 31,
    sectors: ["Infrastructure", "Commercial"],
    locations: ["Wake County, NC", "Durham County, NC"],
    trend: "up",
    avgConfidence: 85,
    historicalAccuracy: 0.89,
    lastUpdated: "2026-07-20",
    signals: 31,
  },
  {
    id: "pat-003",
    name: "School Construction → Residential",
    description: "New school construction permits precede residential development by 8-14 months.",
    confidence: 91,
    evidence: 23,
    sectors: ["Residential", "Education"],
    locations: ["Wake County, NC", "Durham County, NC"],
    trend: "up",
    avgConfidence: 87,
    historicalAccuracy: 0.91,
    lastUpdated: "2026-07-20",
    signals: 23,
  },
];

const defaultProviders: Provider[] = [
  {
    id: "prov-001",
    name: "Wake County Permits",
    type: "Government",
    status: "active",
    lastUpdate: "2026-07-21T10:00:00Z",
    recordsIngested: 2847,
    successRate: 99.5,
    avgLatency: 120,
    errors24h: 0,
  },
  {
    id: "prov-002",
    name: "NC DOT Planning",
    type: "Government",
    status: "active",
    lastUpdate: "2026-07-21T09:30:00Z",
    recordsIngested: 1923,
    successRate: 98.2,
    avgLatency: 200,
    errors24h: 1,
  },
  {
    id: "prov-003",
    name: "Duke Energy Filings",
    type: "Commercial",
    status: "active",
    lastUpdate: "2026-07-21T08:00:00Z",
    recordsIngested: 1456,
    successRate: 97.8,
    avgLatency: 350,
    errors24h: 2,
  },
];

// ─── Analytics Types ───
export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface ConfidenceDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface GeographicInsight {
  region: string;
  signals: number;
  avgConfidence: number;
  topPatterns: string[];
  growth: number;
}

export interface ProviderPerformance {
  provider: string;
  uptime: number;
  avgLatency: number;
  recordsIngested: number;
  errorRate: number;
  trend: "up" | "stable" | "down";
}

export interface PipelineMetrics {
  processedToday: number;
  processedThisWeek: number;
  processedThisMonth: number;
  avgProcessingTime: number;
  queueDepth: number;
  successRate: number;
}

// ─── Hook ───
export function useKestovarData() {
  const [signals, setSignals] = useState<SignalData[]>(defaultSignals);
  const [patterns, setPatterns] = useState<GrowthPattern[]>(defaultPatterns);
  const [providers, setProviders] = useState<Provider[]>(defaultProviders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
          setSignals(defaultSignals);
          setPatterns(defaultPatterns);
          setProviders(defaultProviders);
          return;
        }

        const resp = await fetch(`${apiUrl}/v1/signals`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        if (data.signals?.length > 0) setSignals(data.signals);

        const patResp = await fetch(`${apiUrl}/v1/patterns`);
        if (patResp.ok) {
          const patData = await patResp.json();
          if (patData.patterns?.length > 0) setPatterns(patData.patterns);
        }

        const provResp = await fetch(`${apiUrl}/v1/providers`);
        if (provResp.ok) {
          const provData = await provResp.json();
          if (provData.providers?.length > 0) setProviders(provData.providers);
        }
      } catch (err: any) {
        console.warn("[Kestovar] Using fallback data:", err.message);
        setSignals(defaultSignals);
        setPatterns(defaultPatterns);
        setProviders(defaultProviders);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { signals, patterns, providers, loading, error };
}

export { defaultSignals, defaultPatterns, defaultProviders };
