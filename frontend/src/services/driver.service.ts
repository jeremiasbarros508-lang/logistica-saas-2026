import axiosInstance from "@/lib/axios-instance";
import type { Driver, DriverCreate, DriverUpdate, PaginatedResponse } from "@/types";

interface ListParams {
  page?: number;
  page_size?: number;
}

export async function listDrivers(params?: ListParams): Promise<PaginatedResponse<Driver>> {
  const response = await axiosInstance.get<PaginatedResponse<Driver>>("/drivers/", { params });
  return response.data;
}

export async function getDriver(id: string): Promise<Driver> {
  const response = await axiosInstance.get<Driver>(`/drivers/${id}`);
  return response.data;
}

export async function createDriver(data: DriverCreate): Promise<Driver> {
  const response = await axiosInstance.post<Driver>("/drivers/", data);
  return response.data;
}

export async function updateDriver(id: string, data: DriverUpdate): Promise<Driver> {
  const response = await axiosInstance.put<Driver>(`/drivers/${id}`, data);
  return response.data;
}

export async function deleteDriver(id: string): Promise<void> {
  await axiosInstance.delete(`/drivers/${id}`);
}
