import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  expiresAtUtc: string | null;
  email: string | null;
  role: string | null;
};

type AuthActions = {
  setSession: (session: Partial<AuthState>) => void;
  clearSession: () => void;
};

const initialState: AuthState = {
  accessToken: null,
  expiresAtUtc: null,
  email: null,
  role: null,
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,
  setSession: (session) =>
    set((state) => {
      const next = { ...state, ...session };
      if (typeof window !== "undefined") {
        if (next.accessToken) localStorage.setItem("accessToken", next.accessToken);
        if (next.expiresAtUtc) localStorage.setItem("expiresAtUtc", next.expiresAtUtc);
        if (next.email) localStorage.setItem("email", next.email);
        if (next.role) localStorage.setItem("role", next.role);
      }
      return next;
    }),
  clearSession: () =>
    set(() => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("expiresAtUtc");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
      }
      return { ...initialState };
    }),
}));


