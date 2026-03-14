import { RouteTable } from "@/components/tables/RouteTable";

export default function RoutesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Rotas</h2>
        <p className="text-sm text-muted-foreground">Gerencie e otimize suas rotas de entrega</p>
      </div>
      <RouteTable />
    </div>
  );
}
