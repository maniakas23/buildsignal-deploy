export type StoreApi<T> = any;
export interface User { id: string; email: string; name: string; role: 'admin' | 'user'; orgId?: string; }
export interface Project { id: string; name: string; location: string; status: string; type: string; isFavorite: boolean; }
export interface Signal { id: string; projectId: string; type: string; confidence: number; }
export interface Pattern { id: string; name: string; description: string; confidence: number; maturity: number; status: string; }
export interface Alert { id: string; type: string; message: string; isAcknowledged: boolean; acknowledgedAt?: string; }
export interface Zone { id: string; name: string; signalCount: number; projectCount: number; sparklineData: number[]; }
export interface SurgeAlert { id: string; signalType: string; projectName: string; location: string; timestamp: string; scoreChange: number; }
export interface Summary { content: string; generatedAt: string; }
export interface AlertSettings { emailEnabled: boolean; pushEnabled: boolean; inappEnabled: boolean; scoreThreshold: number; surgeVelocity: number; quietHoursStart: string; quietHoursEnd: string; }
export type ProjectStatus = 'new' | 'reviewing' | 'qualified' | 'contacted' | 'active' | 'pursuing' | 'closed' | 'archived';
export type ProjectType = 'residential' | 'commercial' | 'industrial' | 'mixed-use' | 'infrastructure';
export interface DashboardMetrics { activeSignals: number; confidenceScore: number; recentSurges: SurgeAlert[]; zones: Zone[]; patterns: Pattern[]; summary: Summary | null; }
export interface Recommendation { id: number; title: string; description: string; category: string; confidence: number; relatedSignals: number; sourceCount: number; roi: number; why: string; sources: string[]; contributingSignals: any[]; riskFactors: any[]; nextAction: string; impact: string; lastUpdated: string; lifecycleStage?: string; completeness?: number; }
