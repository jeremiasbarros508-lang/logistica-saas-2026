import axiosInstance from "@/lib/axios-instance";
import type { Vehicle, VehicleCreate, VehicleUpdate, PaginatedResponse } from "@/types";

interface ListParams {
  page?: number;
  page_size?: number;
}

export async function listVehicles(params?: ListParams): Promise<PaginatedResponse<Vehicle>> {
  const response = await axiosInstance.get<PaginatedResponse<Vehicle>>("/vehicles/", { params });
  return response.data;
}

export async function getVehicle(id: string): Promise<Vehicle> {
  const response = await axiosInstance.get<Vehicle>(`/vehicles/${id}`);
  return response.data;
}

export async function createVehicle(data: VehicleCreate): Promise<Vehicle> {
  const response = await axiosInstance.post<Vehicle>("/vehicles/", data);
  return response.data;
}

export async function updateVehicle(id: string, data: VehicleUpdate): Promise<Vehicle> {
  const response = await axiosInstance.put<Vehicle>(`/vehicles/${id}`, data);
  return response.data;
}

export async function deleteVehicle(id: string): Promise<void> {
  await axiosInstance.delete(`/vehicles/${id}`);
}
