"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKPIs } from "@/hooks/useDashboard";
import { SpinnerOverlay } from "@/components/ui/spinner";
import { DELIVERY_STATUS_LABELS } from "@/utils/constants";
import type { DeliveryStatus } from "@/types";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-400",
  in_route: "bg-blue-400",
  delivered: "bg-green-400",
  problem: "bg-red-400",
  cancelled: "bg-gray-300",
};

export function DeliveryStatusSummary() {
  const { data, isLoading } = useKPIs();

  const total = data?.deliveries.total ?? 0;
  const statuses = [
    { key: "pending", count: data?.deliveries.pending ?? 0 },
    { key: "in_route", count: data?.deliveries.in_route ?? 0 },
    { key: "delivered", count: data?.deliveries.delivered ?? 0 },
    { key: "problem", count: data?.deliveries.problem ?? 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Status de Entregas</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SpinnerOverlay />
        ) : (
          <div className="space-y-3">
            {statuses.map(({ key, count }) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">
                      {DELIVERY_STATUS_LABELS[key as DeliveryStatus]}
                    </span>
                    <span className="font-medium">
                      {count} <span className="text-muted-foreground">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-2 rounded-full transition-all ${statusColors[key] ?? "bg-gray-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
