"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpinnerOverlay } from "@/components/ui/spinner";
import { useMetrics } from "@/hooks/useDashboard";

// Mock weekly data for illustration
function generateMockData() {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  return days.map((day) => ({
    day,
    distancia: Math.round(Math.random() * 200 + 50),
    rotas: Math.round(Math.random() * 10 + 1),
  }));
}

export function RouteStatsChart() {
  const { isLoading } = useMetrics();
  const data = generateMockData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Estatísticas de Rotas (Semana)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SpinnerOverlay />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="distancia"
                name="Distância (km)"
                stroke="#F97316"
                strokeWidth={2}
                dot={{ fill: "#F97316", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="rotas"
                name="Rotas"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
