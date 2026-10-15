import { router } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { RoleGuard } from "@/components/role-guard";
import { clearAuthToken, type UserRole } from "@/lib/auth";

const customerRoles: UserRole[] = ["customer"];

function CustomerDashboard() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>PharmaCare</Text>
          <Text style={styles.caption}>CUSTOMER ACCOUNT</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            await clearAuthToken();
            router.replace("/login");
          }}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to PharmaCare</Text>
        <Text style={styles.description}>
          Your customer account is ready. Pharmacy staff features are not available to customer accounts.
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default function CustomerDashboardScreen() {
  return (
    <RoleGuard
      allowedRoles={customerRoles}
      render={() => <CustomerDashboard />}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3fbf7",
  },
  header: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0eee8",
  },
  brand: {
    color: "#087457",
    fontSize: 20,
    fontWeight: "800",
  },
  caption: {
    marginTop: 3,
    color: "#668179",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  logoutButton: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: "#eafaf3",
  },
  logoutText: {
    color: "#087457",
    fontWeight: "700",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 28,
  },
  title: {
    color: "#123129",
    fontSize: 28,
    fontWeight: "800",
  },
  description: {
    maxWidth: 520,
    marginTop: 10,
    color: "#668179",
    fontSize: 15,
    lineHeight: 23,
  },
});
