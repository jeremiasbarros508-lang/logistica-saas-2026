"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { deliveryService, type DeliveryFilters } from "@/services/delivery.service";
import type { Delivery, DeliveryCreate } from "@/types";

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDeliveries = useCallback(async (filters: DeliveryFilters = {}) => {
    setIsLoading(true);
    try {
      const data = await deliveryService.list(filters);
      setDeliveries(data.items);
      setTotal(data.total);
    } catch {
      toast.error("Erro ao carregar entregas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDelivery = useCallback(async (data: DeliveryCreate) => {
    try {
      const delivery = await deliveryService.create(data);
      toast.success("Entrega criada com sucesso!");
      return delivery;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || "Erro ao criar entrega");
      throw error;
    }
  }, []);

  const updateDelivery = useCallback(async (id: string, data: Partial<DeliveryCreate>) => {
    try {
      const delivery = await deliveryService.update(id, data);
      toast.success("Entrega atualizada com sucesso!");
      return delivery;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || "Erro ao atualizar entrega");
      throw error;
    }
  }, []);

  const deleteDelivery = useCallback(async (id: string) => {
    try {
      await deliveryService.delete(id);
      toast.success("Entrega excluída com sucesso!");
    } catch {
      toast.error("Erro ao excluir entrega");
    }
  }, []);

  return {
    deliveries,
    total,
    isLoading,
    fetchDeliveries,
    createDelivery,
    updateDelivery,
    deleteDelivery,
  };
}
