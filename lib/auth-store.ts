import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { JwtUserPayload } from "@/types";
import { decodeJwtToken } from "./jwt-decode";


interface AuthState  {
    accessToken: string | null;
    refreshToken: string | null;
    user: JwtUserPayload | null;
    setTokens: (accessToken: string, refreshToken: string) => void;
    setAccessToken: (accessToken: string) => void;
    logout: () => void;
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setTokens: (accessToken, refreshToken) => {
        const user = decodeJwtToken(accessToken);
        Cookies.set("gearup_role", user?.role ?? "", { expires: 7 });
        Cookies.set("gearup_logged_in", "1", { expires: 7 });
        set({ accessToken, refreshToken, user });
      },

      setAccessToken: (accessToken) => {
        const user = decodeJwtToken(accessToken);
        set({ accessToken, user });
      },

      logout: () => {
        Cookies.remove("gearup_role");
        Cookies.remove("gearup_logged_in");
        set({ accessToken: null, refreshToken: null, user: null });
      },
    }),
    {
      name: "gearup-auth",
      partialize: (state) => ({ refreshToken: state.refreshToken }),
    }
  )
);