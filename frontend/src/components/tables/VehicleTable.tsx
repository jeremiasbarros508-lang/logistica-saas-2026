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
import { VehicleForm } from "@/components/forms/VehicleForm";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { useNotification } from "@/hooks/useNotification";
import { usePagination } from "@/hooks/usePagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as vehicleService from "@/services/vehicle.service";
import { getErrorMessage } from "@/utils/api-error";
import { formatDate } from "@/utils/format";
import type { Vehicle } from "@/types";

export function VehicleTable() {
  const { page, pageSize, nextPage, prevPage } = usePagination();
  const [showForm, setShowForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const notify = useNotification();
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["vehicles", "list", { page, page_size: pageSize }],
    queryFn: () => vehicleService.listVehicles({ page, page_size: pageSize }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vehicleService.deleteVehicle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vehicles"] }),
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      notify.success("Veículo excluído com sucesso");
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
        <Button size="sm" onClick={() => { setEditVehicle(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Veículo
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
                <TableHead>Placa</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Combustível</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhum veículo cadastrado.
                  </TableCell>
                </TableRow>
              )}
              {data?.items.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.name}</TableCell>
                  <TableCell>{vehicle.plate}</TableCell>
                  <TableCell>{vehicle.model ?? "—"}</TableCell>
                  <TableCell>{vehicle.capacity_kg} kg</TableCell>
                  <TableCell>{vehicle.fuel_type ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={vehicle.is_active ? "success" : "secondary"}>
                      {vehicle.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditVehicle(vehicle); setShowForm(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(vehicle.id)}>
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
        title={editVehicle ? "Editar Veículo" : "Novo Veículo"}
      >
        <VehicleForm
          vehicle={editVehicle}
          onSuccess={() => { setShowForm(false); qc.invalidateQueries({ queryKey: ["vehicles"] }); }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir veículo"
        description="Tem certeza que deseja excluir este veículo?"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
