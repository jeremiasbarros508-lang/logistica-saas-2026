"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as deliveryService from "@/services/delivery.service";
import type { DeliveryCreate, DeliveryUpdate } from "@/types";

export const deliveryKeys = {
  all: ["deliveries"] as const,
  list: (params?: Record<string, unknown>) => [...deliveryKeys.all, "list", params] as const,
  detail: (id: string) => [...deliveryKeys.all, "detail", id] as const,
};

export function useDeliveries(params?: { page?: number; page_size?: number; status?: string }) {
  return useQuery({
    queryKey: deliveryKeys.list(params),
    queryFn: () => deliveryService.listDeliveries(params),
  });
}

export function useDelivery(id: string) {
  return useQuery({
    queryKey: deliveryKeys.detail(id),
    queryFn: () => deliveryService.getDelivery(id),
    enabled: !!id,
  });
}

export function useCreateDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DeliveryCreate) => deliveryService.createDelivery(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryKeys.all }),
  });
}

export function useUpdateDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DeliveryUpdate }) =>
      deliveryService.updateDelivery(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryKeys.all }),
  });
}

export function useDeleteDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deliveryService.deleteDelivery(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryKeys.all }),
  });
}

export function useImportDeliveries() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => deliveryService.importDeliveries(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryKeys.all }),
  });
}
