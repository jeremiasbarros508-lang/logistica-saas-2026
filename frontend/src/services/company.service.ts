import axiosInstance from "@/lib/axios-instance";
import type { Company, CompanyUpdate } from "@/types";

export async function getMyCompany(): Promise<Company> {
  const response = await axiosInstance.get<Company>("/companies/me");
  return response.data;
}

export async function updateMyCompany(data: CompanyUpdate): Promise<Company> {
  const response = await axiosInstance.put<Company>("/companies/me", data);
  return response.data;
}
