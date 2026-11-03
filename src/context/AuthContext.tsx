"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({ user: null, loading: true, logout: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending } = authClient.useSession();
  const user = (data?.user as AuthUser | undefined) ?? null;
  const userId = user?.id ?? null;
  const [tokenFor, setTokenFor] = useState<string | null>(null);

  // Whenever a session exists, make sure the HTTPOnly JWT cookie exists too.
  useEffect(() => {
    if (!userId) {
      setTokenFor(null);
      return;
    }
    let cancelled = false;
    fetch("/api/token", { method: "POST", credentials: "include" })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setTokenFor(userId);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // "loading" stays true until the session AND the JWT cookie are ready.
  // This is what stops private routes from redirecting to /login on reload.
  const loading = isPending || (!!userId && tokenFor !== userId);

  const logout = useCallback(async () => {
    await fetch("/api/token", { method: "DELETE", credentials: "include" }).catch(() => {});
    await authClient.signOut();
  }, []);

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
