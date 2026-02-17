import * as SecureStore from "expo-secure-store";
import { apiClient } from "./api-client";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    balance: number;
    currency: string;
  };
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", {
    username,
    email,
    password,
  });
  await storeTokens(data);
  return data;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  await storeTokens(data);
  return data;
}

export async function refreshToken(): Promise<AuthResponse> {
  const refresh = await SecureStore.getItemAsync("refreshToken");
  if (!refresh) throw new Error("No refresh token");
  const { data } = await apiClient.post<AuthResponse>("/auth/refresh", {
    refreshToken: refresh,
  });
  await storeTokens(data);
  return data;
}

export async function logout(): Promise<void> {
  try {
    const refresh = await SecureStore.getItemAsync("refreshToken");
    if (refresh) {
      await apiClient.post("/auth/logout", { refreshToken: refresh });
    }
  } finally {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  }
}

async function storeTokens(data: AuthResponse) {
  await SecureStore.setItemAsync("accessToken", data.accessToken);
  await SecureStore.setItemAsync("refreshToken", data.refreshToken);
}
