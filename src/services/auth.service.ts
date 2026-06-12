import { api } from "../lib/api";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "../types/auth";

export const authService = {
  // =========================
  // REGISTER
  // =========================
  async register(
    payload: RegisterPayload
  ) {
    const { data } =
      await api.post<AuthResponse>(
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

  // =========================
  // LOGIN
  // =========================
  async login(
    payload: LoginPayload
  ) {
    const { data } =
      await api.post<AuthResponse>(
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

  // =========================
  // FORGOT PASSWORD
  // =========================
  async forgotPassword(
    email: string
  ) {
    const { data } =
      await api.post(
        "/api/auth/forgot-password",
        {
          email,
        }
      );

    return data;
  },

  // =========================
  // RESET PASSWORD
  // =========================
  async resetPassword(
    token: string,
    password: string
  ) {
    const { data } =
      await api.post(
        `/api/auth/reset-password/${token}`,
        {
          password,
        }
      );

    return data;
  },

  // =========================
  // VERIFY EMAIL
  // =========================
  async verifyEmail(
    token: string
  ) {
    const { data } =
      await api.get(
        `/api/auth/verify-email/${token}`
      );

    return data;
  },

  // =========================
  // GET CURRENT USER
  // =========================
  async getMe() {
    const { data } =
      await api.get(
        "/api/auth/me"
      );

    return data;
  },

  // =========================
  // HELPERS
  // =========================
  getToken() {
    return localStorage.getItem(
      "accessToken"
    );
  },

  getUser() {
    const user =
      localStorage.getItem(
        "user"
      );

    return user
      ? JSON.parse(user)
      : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem(
      "accessToken"
    );
  },

  // =========================
  // LOGOUT
  // =========================
  async logout() {
    try {
      await api.post(
        "/api/auth/logout"
      );
    } catch (_) {
      // Ignore logout API errors
    }

    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "user"
    );
  },
};