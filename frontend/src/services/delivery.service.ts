import axiosInstance from "@/lib/axios-instance";
import type { Delivery, DeliveryCreate, DeliveryUpdate, PaginatedResponse } from "@/types";

interface ListParams {
  page?: number;
  page_size?: number;
  status?: string;
}

export async function listDeliveries(params?: ListParams): Promise<PaginatedResponse<Delivery>> {
  const response = await axiosInstance.get<PaginatedResponse<Delivery>>("/deliveries/", { params });
  return response.data;
}

export async function getDelivery(id: string): Promise<Delivery> {
  const response = await axiosInstance.get<Delivery>(`/deliveries/${id}`);
  return response.data;
}

export async function createDelivery(data: DeliveryCreate): Promise<Delivery> {
  const response = await axiosInstance.post<Delivery>("/deliveries/", data);
  return response.data;
}

export async function updateDelivery(id: string, data: DeliveryUpdate): Promise<Delivery> {
  const response = await axiosInstance.put<Delivery>(`/deliveries/${id}`, data);
  return response.data;
}

export async function deleteDelivery(id: string): Promise<void> {
  await axiosInstance.delete(`/deliveries/${id}`);
}

export async function importDeliveries(file: File): Promise<Delivery[]> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post<Delivery[]>("/deliveries/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}
