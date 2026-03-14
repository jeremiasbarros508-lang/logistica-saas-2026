import { DeliveryTable } from "@/components/tables/DeliveryTable";

export default function DeliveriesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Entregas</h2>
        <p className="text-sm text-muted-foreground">Gerencie todas as suas entregas</p>
      </div>
      <DeliveryTable />
    </div>
  );
}
