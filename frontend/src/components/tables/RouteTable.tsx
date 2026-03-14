"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Eye } from "lucide-react";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpinnerOverlay } from "@/components/ui/spinner";
import { AlertMessage } from "@/components/ui/alert";
import { useRoutes, useDeleteRoute } from "@/hooks/useRoutes";
import { usePagination } from "@/hooks/usePagination";
import { useNotification } from "@/hooks/useNotification";
import { ROUTE_STATUS_LABELS, ROUTE_STATUS_COLORS } from "@/utils/constants";
import { formatDate, formatDistance, formatDuration } from "@/utils/format";
import { getErrorMessage } from "@/utils/api-error";
import type { RouteStatus } from "@/types";
import { ConfirmModal } from "@/components/modals/ConfirmModal";

export function RouteTable() {
  const { page, pageSize, nextPage, prevPage } = usePagination();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const notify = useNotification();

  const { data, isLoading, error } = useRoutes({ page, page_size: pageSize });
  const deleteMutation = useDeleteRoute();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      notify.success("Rota excluída com sucesso");
    } catch (e) {
      notify.error(getErrorMessage(e));
    } finally {
      setDeleteId(null);
    }
  };

  if (error) return <AlertMessage message={getErrorMessage(error)} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/routes/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Rota
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border">
        {isLoading ? (
          <SpinnerOverlay />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Distância</TableHead>
                <TableHead>Tempo Est.</TableHead>
                <TableHead>Paradas</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhuma rota encontrada.
                  </TableCell>
                </TableRow>
              )}
              {data?.items.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.name}</TableCell>
                  <TableCell>
                    <Badge className={ROUTE_STATUS_COLORS[route.status as RouteStatus]}>
                      {ROUTE_STATUS_LABELS[route.status as RouteStatus] ?? route.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDistance(route.total_distance_km)}</TableCell>
                  <TableCell>{formatDuration(route.estimated_time_minutes)}</TableCell>
                  <TableCell>{route.stops_count}</TableCell>
                  <TableCell>{route.optimization_score.toFixed(0)}%</TableCell>
                  <TableCell>{formatDate(route.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(route.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Página {page} de {data.total_pages} ({data.total} rotas)
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={prevPage} disabled={page <= 1}>
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={nextPage} disabled={page >= data.total_pages}>
              Próxima
            </Button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir rota"
        description="Tem certeza que deseja excluir esta rota?"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
