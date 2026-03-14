export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  company_name: string;
  email: string;
  password: string;
  name: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: string;
  company_id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "operator";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
