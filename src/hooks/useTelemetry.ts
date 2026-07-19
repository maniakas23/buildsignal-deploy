/**
 * Product Telemetry — tracks customer journey events for the Operations Center.
 * All events are stored locally and can be synced to the backend.
 *
 * Tracked events:
 * - homepage_cta_click    → CTA clicked on homepage
 * - signup_start          → User begins signup
 * - onboarding_step       → User completes onboarding step N
 * - onboarding_complete   → User finishes onboarding
 * - dashboard_view        → User views dashboard
 * - first_search          → User performs first search
 * - watchlist_create      → User creates a watchlist
 * - alert_create          → User creates an alert
 * - report_generate       → User generates a report
 * - map_interact          → User interacts with map
 * - opportunity_click     → User clicks an opportunity card
 * - feature_use           → Generic feature adoption tracking
 */

// ─── Event Types ───
export type TelemetryEventType =
  | 'homepage_cta_click'
  | 'signup_start'
  | 'signup_complete'
  | 'onboarding_step'
  | 'onboarding_complete'
  | 'onboarding_skip'
  | 'dashboard_view'
  | 'first_search'
  | 'watchlist_create'
  | 'watchlist_save_item'
  | 'alert_create'
  | 'alert_toggle'
  | 'report_generate'
  | 'report_download'
  | 'map_interact'
  | 'map_filter'
  | 'opportunity_click'
  | 'opportunity_expand'
  | 'opportunity_action'
  | 'feedback_submit'
  | 'feature_use'
  | 'page_view'
  | 'error';

interface TelemetryEvent {
  id: string;
  type: TelemetryEventType;
  timestamp: string;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

// ─── Constants ───
const STORAGE_KEY = 'buildsignal-telemetry';
const SESSION_KEY = 'buildsignal-session';
const MAX_EVENTS = 500;

// ─── Helpers ───
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getSessionId(): string {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = generateId();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function getStoredEvents(): TelemetryEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function storeEvents(events: TelemetryEvent[]) {
  try {
    const trimmed = events.slice(-MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage full — clear oldest 50%
    const half = events.slice(Math.floor(events.length / 2));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(half));
  }
}

// ─── Core Track Function ───
export function trackEvent(
  type: TelemetryEventType,
  metadata?: Record<string, unknown>
) {
  const event: TelemetryEvent = {
    id: generateId(),
    type,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    metadata,
  };

  const events = getStoredEvents();
  events.push(event);
  storeEvents(events);

  // Also log to console in development
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('[Telemetry]', type, metadata);
  }

  return event;
}

// ─── React Hook ───
export function useTelemetry() {
  const track = (type: TelemetryEventType, metadata?: Record<string, unknown>) => {
    trackEvent(type, metadata);
  };

  const getEvents = (type?: TelemetryEventType): TelemetryEvent[] => {
    const events = getStoredEvents();
    return type ? events.filter((e) => e.type === type) : events;
  };

  const getFunnelMetrics = () => {
    const events = getStoredEvents();
    const counts: Partial<Record<TelemetryEventType, number>> = {};
    for (const e of events) {
      counts[e.type] = (counts[e.type] || 0) + 1;
    }

    // Funnel stages
    const homepageViews = events.filter((e) => e.type === 'page_view' && e.metadata?.page === 'home').length;
    const ctaClicks = counts.homepage_cta_click || 0;
    const signupStarts = counts.signup_start || 0;
    const onboardingCompletes = counts.onboarding_complete || 0;
    const dashboardViews = counts.dashboard_view || 0;
    const firstSearches = counts.first_search || 0;
    const watchlistCreates = counts.watchlist_create || 0;
    const alertCreates = counts.alert_create || 0;
    const reportGenerates = counts.report_generate || 0;

    return {
      totalEvents: events.length,
      counts,
      funnel: {
        homepageViews,
        ctaClicks,
        signupStarts,
        onboardingCompletes,
        dashboardViews,
        firstSearches,
        watchlistCreates,
        alertCreates,
        reportGenerates,
      },
      conversionRates: {
        ctaToSignup: homepageViews > 0 ? Math.round((ctaClicks / homepageViews) * 100) : 0,
        signupToOnboarding: signupStarts > 0 ? Math.round((onboardingCompletes / signupStarts) * 100) : 0,
        onboardingToDashboard: onboardingCompletes > 0 ? Math.round((dashboardViews / onboardingCompletes) * 100) : 0,
        dashboardToSearch: dashboardViews > 0 ? Math.round((firstSearches / dashboardViews) * 100) : 0,
      },
      recentEvents: events.slice(-20).reverse(),
      sessionCount: new Set(events.map((e) => e.sessionId)).size,
    };
  };

  const clearEvents = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return { track, getEvents, getFunnelMetrics, clearEvents };
}

// ─── Convenience Hook for Page Views ───
export function usePageTelemetry(pageName: string) {
  useTelemetry().track('page_view', { page: pageName });
}
