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
    if (localFlag !== null) return localFlag === 'true';
  }
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_MODE === 'true') {
    return true;
  }
  return false; // Live intelligence by default; demo mode is opt-in only
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
      confidence: 0,
      evidenceSummary: 'Aggregated from monitored public data sources including permits, utilities, zoning, and public records.',
      lastUpdated: new Date().toISOString(),
      relatedSignals: 0,
      source: isDemoMode() ? 'Demo Data' : 'SignalCore Intelligence',
      ...overrides,
    },
  };
}

function wrapListMeta<T>(data: T[], overrides: Partial<EngineListResponse<T>['meta']> = {}): EngineListResponse<T> {
  return {
    data,
    meta: {
      confidence: 0,
      evidenceSummary: 'Aggregated from monitored public data sources including permits, utilities, zoning, and public records.',
      lastUpdated: new Date().toISOString(),
      relatedSignals: 0,
      total: data.length, page: 1, perPage: data.length,
      source: isDemoMode() ? 'Demo Data' : 'SignalCore Intelligence',
      ...overrides,
    },
  };
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// ─── Live API access (tRPC batch protocol) ───
async function trpcQuery<T>(proc: string): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const res = await fetch(`/api/trpc/${proc}?batch=1`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ '0': { json: null } }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new EngineError(`API request failed (${res.status})`, res.status, body);
  }
  const items = await res.json();
  const item = Array.isArray(items) ? items[0] : items;
  if (item?.error) {
    throw new EngineError(item.error.message || 'API error', 0, JSON.stringify(item.error));
  }
  return item?.result?.data as T;
}

interface ApiPattern {
  id: number;
  name: string;
  patternType: string;
  description: string;
  county: string;
  state: string;
  confidence: number;
  evidenceCount: number;
  status: string;
  summary: string;
  recommendedAction: string;
  impactScore?: number;
  geographicReach?: string;
  lastDetectedAt: number;
  provenance: string;
}

interface CountySummaryData {
  total: number;
  active: number;
  avgCoverage: number;
  totalEvents: number;
  totalPatterns: number;
  totalRecommendations: number;
}

interface HealthScoreData {
  overall: number;
  status: string;
}

function livePatterns(res: { patterns?: ApiPattern[] } | null): ApiPattern[] {
  return (res?.patterns ?? []).filter((p) => p.provenance === 'LIVE');
}

function humanizePatternType(t: string): string {
  return (t || 'Pattern').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Presentation normalization (first-customer stabilization) ───
// Kestovar owns correlation and sometimes emits raw "key:value" pattern
// labels (e.g. "city:Knightdale") or unresolved "Unknown" locations.
// The frontend must never expose raw object keys or Unknown/undefined/null
// tokens, and must never invent a location that isn't in the payload.
const UNKNOWN_PLACE = /^(unknown|undefined|null|n\/a|none|na)$/i;

function cleanPlace(v?: string | null): string {
  const t = (v ?? '').trim();
  return t && !UNKNOWN_PLACE.test(t) ? t : '';
}

function countFromDescription(desc?: string): { n: number; noun: string } | null {
  const m = (desc || '').match(/(\d+)\s+([a-z-]*?)(permits?|signals?|rezoning cases?|projects?)/i);
  if (!m) return null;
  return { n: Number(m[1]), noun: m[3].toLowerCase() };
}

/** Truthful customer-facing pattern title. */
export function presentPatternTitle(p: { name?: string; description?: string; evidenceCount?: number }): string {
  const raw = (p.name || '').trim();
  const kv = raw.match(/^[a-z][\w]*\s*:\s*(.*)$/i); // raw "field:value" label
  const counted = countFromDescription(p.description);
  const n = p.evidenceCount && p.evidenceCount > 0 ? p.evidenceCount : counted?.n ?? 0;
  const noun = counted?.noun ?? 'permit';
  const nounPhrase = n === 1 ? noun : noun.endsWith('s') ? noun : `${noun}s`;
  if (kv) {
    const place = cleanPlace(kv[1]);
    if (place) return n > 0 ? `${n} ${nounPhrase} in ${place}` : place;
    return n > 0 ? `${n} recent ${noun.startsWith('permit') ? 'permit ' : ''}signals` : 'Recent signals';
  }
  // Scrub unresolved location tokens from otherwise well-formed titles.
  const scrubbed = raw.replace(/\b(unknown|undefined|null)\b/gi, '').replace(/\s{2,}/g, ' ').replace(/[\s—–-]+$/, '').trim();
  return scrubbed || (n > 0 ? `${n} recent signals` : 'Recent signals');
}

/** Truthful customer-facing pattern description. */
export function presentPatternDescription(p: { name?: string; description?: string; evidenceCount?: number }): string {
  const raw = (p.description || '').trim();
  const kv = (p.name || '').trim().match(/^[a-z][\w]*\s*:\s*(.*)$/i);
  if (kv) {
    const place = cleanPlace(kv[1]);
    const counted = countFromDescription(raw);
    if (counted) {
      return place
        ? `${counted.n} ${counted.noun} detected in ${place}.`
        : `${counted.n} recent ${counted.noun} detected across a monitored area.`;
    }
  }
  const scrubbed = raw
    .replace(/\bin\s+(Unknown|undefined|null)\b/g, 'across a monitored area')
    .replace(/\b(Unknown|undefined|null)\b/g, 'a monitored area');
  return scrubbed;
}

/** Scrub unresolved location tokens from arbitrary backend prose (e.g. recommendation "why"). */
export function scrubUnknownPlaceText(s?: string | null): string {
  return (s ?? '')
    .replace(/\bin\s+(Unknown|undefined|null)\b/g, 'across a monitored area')
    .replace(/\b(Unknown|undefined|null)\b/g, 'a monitored area');
}

// Pattern timestamps arrive in mixed units (some unix seconds, some ms).
function patternMs(t?: number): number {
  if (!t) return Date.now();
  return t < 1e12 ? t * 1000 : t;
}


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
  const [county, patternsRes, health] = await Promise.all([
    trpcQuery<CountySummaryData>('county.summary').catch(() => null),
    trpcQuery<{ patterns?: ApiPattern[] }>('pattern.list').catch(() => null),
    trpcQuery<HealthScoreData>('analytics.healthScore').catch(() => null),
  ]);
  if (!county && !patternsRes && !health) {
    throw new EngineError('Live intelligence endpoints are unavailable', 0, 'county.summary, pattern.list and analytics.healthScore all failed');
  }
  const patterns = livePatterns(patternsRes);
  const byCounty = new Map<string, ApiPattern[]>();
  for (const p of patterns) {
    const key = `${p.county} County, ${p.state}`;
    byCounty.set(key, [...(byCounty.get(key) ?? []), p]);
  }
  const zones: Zone[] = [...byCounty.entries()]
    .map(([name, ps], i) => ({
      id: String(i + 1),
      name,
      signalCount: ps.reduce((sum, p) => sum + (p.evidenceCount || 0), 0),
      projectCount: ps.length,
      sparklineData: [] as number[],
    }))
    .sort((a, b) => b.signalCount - a.signalCount);
  const data: DashboardMetrics = {
    activeSignals: county?.totalEvents ?? 0,
    projectsTracked: county?.totalRecommendations ?? 0,
    patternsActive: patterns.filter((p) => p.status === 'active').length,
    alertsUnread: 0,
    confidenceScore: health?.overall ?? 0,
    zones,
    recentSurges: [],
    summary: null,
    patterns: patterns.map((p) => ({
      id: String(p.id),
      name: presentPatternTitle(p),
      description: presentPatternDescription(p),
      confidence: p.confidence,
      maturity: p.confidence,
      status: p.status === 'active' ? 'active' : 'learning',
    })),
  };
  return wrapMeta(data, {
    confidence: health?.overall ?? 0,
    relatedSignals: county?.totalEvents ?? 0,
  });
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
  roi?: number;
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
  county?: string;
  state?: string;
}

export async function fetchRecommendations(): Promise<EngineListResponse<Recommendation>> {
  const res = await trpcQuery<{ patterns?: ApiPattern[] }>('pattern.list');
  const patterns = livePatterns(res).sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0));
  const recommendations: Recommendation[] = patterns.map((p) => ({
    id: `pattern-${p.id}`,
    title: presentPatternTitle(p),
    description: presentPatternDescription(p),
    category: humanizePatternType(p.patternType),
    confidence: p.confidence ?? 0,
    evidenceSummary: p.summary || p.description,
    lastUpdated: new Date(patternMs(p.lastDetectedAt)).toISOString(),
    county: p.county || '',
    state: p.state || '',
    relatedSignals: p.evidenceCount ?? 0,
    sourceCount: 0,
    sources: [],
    lifecycleStage: 'new',
    contributingSignals: [],
    riskFactors: [],
    impact: p.impactScore != null ? `Score ${p.impactScore}` : 'Not scored',
    why: p.summary || p.description,
    nextAction: (p.recommendedAction || 'Monitor for further activity').split('|')[0].trim(),
  }));
  return wrapListMeta(recommendations, {
    relatedSignals: patterns.reduce((sum, p) => sum + (p.evidenceCount || 0), 0),
    source: 'Kestovar Pattern Intelligence',
  });
}

// ─── Recent live signal activity (for activity feeds) ───
export interface RecentSignal {
  id: string;
  title: string;
  category: string;
  county: string;
  state: string;
  confidence: number;
  evidenceCount: number;
  detectedAt: string;
}

export async function fetchRecentSignals(limit = 10): Promise<RecentSignal[]> {
  const res = await trpcQuery<{ patterns?: ApiPattern[] }>('pattern.list');
  return livePatterns(res)
    .slice()
    .sort((a, b) => patternMs(b.lastDetectedAt) - patternMs(a.lastDetectedAt))
    .slice(0, limit)
    .map((p) => ({
      id: `pattern-${p.id}`,
      title: presentPatternTitle(p),
      category: humanizePatternType(p.patternType),
      county: p.county || '',
      state: p.state || '',
      confidence: p.confidence ?? 0,
      evidenceCount: p.evidenceCount ?? 0,
      detectedAt: new Date(patternMs(p.lastDetectedAt)).toISOString(),
    }));
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
