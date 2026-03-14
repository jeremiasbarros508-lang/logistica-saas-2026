import axiosInstance from "@/lib/axios-instance";
import type { Route, RouteCreate, PaginatedResponse } from "@/types";

export interface RouteFilters {
  page?: number;
  per_page?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export const routeService = {
  async list(filters: RouteFilters = {}): Promise<PaginatedResponse<Route>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, String(value));
      }
    });
    const response = await axiosInstance.get<PaginatedResponse<Route>>(
      `/routes?${params.toString()}`
    );
    return response.data;
  },

  async get(id: string): Promise<Route> {
    const response = await axiosInstance.get<Route>(`/routes/${id}`);
    return response.data;
  },

  async generate(data: RouteCreate): Promise<Route> {
    const response = await axiosInstance.post<Route>("/routes/generate", data);
    return response.data;
  },

  async update(id: string, data: Partial<RouteCreate>): Promise<Route> {
    const response = await axiosInstance.put<Route>(`/routes/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/routes/${id}`);
  },

  async reoptimize(id: string): Promise<Route> {
    const response = await axiosInstance.post<Route>(`/routes/${id}/reoptimize`);
    return response.data;
  },
};
