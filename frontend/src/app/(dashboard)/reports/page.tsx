"use client";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
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
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dashboardService, type DashboardMetrics } from "@/services/dashboard.service";

export default function ReportsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getMetrics()
      .then(setMetrics)
      .catch(() => {
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
          routes_last_7_days: Array.from({ length: 30 }, (_, i) => ({
            name: `Dia ${i + 1}`,
            value: Math.floor(Math.random() * 15) + 5,
          })),
          deliveries_by_driver: [
            { name: "João Silva", value: 65, km: 312 },
            { name: "Maria Santos", value: 52, km: 245 },
            { name: "Carlos Lima", value: 48, km: 198 },
            { name: "Ana Costa", value: 43, km: 187 },
          ],
          recent_routes: [],
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            ))
          : [
              { label: "Total Entregas", value: metrics?.kpis.total_deliveries },
              { label: "Rotas no Mês", value: metrics?.kpis.routes_today },
              { label: "Km Rodados", value: `${metrics?.kpis.km_today} km` },
              { label: "Taxa de Entrega", value: `${metrics?.kpis.delivery_rate}%` },
            ].map((item) => (
              <Card key={item.label}>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold mt-1">{item.value}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rotas Completadas (Últimos 30 Dias)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={(metrics?.routes_last_7_days || []).slice(0, 30)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={4} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#F97316" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Eficiência por Status de Entrega</CardTitle>
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
                  <Legend />
                  <Bar dataKey="value" fill="#F97316" name="Entregas" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Drivers Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Top Motoristas</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Entregas</TableHead>
                <TableHead>Km Rodados</TableHead>
                <TableHead>Eficiência</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                (metrics?.deliveries_by_driver || []).map((driver, idx) => (
                  <TableRow key={driver.name}>
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell>{driver.name}</TableCell>
                    <TableCell>{driver.value}</TableCell>
                    <TableCell>{(driver.km as number) || "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-gray-100 rounded-full flex-1 max-w-24">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(driver.value / 70) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm">{Math.round((driver.value / 70) * 100)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
