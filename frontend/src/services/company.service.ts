import axiosInstance from "@/lib/axios-instance";
import type { Company } from "@/types";

export interface CompanyUpdate {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const companyService = {
  async getMe(): Promise<Company> {
    const response = await axiosInstance.get<Company>("/companies/me");
    return response.data;
  },

  async update(data: CompanyUpdate): Promise<Company> {
    const response = await axiosInstance.put<Company>("/companies/me", data);
    return response.data;
  },

  async uploadLogo(file: File): Promise<Company> {
    const formData = new FormData();
    formData.append("logo", file);
    const response = await axiosInstance.post<Company>("/companies/me/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
