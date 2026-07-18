import { useState } from 'react';
export function useEngineQuery<T>(fn: () => Promise<T>, deps: any[]) {
  const [data, setData] = useState<T | null>(null);
  const [state] = useState<'loading' | 'success' | 'error'>('success');
  return { data, state, error: null, refetch: () => {} };
}
export function useEngineListQuery<T>(fn: () => Promise<T[]>, deps: any[]) {
  const [data] = useState<T[]>([]);
  const [state] = useState<'loading' | 'success' | 'error'>('success');
  return { data, state, error: null, refetch: () => {} };
}
