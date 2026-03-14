// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  company_name: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "operator" | "driver";
  company_id: string;
  is_active: boolean;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  plan: string;
  is_active: boolean;
  created_at: string;
}

export type DeliveryStatus = "pending" | "in_route" | "delivered" | "problem";
export type DeliveryPriority = "low" | "medium" | "high" | "urgent";

export interface Delivery {
  id: string;
  company_id: string;
  customer_name: string;
  customer_phone?: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  product_description?: string;
  quantity: number;
  weight_kg?: number;
  status: DeliveryStatus;
  priority: DeliveryPriority;
  time_window_start?: string;
  time_window_end?: string;
  notes?: string;
  route_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DeliveryCreate {
  customer_name: string;
  customer_phone?: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  product_description?: string;
  quantity: number;
  weight_kg?: number;
  priority: DeliveryPriority;
  time_window_start?: string;
  time_window_end?: string;
  notes?: string;
}

export type RouteStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface RouteStop {
  id: string;
  delivery_id: string;
  sequence: number;
  customer_name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  status: DeliveryStatus;
  estimated_arrival?: string;
}

export interface Route {
  id: string;
  company_id: string;
  name: string;
  status: RouteStatus;
  total_distance_km: number;
  estimated_duration_min: number;
  vehicle_id?: string;
  driver_id?: string;
  vehicle?: Vehicle;
  driver?: Driver;
  stops: RouteStop[];
  created_at: string;
  updated_at: string;
}

export interface RouteCreate {
  name: string;
  delivery_ids: string[];
  vehicle_id?: string;
  driver_id?: string;
}

export interface Vehicle {
  id: string;
  company_id: string;
  name: string;
  license_plate: string;
  model: string;
  capacity_kg: number;
  fuel_type: "gasoline" | "diesel" | "electric" | "flex";
  fuel_consumption_per_km: number;
  is_active: boolean;
  created_at: string;
}

export interface VehicleCreate {
  name: string;
  license_plate: string;
  model: string;
  capacity_kg: number;
  fuel_type: "gasoline" | "diesel" | "electric" | "flex";
  fuel_consumption_per_km: number;
}

export interface Driver {
  id: string;
  company_id: string;
  name: string;
  email: string;
  phone: string;
  license_number: string;
  is_active: boolean;
  created_at: string;
}

export interface DriverCreate {
  name: string;
  email: string;
  phone: string;
  license_number: string;
}

export interface DashboardKPIs {
  total_deliveries: number;
  routes_today: number;
  km_today: number;
  delivery_rate: number;
  deliveries_change: number;
  routes_change: number;
  km_change: number;
  rate_change: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}
