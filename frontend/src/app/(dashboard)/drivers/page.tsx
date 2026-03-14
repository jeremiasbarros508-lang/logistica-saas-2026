import { DriverTable } from "@/components/tables/DriverTable";

export default function DriversPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Motoristas</h2>
        <p className="text-sm text-muted-foreground">Gerencie sua equipe de motoristas</p>
      </div>
      <DriverTable />
    </div>
  );
}
