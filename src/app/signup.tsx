import { Link } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const palette = {
  emerald: "#10a06d",
  emeraldDark: "#0d7d5d",
  emeraldSoft: "#ecfaf4",
  white: "#ffffff",
  text: "#123129",
  muted: "#5d7d73",
  border: "#dfeee7",
  background: "#edfdf8",
  shadow: "rgba(16, 160, 109, 0.18)",
};

export default function SignupScreen() {
  const rise = useRef(new Animated.Value(26)).current;

  useEffect(() => {
    Animated.timing(rise, {
      toValue: 0,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [rise]);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={[styles.card, { transform: [{ translateY: rise }] }]}
        >
          <View style={styles.topRow}>
            <View style={styles.logoBadge}>
              <View style={styles.logoPill}>
                <View style={styles.logoBody} />
                <View style={styles.logoCrossH} />
                <View style={styles.logoCrossV} />
              </View>
            </View>
            <Text style={styles.brand}>PharmaCare</Text>
          </View>

          <Text style={styles.header}>Create account</Text>
          <Text style={styles.subheader}>
            Set up your pharmacy management access
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={palette.muted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={palette.muted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor={palette.muted}
              secureTextEntry
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter your password"
              placeholderTextColor={palette.muted}
              secureTextEntry
            />
          </View>

          <View style={styles.checkRow}>
            <View style={styles.checkbox} />
            <Text style={styles.checkText}>
              I agree to the terms and conditions
            </Text>
          </View>

          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Sign up</Text>
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/login" asChild>
              <Pressable>
                <Text style={styles.footerLink}>Login</Text>
              </Pressable>
            </Link>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 8,
  },
  logoBadge: {
    width: 52,
    height: 52,
    backgroundColor: palette.emeraldSoft,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  logoPill: {
    width: 30,
    height: 24,
    borderRadius: 15,
    backgroundColor: palette.emerald,
    borderWidth: 4,
    borderColor: "#f5fffb",
    transform: [{ rotate: "-28deg" }],
    justifyContent: "center",
    alignItems: "center",
  },
  logoBody: {
    width: 14,
    height: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    position: "absolute",
  },
  logoCrossH: {
    width: 12,
    height: 4,
    backgroundColor: "#ffffff",
    borderRadius: 3,
    position: "absolute",
  },
  logoCrossV: {
    width: 4,
    height: 12,
    backgroundColor: "#ffffff",
    borderRadius: 3,
    position: "absolute",
  },
  brand: {
    fontSize: 30,
    fontWeight: "800",
    color: palette.emeraldDark,
    letterSpacing: -0.7,
  },
  header: {
    fontSize: 32,
    fontWeight: "800",
    color: palette.text,
    textAlign: "center",
    marginTop: 8,
  },
  subheader: {
    fontSize: 15,
    color: palette.muted,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 22,
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f7faf8",
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: palette.text,
    fontSize: 15,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    backgroundColor: palette.emeraldSoft,
    borderWidth: 1,
    borderColor: palette.emerald,
  },
  checkText: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  primaryButton: {
    backgroundColor: palette.emerald,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: palette.emerald,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
  },
  primaryButtonText: {
    color: palette.white,
    fontSize: 17,
    fontWeight: "800",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 6,
  },
  footerText: {
    color: palette.muted,
    fontSize: 14,
  },
  footerLink: {
    color: palette.emeraldDark,
    fontWeight: "800",
    fontSize: 14,
  },
});
