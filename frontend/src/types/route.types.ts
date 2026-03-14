export type RouteStatus = "pending" | "processing" | "optimized" | "in_progress" | "completed" | "cancelled";

export interface RouteStop {
  id: string;
  route_id: string;
  delivery_id: string;
  sequence_order: number;
  distance_from_prev_km: number;
  created_at: string;
  updated_at: string;
}

export interface Route {
  id: string;
  company_id: string;
  name: string;
  status: RouteStatus;
  total_distance_km: number;
  estimated_time_minutes: number;
  vehicle_id: string | null;
  driver_id: string | null;
  optimization_score: number;
  stops_count: number;
  stops: RouteStop[];
  created_at: string;
  updated_at: string;
}

export interface RouteCreate {
  name: string;
  vehicle_id?: string | null;
  driver_id?: string | null;
  delivery_ids?: string[];
}

export interface RouteUpdate {
  name?: string;
  vehicle_id?: string | null;
  driver_id?: string | null;
  status?: RouteStatus;
}
