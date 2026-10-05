import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000/api";
const tokenKey = "pharmacare-auth-token";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

type ApiMessage = {
  message?: string;
};

const storeToken = async (token: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(tokenKey, token);
  } else {
    await SecureStore.setItemAsync(tokenKey, token);
  }
};

const postAuth = async <T,>(path: string, payload: Record<string, string>): Promise<T> => {
  const response = await fetch(`${apiUrl}/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => ({}))) as T & ApiMessage;

  if (!response.ok) {
    throw new Error(data.message || "Authentication failed.");
  }

  return data;
};

export const authenticate = async (
  path: "login",
  payload: Record<string, string>,
): Promise<AuthResponse> => {
  const data = await postAuth<AuthResponse>(path, payload);
  await storeToken(data.token);
  return data;
};

export const requestSignupVerification = async (
  payload: Record<string, string>,
): Promise<ApiMessage> => postAuth<ApiMessage>("signup/request-code", payload);

export const verifySignupCode = async (email: string, code: string): Promise<ApiMessage> => {
  const result = await postAuth<ApiMessage>("signup/verify-code", { email, code });
  await clearAuthToken();
  return result;
};

export const clearAuthToken = async () => {
  if (Platform.OS === "web") {
    localStorage.removeItem(tokenKey);
  } else {
    await SecureStore.deleteItemAsync(tokenKey);
  }
};