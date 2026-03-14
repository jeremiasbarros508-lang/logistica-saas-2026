"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertMessage } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useCreateDelivery, useUpdateDelivery } from "@/hooks/useDeliveries";
import { useNotification } from "@/hooks/useNotification";
import { getErrorMessage } from "@/utils/api-error";
import type { Delivery } from "@/types";

const schema = z.object({
  customer_name: z.string().min(2, "Nome é obrigatório"),
  address: z.string().min(5, "Endereço é obrigatório"),
  phone: z.string().optional(),
  product: z.string().optional(),
  quantity: z.coerce.number().int().min(1).default(1),
  priority: z.coerce.number().int().min(0).max(10).default(0),
  notes: z.string().optional(),
  weight_kg: z.coerce.number().min(0).default(0),
  time_window_start: z.string().optional(),
  time_window_end: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface DeliveryFormProps {
  delivery?: Delivery | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DeliveryForm({ delivery, onSuccess, onCancel }: DeliveryFormProps) {
  const isEdit = !!delivery;
  const createMutation = useCreateDelivery();
  const updateMutation = useUpdateDelivery();
  const notify = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: delivery
      ? {
          customer_name: delivery.customer_name,
          address: delivery.address,
          phone: delivery.phone ?? "",
          product: delivery.product ?? "",
          quantity: delivery.quantity,
          priority: delivery.priority,
          notes: delivery.notes ?? "",
          weight_kg: delivery.weight_kg,
        }
      : { quantity: 1, priority: 0, weight_kg: 0 },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        phone: data.phone || null,
        product: data.product || null,
        notes: data.notes || null,
        time_window_start: data.time_window_start || null,
        time_window_end: data.time_window_end || null,
      };

      if (isEdit && delivery) {
        await updateMutation.mutateAsync({ id: delivery.id, data: payload });
        notify.success("Entrega atualizada com sucesso");
      } else {
        await createMutation.mutateAsync(payload);
        notify.success("Entrega criada com sucesso");
      }
      onSuccess?.();
    } catch (e) {
      setError("root", { message: getErrorMessage(e) });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && <AlertMessage message={errors.root.message ?? "Erro"} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="customer_name">Nome do Cliente *</Label>
          <Input id="customer_name" {...register("customer_name")} placeholder="Nome completo" />
          {errors.customer_name && (
            <p className="text-xs text-red-500">{errors.customer_name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" {...register("phone")} placeholder="(11) 99999-9999" />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="address">Endereço *</Label>
        <Input id="address" {...register("address")} placeholder="Rua, número, bairro, cidade" />
        {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1">
          <Label htmlFor="product">Produto</Label>
          <Input id="product" {...register("product")} placeholder="Descrição" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="quantity">Quantidade</Label>
          <Input id="quantity" type="number" {...register("quantity")} min={1} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="weight_kg">Peso (kg)</Label>
          <Input id="weight_kg" type="number" step="0.1" {...register("weight_kg")} min={0} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="time_window_start">Janela de Início</Label>
          <Input id="time_window_start" type="datetime-local" {...register("time_window_start")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="time_window_end">Janela de Fim</Label>
          <Input id="time_window_end" type="datetime-local" {...register("time_window_end")} />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="priority">Prioridade (0-10)</Label>
        <Input id="priority" type="number" {...register("priority")} min={0} max={10} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" {...register("notes")} rows={3} placeholder="Informações adicionais..." />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner size="sm" className="mr-2" />}
          {isEdit ? "Atualizar" : "Criar"} Entrega
        </Button>
      </div>
    </form>
  );
}
