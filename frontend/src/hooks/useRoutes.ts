"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as routeService from "@/services/route.service";
import type { RouteCreate, RouteUpdate } from "@/types";

export const routeKeys = {
  all: ["routes"] as const,
  list: (params?: Record<string, unknown>) => [...routeKeys.all, "list", params] as const,
  detail: (id: string) => [...routeKeys.all, "detail", id] as const,
};

export function useRoutes(params?: { page?: number; page_size?: number; status?: string }) {
  return useQuery({
    queryKey: routeKeys.list(params),
    queryFn: () => routeService.listRoutes(params),
  });
}

export function useRoute(id: string) {
  return useQuery({
    queryKey: routeKeys.detail(id),
    queryFn: () => routeService.getRoute(id),
    enabled: !!id,
  });
}

export function useCreateRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RouteCreate) => routeService.createRoute(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: routeKeys.all }),
  });
}

export function useUpdateRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RouteUpdate }) =>
      routeService.updateRoute(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: routeKeys.all }),
  });
}

export function useDeleteRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => routeService.deleteRoute(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: routeKeys.all }),
  });
}
