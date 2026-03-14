"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Plus, Upload } from "lucide-react";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpinnerOverlay } from "@/components/ui/spinner";
import { AlertMessage } from "@/components/ui/alert";
import { useDeliveries, useDeleteDelivery } from "@/hooks/useDeliveries";
import { usePagination } from "@/hooks/usePagination";
import { useNotification } from "@/hooks/useNotification";
import { DELIVERY_STATUS_LABELS, DELIVERY_STATUS_COLORS } from "@/utils/constants";
import { formatDate, formatPhone } from "@/utils/format";
import { getErrorMessage } from "@/utils/api-error";
import type { Delivery, DeliveryStatus } from "@/types";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { DeliveryDetailModal } from "@/components/modals/DeliveryDetailModal";

export function DeliveryTable() {
  const { page, pageSize, nextPage, prevPage } = usePagination();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const notify = useNotification();

  const { data, isLoading, error } = useDeliveries({ page, page_size: pageSize, status: statusFilter });
  const deleteMutation = useDeleteDelivery();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      notify.success("Entrega excluída com sucesso");
    } catch (e) {
      notify.error(getErrorMessage(e));
    } finally {
      setDeleteId(null);
    }
  };

  if (error) return <AlertMessage message={getErrorMessage(error)} />;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={statusFilter ?? ""}
            onChange={(e) => setStatusFilter(e.target.value || undefined)}
          >
            <option value="">Todos os status</option>
            {Object.entries(DELIVERY_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/deliveries/import">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
          </Link>
          <Link href="/deliveries/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Entrega
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        {isLoading ? (
          <SpinnerOverlay />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhuma entrega encontrada.
                  </TableCell>
                </TableRow>
              )}
              {data?.items.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.customer_name}</TableCell>
                  <TableCell className="max-w-xs truncate">{delivery.address}</TableCell>
                  <TableCell>{formatPhone(delivery.phone)}</TableCell>
                  <TableCell>{delivery.product ?? "—"}</TableCell>
                  <TableCell>
                    <Badge className={DELIVERY_STATUS_COLORS[delivery.status as DeliveryStatus]}>
                      {DELIVERY_STATUS_LABELS[delivery.status as DeliveryStatus] ?? delivery.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(delivery.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDelivery(delivery)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(delivery.id)}
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

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Mostrando {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, data.total)} de{" "}
            {data.total}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={prevPage} disabled={page <= 1}>
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={page >= data.total_pages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir entrega"
        description="Tem certeza que deseja excluir esta entrega? Esta ação não pode ser desfeita."
        loading={deleteMutation.isPending}
      />

      <DeliveryDetailModal
        delivery={selectedDelivery}
        onClose={() => setSelectedDelivery(null)}
      />
    </div>
  );
}
