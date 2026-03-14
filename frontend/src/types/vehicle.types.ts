export interface Vehicle {
  id: string;
  company_id: string;
  name: string;
  plate: string;
  model: string | null;
  capacity_kg: number;
  fuel_type: string | null;
  fuel_consumption_per_km: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleCreate {
  name: string;
  plate: string;
  model?: string | null;
  capacity_kg?: number;
  fuel_type?: string | null;
  fuel_consumption_per_km?: number;
}

export interface VehicleUpdate extends Partial<VehicleCreate> {
  is_active?: boolean;
}
