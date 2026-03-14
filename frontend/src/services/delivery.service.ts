import axiosInstance from "@/lib/axios-instance";
import type { Delivery, DeliveryCreate, PaginatedResponse } from "@/types";

export interface DeliveryFilters {
  page?: number;
  per_page?: number;
  status?: string;
  priority?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export const deliveryService = {
  async list(filters: DeliveryFilters = {}): Promise<PaginatedResponse<Delivery>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, String(value));
      }
    });
    const response = await axiosInstance.get<PaginatedResponse<Delivery>>(
      `/deliveries?${params.toString()}`
    );
    return response.data;
  },

  async get(id: string): Promise<Delivery> {
    const response = await axiosInstance.get<Delivery>(`/deliveries/${id}`);
    return response.data;
  },

  async create(data: DeliveryCreate): Promise<Delivery> {
    const response = await axiosInstance.post<Delivery>("/deliveries", data);
    return response.data;
  },

  async update(id: string, data: Partial<DeliveryCreate>): Promise<Delivery> {
    const response = await axiosInstance.put<Delivery>(`/deliveries/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/deliveries/${id}`);
  },

  async importCSV(file: File): Promise<{ imported: number; errors: string[] }> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post<{ imported: number; errors: string[] }>(
      "/deliveries/import",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },
};
