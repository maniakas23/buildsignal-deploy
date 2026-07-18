// React hooks for SignalCore Engine data fetching
// Wraps Engine SDK calls with loading, error, and retry states.

import { useState, useEffect, useCallback, useRef } from 'react';
import type { EngineResponse, EngineListResponse, LoadingState } from '@/signalcore/engine';

interface UseEngineResult<T> {
  data: T | null;
  state: LoadingState;
  error: string | null;
  refetch: () => void;
  meta: EngineResponse<unknown>['meta'] | null;
}

export function useEngineQuery<T>(
  fetcher: () => Promise<EngineResponse<T>>,
  deps: unknown[] = []
): UseEngineResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [state, setState] = useState<LoadingState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<EngineResponse<unknown>['meta'] | null>(null);
  const isMounted = useRef(true);

  const fetch = useCallback(async () => {
    setState('loading');
    setError(null);
    try {
      const response = await fetcher();
      if (isMounted.current) {
        setData(response.data);
        setMeta(response.meta);
        setState('success');
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setState('error');
      }
    }
  }, [fetcher]);

  const refetch = useCallback(() => {
    setData(null);
    setMeta(null);
    fetch();
  }, [fetch]);

  useEffect(() => {
    isMounted.current = true;
    const timer = setTimeout(() => fetch(), 0);
    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, state, error, refetch, meta };
}

export function useEngineListQuery<T>(
  fetcher: () => Promise<EngineListResponse<T>>,
  deps: unknown[] = []
): UseEngineResult<T[]> {
  const [data, setData] = useState<T[] | null>(null);
  const [state, setState] = useState<LoadingState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<EngineResponse<unknown>['meta'] | null>(null);
  const isMounted = useRef(true);

  const fetch = useCallback(async () => {
    setState('loading');
    setError(null);
    try {
      const response = await fetcher();
      if (isMounted.current) {
        setData(response.data);
        setMeta(response.meta);
        setState('success');
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setState('error');
      }
    }
  }, [fetcher]);

  const refetch = useCallback(() => {
    setData(null);
    setMeta(null);
    fetch();
  }, [fetch]);

  useEffect(() => {
    isMounted.current = true;
    const timer = setTimeout(() => fetch(), 0);
    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, state, error, refetch, meta };
}
