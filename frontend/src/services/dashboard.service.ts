import axiosInstance from "@/lib/axios-instance";
import type { DashboardKPIs, ChartDataPoint } from "@/types";

export interface DashboardMetrics {
  kpis: DashboardKPIs;
  delivery_by_status: ChartDataPoint[];
  routes_last_7_days: ChartDataPoint[];
  deliveries_by_driver: ChartDataPoint[];
  recent_routes: Array<{
    id: string;
    name: string;
    status: string;
    total_distance_km: number;
    estimated_duration_min: number;
    created_at: string;
  }>;
}

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await axiosInstance.get<DashboardMetrics>("/dashboard");
    return response.data;
  },

  async getKPIs(): Promise<DashboardKPIs> {
    const response = await axiosInstance.get<DashboardKPIs>("/dashboard/kpis");
    return response.data;
  },
};
