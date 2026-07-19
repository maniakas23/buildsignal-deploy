import { useCallback } from 'react';

export type TelemetryEventType =
  | 'page_view'
  | 'search_performed'
  | 'opportunity_viewed'
  | 'opportunity_saved'
  | 'report_generated'
  | 'alert_created'
  | 'alert_triggered'
  | 'map_explored'
  | 'filter_applied'
  | 'export_downloaded'
  | 'subscription_changed'
  | 'feedback_submitted'
  | 'tutorial_completed'
  | 'feature_used'
  | 'error_occurred'
  | 'api_latency'
  | 'session_start'
  | 'session_end'
  | 'onboarding_step'
  | 'conversion_event';

export interface TelemetryEvent {
  type: TelemetryEventType;
  timestamp: number;
  page?: string;
  metadata?: Record<string, unknown>;
}

const STORAGE_KEY = 'buildsignal_telemetry';
const MAX_EVENTS = 500;

function getEvents(): TelemetryEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveEvents(events: TelemetryEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // If quota exceeded, clear old events
    const trimmed = events.slice(-100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }
}

export function track(event: Omit<TelemetryEvent, 'timestamp'>) {
  const events = getEvents();
  events.push({
    ...event,
    timestamp: Date.now(),
  });

  // Trim to max
  if (events.length > MAX_EVENTS) {
    events.splice(0, events.length - MAX_EVENTS);
  }

  saveEvents(events);
}

export function trackPageView(page: string) {
  track({ type: 'page_view', page });
}

export function trackSearch(query: string, filters?: Record<string, unknown>) {
  track({ type: 'search_performed', metadata: { query, filters } });
}

export function trackOpportunityViewed(id: string, title: string) {
  track({ type: 'opportunity_viewed', metadata: { id, title } });
}

export function trackError(error: Error, context?: Record<string, unknown>) {
  track({
    type: 'error_occurred',
    metadata: {
      message: error.message,
      stack: error.stack,
      ...context,
    },
  });
}

export function getTelemetrySummary() {
  const events = getEvents();
  const now = Date.now();
  const dayAgo = now - 86400000;
  const weekAgo = now - 604800000;

  return {
    totalEvents: events.length,
    today: events.filter((e) => e.timestamp > dayAgo).length,
    thisWeek: events.filter((e) => e.timestamp > weekAgo).length,
    byType: events.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byPage: events.reduce((acc, e) => {
      if (e.page) {
        acc[e.page] = (acc[e.page] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    events,
  };
}

export function clearTelemetry() {
  localStorage.removeItem(STORAGE_KEY);
}

// React hook for tracking page views
export function useTelemetry() {
  const trackEvent = useCallback((event: Omit<TelemetryEvent, 'timestamp'>) => {
    track(event);
  }, []);

  const trackView = useCallback((page: string) => {
    trackPageView(page);
  }, []);

  return { track: trackEvent, trackPageView: trackView, getSummary: getTelemetrySummary };
}
