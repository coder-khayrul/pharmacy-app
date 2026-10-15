import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import { auth } from "@/Firebase/firebase.init";
import { getApiUrl } from "@/lib/api";

export type AuthUser = {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
};

export type UserRole = "customer" | "staff" | "admin";

type ApiMessage = {
  message?: string;
};

const isUserRole = (role: unknown): role is UserRole =>
  role === "customer" || role === "staff" || role === "admin";

const getRole = async (idToken: string): Promise<UserRole> => {
  const url = `${getApiUrl()}/auth/me`;
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
  } catch (error) {
    const detail = error instanceof Error ? ` ${error.message}` : "";
    throw new Error(`Cannot reach the authentication server at ${url}.${detail} Check that the API is running and that your device is on the same network.`);
  }

  const data = (await response.json().catch(() => ({}))) as { role?: unknown; message?: string };
  if (!response.ok) {
    throw new Error(data.message || "Unable to verify your account role.");
  }
  if (!isUserRole(data.role)) {
    throw new Error("The authentication server returned an invalid account role.");
  }
  return data.role;
};

export const getAuthenticatedRole = getRole;

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

  let role: UserRole;
  try {
    role = await getRole(await credential.user.getIdToken(true));
  } catch (error) {
    await signOut(auth);
    throw error;
  }
  return {
    uid: credential.user.uid,
    name: credential.user.displayName || "",
    email: credential.user.email || email,
    role,
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
    const completion = await postAuth<ApiMessage & { role?: unknown }>(
      "signup/complete",
      { verificationToken },
      idToken,
    );
    if (!isUserRole(completion.role)) {
      throw new Error("The authentication server returned an invalid account role.");
    }
    await credential.user.getIdToken(true);
    await credential.user.reload();
    return {
      uid: credential.user.uid,
      name: credential.user.displayName || name,
      email: credential.user.email || email,
      role: completion.role,
    };
  } catch (error) {
    await signOut(auth);
    throw error;
  }
};

export const clearAuthToken = async () => signOut(auth);