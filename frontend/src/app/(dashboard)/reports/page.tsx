"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKPIs, useMetrics } from "@/hooks/useDashboard";
import { DeliveryChart } from "@/components/charts/DeliveryChart";
import { RouteStatsChart } from "@/components/charts/RouteStatsChart";
import { EfficiencyGauge } from "@/components/charts/EfficiencyGauge";

export default function ReportsPage() {
  const { data: kpis } = useKPIs();
  const { data: metrics } = useMetrics();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
        <p className="text-sm text-muted-foreground">Análise de desempenho da operação</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DeliveryChart />
        <EfficiencyGauge />
        <RouteStatsChart />
        <Card>
          <CardHeader><CardTitle className="text-base">Resumo Geral</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Total Entregas</span><span className="font-medium">{kpis?.deliveries.total ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Entregas Concluídas</span><span className="font-medium text-green-600">{kpis?.deliveries.delivered ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Entregas c/ Problema</span><span className="font-medium text-red-600">{kpis?.deliveries.problem ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Rotas</span><span className="font-medium">{kpis?.routes.total ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Rotas Concluídas</span><span className="font-medium">{kpis?.routes.completed ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Distância Média</span><span className="font-medium">{metrics?.avg_route_distance_km.toFixed(1) ?? 0} km</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Score Médio</span><span className="font-medium">{metrics?.avg_optimization_score.toFixed(1) ?? 0}%</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
