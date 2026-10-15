import Constants from "expo-constants";
import { Platform } from "react-native";

export const getApiUrl = () => {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  if (Platform.OS === "web") {
    const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
    return `http://${host}:4000/api`;
  }

  const expoHost = Constants.expoConfig?.hostUri?.split(":")[0];
  return `http://${expoHost || "localhost"}:4000/api`;
};

export type MedicineInventoryItem = {
  id: string;
  name: string;
  currentStock: number;
  reorderLevel: number;
};

export const getMedicines = async (idToken: string): Promise<MedicineInventoryItem[]> => {
  const url = `${getApiUrl()}/medicines`;
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
  } catch (error) {
    const detail = error instanceof Error ? ` ${error.message}` : "";
    throw new Error(`Cannot reach the pharmacy server at ${url}.${detail} Check that the API is running and that your device is on the same network.`);
  }

  const data = (await response.json().catch(() => ({}))) as {
    medicines?: MedicineInventoryItem[];
    message?: string;
  };
  if (!response.ok) {
    throw new Error(data.message || "Unable to load medicines.");
  }
  if (!Array.isArray(data.medicines)) {
    throw new Error("The pharmacy server returned an invalid medicine list.");
  }
  return data.medicines;
};
