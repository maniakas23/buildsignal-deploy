import { useCallback, useState } from "react";
import { trpc } from "@/providers/trpc";

const TOKEN_KEY = "buildsignal_auth_token";

export function useAuth() {
  const [token, setTokenState] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const utils = trpc.useContext();

  const {
    data: user,
    isLoading,
    error,
  } = trpc.auth.me.useQuery(undefined, {
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Auto-clear token if auth.me returns null (invalid token)
  if (error?.data?.code === "UNAUTHORIZED" && token) {
    localStorage.removeItem(TOKEN_KEY);
    setTokenState(null);
    window.location.href = "/login";
  }

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem(TOKEN_KEY, data.token);
      setTokenState(data.token);
      utils.invalidate();
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem(TOKEN_KEY, data.token);
      setTokenState(data.token);
      utils.invalidate();
    },
  });

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setTokenState(null);
    utils.invalidate();
    window.location.href = "/login";
  }, [utils]);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.isAdmin || false;

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    loginIsPending: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    registerError: registerMutation.error,
    registerIsPending: registerMutation.isPending,
    logout,
  };
}
