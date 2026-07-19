import { useEffect, useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// PI-10: Core Web Vitals & Performance Monitoring
// Tracks CLS, FID, FCP, LCP, TTFB, and custom API latencies.
// ═══════════════════════════════════════════════════════════════

export interface WebVitals {
  cls: number | null;
  fcp: number | null;
  lcp: number | null;
  ttfb: number | null;
  fid: number | null;
  inp: number | null;
}

export interface ApiLatency {
  endpoint: string;
  method: string;
  duration: number;
  timestamp: number;
  success: boolean;
}

const STORAGE_KEY = 'buildsignal_performance';
const MAX_LATENCY_ENTRIES = 200;

function loadStored(): { vitals: WebVitals; latencies: ApiLatency[] } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return {
    vitals: { cls: null, fcp: null, lcp: null, ttfb: null, fid: null, inp: null },
    latencies: [],
  };
}

function saveStored(vitals: WebVitals, latencies: ApiLatency[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ vitals, latencies: latencies.slice(-MAX_LATENCY_ENTRIES) }));
  } catch { /* quota exceeded — ignore */ }
}

export function usePerformanceMonitor() {
  const stored = loadStored();
  const [vitals, setVitals] = useState<WebVitals>(stored.vitals);
  const [latencies, setLatencies] = useState<ApiLatency[]>(stored.latencies);
  const [apiStats, setApiStats] = useState({
    avgLatency: 0,
    p95Latency: 0,
    errorRate: 0,
    totalCalls: 0,
  });

  // Compute API stats from latencies
  useEffect(() => {
    if (latencies.length === 0) return;
    const durations = latencies.map((l) => l.duration).sort((a, b) => a - b);
    const avg = Math.round(durations.reduce((s, d) => s + d, 0) / durations.length);
    const p95Idx = Math.floor(durations.length * 0.95);
    const p95 = durations[Math.min(p95Idx, durations.length - 1)];
    const errors = latencies.filter((l) => !l.success).length;
    setApiStats({
      avgLatency: avg,
      p95Latency: p95,
      errorRate: Math.round((errors / latencies.length) * 100),
      totalCalls: latencies.length,
    });
  }, [latencies]);

  // Track Core Web Vitals
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('PerformanceObserver' in window)) return;

    const updatedVitals = { ...vitals };
    let clsScore = 0;

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        if (lastEntry) {
          updatedVitals.lcp = Math.round(lastEntry.startTime);
          setVitals((v) => ({ ...v, lcp: updatedVitals.lcp }));
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] as unknown as undefined });
    } catch { /* LCP not supported */ }

    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0] as PerformanceEntry & { startTime: number };
        if (firstEntry) {
          updatedVitals.fcp = Math.round(firstEntry.startTime);
          setVitals((v) => ({ ...v, fcp: updatedVitals.fcp }));
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] as unknown as undefined });
    } catch { /* paint not supported */ }

    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutEntry = entry as unknown as { hadRecentInput: boolean; value: number };
          if (!layoutEntry.hadRecentInput) {
            clsScore += layoutEntry.value;
            updatedVitals.cls = Math.round(clsScore * 1000) / 1000;
            setVitals((v) => ({ ...v, cls: updatedVitals.cls }));
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] as unknown as undefined });
    } catch { /* layout-shift not supported */ }

    try {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (navEntry) {
        updatedVitals.ttfb = Math.round(navEntry.responseStart);
        setVitals((v) => ({ ...v, ttfb: updatedVitals.ttfb }));
      }
    } catch { /* navigation timing not supported */ }

    const handleUnload = () => saveStored(updatedVitals, latencies);
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      saveStored(updatedVitals, latencies);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Record API latency
  const recordLatency = useCallback((endpoint: string, method: string, duration: number, success: boolean) => {
    setLatencies((prev) => {
      const updated = [...prev, { endpoint, method, duration, timestamp: Date.now(), success }];
      if (updated.length > MAX_LATENCY_ENTRIES) updated.shift();
      return updated;
    });
  }, []);

  // Helper: fetch with automatic latency tracking
  const trackedFetch = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const start = performance.now();
      const endpoint = typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url;
      const method = init?.method || 'GET';
      try {
        const response = await fetch(input, init);
        recordLatency(endpoint, method, Math.round(performance.now() - start), response.ok);
        return response;
      } catch (error) {
        recordLatency(endpoint, method, Math.round(performance.now() - start), false);
        throw error;
      }
    },
    [recordLatency]
  );

  return {
    vitals,
    latencies,
    apiStats,
    recordLatency,
    trackedFetch,
  };
}
