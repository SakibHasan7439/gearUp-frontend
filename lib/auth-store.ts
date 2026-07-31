import { create } from "zustand";
import { persist } from "zustand/middleware";
import { JwtUserPayload } from "@/types";

interface AuthState {
  user: JwtUserPayload | null;
  setUser: (user: JwtUserPayload) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "gearup-auth",
    }
  )
);