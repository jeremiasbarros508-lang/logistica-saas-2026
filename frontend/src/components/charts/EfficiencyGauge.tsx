"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMetrics } from "@/hooks/useDashboard";
import { SpinnerOverlay } from "@/components/ui/spinner";

export function EfficiencyGauge() {
  const { data, isLoading } = useMetrics();
  const score = data?.avg_optimization_score ?? 0;

  const chartData = [
    {
      name: "Eficiência",
      value: Math.round(score),
      fill: score >= 80 ? "#22C55E" : score >= 60 ? "#F97316" : "#EF4444",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Score de Otimização</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {isLoading ? (
          <SpinnerOverlay />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart
                cx="50%"
                cy="80%"
                innerRadius="60%"
                outerRadius="80%"
                startAngle={180}
                endAngle={0}
                data={chartData}
              >
                <RadialBar dataKey="value" cornerRadius={10} />
                <Tooltip formatter={(v) => [`${v}%`, "Score"]} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center -mt-8">
              <p className="text-3xl font-bold text-gray-900">{Math.round(score)}%</p>
              <p className="text-sm text-muted-foreground">Score médio de rotas</p>
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-muted-foreground">
                Distância média:{" "}
                <span className="font-medium text-gray-800">
                  {data?.avg_route_distance_km.toFixed(1)} km
                </span>
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
