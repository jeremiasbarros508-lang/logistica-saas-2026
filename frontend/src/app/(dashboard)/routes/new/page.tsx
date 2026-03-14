"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Route } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertMessage } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useCreateRoute } from "@/hooks/useRoutes";
import { useNotification } from "@/hooks/useNotification";
import { getErrorMessage } from "@/utils/api-error";
import { useQuery } from "@tanstack/react-query";
import * as vehicleService from "@/services/vehicle.service";
import * as driverService from "@/services/driver.service";
import * as deliveryService from "@/services/delivery.service";

const schema = z.object({
  name: z.string().min(2, "Nome da rota é obrigatório"),
  vehicle_id: z.string().optional(),
  driver_id: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewRoutePage() {
  const router = useRouter();
  const notify = useNotification();
  const createRoute = useCreateRoute();
  const [selectedDeliveries, setSelectedDeliveries] = useState<string[]>([]);

  const { data: vehicles } = useQuery({
    queryKey: ["vehicles", "list", { page: 1, page_size: 100 }],
    queryFn: () => vehicleService.listVehicles({ page: 1, page_size: 100 }),
  });

  const { data: drivers } = useQuery({
    queryKey: ["drivers", "list", { page: 1, page_size: 100 }],
    queryFn: () => driverService.listDrivers({ page: 1, page_size: 100 }),
  });

  const { data: deliveries } = useQuery({
    queryKey: ["deliveries", "list", { status: "pending" }],
    queryFn: () => deliveryService.listDeliveries({ status: "pending", page_size: 100 }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const toggleDelivery = (id: string) => {
    setSelectedDeliveries((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createRoute.mutateAsync({
        name: data.name,
        vehicle_id: data.vehicle_id || null,
        driver_id: data.driver_id || null,
        delivery_ids: selectedDeliveries,
      });
      notify.success("Rota criada com sucesso!");
      router.push("/routes");
    } catch (e) {
      setError("root", { message: getErrorMessage(e) });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/routes" className="p-2 rounded-md hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nova Rota</h2>
          <p className="text-sm text-muted-foreground">Crie e otimize uma nova rota</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && <AlertMessage message={errors.root.message ?? "Erro"} />}

        <Card>
          <CardHeader><CardTitle className="text-base">Configurações da Rota</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="route-name">Nome da Rota *</Label>
              <Input id="route-name" {...register("name")} placeholder="Rota Centro - 20/01" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="vehicle">Veículo</Label>
                <select
                  id="vehicle"
                  {...register("vehicle_id")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecionar veículo...</option>
                  {vehicles?.items.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="driver">Motorista</Label>
                <select
                  id="driver"
                  {...register("driver_id")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecionar motorista...</option>
                  {drivers?.items.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Entregas ({selectedDeliveries.length} selecionadas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-72 overflow-y-auto space-y-2">
              {deliveries?.items.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma entrega pendente disponível.
                </p>
              )}
              {deliveries?.items.map((d) => (
                <label
                  key={d.id}
                  className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedDeliveries.includes(d.id)}
                    onChange={() => toggleDelivery(d.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{d.customer_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{d.address}</p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/routes">
            <Button type="button" variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={createRoute.isPending}>
            {createRoute.isPending && <Spinner size="sm" className="mr-2" />}
            <Route className="h-4 w-4 mr-2" />
            Criar e Otimizar Rota
          </Button>
        </div>
      </form>
    </div>
  );
}
