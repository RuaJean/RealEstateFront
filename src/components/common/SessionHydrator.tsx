"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export default function SessionHydrator() {
  const { setSession } = useAuthStore();

  useEffect(() => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;
      const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
      const expiresAtUtc = typeof window !== "undefined" ? localStorage.getItem("expiresAtUtc") : null;
      if (accessToken || email || role || expiresAtUtc) {
        setSession({ accessToken, email, role, expiresAtUtc });
      }
    } catch (_) {
      // noop
    }
  }, [setSession]);

  return null;
}


