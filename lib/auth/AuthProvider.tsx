"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi, type LoginInput, type SignupInput } from "@/lib/api/auth";
import type { ApiUser } from "@/lib/api/types";
import { tokenStore } from "@/lib/api/client";

interface AuthContextValue {
  user: ApiUser | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<ApiUser>;
  signup: (input: SignupInput) => Promise<ApiUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      // If a refresh-token cookie is present, this will issue a new access
      // token. If not, /me will 401 and we treat the user as logged-out.
      await authApi.refresh().catch(() => null);
      if (tokenStore.get()) {
        const me = await authApi.me();
        setUser(me.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (input: LoginInput) => {
    const session = await authApi.login(input);
    setUser(session.user);
    return session.user;
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    const session = await authApi.signup(input);
    setUser(session.user);
    return session.user;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      refresh,
      isAdmin: user?.role === "ADMIN" || user?.role === "STAFF",
    }),
    [user, loading, login, signup, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
