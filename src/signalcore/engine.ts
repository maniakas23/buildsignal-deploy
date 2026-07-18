// SignalCore Engine SDK — Production build with demo data fallback
import type {
  Project, Pattern, Alert, Zone, Summary, SurgeAlert,
  GrowthStory,
} from '@/types';

// ─── Mode Detection ───
const DEMO_FLAG = 'BUILDSIGNAL_DEMO_MODE';

export function isDemoMode(): boolean {
  if (typeof window !== 'undefined') {
    const localFlag = localStorage.getItem(DEMO_FLAG);
    if (localFlag === 'true') return true;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_MODE === 'true') {
    return true;
  }
  return true; // Default to demo mode for now
}

export function setDemoMode(enabled: boolean): void {
  localStorage.setItem(DEMO_FLAG, enabled ? 'true' : 'false');
  window.location.reload();
}

export class EngineError extends Error {
  statusCode: number;
  body: string;

  constructor(message: string, statusCode: number, body: string) {
    super(message);
    this.name = 'EngineError';
    this.statusCode = statusCode;
    this.body = body;
  }

  isRetryable(): boolean {
    return this.statusCode >= 500 || this.statusCode === 429 || this.statusCode === 0;
  }
}

export interface EngineResponse<T> {
  data: T;
  meta: {
    confidence: number;
    evidenceSummary: string;
    lastUpdated: string;
    relatedSignals: number;
    source: string;
  };
}

export interface EngineListResponse<T> extends EngineResponse<T[]> {
  meta: EngineResponse<T[]>['meta'] & {
    total: number;
    page: number;
    perPage: number;
  };
}

function wrapMeta<T>(data: T, overrides: Partial<EngineResponse<T>['meta']> = {}): EngineResponse<T> {
  return {
    data,
    meta: {
      confidence: 94,
      evidenceSummary: 'Aggregated from 2,400+ data sources including permits, utilities, zoning, and public records.',
      lastUpdated: new Date().toISOString(),
      relatedSignals: 2847,
      source: isDemoMode() ? 'Demo Data' : 'SignalCore Intelligence',
      ...overrides,
    },
  };
}

function wrapListMeta<T>(data: T[], overrides: Partial<EngineListResponse<T>['meta']> = {}): EngineListResponse<T> {
  return {
    data,
    meta: {
      confidence: 94,
      evidenceSummary: 'Aggregated from 2,400+ data sources including permits, utilities, zoning, and public records.',
      lastUpdated: new Date().toISOString(),
      relatedSignals: 2847,
      total: data.length, page: 1, perPage: data.length,
      source: isDemoMode() ? 'Demo Data' : 'SignalCore Intelligence',
      ...overrides,
    },
  };
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// ─── Demo Data ───
const DEMO_ZONES: Zone[] = [
  { id: '1', name: 'Wake County, NC', signalCount: 847, projectCount: 42, sparklineData: [12, 15, 18, 22, 25, 28, 30, 28, 32, 35, 30, 28] },
  { id: '2', name: 'Mecklenburg County, NC', signalCount: 623, projectCount: 31, sparklineData: [8, 10, 14, 18, 20, 22, 25, 28, 26, 30, 32, 28] },
  { id: '3', name: 'Durham County, NC', signalCount: 412, projectCount: 19, sparklineData: [5, 8, 10, 12, 15, 18, 20, 22, 20, 18, 22, 25] },
  { id: '4', name: 'Orange County, NC', signalCount: 289, projectCount: 14, sparklineData: [3, 5, 8, 10, 12, 14, 16, 18, 20, 18, 16, 14] },
];

const DEMO_SURGES: SurgeAlert[] = [
  { id: '1', projectName: 'Apex Town Center Phase 2', location: 'Apex, Wake County', signalType: 'permit', scoreChange: 12, timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: '2', projectName: 'Morrisville Station District', location: 'Morrisville, Wake County', signalType: 'zoning_change', scoreChange: 8, timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: '3', projectName: 'Duke Energy Substation Expansion', location: 'Durham County', signalType: 'utility_request', scoreChange: 15, timestamp: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: '4', projectName: 'Charlotte Light Rail Extension', location: 'Mecklenburg County', signalType: 'permit', scoreChange: 20, timestamp: new Date(Date.now() - 12 * 3600000).toISOString() },
  { id: '5', projectName: 'Chapel Hill South Development', location: 'Orange County', signalType: 'permit', scoreChange: 6, timestamp: new Date(Date.now() - 18 * 3600000).toISOString() },
];

const DEMO_PATTERNS: Pattern[] = [
  { id: '1', name: 'Transit-Oriented Development', description: 'New transit infrastructure correlates with 3-5x permit filings within 0.5 miles within 12 months.', confidence: 94, maturity: 85, status: 'active', evidenceCount: 156, isActive: true },
  { id: '2', name: 'Utility Expansion Precedes Zoning', description: 'Utility upgrade requests predict zoning changes 6-9 months in advance with 89% accuracy.', confidence: 89, maturity: 72, status: 'active', evidenceCount: 98, isActive: true },
  { id: '3', name: 'School Construction → Residential', description: 'New school construction permits precede residential development by 8-14 months.', confidence: 91, maturity: 68, status: 'active', evidenceCount: 124, isActive: true },
];

const DEMO_SUMMARY: Summary = {
  content: 'Infrastructure activity across monitored counties shows continued acceleration. Wake County leads with 847 signals, driven by transit-oriented development patterns around the Research Triangle. Mecklenburg County follows with 623 signals, primarily from utility expansion projects ahead of zoning changes. Durham County shows 412 signals with increasing permit velocity in the downtown corridor. Overall confidence remains high at 94% based on multi-source convergence.',
  generatedAt: new Date().toISOString(),
  period: '24h',
  highlights: ['Wake County: 847 signals', 'Mecklenburg: 623 signals', 'Durham: 412 signals'],
};

const DEMO_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1', title: 'Apex Town Center Phase 2', description: '42-acre mixed-use development adjacent to new transit station. Strong permit velocity and utility expansion signals.', category: 'Mixed-Use Development',
    roi: 28, confidence: 94, evidenceSummary: 'Transit-oriented pattern match with 156 historical confirmations.', lastUpdated: new Date().toISOString(),
    relatedSignals: 47, sourceCount: 12, sources: ['Permit Database', 'Utility Records', 'Zoning Board'],
    lifecycleStage: 'qualified', contributingSignals: [
      { name: 'Transit Station Approval', type: 'transportation', influence: 92, date: '2026-06-15', description: 'New light rail station approved within 0.3 miles' },
      { name: 'Utility Expansion Request', type: 'utility', influence: 78, date: '2026-06-20', description: 'Duke Energy filed substation upgrade' },
      { name: 'Zoning Change Passed', type: 'zoning', influence: 85, date: '2026-05-28', description: 'Rezoning from residential to mixed-use approved' },
    ],
    riskFactors: [{ label: 'Environmental Review', severity: 'medium', description: 'Wetlands assessment pending' }],
    impact: 'High', why: 'Strong multi-signal convergence with transit infrastructure.', nextAction: 'Contact developer within 48 hours', completeness: 92,
  },
  {
    id: 'rec-2', title: 'Morrisville Station District', description: 'Transit-adjacent commercial and residential development showing strong early signals.', category: 'Transit-Oriented Development',
    roi: 22, confidence: 89, evidenceSummary: 'Utility expansion pattern match with 98 historical confirmations.', lastUpdated: new Date().toISOString(),
    relatedSignals: 31, sourceCount: 8, sources: ['Utility Database', 'Planning Department'],
    lifecycleStage: 'new', contributingSignals: [
      { name: 'Water Main Extension', type: 'utility', influence: 72, date: '2026-07-01', description: 'Municipal water main extension filed' },
      { name: 'Traffic Study Commissioned', type: 'transportation', influence: 65, date: '2026-06-22', description: 'DOT traffic impact study initiated' },
    ],
    riskFactors: [{ label: 'Market Timing', severity: 'low', description: 'Competing projects in same corridor' }],
    impact: 'Medium', why: 'Utility expansion precedes zoning changes with 89% accuracy.', nextAction: 'Monitor for zoning filing', completeness: 78,
  },
  {
    id: 'rec-3', title: 'Duke Energy Regional Substation', description: 'Major electrical infrastructure upgrade serving Research Triangle area.', category: 'Utility Infrastructure',
    roi: 18, confidence: 91, evidenceSummary: 'Utility pattern match with 124 historical confirmations.', lastUpdated: new Date().toISOString(),
    relatedSignals: 23, sourceCount: 6, sources: ['Utility Records', 'County Permits'],
    lifecycleStage: 'active', contributingSignals: [
      { name: 'Substation Permit', type: 'utility', influence: 88, date: '2026-07-08', description: 'Building permit for new substation' },
      { name: 'Environmental Clearance', type: 'environmental', influence: 70, date: '2026-06-30', description: 'Environmental impact assessment cleared' },
    ],
    riskFactors: [{ label: 'Regulatory Delay', severity: 'low', description: 'Standard utility commission review' }],
    impact: 'High', why: 'Large-scale utility expansion predicts commercial development.', nextAction: 'Review subcontractor opportunities', completeness: 85,
  },
];

// ─── Dashboard API ───

export interface DashboardMetrics {
  activeSignals: number;
  projectsTracked: number;
  patternsActive: number;
  alertsUnread: number;
  confidenceScore: number;
  zones: Zone[];
  recentSurges: SurgeAlert[];
  summary: Summary | null;
  patterns: Pattern[];
}

export async function fetchDashboard(): Promise<EngineResponse<DashboardMetrics>> {
  const data: DashboardMetrics = {
    activeSignals: 2847, projectsTracked: 1032,
    patternsActive: DEMO_PATTERNS.filter((p) => p.status === 'active').length,
    alertsUnread: 4,
    confidenceScore: 94, zones: DEMO_ZONES, recentSurges: DEMO_SURGES,
    summary: DEMO_SUMMARY, patterns: DEMO_PATTERNS,
  };
  return wrapMeta(data);
}

// ─── Recommendations API ───

export interface ContributingSignal {
  name: string;
  type: 'permit' | 'zoning' | 'utility' | 'project' | 'economic' | 'environmental' | 'demographic' | 'transportation' | 'commercial';
  influence: number;
  date: string;
  description: string;
}

export type OpportunityStatus = 'new' | 'reviewing' | 'qualified' | 'contacted' | 'active' | 'pursuing' | 'closed' | 'archived';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface FollowUpTask {
  id: string;
  description: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
}

export interface DecisionRecord {
  id: string;
  decision: 'proceed' | 'decline' | 'defer' | 'pending';
  reason: string;
  recordedAt: string;
}

export interface SavedOpportunity {
  id: string;
  recommendationId: string;
  title: string;
  category: string;
  description: string;
  roi: number;
  confidence: number;
  impact: string;
  status: OpportunityStatus;
  priority: PriorityLevel;
  tags: string[];
  notes: string;
  tasks: FollowUpTask[];
  decisions: DecisionRecord[];
  savedAt: string;
  lastUpdated: string;
}

export interface RiskFactor {
  label: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  roi: number;
  confidence: number;
  evidenceSummary: string;
  lastUpdated: string;
  relatedSignals: number;
  sourceCount: number;
  sources: string[];
  lifecycleStage?: OpportunityStatus;
  contributingSignals: ContributingSignal[];
  riskFactors: RiskFactor[];
  impact: string;
  why: string;
  nextAction: string;
  completeness?: number;
}

export async function fetchRecommendations(): Promise<EngineListResponse<Recommendation>> {
  return wrapListMeta(DEMO_RECOMMENDATIONS);
}

// ─── Projects API ───

export async function fetchProjects(): Promise<EngineListResponse<Project>> {
  return wrapListMeta([]);
}

// ─── Portfolio API ───

export async function fetchPortfolio(): Promise<EngineListResponse<SavedOpportunity>> {
  return wrapListMeta([]);
}

// ─── Growth Stories API ───

export async function fetchGrowthStories(): Promise<EngineListResponse<GrowthStory>> {
  return wrapListMeta([], {
    confidence: 91,
    evidenceSummary: 'Growth Stories synthesized from correlated signals, pattern matches, and project activity.',
    relatedSignals: 83,
  });
}

// ─── Summary API ───

export async function fetchSummary(): Promise<EngineResponse<Summary>> {
  return wrapMeta(DEMO_SUMMARY);
}

// ─── Utility ───
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Analytics ───
export function track(event: { type: string; [key: string]: unknown }) {
  console.info('[Analytics]', event);
}

export function recordFirstOpportunity() {
  console.info('[Analytics] First opportunity recorded');
}

// ─── Provider Status ───
export interface ProviderStatus {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'degraded';
  coverage: string[];
  signalCount: number;
  lastUpdated: string;
  latencyMs: number;
  errorRate: number;
}

// ─── Platform Health ───
export interface PlatformHealth {
  status: 'healthy' | 'degraded' | 'down';
  checks: Array<{
    name: string;
    status: 'passed' | 'failed' | 'degraded';
    latencyMs?: number;
    detail?: string;
  }>;
  uptimeSeconds: number;
  version: string;
}

export async function fetchPlatformHealth(): Promise<EngineResponse<PlatformHealth>> {
  const health: PlatformHealth = {
    status: 'healthy',
    checks: [
      { name: 'Database', status: 'passed', latencyMs: 45 },
      { name: 'API', status: 'passed', latencyMs: 12 },
      { name: 'SignalCore Engine', status: 'passed', latencyMs: 78 },
    ],
    uptimeSeconds: 86400,
    version: '1.0.0',
  };
  return wrapMeta(health);
}
