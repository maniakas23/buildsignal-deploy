import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ANALYTICS_ID = "custom"; // Set to "ga4-XXXXXXXX" to enable real GA4, or "custom" for local-only

interface AnalyticsEvent {
  event: string;
  path: string;
  timestamp: number;
  params?: Record<string, unknown>;
}

function getAnalyticsStore(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem("buildsignal_analytics");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function appendEvent(event: AnalyticsEvent) {
  try {
    const store = getAnalyticsStore();
    store.push(event);
    // Keep last 500 events
    if (store.length > 500) store.shift();
    localStorage.setItem("buildsignal_analytics", JSON.stringify(store));
  } catch {
    // localStorage may be unavailable
  }
}

function isGA4Enabled(): boolean {
  return ANALYTICS_ID.startsWith("ga4-");
}

function getGA4Id(): string {
  return ANALYTICS_ID.replace("ga4-", "");
}

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname + location.search;
    const event: AnalyticsEvent = {
      event: "page_view",
      path,
      timestamp: Date.now(),
      params: {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
      },
    };
    appendEvent(event);
    // eslint-disable-next-line no-console
    console.log("[Analytics] page_view", path);

    // If GA4 is enabled, send to gtag (requires real GA4 script in index.html)
    if (isGA4Enabled() && typeof window.gtag !== "undefined") {
      window.gtag("event", "page_view", {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
        send_to: getGA4Id(),
      });
    }
  }, [location]);
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  const event: AnalyticsEvent = {
    event: eventName,
    path: window.location.pathname,
    timestamp: Date.now(),
    params,
  };
  appendEvent(event);
  // eslint-disable-next-line no-console
  console.log("[Analytics] event", eventName, params);

  if (isGA4Enabled() && typeof window.gtag !== "undefined") {
    window.gtag("event", eventName, {
      send_to: getGA4Id(),
      ...params,
    });
  }
}

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
  }
}
