import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
  plan: string;
  organizationId?: number;
  isAdmin: boolean;
}

interface AuthInput {
  email: string;
  password: string;
}

interface RegisterInput extends AuthInput {
  name: string;
}

/**
 * Minimal tRPC v10 batch-protocol caller for unauthenticated auth procedures.
 * The React tRPC client requires a QueryClient/provider context, which is not
 * guaranteed inside this hook's consumers, so auth uses a direct fetch.
 */
async function trpcCall<T = unknown>(proc: string, input: unknown): Promise<T> {
  const res = await fetch(`/api/trpc/${proc}?batch=1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "0": { json: input } }),
  });
  const payload = await res.json().catch(() => null);
  const item = Array.isArray(payload) ? payload[0] : payload;
  if (item?.error) {
    throw new Error(item.error.message || "Request failed. Please try again.");
  }
  if (!res.ok) {
    throw new Error("Request failed. Please try again.");
  }
  return item?.result?.data as T;
}

async function fetchMe(token: string): Promise<User | null> {
  const res = await fetch("/api/auth.me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => null);
  return data?.user ?? null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<Error | null>(null);
  const [loginIsPending, setLoginIsPending] = useState(false);
  const [registerError, setRegisterError] = useState<Error | null>(null);
  const [registerIsPending, setRegisterIsPending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/auth.me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem("auth_token");
        }
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async ({ email, password }: AuthInput) => {
    setLoginIsPending(true);
    setLoginError(null);
    try {
      const data = await trpcCall<{ token?: string }>("auth.login", { email, password });
      if (!data?.token) {
        throw new Error("Invalid email or password. Please try again.");
      }
      localStorage.setItem("auth_token", data.token);
      const me = await fetchMe(data.token);
      if (me) setUser(me);
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Invalid email or password. Please try again.");
      setLoginError(e);
      throw e;
    } finally {
      setLoginIsPending(false);
    }
  };

  const register = async ({ name, email, password }: RegisterInput) => {
    setRegisterIsPending(true);
    setRegisterError(null);
    try {
      // auth.register creates the account but does not return a session token;
      // immediately authenticate so the customer lands signed in.
      await trpcCall("auth.register", { name, email, password });
      const data = await trpcCall<{ token?: string }>("auth.login", { email, password });
      if (data?.token) {
        localStorage.setItem("auth_token", data.token);
        const me = await fetchMe(data.token);
        if (me) setUser(me);
      }
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Something went wrong. Please try again.");
      setRegisterError(e);
      throw e;
    } finally {
      setRegisterIsPending(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    navigate("/login");
  };

  return {
    user,
    loading,
    isLoading: loading,
    isAuthenticated: !!user,
    logout,
    login,
    loginError,
    loginIsPending,
    register,
    registerError,
    registerIsPending,
  };
}
