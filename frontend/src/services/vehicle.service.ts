import axiosInstance from "@/lib/axios-instance";
import type { Vehicle, VehicleCreate, PaginatedResponse } from "@/types";

export const vehicleService = {
  async list(page = 1, perPage = 20): Promise<PaginatedResponse<Vehicle>> {
    const response = await axiosInstance.get<PaginatedResponse<Vehicle>>(
      `/vehicles?page=${page}&per_page=${perPage}`
    );
    return response.data;
  },

  async get(id: string): Promise<Vehicle> {
    const response = await axiosInstance.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },

  async create(data: VehicleCreate): Promise<Vehicle> {
    const response = await axiosInstance.post<Vehicle>("/vehicles", data);
    return response.data;
  },

  async update(id: string, data: Partial<VehicleCreate>): Promise<Vehicle> {
    const response = await axiosInstance.put<Vehicle>(`/vehicles/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/vehicles/${id}`);
  },
};
