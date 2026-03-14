import axiosInstance from "@/lib/axios-instance";
import type { Route, RouteCreate, RouteUpdate, PaginatedResponse } from "@/types";

interface ListParams {
  page?: number;
  page_size?: number;
  status?: string;
}

export async function listRoutes(params?: ListParams): Promise<PaginatedResponse<Route>> {
  const response = await axiosInstance.get<PaginatedResponse<Route>>("/routes/", { params });
  return response.data;
}

export async function getRoute(id: string): Promise<Route> {
  const response = await axiosInstance.get<Route>(`/routes/${id}`);
  return response.data;
}

export async function createRoute(data: RouteCreate): Promise<Route> {
  const response = await axiosInstance.post<Route>("/routes/", data);
  return response.data;
}

export async function updateRoute(id: string, data: RouteUpdate): Promise<Route> {
  const response = await axiosInstance.put<Route>(`/routes/${id}`, data);
  return response.data;
}

export async function deleteRoute(id: string): Promise<void> {
  await axiosInstance.delete(`/routes/${id}`);
}

export async function optimizeRoute(id: string): Promise<Route> {
  const response = await axiosInstance.post<Route>(`/routes/${id}/optimize`);
  return response.data;
}
