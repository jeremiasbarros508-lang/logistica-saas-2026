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
import * as driverService from "@/services/driver.service";
import { useNotification } from "@/hooks/useNotification";
import { getErrorMessage } from "@/utils/api-error";
import type { Driver } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  license_number: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface DriverFormProps {
  driver?: Driver | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DriverForm({ driver, onSuccess, onCancel }: DriverFormProps) {
  const isEdit = !!driver;
  const notify = useNotification();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload = {
        ...data,
        email: data.email || null,
        phone: data.phone || null,
        license_number: data.license_number || null,
      };
      return isEdit && driver
        ? driverService.updateDriver(driver.id, payload)
        : driverService.createDriver(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["drivers"] });
      notify.success(isEdit ? "Motorista atualizado" : "Motorista criado");
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
    defaultValues: driver
      ? {
          name: driver.name,
          email: driver.email ?? "",
          phone: driver.phone ?? "",
          license_number: driver.license_number ?? "",
        }
      : {},
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

      <div className="space-y-1">
        <Label htmlFor="d-name">Nome *</Label>
        <Input id="d-name" {...register("name")} placeholder="Nome completo" />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="d-email">Email</Label>
          <Input id="d-email" type="email" {...register("email")} placeholder="email@exemplo.com" />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="d-phone">Telefone</Label>
          <Input id="d-phone" {...register("phone")} placeholder="(11) 99999-9999" />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="d-license">Número da CNH</Label>
        <Input id="d-license" {...register("license_number")} placeholder="00000000000" />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Spinner size="sm" className="mr-2" />}
          {isEdit ? "Atualizar" : "Criar"} Motorista
        </Button>
      </div>
    </form>
  );
}
