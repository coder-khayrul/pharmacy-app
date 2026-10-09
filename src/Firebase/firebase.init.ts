import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import * as FirebaseAuth from "firebase/auth";
import {
  browserLocalPersistence,
  getAuth,
  initializeAuth,
  type Persistence,
} from "firebase/auth";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyCvViQ3h0Swmw1vZM_IgG86wo6x6FUCR9E",
  authDomain: "pharmacy-auth-dfeb5.firebaseapp.com",
  projectId: "pharmacy-auth-dfeb5",
  storageBucket: "pharmacy-auth-dfeb5.firebasestorage.app",
  messagingSenderId: "870322082782",
  appId: "1:870322082782:web:94043cd65dd25941d2434f"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const getReactNativePersistence = (
  FirebaseAuth as typeof FirebaseAuth & {
    getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
  }
).getReactNativePersistence;

const initializeFirebaseAuth = () => {
  try {
    return initializeAuth(app, {
      persistence:
        Platform.OS === "web"
          ? browserLocalPersistence
          : getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("already-initialized")) {
      return getAuth(app);
    }
    throw error;
  }
};

export const auth = initializeFirebaseAuth();