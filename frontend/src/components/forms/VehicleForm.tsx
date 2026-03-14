"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertMessage } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import * as vehicleService from "@/services/vehicle.service";
import { useNotification } from "@/hooks/useNotification";
import { getErrorMessage } from "@/utils/api-error";
import { FUEL_TYPES } from "@/utils/constants";
import type { Vehicle } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  plate: z.string().min(4, "Placa é obrigatória"),
  model: z.string().optional(),
  capacity_kg: z.coerce.number().min(0).default(1000),
  fuel_type: z.string().optional(),
  fuel_consumption_per_km: z.coerce.number().min(0).default(0),
});

type FormData = z.infer<typeof schema>;

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function VehicleForm({ vehicle, onSuccess, onCancel }: VehicleFormProps) {
  const isEdit = !!vehicle;
  const notify = useNotification();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload = { ...data, model: data.model || null, fuel_type: data.fuel_type || null };
      return isEdit && vehicle
        ? vehicleService.updateVehicle(vehicle.id, payload)
        : vehicleService.createVehicle(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      notify.success(isEdit ? "Veículo atualizado" : "Veículo criado");
      onSuccess?.();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: vehicle
      ? {
          name: vehicle.name,
          plate: vehicle.plate,
          model: vehicle.model ?? "",
          capacity_kg: vehicle.capacity_kg,
          fuel_type: vehicle.fuel_type ?? "",
          fuel_consumption_per_km: vehicle.fuel_consumption_per_km,
        }
      : { capacity_kg: 1000, fuel_consumption_per_km: 0 },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync(data);
    } catch (e) {
      setError("root", { message: getErrorMessage(e) });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && <AlertMessage message={errors.root.message ?? "Erro"} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="v-name">Nome *</Label>
          <Input id="v-name" {...register("name")} placeholder="ex: Van 01" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="v-plate">Placa *</Label>
          <Input id="v-plate" {...register("plate")} placeholder="ABC-1234" />
          {errors.plate && <p className="text-xs text-red-500">{errors.plate.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="v-model">Modelo</Label>
        <Input id="v-model" {...register("model")} placeholder="ex: Fiat Ducato" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="v-capacity">Capacidade (kg)</Label>
          <Input id="v-capacity" type="number" step="0.1" {...register("capacity_kg")} min={0} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="v-consumption">Consumo (km/l)</Label>
          <Input id="v-consumption" type="number" step="0.1" {...register("fuel_consumption_per_km")} min={0} />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="v-fuel">Combustível</Label>
        <select
          id="v-fuel"
          {...register("fuel_type")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Selecionar...</option>
          {FUEL_TYPES.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Spinner size="sm" className="mr-2" />}
          {isEdit ? "Atualizar" : "Criar"} Veículo
        </Button>
      </div>
    </form>
  );
}
