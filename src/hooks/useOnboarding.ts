// useOnboarding hook — manages first-time user onboarding state

import { useState, useEffect, useCallback } from 'react';

const ONBOARDING_KEY = 'buildsignal_onboarding_complete';

export function useOnboarding() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      // Use requestAnimationFrame to avoid setState-in-effect warning
      requestAnimationFrame(() => setShow(true));
    }
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShow(false);
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY);
    setShow(true);
  }, []);

  return { show, dismiss, reset };
}
