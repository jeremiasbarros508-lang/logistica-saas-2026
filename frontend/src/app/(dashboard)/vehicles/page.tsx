"use client";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { vehicleService } from "@/services/vehicle.service";
import { toast } from "sonner";
import type { Vehicle, VehicleCreate } from "@/types";

const vehicleSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  license_plate: z.string().min(6, "Placa inválida"),
  model: z.string().min(2, "Modelo obrigatório"),
  capacity_kg: z.coerce.number().min(1, "Capacidade mínima: 1 kg"),
  fuel_type: z.enum(["gasoline", "diesel", "electric", "flex"]),
  fuel_consumption_per_km: z.coerce.number().min(0.1, "Consumo mínimo: 0.1"),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { fuel_type: "flex", capacity_kg: 1000, fuel_consumption_per_km: 10 },
  });

  const loadVehicles = async () => {
    try {
      const data = await vehicleService.list();
      setVehicles(data.items);
    } catch {
      toast.error("Erro ao carregar veículos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const openCreate = () => {
    setEditingVehicle(null);
    reset({ fuel_type: "flex", capacity_kg: 1000, fuel_consumption_per_km: 10 });
    setModalOpen(true);
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    reset({
      name: vehicle.name,
      license_plate: vehicle.license_plate,
      model: vehicle.model,
      capacity_kg: vehicle.capacity_kg,
      fuel_type: vehicle.fuel_type,
      fuel_consumption_per_km: vehicle.fuel_consumption_per_km,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: VehicleFormData) => {
    try {
      if (editingVehicle) {
        await vehicleService.update(editingVehicle.id, data as VehicleCreate);
        toast.success("Veículo atualizado!");
      } else {
        await vehicleService.create(data as VehicleCreate);
        toast.success("Veículo criado!");
      }
      setModalOpen(false);
      loadVehicles();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || "Erro ao salvar veículo");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await vehicleService.delete(id);
      toast.success("Veículo excluído!");
      loadVehicles();
    } catch {
      toast.error("Erro ao excluir veículo");
    }
  };

  const fuelLabels: Record<string, string> = {
    gasoline: "Gasolina",
    diesel: "Diesel",
    electric: "Elétrico",
    flex: "Flex",
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo Veículo
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
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
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Nenhum veículo cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.name}</TableCell>
                    <TableCell>{vehicle.license_plate}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.capacity_kg.toLocaleString("pt-BR")} kg</TableCell>
                    <TableCell>{fuelLabels[vehicle.fuel_type]}</TableCell>
                    <TableCell>
                      <Badge variant={vehicle.is_active ? "success" : "secondary"}>
                        {vehicle.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(vehicle)}
                          aria-label="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(vehicle.id)}
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

      {/* Vehicle Form Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? "Editar Veículo" : "Novo Veículo"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nome *"
                placeholder="Furgão 01"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                label="Placa *"
                placeholder="ABC-1234"
                error={errors.license_plate?.message}
                {...register("license_plate")}
              />
            </div>
            <Input
              label="Modelo *"
              placeholder="VW Delivery 3.5"
              error={errors.model?.message}
              {...register("model")}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Capacidade (kg) *"
                type="number"
                error={errors.capacity_kg?.message}
                {...register("capacity_kg")}
              />
              <Input
                label="Consumo (km/L) *"
                type="number"
                step="0.1"
                error={errors.fuel_consumption_per_km?.message}
                {...register("fuel_consumption_per_km")}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-foreground">Combustível *</label>
              <Select
                value={watch("fuel_type")}
                onValueChange={(v) => setValue("fuel_type", v as VehicleFormData["fuel_type"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex">Flex</SelectItem>
                  <SelectItem value="gasoline">Gasolina</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Elétrico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
