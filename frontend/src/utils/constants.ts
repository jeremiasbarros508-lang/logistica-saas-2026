import type { DeliveryStatus, RouteStatus } from "@/types";

export const APP_NAME = "LogísticaSaaS";

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  pending: "Pendente",
  in_route: "Em Rota",
  delivered: "Entregue",
  problem: "Problema",
  cancelled: "Cancelado",
};

export const DELIVERY_STATUS_COLORS: Record<DeliveryStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_route: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  problem: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export const ROUTE_STATUS_LABELS: Record<RouteStatus, string> = {
  pending: "Pendente",
  processing: "Processando",
  optimized: "Otimizada",
  in_progress: "Em Andamento",
  completed: "Concluída",
  cancelled: "Cancelada",
};

export const ROUTE_STATUS_COLORS: Record<RouteStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  optimized: "bg-indigo-100 text-indigo-800",
  in_progress: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export const FUEL_TYPES = [
  { value: "gasoline", label: "Gasolina" },
  { value: "ethanol", label: "Etanol" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Elétrico" },
  { value: "hybrid", label: "Híbrido" },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 20;
