/**
 * BuildSignal Demo Fixtures
 * Fallback data when Kestovar Engine is unavailable or in demo mode.
 */

export const demoSignals = [
  {
    id: "sig-001",
    title: "Apex Town Center Phase 2",
    description: "42-acre mixed-use development permit filed",
    location: "Apex, Wake County, NC",
    confidence: 92,
    stage: "advanced" as const,
    signals: 47,
    estimatedValue: 45000000,
  },
  {
    id: "sig-002",
    title: "Morrisville Station District",
    description: "Transit-adjacent commercial development site plan",
    location: "Morrisville, Wake County, NC",
    confidence: 78,
    stage: "developing" as const,
    signals: 31,
    estimatedValue: 28000000,
  },
  {
    id: "sig-003",
    title: "Duke Energy Regional Substation",
    description: "Major electrical infrastructure upgrade",
    location: "Durham County, NC",
    confidence: 85,
    stage: "active" as const,
    signals: 23,
    estimatedValue: 32000000,
  },
];

export const demoPatterns = [
  {
    id: "pat-001",
    name: "Transit-Oriented Development",
    description: "New transit infrastructure correlates with 3-5x permit filings within 0.5 miles within 12 months.",
    confidence: 94,
    evidence: 47,
    trend: "up" as const,
  },
  {
    id: "pat-002",
    name: "Utility Expansion Precedes Zoning",
    description: "Utility upgrade requests predict zoning changes 6-9 months in advance with 89% accuracy.",
    confidence: 89,
    evidence: 31,
    trend: "up" as const,
  },
  {
    id: "pat-003",
    name: "School Construction → Residential",
    description: "New school construction permits precede residential development by 8-14 months.",
    confidence: 91,
    evidence: 23,
    trend: "up" as const,
  },
];

export const demoProviders = [
  { id: "prov-001", name: "Wake County Permits", type: "Government", status: "active" as const, successRate: 99.5 },
  { id: "prov-002", name: "NC DOT Planning", type: "Government", status: "active" as const, successRate: 98.2 },
  { id: "prov-003", name: "Duke Energy Filings", type: "Commercial", status: "active" as const, successRate: 97.8 },
];
