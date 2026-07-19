import { useState, useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════
// PI-10: Health Check System
// Comprehensive API validation, workflow testing, and system status.
// ═══════════════════════════════════════════════════════════════

export interface HealthStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'checking';
  latency: number;
  lastChecked: number;
  message?: string;
}

export interface WorkflowCheck {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  duration: number;
  message?: string;
  dependencies?: string[];
}

const API_ENDPOINTS = [
  { name: 'Health Check', path: '/api/health', critical: true },
  { name: 'Version', path: '/api/version', critical: false },
  { name: 'Ready Check', path: '/api/ready', critical: true },
  { name: 'Auth Status', path: '/api/auth/status', critical: false },
  { name: 'Signals Feed', path: '/api/signals/list', critical: false },
  { name: 'Recommendations', path: '/api/recommendations/list', critical: false },
  { name: 'Zones', path: '/api/zones/list', critical: false },
  { name: 'Alerts', path: '/api/alerts/list', critical: false },
  { name: 'Patterns', path: '/api/patterns/list', critical: false },
  { name: 'Summary', path: '/api/summary', critical: false },
  { name: 'Search', path: '/api/search?q=test', critical: false },
  { name: 'Map Data', path: '/api/map/clusters', critical: false },
  { name: 'Provider Status', path: '/api/providers/status', critical: false },
  { name: 'Billing Info', path: '/api/billing/info', critical: false },
  { name: 'Settings', path: '/api/settings', critical: false },
];

const CUSTOMER_WORKFLOWS: Omit<WorkflowCheck, 'status' | 'duration' | 'message'>[] = [
  {
    id: 'homepage',
    name: 'Homepage Load',
    description: 'Marketing page renders with all sections',
    dependencies: ['/api/health'],
  },
  {
    id: 'signup',
    name: 'User Signup',
    description: 'Account creation flow completes',
    dependencies: ['/api/auth/status'],
  },
  {
    id: 'auth',
    name: 'Authentication',
    description: 'Login and session management works',
    dependencies: ['/api/auth/status'],
  },
  {
    id: 'onboarding',
    name: 'Onboarding Flow',
    description: 'New user setup completes successfully',
    dependencies: ['/api/settings'],
  },
  {
    id: 'dashboard',
    name: 'Dashboard Load',
    description: 'Dashboard with KPIs, recommendations, zones',
    dependencies: ['/api/signals/list', '/api/recommendations/list', '/api/zones/list'],
  },
  {
    id: 'parcel_search',
    name: 'Parcel Search',
    description: 'Search by county, signal type, confidence',
    dependencies: ['/api/search'],
  },
  {
    id: 'infrastructure_search',
    name: 'Infrastructure Search',
    description: 'Search utility, transportation, project signals',
    dependencies: ['/api/search'],
  },
  {
    id: 'maps',
    name: 'Interactive Map',
    description: 'Map renders clusters, filters, detail popups',
    dependencies: ['/api/map/clusters'],
  },
  {
    id: 'alerts',
    name: 'Alert Center',
    description: 'View, configure, and acknowledge alerts',
    dependencies: ['/api/alerts/list'],
  },
  {
    id: 'reports',
    name: 'Reports & Briefs',
    description: 'Generate and view intelligence reports',
    dependencies: ['/api/summary'],
  },
  {
    id: 'billing',
    name: 'Billing Management',
    description: 'View subscription, payment methods',
    dependencies: ['/api/billing/info'],
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Profile, notifications, preferences',
    dependencies: ['/api/settings'],
  },
  {
    id: 'support',
    name: 'Support Access',
    description: 'Help center, contact form, feedback',
    dependencies: ['/api/health'],
  },
];

async function checkEndpoint(name: string, path: string): Promise<HealthStatus> {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(path, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const latency = Math.round(performance.now() - start);

    if (response.ok) {
      return { name, status: 'healthy', latency, lastChecked: Date.now() };
    }
    if (response.status >= 500) {
      return { name, status: 'unhealthy', latency, lastChecked: Date.now(), message: `HTTP ${response.status}` };
    }
    return { name, status: 'degraded', latency, lastChecked: Date.now(), message: `HTTP ${response.status}` };
  } catch (err) {
    const latency = Math.round(performance.now() - start);
    const message = err instanceof Error ? err.name : 'Network error';
    return { name, status: 'unhealthy', latency, lastChecked: Date.now(), message };
  }
}

export function useHealthCheck(autoCheck = false, interval = 60000) {
  const [endpoints, setEndpoints] = useState<HealthStatus[]>(
    API_ENDPOINTS.map((e) => ({ name: e.name, status: 'checking', latency: 0, lastChecked: 0 }))
  );
  const [workflows, setWorkflows] = useState<WorkflowCheck[]>(
    CUSTOMER_WORKFLOWS.map((w) => ({ ...w, status: 'pending', duration: 0 }))
  );
  const [overall, setOverall] = useState<'healthy' | 'degraded' | 'unhealthy' | 'checking'>('checking');
  const [lastRun, setLastRun] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runCheck = useCallback(async () => {
    if (running) return;
    setRunning(true);

    // Check all endpoints in parallel
    const results = await Promise.all(
      API_ENDPOINTS.map((ep) => checkEndpoint(ep.name, ep.path))
    );
    setEndpoints(results);

    // Derive workflow status from endpoint health
    const endpointMap = new Map(results.map((r) => [API_ENDPOINTS.find((e) => e.name === r.name)?.path || '', r]));

    const workflowResults: WorkflowCheck[] = CUSTOMER_WORKFLOWS.map((wf) => {
      const start = performance.now();
      const deps = wf.dependencies || [];
      const depStatuses = deps.map((d) => endpointMap.get(d)?.status || 'unhealthy');
      const allHealthy = depStatuses.every((s) => s === 'healthy');
      const anyUnhealthy = depStatuses.some((s) => s === 'unhealthy');

      return {
        ...wf,
        status: allHealthy ? 'pass' : anyUnhealthy ? 'fail' : 'warning',
        duration: Math.round(performance.now() - start),
        message: anyUnhealthy
          ? `Failed dependency: ${deps.filter((d) => endpointMap.get(d)?.status !== 'healthy').join(', ')}`
          : undefined,
      };
    });
    setWorkflows(workflowResults);

    // Overall status
    const critical = results.filter((r) => API_ENDPOINTS.find((e) => e.name === r.name)?.critical);
    const allHealthy = results.every((r) => r.status === 'healthy');
    const criticalDown = critical.some((r) => r.status === 'unhealthy');
    const anyDegraded = results.some((r) => r.status === 'degraded');

    if (allHealthy) setOverall('healthy');
    else if (criticalDown) setOverall('unhealthy');
    else if (anyDegraded) setOverall('degraded');
    else setOverall('degraded');

    setLastRun(Date.now());
    setRunning(false);
  }, [running]);

  // Auto-check on mount and optionally on interval
  useEffect(() => {
    runCheck();
    if (autoCheck && interval > 0) {
      intervalRef.current = setInterval(runCheck, interval);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [autoCheck, interval, runCheck]);

  return {
    endpoints,
    workflows,
    overall,
    lastRun,
    running,
    runCheck,
    healthyCount: endpoints.filter((e) => e.status === 'healthy').length,
    degradedCount: endpoints.filter((e) => e.status === 'degraded').length,
    unhealthyCount: endpoints.filter((e) => e.status === 'unhealthy').length,
    workflowPassCount: workflows.filter((w) => w.status === 'pass').length,
    workflowFailCount: workflows.filter((w) => w.status === 'fail').length,
  };
}

export { API_ENDPOINTS, CUSTOMER_WORKFLOWS };
