"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpinnerOverlay } from "@/components/ui/spinner";
import { AlertMessage } from "@/components/ui/alert";
import { Modal } from "@/components/ui/modal";
import { DriverForm } from "@/components/forms/DriverForm";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { useNotification } from "@/hooks/useNotification";
import { usePagination } from "@/hooks/usePagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as driverService from "@/services/driver.service";
import { getErrorMessage } from "@/utils/api-error";
import { formatPhone } from "@/utils/format";
import type { Driver } from "@/types";

export function DriverTable() {
  const { page, pageSize, nextPage, prevPage } = usePagination();
  const [showForm, setShowForm] = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const notify = useNotification();
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["drivers", "list", { page, page_size: pageSize }],
    queryFn: () => driverService.listDrivers({ page, page_size: pageSize }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => driverService.deleteDriver(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] }),
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      notify.success("Motorista excluído com sucesso");
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
        <Button size="sm" onClick={() => { setEditDriver(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Motorista
        </Button>
      </div>

      <div className="rounded-lg border">
        {isLoading ? (
          <SpinnerOverlay />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>CNH</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhum motorista cadastrado.
                  </TableCell>
                </TableRow>
              )}
              {data?.items.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{driver.email ?? "—"}</TableCell>
                  <TableCell>{formatPhone(driver.phone)}</TableCell>
                  <TableCell>{driver.license_number ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={driver.is_active ? "success" : "secondary"}>
                      {driver.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditDriver(driver); setShowForm(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(driver.id)}>
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
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={prevPage} disabled={page <= 1}>Anterior</Button>
          <Button variant="outline" size="sm" onClick={nextPage} disabled={page >= data.total_pages}>Próxima</Button>
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editDriver ? "Editar Motorista" : "Novo Motorista"}
      >
        <DriverForm
          driver={editDriver}
          onSuccess={() => { setShowForm(false); qc.invalidateQueries({ queryKey: ["drivers"] }); }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir motorista"
        description="Tem certeza que deseja excluir este motorista?"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
