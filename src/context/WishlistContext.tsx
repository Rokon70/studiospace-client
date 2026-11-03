"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface WishCtx {
  ids: string[];
  toggle: (studioId: string) => Promise<void>;
}
const WishlistContext = createContext<WishCtx>({ ids: [], toggle: async () => {} });

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const userId = user?.id;

  useEffect(() => {
    if (loading) return;
    if (!userId) {
      setIds([]);
      return;
    }
    api<string[]>("/wishlist").then(setIds).catch(() => {});
  }, [userId, loading]);

  const toggle = useCallback(
    async (studioId: string) => {
      if (!userId) {
        toast.error("Log in to save studios to your wishlist");
        return;
      }
      try {
        const r = await api<{ saved: boolean }>(`/wishlist/${studioId}`, { method: "POST" });
        setIds((p) => (r.saved ? [...p, studioId] : p.filter((x) => x !== studioId)));
        toast.success(r.saved ? "Studio saved to your wishlist" : "Studio removed from your wishlist");
      } catch (e) {
        toast.error((e as Error).message);
      }
    },
    [userId]
  );

  return <WishlistContext.Provider value={{ ids, toggle }}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
