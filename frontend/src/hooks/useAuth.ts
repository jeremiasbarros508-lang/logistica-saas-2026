"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import * as authService from "@/services/auth.service";
import type { LoginRequest, RegisterRequest } from "@/types";
import { getErrorMessage } from "@/utils/api-error";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();

  const login = useCallback(
    async (data: LoginRequest) => {
      const tokens = await authService.login(data);
      const me = await authService.getMe();
      setAuth(me, tokens);
      router.push("/");
    },
    [setAuth, router]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      const tokens = await authService.register(data);
      const me = await authService.getMe();
      setAuth(me, tokens);
      router.push("/");
    },
    [setAuth, router]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // silently ignore logout errors
    } finally {
      storeLogout();
      router.push("/login");
    }
  }, [storeLogout, router]);

  return { user, isAuthenticated, login, register, logout, getErrorMessage };
}
