import { api } from "@/lib/api";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

export const authService = {
  async register(payload: RegisterPayload) {
    const { data } = await api.post<AuthResponse>(
      "/api/auth/register",
      payload
    );

    localStorage.setItem(
      "accessToken",
      data.accessToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    return data;
  },

  async login(payload: LoginPayload) {
    const { data } = await api.post<AuthResponse>(
      "/api/auth/login",
      payload
    );

    localStorage.setItem(
      "accessToken",
      data.accessToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    return data;
  },

  async forgotPassword(email: string) {
    const { data } = await api.post(
      "/api/auth/forgot-password",
      { email }
    );

    return data;
  },

  async resetPassword(
    token: string,
    password: string
  ) {
    const { data } = await api.post(
      "/api/auth/reset-password",
      {
        token,
        password,
      }
    );

    return data;
  },

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  },
};