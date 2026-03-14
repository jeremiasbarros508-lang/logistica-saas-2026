import axiosInstance from "@/lib/axios-instance";
import type { LoginRequest, RegisterRequest, TokenResponse, User } from "@/types";

export const authService = {
  async login(data: LoginRequest): Promise<{ tokens: TokenResponse; user: User }> {
    const formData = new URLSearchParams();
    formData.append("username", data.email);
    formData.append("password", data.password);

    const response = await axiosInstance.post<TokenResponse>("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const user = await axiosInstance.get<User>("/auth/me");
    return { tokens: response.data, user: user.data };
  },

  async register(data: RegisterRequest): Promise<{ tokens: TokenResponse; user: User }> {
    const response = await axiosInstance.post<TokenResponse>("/auth/register", data);
    const user = await axiosInstance.get<User>("/auth/me", {
      headers: { Authorization: `Bearer ${response.data.access_token}` },
    });
    return { tokens: response.data, user: user.data };
  },

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const response = await axiosInstance.post<TokenResponse>("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post("/auth/logout").catch(() => {
      // Ignore errors on logout
    });
  },

  async me(): Promise<User> {
    const response = await axiosInstance.get<User>("/auth/me");
    return response.data;
  },
};
