import { onAuthStateChanged } from "firebase/auth";
import { router } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { auth } from "@/Firebase/firebase.init";
import { clearAuthToken, getAuthenticatedRole, type UserRole } from "@/lib/auth";

type RoleGuardProps = {
  allowedRoles: UserRole[];
  render: (role: UserRole) => ReactNode;
};

export function RoleGuard({ allowedRoles, render }: RoleGuardProps) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setRole(null);
      setError(null);
      if (!user) {
        router.replace("/login");
        return;
      }

      void (async () => {
        try {
          const verifiedRole = await getAuthenticatedRole(await user.getIdToken(true));
          if (!isActive) return;
          if (!allowedRoles.includes(verifiedRole)) {
            router.replace(verifiedRole === "customer" ? "/customer-dashboard" : "/dashboard");
            return;
          }
          setRole(verifiedRole);
        } catch (authError) {
          if (isActive) {
            setError(authError instanceof Error ? authError.message : "Unable to verify account access.");
          }
        }
      })();
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [allowedRoles]);

  if (role) return render(role);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Pressable
          onPress={async () => {
            await clearAuthToken();
            router.replace("/login");
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Return to login</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator color="#087457" />
      <Text style={styles.message}>Checking account access...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f3fbf7",
  },
  message: {
    marginTop: 12,
    color: "#123129",
  },
  error: {
    color: "#a42d25",
    textAlign: "center",
  },
  button: {
    marginTop: 18,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: "#087457",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
