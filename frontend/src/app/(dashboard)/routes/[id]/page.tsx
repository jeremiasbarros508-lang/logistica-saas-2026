"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Navigation, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { routeService } from "@/services/route.service";
import { toast } from "sonner";
import type { Route, RouteStatus, DeliveryStatus } from "@/types";

const statusLabels: Record<RouteStatus, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  completed: "Concluída",
  cancelled: "Cancelada",
};

const statusVariants: Record<RouteStatus, "pending" | "info" | "success" | "destructive"> = {
  pending: "pending",
  in_progress: "info",
  completed: "success",
  cancelled: "destructive",
};

const stopStatusLabels: Record<DeliveryStatus, string> = {
  pending: "Pendente",
  in_route: "Em Rota",
  delivered: "Entregue",
  problem: "Problema",
};

export default function RouteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [route, setRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReoptimizing, setIsReoptimizing] = useState(false);

  useEffect(() => {
    routeService
      .get(id)
      .then(setRoute)
      .catch(() => toast.error("Erro ao carregar rota"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleReoptimize = async () => {
    setIsReoptimizing(true);
    try {
      const updated = await routeService.reoptimize(id);
      setRoute(updated);
      toast.success("Rota re-otimizada com sucesso!");
    } catch {
      toast.error("Erro ao re-otimizar rota");
    } finally {
      setIsReoptimizing(false);
    }
  };

  const openGoogleMaps = () => {
    if (!route?.stops.length) return;
    const stops = route.stops
      .filter((s) => s.latitude && s.longitude)
      .map((s) => `${s.latitude},${s.longitude}`);
    const url = `https://www.google.com/maps/dir/${stops.join("/")}`;
    window.open(url, "_blank");
  };

  const openWaze = () => {
    if (!route?.stops.length) return;
    const first = route.stops.find((s) => s.latitude && s.longitude);
    if (first?.latitude && first?.longitude) {
      window.open(
        `https://waze.com/ul?ll=${first.latitude},${first.longitude}&navigate=yes`,
        "_blank"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Rota não encontrada</p>
        <Link href="/routes">
          <Button variant="outline" className="mt-4">
            Voltar para Rotas
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{route.name}</h1>
        </div>
        <Badge variant={statusVariants[route.status]}>{statusLabels[route.status]}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map placeholder */}
        <div className="lg:col-span-2">
          <Card className="h-96">
            <CardContent className="p-0 h-full">
              <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Navigation className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="font-medium">Mapa da Rota</p>
                  <p className="text-sm mt-1">Integração Google Maps</p>
                  <p className="text-xs mt-1 text-gray-400">
                    Configure NEXT_PUBLIC_GOOGLE_MAPS_KEY para exibir o mapa
                  </p>
                  <div className="flex gap-2 justify-center mt-4">
                    <Button size="sm" variant="outline" onClick={openGoogleMaps} className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Google Maps
                    </Button>
                    <Button size="sm" variant="outline" onClick={openWaze} className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Waze
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Route details panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações da Rota</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Distância Total</p>
                <p className="font-semibold">{route.total_distance_km.toFixed(1)} km</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tempo Estimado</p>
                <p className="font-semibold">
                  {Math.floor(route.estimated_duration_min / 60)}h{" "}
                  {route.estimated_duration_min % 60}min
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Motorista</p>
                <p className="font-semibold">{route.driver?.name || "Não atribuído"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Veículo</p>
                <p className="font-semibold">
                  {route.vehicle ? `${route.vehicle.name} (${route.vehicle.license_plate})` : "Não atribuído"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total de Paradas</p>
                <p className="font-semibold">{route.stops.length}</p>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleReoptimize}
            isLoading={isReoptimizing}
          >
            <RotateCcw className="h-4 w-4" />
            Re-otimizar Rota
          </Button>
        </div>
      </div>

      {/* Stops list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Paradas ({route.stops.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {route.stops
              .sort((a, b) => a.sequence - b.sequence)
              .map((stop, index) => (
                <div
                  key={stop.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50"
                >
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{stop.customer_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{stop.address}</p>
                  </div>
                  <Badge
                    variant={
                      stop.status === "delivered"
                        ? "success"
                        : stop.status === "problem"
                          ? "destructive"
                          : "pending"
                    }
                  >
                    {stopStatusLabels[stop.status]}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
