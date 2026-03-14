export interface Company {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  plan: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyUpdate {
  name?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}
