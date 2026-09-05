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

const storeToken = async (token: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(tokenKey, token);
  } else {
    await SecureStore.setItemAsync(tokenKey, token);
  }
};

export const authenticate = async (
  path: "login" | "signup",
  payload: Record<string, string>,
): Promise<AuthResponse> => {
  const response = await fetch(`${apiUrl}/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Authentication failed.");
  }

  await storeToken(data.token);
  return data;
};