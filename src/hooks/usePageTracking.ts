import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

const GA_MEASUREMENT_ID = "G-BUILDSIGNAL";

/**
 * Track page views in Google Analytics 4 for SPA route changes.
 * Call this once at the top level of your app (inside Router).
 *
 * IMPORTANT: Replace G-BUILDSIGNAL with your real GA4 Measurement ID
 * in both this file and index.html.
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
        send_to: GA_MEASUREMENT_ID,
      });
    }
  }, [location]);
}

/**
 * Helper to send GA4 conversion events safely.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", eventName, {
      send_to: GA_MEASUREMENT_ID,
      ...params,
    });
  }
}
