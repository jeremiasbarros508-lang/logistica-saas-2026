"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRoutes } from "@/hooks/useRoutes";
import { deliveryService } from "@/services/delivery.service";
import { vehicleService } from "@/services/vehicle.service";
import { driverService } from "@/services/driver.service";
import type { Delivery, Vehicle, Driver } from "@/types";

const routeSchema = z.object({
  name: z.string().min(3, "Nome obrigatório (mínimo 3 caracteres)"),
  vehicle_id: z.string().optional(),
  driver_id: z.string().optional(),
});

type RouteFormData = z.infer<typeof routeSchema>;

export default function NewRoutePage() {
  const router = useRouter();
  const { generateRoute, isGenerating } = useRoutes();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDeliveries, setSelectedDeliveries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
  });

  useEffect(() => {
    Promise.all([
      deliveryService.list({ status: "pending", per_page: 100 }),
      vehicleService.list(1, 50),
      driverService.list(1, 50),
    ])
      .then(([deliveriesRes, vehiclesRes, driversRes]) => {
        setDeliveries(deliveriesRes.items);
        setVehicles(vehiclesRes.items);
        setDrivers(driversRes.items);
      })
      .catch(() => {
        // Ignore errors
      })
      .finally(() => setIsLoading(false));
  }, []);

  const toggleDelivery = (id: string) => {
    setSelectedDeliveries((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const onSubmit = async (data: RouteFormData) => {
    if (selectedDeliveries.length === 0) {
      return;
    }
    const route = await generateRoute({
      name: data.name,
      delivery_ids: selectedDeliveries,
      vehicle_id: data.vehicle_id || undefined,
      driver_id: data.driver_id || undefined,
    });
    router.push(`/routes/${route.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/routes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Gerar Nova Rota</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configuração da Rota</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Nome da rota *"
              placeholder="Rota Norte - 2026-03-14"
              error={errors.name?.message}
              {...register("name")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-foreground">Veículo</label>
                <Select
                  value={watch("vehicle_id") || ""}
                  onValueChange={(v) => setValue("vehicle_id", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sem veículo</SelectItem>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name} ({v.license_plate})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-foreground">Motorista</label>
                <Select
                  value={watch("driver_id") || ""}
                  onValueChange={(v) => setValue("driver_id", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar motorista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sem motorista</SelectItem>
                    {drivers.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Entregas Pendentes ({selectedDeliveries.length} selecionadas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : deliveries.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Nenhuma entrega pendente encontrada
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {deliveries.map((delivery) => (
                  <label
                    key={delivery.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedDeliveries.includes(delivery.id)
                        ? "border-primary bg-primary/5"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDeliveries.includes(delivery.id)}
                      onChange={() => toggleDelivery(delivery.id)}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium">{delivery.customer_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {delivery.address}, {delivery.city}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            type="submit"
            isLoading={isGenerating}
            disabled={selectedDeliveries.length === 0}
          >
            {isGenerating ? "Otimizando rota..." : "Gerar Rota Otimizada"}
          </Button>
          <Link href="/routes">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
