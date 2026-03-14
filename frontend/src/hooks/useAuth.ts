"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import type { LoginRequest, RegisterRequest } from "@/types";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, login, logout: storeLogout, setLoading } = useAuthStore();

  const handleLogin = useCallback(
    async (data: LoginRequest) => {
      setLoading(true);
      try {
        const { tokens, user: userData } = await authService.login(data);
        login(tokens.access_token, tokens.refresh_token, userData);
        toast.success("Login realizado com sucesso!");
        router.push("/");
      } catch (error: unknown) {
        const err = error as { response?: { data?: { detail?: string } } };
        toast.error(err.response?.data?.detail || "Erro ao fazer login");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [login, router, setLoading]
  );

  const handleRegister = useCallback(
    async (data: RegisterRequest) => {
      setLoading(true);
      try {
        const { tokens, user: userData } = await authService.register(data);
        login(tokens.access_token, tokens.refresh_token, userData);
        toast.success("Conta criada com sucesso!");
        router.push("/");
      } catch (error: unknown) {
        const err = error as { response?: { data?: { detail?: string } } };
        toast.error(err.response?.data?.detail || "Erro ao criar conta");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [login, router, setLoading]
  );

  const handleLogout = useCallback(async () => {
    await authService.logout();
    storeLogout();
    router.push("/login");
  }, [storeLogout, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}
