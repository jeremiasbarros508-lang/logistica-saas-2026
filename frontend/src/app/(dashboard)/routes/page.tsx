"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Map, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRoutes } from "@/hooks/useRoutes";
import { usePagination } from "@/hooks/usePagination";
import type { RouteStatus } from "@/types";

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

export default function RoutesPage() {
  const { routes, total, isLoading, fetchRoutes, deleteRoute } = useRoutes();
  const { page, perPage, goToPage } = usePagination(1, 10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRoutes({ page, per_page: perPage, search });
  }, [page, perPage, search, fetchRoutes]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-4">
      {/* Actions bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Buscar por nome da rota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Link href="/routes/new">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Gerar Rota
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Rota</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Distância</TableHead>
                <TableHead>Tempo Est.</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : routes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Nenhuma rota encontrada
                  </TableCell>
                </TableRow>
              ) : (
                routes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.name}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[route.status]}>
                        {statusLabels[route.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{route.total_distance_km.toFixed(1)} km</TableCell>
                    <TableCell>
                      {Math.floor(route.estimated_duration_min / 60)}h{" "}
                      {route.estimated_duration_min % 60}min
                    </TableCell>
                    <TableCell>{route.driver?.name || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(route.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/routes/${route.id}`}>
                          <Button variant="ghost" size="icon" aria-label="Ver mapa">
                            <Map className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" aria-label="Editar">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteRoute(route.id)}
                          aria-label="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {total} rotas • Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
