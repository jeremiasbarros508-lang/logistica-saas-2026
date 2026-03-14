"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { routeService, type RouteFilters } from "@/services/route.service";
import type { Route, RouteCreate } from "@/types";

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchRoutes = useCallback(async (filters: RouteFilters = {}) => {
    setIsLoading(true);
    try {
      const data = await routeService.list(filters);
      setRoutes(data.items);
      setTotal(data.total);
    } catch {
      toast.error("Erro ao carregar rotas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateRoute = useCallback(async (data: RouteCreate) => {
    setIsGenerating(true);
    try {
      const route = await routeService.generate(data);
      toast.success("Rota gerada com sucesso!");
      return route;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || "Erro ao gerar rota");
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const deleteRoute = useCallback(async (id: string) => {
    try {
      await routeService.delete(id);
      toast.success("Rota excluída com sucesso!");
    } catch {
      toast.error("Erro ao excluir rota");
    }
  }, []);

  return {
    routes,
    total,
    isLoading,
    isGenerating,
    fetchRoutes,
    generateRoute,
    deleteRoute,
  };
}
