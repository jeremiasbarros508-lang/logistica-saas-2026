import axiosInstance from "@/lib/axios-instance";
import type { LoginRequest, RegisterRequest, TokenResponse, User } from "@/types";

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const params = new URLSearchParams();
  params.append("username", data.email);
  params.append("password", data.password);
  const response = await axiosInstance.post<TokenResponse>("/auth/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
}

export async function register(data: RegisterRequest): Promise<TokenResponse> {
  const response = await axiosInstance.post<TokenResponse>("/auth/register", data);
  return response.data;
}

export async function refreshToken(token: string): Promise<TokenResponse> {
  const response = await axiosInstance.post<TokenResponse>("/auth/refresh", {
    refresh_token: token,
  });
  return response.data;
}

export async function logout(refreshToken?: string): Promise<void> {
  await axiosInstance.post("/auth/logout", { refresh_token: refreshToken });
}

export async function getMe(): Promise<User> {
  const response = await axiosInstance.get<User>("/auth/me");
  return response.data;
}
