import axiosInstance from "@/lib/axios-instance";
import type { Driver, DriverCreate, PaginatedResponse } from "@/types";

export const driverService = {
  async list(page = 1, perPage = 20): Promise<PaginatedResponse<Driver>> {
    const response = await axiosInstance.get<PaginatedResponse<Driver>>(
      `/drivers?page=${page}&per_page=${perPage}`
    );
    return response.data;
  },

  async get(id: string): Promise<Driver> {
    const response = await axiosInstance.get<Driver>(`/drivers/${id}`);
    return response.data;
  },

  async create(data: DriverCreate): Promise<Driver> {
    const response = await axiosInstance.post<Driver>("/drivers", data);
    return response.data;
  },

  async update(id: string, data: Partial<DriverCreate>): Promise<Driver> {
    const response = await axiosInstance.put<Driver>(`/drivers/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/drivers/${id}`);
  },
};
