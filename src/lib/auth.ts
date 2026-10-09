import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import Constants from "expo-constants";
import { Platform } from "react-native";

import { auth } from "@/Firebase/firebase.init";

const getApiUrl = () => {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  if (Platform.OS === "web") {
    const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
    return `http://${host}:4000/api`;
  }

  const expoHost = Constants.expoConfig?.hostUri?.split(":")[0];
  return `http://${expoHost || "localhost"}:4000/api`;
};

export type AuthUser = {
  uid: string;
  name: string;
  email: string;
};

type ApiMessage = {
  message?: string;
};

const postAuth = async <T,>(
  path: string,
  payload: Record<string, string>,
  idToken?: string,
): Promise<T> => {
  let response: Response;
  const url = `${getApiUrl()}/auth/${path}`;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const detail = error instanceof Error ? ` ${error.message}` : "";
    throw new Error(`Cannot reach the authentication server at ${url}.${detail} Check that the API is running and that your device is on the same network.`);
  }

  const data = (await response.json().catch(() => ({}))) as T & ApiMessage;
  if (!response.ok) {
    throw new Error(data.message || "Authentication failed.");
  }
  return data;
};

export const authenticate = async (email: string, password: string): Promise<AuthUser> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await credential.user.reload();
  if (!credential.user.emailVerified) {
    await signOut(auth);
    throw new Error("Verify your email address before logging in.");
  }

  return {
    uid: credential.user.uid,
    name: credential.user.displayName || "",
    email: credential.user.email || email,
  };
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const requestSignupVerification = async (
  payload: { name: string; email: string },
): Promise<ApiMessage> => postAuth<ApiMessage>("signup/request-code", payload);

export const verifySignupCode = async (email: string, code: string): Promise<string> => {
  const result = await postAuth<{ verificationToken: string }>("signup/verify-code", { email, code });
  return result.verificationToken;
};

export const completeSignup = async (
  name: string,
  email: string,
  password: string,
  verificationToken: string,
): Promise<AuthUser> => {
  let credential: UserCredential;
  try {
    credential = await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "auth/email-already-in-use") {
      throw error;
    }
    credential = await signInWithEmailAndPassword(auth, email, password);
  }
  try {
    await updateProfile(credential.user, { displayName: name });
    const idToken = await credential.user.getIdToken();
    await postAuth<ApiMessage>(
      "signup/complete",
      { verificationToken },
      idToken,
    );
    await credential.user.reload();
    return {
      uid: credential.user.uid,
      name: credential.user.displayName || name,
      email: credential.user.email || email,
    };
  } catch (error) {
    await signOut(auth);
    throw error;
  }
};

export const clearAuthToken = async () => signOut(auth);