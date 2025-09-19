"use client";
import { useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { login as loginApi, register as registerApi } from "@/services/auth.service";
import type { LoginRequest, RegisterRequest, AuthResponse } from "@/models/Auth";

export function useAuth() {
  const { accessToken, email, role, expiresAtUtc, setSession, clearSession } = useAuthStore();

  const login = useCallback(async (payload: LoginRequest): Promise<AuthResponse> => {
    const res = await loginApi(payload);
    setSession({
      accessToken: res.accessToken ?? null,
      email: res.email ?? null,
      role: res.role ?? null,
      expiresAtUtc: res.expiresAtUtc ?? null,
    });
    if (typeof document !== "undefined" && res.accessToken) {
      const isSecure = location.protocol === "https:";
      const token = encodeURIComponent(res.accessToken);
      const expires = res.expiresAtUtc ? `Expires=${new Date(res.expiresAtUtc).toUTCString()};` : "";
      const maxAge = res.expiresAtUtc ? "" : "Max-Age=86400;"; // 1 día por defecto si no viene expiración
      document.cookie = `accessToken=${token}; Path=/; ${expires} ${maxAge} SameSite=Lax; ${isSecure ? "Secure;" : ""}`.replace(/\s{2,}/g, " ").trim();
      const role = encodeURIComponent(res.role ?? "");
      document.cookie = `role=${role}; Path=/; ${expires} ${maxAge} SameSite=Lax; ${isSecure ? "Secure;" : ""}`.replace(/\s{2,}/g, " ").trim();
    }
    return res;
  }, [setSession]);

  const register = useCallback(async (payload: RegisterRequest): Promise<AuthResponse> => {
    const res = await registerApi(payload);
    setSession({
      accessToken: res.accessToken ?? null,
      email: res.email ?? null,
      role: res.role ?? null,
      expiresAtUtc: res.expiresAtUtc ?? null,
    });
    if (typeof document !== "undefined" && res.accessToken) {
      const isSecure = location.protocol === "https:";
      const token = encodeURIComponent(res.accessToken);
      const expires = res.expiresAtUtc ? `Expires=${new Date(res.expiresAtUtc).toUTCString()};` : "";
      const maxAge = res.expiresAtUtc ? "" : "Max-Age=86400;";
      document.cookie = `accessToken=${token}; Path=/; ${expires} ${maxAge} SameSite=Lax; ${isSecure ? "Secure;" : ""}`.replace(/\s{2,}/g, " ").trim();
      const role = encodeURIComponent(res.role ?? "");
      document.cookie = `role=${role}; Path=/; ${expires} ${maxAge} SameSite=Lax; ${isSecure ? "Secure;" : ""}`.replace(/\s{2,}/g, " ").trim();
    }
    return res;
  }, [setSession]);

  const logout = useCallback(() => {
    clearSession();
    if (typeof window !== "undefined") {
      // borrar cookie
      document.cookie = "accessToken=; Path=/; Max-Age=0; SameSite=Lax";
      document.cookie = "role=; Path=/; Max-Age=0; SameSite=Lax";
      window.location.href = "/login";
    }
  }, [clearSession]);

  const getToken = useCallback(() => accessToken, [accessToken]);

  return {
    accessToken,
    email,
    role,
    expiresAtUtc,
    login,
    register,
    logout,
    getToken,
  };
}


