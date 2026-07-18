import { useCallback, useRef } from 'react';

type TrackEvent = {
  type: 'page_view' | 'click' | 'search' | 'filter' | 'export' | 'error';
  page?: string;
  target?: string;
  metadata?: Record<string, unknown>;
};

export function useAnalytics() {
  const queue = useRef<TrackEvent[]>([]);

  const track = useCallback((event: TrackEvent) => {
    queue.current.push({ ...event, metadata: { ...event.metadata, t: Date.now() } });
    if (queue.current.length > 50) queue.current = queue.current.slice(-50);
    if (typeof window !== 'undefined' && (window as any).bsTrack) {
      (window as any).bsTrack(event);
    }
  }, []);

  return { track };
}

export function track(event: TrackEvent) {
  if (typeof window !== 'undefined' && (window as any).bsTrack) {
    (window as any).bsTrack(event);
  }
}

export function recordFirstOpportunity() { }
