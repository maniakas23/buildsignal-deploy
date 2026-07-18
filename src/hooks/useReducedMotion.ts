import { useEffect } from 'react';

export function useReducedMotionClass() {
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => {
      document.documentElement.classList.toggle('reduce-motion', mql.matches);
    };
    handler();
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
}
