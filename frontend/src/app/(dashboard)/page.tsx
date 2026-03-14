"use client";
import { useEffect, useState } from "react";
import { Package, Map, Navigation, TrendingUp, Plus, Upload, BarChart2 } from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardService, type DashboardMetrics } from "@/services/dashboard.service";

const COLORS = ["#F97316", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"];

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  in_route: "Em Rota",
  delivered: "Entregue",
  problem: "Problema",
};

const routeStatusVariant: Record<string, "pending" | "info" | "success" | "destructive"> = {
  pending: "pending",
  in_progress: "info",
  completed: "success",
  cancelled: "destructive",
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getMetrics()
      .then(setMetrics)
      .catch(() => {
        // Use mock data on error
        setMetrics({
          kpis: {
            total_deliveries: 248,
            routes_today: 12,
            km_today: 634,
            delivery_rate: 94.2,
            deliveries_change: 8,
            routes_change: 2,
            km_change: 15,
            rate_change: 1.2,
          },
          delivery_by_status: [
            { name: "Pendente", value: 45 },
            { name: "Em Rota", value: 32 },
            { name: "Entregue", value: 156 },
            { name: "Problema", value: 15 },
          ],
          routes_last_7_days: [
            { name: "Seg", value: 8 },
            { name: "Ter", value: 12 },
            { name: "Qua", value: 10 },
            { name: "Qui", value: 14 },
            { name: "Sex", value: 16 },
            { name: "Sáb", value: 6 },
            { name: "Dom", value: 3 },
          ],
          deliveries_by_driver: [
            { name: "João Silva", value: 65 },
            { name: "Maria Santos", value: 52 },
            { name: "Carlos Lima", value: 48 },
            { name: "Ana Costa", value: 43 },
            { name: "Outros", value: 40 },
          ],
          recent_routes: [
            {
              id: "1",
              name: "Rota Norte - 2026-03-14",
              status: "completed",
              total_distance_km: 85.3,
              estimated_duration_min: 210,
              created_at: "2026-03-14T08:00:00",
            },
            {
              id: "2",
              name: "Rota Sul - 2026-03-14",
              status: "in_progress",
              total_distance_km: 62.1,
              estimated_duration_min: 155,
              created_at: "2026-03-14T09:30:00",
            },
            {
              id: "3",
              name: "Rota Centro - 2026-03-13",
              status: "completed",
              total_distance_km: 45.7,
              estimated_duration_min: 120,
              created_at: "2026-03-13T08:00:00",
            },
          ],
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const kpiCards = metrics
    ? [
        {
          title: "Total de Entregas",
          value: metrics.kpis.total_deliveries,
          change: `+${metrics.kpis.deliveries_change}%`,
          icon: Package,
          color: "text-orange-500",
          bg: "bg-orange-50",
        },
        {
          title: "Rotas Hoje",
          value: metrics.kpis.routes_today,
          change: `+${metrics.kpis.routes_change}`,
          icon: Map,
          color: "text-blue-500",
          bg: "bg-blue-50",
        },
        {
          title: "Km Rodados",
          value: `${metrics.kpis.km_today.toLocaleString("pt-BR")} km`,
          change: `+${metrics.kpis.km_change}%`,
          icon: Navigation,
          color: "text-green-500",
          bg: "bg-green-50",
        },
        {
          title: "Taxa de Entrega",
          value: `${metrics.kpis.delivery_rate}%`,
          change: `+${metrics.kpis.rate_change}%`,
          icon: TrendingUp,
          color: "text-purple-500",
          bg: "bg-purple-50",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))
          : kpiCards.map((card) => (
              <Card key={card.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                      <p className="text-2xl font-bold mt-1">{card.value}</p>
                      <p className="text-xs text-green-600 mt-1">{card.change} vs mês passado</p>
                    </div>
                    <div className={`p-3 rounded-lg ${card.bg}`}>
                      <card.icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Deliveries by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Entregas por Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={metrics?.delivery_by_status || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Line Chart - Routes last 7 days */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rotas nos Últimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={metrics?.routes_last_7_days || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#F97316"
                    strokeWidth={2}
                    dot={{ fill: "#F97316" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pie + Recent Routes Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart - By Driver */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Entregas por Motorista</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={metrics?.deliveries_by_driver || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(metrics?.deliveries_by_driver || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Routes Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Rotas Recentes</CardTitle>
            <Link href="/routes">
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {metrics?.recent_routes.map((route) => (
                  <div
                    key={route.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium">{route.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {route.total_distance_km.toFixed(1)} km •{" "}
                        {Math.round(route.estimated_duration_min / 60)}h{" "}
                        {route.estimated_duration_min % 60}min
                      </p>
                    </div>
                    <Badge variant={routeStatusVariant[route.status] || "pending"}>
                      {route.status === "completed"
                        ? "Concluída"
                        : route.status === "in_progress"
                          ? "Em andamento"
                          : route.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/deliveries/new">
              <Button variant="outline" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Nova Entrega
              </Button>
            </Link>
            <Link href="/routes/new">
              <Button variant="outline" className="w-full gap-2">
                <Map className="h-4 w-4" />
                Gerar Rota
              </Button>
            </Link>
            <Link href="/deliveries/import">
              <Button variant="outline" className="w-full gap-2">
                <Upload className="h-4 w-4" />
                Importar CSV
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="outline" className="w-full gap-2">
                <BarChart2 className="h-4 w-4" />
                Ver Relatório
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
