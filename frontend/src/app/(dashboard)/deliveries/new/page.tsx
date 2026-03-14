"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeliveries } from "@/hooks/useDeliveries";

const deliverySchema = z.object({
  customer_name: z.string().min(2, "Nome do cliente obrigatório"),
  customer_phone: z.string().optional(),
  address: z.string().min(5, "Endereço obrigatório"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().min(2, "Estado obrigatório"),
  zip_code: z.string().optional(),
  product_description: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantidade mínima: 1"),
  weight_kg: z.coerce.number().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  time_window_start: z.string().optional(),
  time_window_end: z.string().optional(),
  notes: z.string().optional(),
});

type DeliveryFormData = z.infer<typeof deliverySchema>;

export default function NewDeliveryPage() {
  const router = useRouter();
  const { createDelivery } = useDeliveries();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    defaultValues: { priority: "medium", quantity: 1 },
  });

  const onSubmit = async (data: DeliveryFormData) => {
    await createDelivery(data);
    router.push("/deliveries");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/deliveries">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Nova Entrega</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações da Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome do cliente *"
                placeholder="João da Silva"
                error={errors.customer_name?.message}
                {...register("customer_name")}
              />
              <Input
                label="Telefone"
                placeholder="(11) 99999-9999"
                {...register("customer_phone")}
              />
            </div>

            <Input
              label="Endereço *"
              placeholder="Rua das Flores, 123"
              error={errors.address?.message}
              {...register("address")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Cidade *"
                  placeholder="São Paulo"
                  error={errors.city?.message}
                  {...register("city")}
                />
              </div>
              <Input
                label="Estado *"
                placeholder="SP"
                error={errors.state?.message}
                {...register("state")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="CEP"
                placeholder="01310-100"
                {...register("zip_code")}
              />
              <Input
                label="Peso (kg)"
                type="number"
                step="0.1"
                placeholder="10.5"
                {...register("weight_kg")}
              />
            </div>

            <Input
              label="Produto / Descrição"
              placeholder="Eletrônicos, Móveis..."
              {...register("product_description")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Quantidade *"
                type="number"
                min={1}
                error={errors.quantity?.message}
                {...register("quantity")}
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-foreground">Prioridade *</label>
                <Select
                  value={watch("priority")}
                  onValueChange={(v) => setValue("priority", v as DeliveryFormData["priority"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Janela de horário - Início"
                type="time"
                {...register("time_window_start")}
              />
              <Input
                label="Janela de horário - Fim"
                type="time"
                {...register("time_window_end")}
              />
            </div>

            <Textarea
              label="Observações"
              placeholder="Informações adicionais sobre a entrega..."
              rows={3}
              {...register("notes")}
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit" isLoading={isSubmitting}>
                Salvar Entrega
              </Button>
              <Link href="/deliveries">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
