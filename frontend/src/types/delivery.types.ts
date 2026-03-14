export type DeliveryStatus = "pending" | "in_route" | "delivered" | "problem" | "cancelled";

export interface Delivery {
  id: string;
  company_id: string;
  customer_name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  product: string | null;
  quantity: number;
  priority: number;
  time_window_start: string | null;
  time_window_end: string | null;
  notes: string | null;
  status: DeliveryStatus;
  route_id: string | null;
  weight_kg: number;
  created_at: string;
  updated_at: string;
}

export interface DeliveryCreate {
  customer_name: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
  phone?: string | null;
  product?: string | null;
  quantity?: number;
  priority?: number;
  time_window_start?: string | null;
  time_window_end?: string | null;
  notes?: string | null;
  weight_kg?: number;
}

export interface DeliveryUpdate extends Partial<DeliveryCreate> {
  status?: DeliveryStatus;
}
