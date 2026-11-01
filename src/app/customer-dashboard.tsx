import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { RoleGuard } from "@/components/role-guard";
import { auth } from "@/Firebase/firebase.init";
import { clearAuthToken, requestPasswordReset, type UserRole } from "@/lib/auth";

const customerRoles: UserRole[] = ["customer"];
type Panel = "menu" | "profile" | "settings" | "catalog" | "orders" | null;

const palette = {
  background: "#f3fbf7",
  white: "#ffffff",
  text: "#123129",
  muted: "#668179",
  border: "#e0eee8",
  emerald: "#0e9d77",
  emeraldDark: "#087457",
  mint: "#eafaf3",
  pale: "#e0f6ed",
  red: "#a42d25",
};

function getInitials(name: string, email: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length > 1) return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return email.slice(0, 1).toUpperCase() || "C";
}

function CustomerDashboard() {
  const user = auth.currentUser;
  const name = user?.displayName?.trim() || "";
  const email = user?.email || "";
  const firstName = name.split(/\s+/)[0] || "there";
  const [panel, setPanel] = useState<Panel>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);

  const closePanel = () => {
    setPanel(null);
    setMessage("");
    setMessageIsError(false);
  };

  const logOut = async () => {
    setIsLoggingOut(true);
    setMessage("");
    try {
      await clearAuthToken();
      router.replace("/login");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to log out. Please try again.");
      setMessageIsError(true);
      setPanel(null);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const sendPasswordReset = async () => {
    if (!email) {
      setMessage("This account does not have an email address for password recovery.");
      setMessageIsError(true);
      return;
    }

    setIsSendingReset(true);
    setMessage("");
    try {
      await requestPasswordReset(email);
      setMessage("Password reset link sent. Check your email.");
      setMessageIsError(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send a password reset email.");
      setMessageIsError(true);
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.shell}>
          <View style={styles.header}>
            <View>
              <Text style={styles.brand}>PharmaCare</Text>
              <Text style={styles.caption}>YOUR PHARMACY, MADE SIMPLE</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open customer menu"
              accessibilityState={{ expanded: panel === "menu" }}
              onPress={() => setPanel("menu")}
              style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(name, email)}</Text>
              </View>
              <Text style={styles.menuChevron}>⌄</Text>
            </Pressable>
          </View>

          {message ? (
            <View style={[styles.notice, messageIsError && styles.errorNotice]}>
              <Text style={[styles.noticeText, messageIsError && styles.errorText]}>
                {message}
              </Text>
            </View>
          ) : null}

          <View style={styles.content}>
            <Text style={styles.eyebrow}>CUSTOMER HOME</Text>
            <Text style={styles.title}>Welcome, {firstName}!</Text>
            <Text style={styles.subtitle}>
              Manage your account and keep your pharmacy essentials close at hand.
            </Text>

            <View style={styles.hero}>
              <View style={styles.heroIcon}>
                <Text style={styles.heroIconText}>+</Text>
              </View>
              <Text style={styles.heroTitle}>Your health, made simpler.</Text>
              <Text style={styles.heroCopy}>
                Your PharmaCare customer account is ready. Browse medicines and order
                tracking will be available here when online ordering is connected.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Quick access</Text>
            <View style={styles.actionGrid}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setPanel("catalog")}
                style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}
              >
                <View style={[styles.actionIcon, styles.catalogIcon]}>
                  <Text style={styles.actionIconText}>⌕</Text>
                </View>
                <Text style={styles.actionTitle}>Browse medicines</Text>
                <Text style={styles.actionDescription}>Explore the pharmacy catalog</Text>
                <Text style={styles.actionLink}>Open catalog  →</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => setPanel("orders")}
                style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}
              >
                <View style={[styles.actionIcon, styles.ordersIcon]}>
                  <Text style={styles.actionIconText}>≡</Text>
                </View>
                <Text style={styles.actionTitle}>Order history</Text>
                <Text style={styles.actionDescription}>View your past and current orders</Text>
                <Text style={styles.actionLink}>View orders  →</Text>
              </Pressable>
            </View>

            <View style={styles.accountCard}>
              <View style={styles.accountCopy}>
                <Text style={styles.accountTitle}>Your account</Text>
                <Text style={styles.accountDescription}>
                  Update your profile or manage your sign-in details.
                </Text>
              </View>
              <View style={styles.accountButtons}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setPanel("profile")}
                  style={styles.outlineButton}
                >
                  <Text style={styles.outlineButtonText}>View profile</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setPanel("settings")}
                  style={styles.outlineButton}
                >
                  <Text style={styles.outlineButtonText}>Settings</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={panel !== null}
        animationType="fade"
        onRequestClose={closePanel}
      >
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close menu"
            onPress={closePanel}
            style={styles.modalBackdrop}
          />
          {panel === "menu" ? (
            <View style={styles.menu}>
              <View style={styles.menuIdentity}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(name, email)}</Text>
                </View>
                <View style={styles.menuIdentityCopy}>
                  <Text style={styles.menuName} numberOfLines={1}>{name || "Customer"}</Text>
                  <Text style={styles.menuEmail} numberOfLines={1}>{email}</Text>
                </View>
              </View>
              <View style={styles.menuDivider} />
              <MenuItem label="My profile" icon="○" onPress={() => setPanel("profile")} />
              <MenuItem label="Settings" icon="⚙" onPress={() => setPanel("settings")} />
              <View style={styles.menuDivider} />
              <Pressable
                accessibilityRole="button"
                disabled={isLoggingOut}
                onPress={() => void logOut()}
                style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
              >
                {isLoggingOut ? (
                  <ActivityIndicator size="small" color={palette.red} />
                ) : (
                  <Text style={styles.logoutIcon}>↪</Text>
                )}
                <Text style={styles.logoutLabel}>
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </Text>
              </Pressable>
            </View>
          ) : panel === "profile" ? (
            <View style={styles.dialog}>
              <DialogHeader title="My profile" onClose={closePanel} />
              <View style={styles.profileSummary}>
                <View style={[styles.avatar, styles.largeAvatar]}>
                  <Text style={styles.largeAvatarText}>{getInitials(name, email)}</Text>
                </View>
                <Text style={styles.profileName}>{name || "Customer"}</Text>
                <Text style={styles.profileRole}>CUSTOMER ACCOUNT</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email address</Text>
                <Text style={styles.detailValue}>{email || "Not available"}</Text>
              </View>
              <Text style={styles.profileHint}>
                Profile details are managed by your sign-in account.
              </Text>
            </View>
          ) : panel === "settings" ? (
            <View style={styles.dialog}>
              <DialogHeader title="Settings" onClose={closePanel} />
              <Text style={styles.settingsSection}>ACCOUNT SECURITY</Text>
              <Text style={styles.settingsTitle}>Reset your password</Text>
              <Text style={styles.settingsCopy}>
                We&apos;ll email a secure password reset link to {email || "your account email"}.
              </Text>
              {message ? (
                <Text style={[styles.settingsMessage, messageIsError && styles.errorText]}>
                  {message}
                </Text>
              ) : null}
              <Pressable
                accessibilityRole="button"
                disabled={isSendingReset}
                onPress={() => void sendPasswordReset()}
                style={({ pressed }) => [
                  styles.primaryButton,
                  (pressed || isSendingReset) && styles.buttonMuted,
                ]}
              >
                {isSendingReset ? (
                  <ActivityIndicator color={palette.white} />
                ) : (
                  <Text style={styles.primaryButtonText}>Send password reset link</Text>
                )}
              </Pressable>
            </View>
          ) : panel === "catalog" || panel === "orders" ? (
            <View style={styles.dialog}>
              <DialogHeader
                title={panel === "catalog" ? "Medicine catalog" : "Order history"}
                onClose={closePanel}
              />
              <View style={styles.emptyStateIcon}>
                <Text style={styles.emptyStateIconText}>{panel === "catalog" ? "+" : "≡"}</Text>
              </View>
              <Text style={styles.emptyStateTitle}>
                {panel === "catalog" ? "Catalog coming soon" : "Orders will appear here"}
              </Text>
              <Text style={styles.emptyStateCopy}>
                {panel === "catalog"
                  ? "The customer medicine catalog is not connected yet. Please check back soon."
                  : "Online ordering is not available yet, so there are no customer orders to show."}
              </Text>
              <Pressable accessibilityRole="button" onPress={closePanel} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Got it</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function MenuItem({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
    >
      <Text style={styles.menuItemIcon}>{icon}</Text>
      <Text style={styles.menuItemLabel}>{label}</Text>
      <Text style={styles.itemChevron}>›</Text>
    </Pressable>
  );
}

function DialogHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <View style={styles.dialogHeader}>
      <Text style={styles.dialogTitle}>{title}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        onPress={onClose}
        style={styles.closeButton}
      >
        <Text style={styles.closeButtonText}>×</Text>
      </Pressable>
    </View>
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
    backgroundColor: palette.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  shell: {
    width: "100%",
    maxWidth: 1120,
    flex: 1,
  },
  header: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    backgroundColor: palette.white,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  brand: {
    color: palette.emeraldDark,
    fontSize: 20,
    fontWeight: "800",
  },
  caption: {
    marginTop: 3,
    color: palette.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 24,
    padding: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.pale,
  },
  avatarText: {
    color: palette.emeraldDark,
    fontSize: 14,
    fontWeight: "800",
  },
  menuChevron: {
    color: palette.muted,
    fontSize: 18,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 48,
  },
  eyebrow: {
    color: palette.emerald,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
    marginTop: 8,
    color: palette.text,
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 8,
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  hero: {
    marginTop: 24,
    borderRadius: 18,
    padding: 22,
    backgroundColor: palette.emeraldDark,
  },
  heroIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.17)",
  },
  heroIconText: {
    color: palette.white,
    fontSize: 26,
    fontWeight: "500",
    lineHeight: 30,
  },
  heroTitle: {
    marginTop: 15,
    color: palette.white,
    fontSize: 21,
    fontWeight: "800",
  },
  heroCopy: {
    maxWidth: 670,
    marginTop: 7,
    color: "#e4f7ef",
    fontSize: 13,
    lineHeight: 20,
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 12,
    color: palette.text,
    fontSize: 17,
    fontWeight: "800",
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  actionCard: {
    flexGrow: 1,
    flexBasis: 240,
    minWidth: 220,
    borderRadius: 16,
    padding: 18,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.border,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  catalogIcon: {
    backgroundColor: palette.mint,
  },
  ordersIcon: {
    backgroundColor: "#eef1ff",
  },
  actionIconText: {
    color: palette.emeraldDark,
    fontSize: 22,
    fontWeight: "700",
  },
  actionTitle: {
    marginTop: 15,
    color: palette.text,
    fontSize: 15,
    fontWeight: "800",
  },
  actionDescription: {
    minHeight: 36,
    marginTop: 5,
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  actionLink: {
    marginTop: 13,
    color: palette.emeraldDark,
    fontSize: 12,
    fontWeight: "800",
  },
  accountCard: {
    marginTop: 18,
    borderRadius: 16,
    padding: 18,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.border,
  },
  accountCopy: {
    marginBottom: 15,
  },
  accountTitle: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "800",
  },
  accountDescription: {
    marginTop: 5,
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  accountButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  outlineButton: {
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: palette.mint,
  },
  outlineButtonText: {
    color: palette.emeraldDark,
    fontSize: 12,
    fontWeight: "700",
  },
  notice: {
    marginHorizontal: 24,
    marginTop: 14,
    borderRadius: 10,
    padding: 12,
    backgroundColor: palette.mint,
  },
  errorNotice: {
    backgroundColor: "#fff0ee",
  },
  noticeText: {
    color: palette.emeraldDark,
    fontSize: 13,
    lineHeight: 18,
  },
  errorText: {
    color: palette.red,
  },
  modalRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(11, 34, 27, 0.4)",
  },
  menu: {
    position: "absolute",
    top: 72,
    right: 18,
    width: 280,
    borderRadius: 14,
    padding: 10,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.border,
    elevation: 8,
    shadowColor: "#123129",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
  },
  menuIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  menuIdentityCopy: {
    flex: 1,
  },
  menuName: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "800",
  },
  menuEmail: {
    marginTop: 3,
    color: palette.muted,
    fontSize: 11,
  },
  menuDivider: {
    height: 1,
    marginVertical: 7,
    backgroundColor: palette.border,
  },
  menuItem: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    borderRadius: 9,
    paddingHorizontal: 9,
  },
  menuItemIcon: {
    width: 22,
    color: palette.emeraldDark,
    fontSize: 17,
    textAlign: "center",
  },
  menuItemLabel: {
    flex: 1,
    color: palette.text,
    fontSize: 13,
    fontWeight: "600",
  },
  itemChevron: {
    color: palette.muted,
    fontSize: 21,
  },
  logoutIcon: {
    width: 22,
    color: palette.red,
    fontSize: 17,
    textAlign: "center",
  },
  logoutLabel: {
    color: palette.red,
    fontSize: 13,
    fontWeight: "700",
  },
  dialog: {
    width: "100%",
    maxWidth: 440,
    borderRadius: 18,
    padding: 22,
    backgroundColor: palette.white,
    elevation: 8,
    shadowColor: "#123129",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
  },
  dialogHeader: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dialogTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "800",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.background,
  },
  closeButtonText: {
    color: palette.muted,
    fontSize: 24,
    lineHeight: 27,
  },
  profileSummary: {
    alignItems: "center",
    paddingVertical: 9,
  },
  largeAvatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  largeAvatarText: {
    color: palette.emeraldDark,
    fontSize: 21,
    fontWeight: "800",
  },
  profileName: {
    marginTop: 11,
    color: palette.text,
    fontSize: 17,
    fontWeight: "800",
  },
  profileRole: {
    marginTop: 4,
    color: palette.emeraldDark,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  detailRow: {
    marginTop: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: palette.border,
    paddingVertical: 13,
  },
  detailLabel: {
    color: palette.muted,
    fontSize: 11,
  },
  detailValue: {
    marginTop: 5,
    color: palette.text,
    fontSize: 13,
    fontWeight: "600",
  },
  profileHint: {
    marginTop: 13,
    color: palette.muted,
    fontSize: 11,
    lineHeight: 17,
  },
  settingsSection: {
    color: palette.emeraldDark,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  settingsTitle: {
    marginTop: 12,
    color: palette.text,
    fontSize: 15,
    fontWeight: "800",
  },
  settingsCopy: {
    marginTop: 6,
    color: palette.muted,
    fontSize: 12,
    lineHeight: 19,
  },
  settingsMessage: {
    marginTop: 12,
    color: palette.emeraldDark,
    fontSize: 12,
    lineHeight: 18,
  },
  primaryButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: palette.emeraldDark,
  },
  primaryButtonText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: "800",
  },
  buttonMuted: {
    opacity: 0.7,
  },
  emptyStateIcon: {
    width: 48,
    height: 48,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: palette.mint,
  },
  emptyStateIconText: {
    color: palette.emeraldDark,
    fontSize: 24,
    fontWeight: "700",
  },
  emptyStateTitle: {
    marginTop: 13,
    color: palette.text,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },
  emptyStateCopy: {
    marginTop: 7,
    color: palette.muted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
