"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpinnerOverlay } from "@/components/ui/spinner";
import { useChartData } from "@/hooks/useDashboard";
import { DELIVERY_STATUS_LABELS } from "@/utils/constants";
import type { DeliveryStatus } from "@/types";

const STATUS_FILL: Record<string, string> = {
  pending: "#EAB308",
  in_route: "#3B82F6",
  delivered: "#22C55E",
  problem: "#EF4444",
  cancelled: "#9CA3AF",
};

export function DeliveryChart() {
  const { data, isLoading } = useChartData();

  const chartData = data?.deliveries_by_status.map((item) => ({
    name: DELIVERY_STATUS_LABELS[item.status as DeliveryStatus] ?? item.status,
    count: item.count,
    fill: STATUS_FILL[item.status] ?? "#F97316",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Entregas por Status</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SpinnerOverlay />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="Quantidade" radius={[4, 4, 0, 0]}>
                {chartData?.map((entry, index) => (
                  <rect key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
