import axiosInstance from "@/lib/axios-instance";

export interface KPIs {
  deliveries: {
    total: number;
    pending: number;
    in_route: number;
    delivered: number;
    problem: number;
  };
  routes: {
    total: number;
    completed: number;
    processing: number;
  };
  vehicles: {
    total: number;
    active: number;
  };
  drivers: {
    total: number;
    active: number;
  };
}

export interface Metrics {
  avg_route_distance_km: number;
  avg_optimization_score: number;
}

export interface ChartData {
  deliveries_by_status: { status: string; count: number }[];
}

export async function getKPIs(): Promise<KPIs> {
  const response = await axiosInstance.get<KPIs>("/dashboard/kpis");
  return response.data;
}

export async function getMetrics(): Promise<Metrics> {
  const response = await axiosInstance.get<Metrics>("/dashboard/metrics");
  return response.data;
}

export async function getChartData(): Promise<ChartData> {
  const response = await axiosInstance.get<ChartData>("/dashboard/chart-data");
  return response.data;
}
