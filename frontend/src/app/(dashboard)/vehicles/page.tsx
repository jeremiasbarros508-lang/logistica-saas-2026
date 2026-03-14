import { VehicleTable } from "@/components/tables/VehicleTable";

export default function VehiclesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Veículos</h2>
        <p className="text-sm text-muted-foreground">Gerencie sua frota de veículos</p>
      </div>
      <VehicleTable />
    </div>
  );
}
