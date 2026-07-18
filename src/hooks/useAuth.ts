import { useState, useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  orgId?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setUser({ id: '1', email, name: email.split('@')[0], role: 'user' });
      return true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return { user, isLoading, login, logout, isAuthenticated: !!user };
}
