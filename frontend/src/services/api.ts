import axiosInstance from "@/lib/axios-instance";
import type { PaginatedResponse } from "@/types";

export async function getList<T>(
  url: string,
  params?: Record<string, unknown>
): Promise<PaginatedResponse<T>> {
  const response = await axiosInstance.get<PaginatedResponse<T>>(url, { params });
  return response.data;
}

export async function getOne<T>(url: string): Promise<T> {
  const response = await axiosInstance.get<T>(url);
  return response.data;
}

export async function create<T, B = unknown>(url: string, body: B): Promise<T> {
  const response = await axiosInstance.post<T>(url, body);
  return response.data;
}

export async function update<T, B = unknown>(url: string, body: B): Promise<T> {
  const response = await axiosInstance.put<T>(url, body);
  return response.data;
}

export async function remove(url: string): Promise<void> {
  await axiosInstance.delete(url);
}
