export interface Driver {
  id: string;
  company_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  license_number: string | null;
  is_active: boolean;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DriverCreate {
  name: string;
  email?: string | null;
  phone?: string | null;
  license_number?: string | null;
  user_id?: string | null;
}

export interface DriverUpdate extends Partial<DriverCreate> {
  is_active?: boolean;
}
