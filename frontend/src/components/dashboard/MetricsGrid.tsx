"use client";

import { Package, Route, Truck, UserCheck } from "lucide-react";
import { KPICard } from "./KPICard";
import { SpinnerOverlay } from "@/components/ui/spinner";
import { AlertMessage } from "@/components/ui/alert";
import { useKPIs } from "@/hooks/useDashboard";
import { getErrorMessage } from "@/utils/api-error";

export function MetricsGrid() {
  const { data, isLoading, error } = useKPIs();

  if (isLoading) return <SpinnerOverlay />;
  if (error) return <AlertMessage message={getErrorMessage(error)} />;
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KPICard
        title="Total de Entregas"
        value={data.deliveries.total}
        icon={Package}
        description={`${data.deliveries.pending} pendentes`}
      />
      <KPICard
        title="Rotas"
        value={data.routes.total}
        icon={Route}
        description={`${data.routes.completed} concluídas`}
      />
      <KPICard
        title="Veículos Ativos"
        value={data.vehicles.active}
        icon={Truck}
        description={`de ${data.vehicles.total} total`}
      />
      <KPICard
        title="Motoristas Ativos"
        value={data.drivers.active}
        icon={UserCheck}
        description={`de ${data.drivers.total} total`}
      />
    </div>
  );
}
