"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpinnerOverlay } from "@/components/ui/spinner";
import { useRoutes } from "@/hooks/useRoutes";
import { formatDate, formatDistance, formatDuration } from "@/utils/format";
import { ROUTE_STATUS_LABELS, ROUTE_STATUS_COLORS } from "@/utils/constants";
import type { RouteStatus } from "@/types";

export function RecentRoutes() {
  const { data, isLoading } = useRoutes({ page: 1, page_size: 5 });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Rotas Recentes</CardTitle>
        <Link href="/routes" className="text-sm text-primary-500 hover:underline">
          Ver todas
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SpinnerOverlay />
        ) : (
          <div className="space-y-3">
            {data?.items.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma rota encontrada.
              </p>
            )}
            {data?.items.map((route) => (
              <div
                key={route.id}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{route.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistance(route.total_distance_km)} •{" "}
                    {formatDuration(route.estimated_time_minutes)} •{" "}
                    {route.stops_count} paradas
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(route.created_at)}</p>
                </div>
                <Badge className={ROUTE_STATUS_COLORS[route.status as RouteStatus]}>
                  {ROUTE_STATUS_LABELS[route.status as RouteStatus] ?? route.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
