"use client";

import { useQuery } from "@tanstack/react-query";
import * as dashboardService from "@/services/dashboard.service";

export const dashboardKeys = {
  kpis: ["dashboard", "kpis"] as const,
  metrics: ["dashboard", "metrics"] as const,
  chartData: ["dashboard", "chart-data"] as const,
};

export function useKPIs() {
  return useQuery({
    queryKey: dashboardKeys.kpis,
    queryFn: dashboardService.getKPIs,
    refetchInterval: 60_000,
  });
}

export function useMetrics() {
  return useQuery({
    queryKey: dashboardKeys.metrics,
    queryFn: dashboardService.getMetrics,
  });
}

export function useChartData() {
  return useQuery({
    queryKey: dashboardKeys.chartData,
    queryFn: dashboardService.getChartData,
  });
}
