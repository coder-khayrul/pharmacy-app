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
  emeraldSoft: "#eafaf3",
  greenPastel: "#d6f7e8",
  white: "#ffffff",
  text: "#123129",
  muted: "#5d7d73",
  border: "#dfeee7",
  background: "#edfdf8",
  shadow: "rgba(16, 160, 109, 0.18)",
};

export default function LoginScreen() {
  const rise = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    Animated.timing(rise, {
      toValue: 0,
      duration: 500,
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
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <View style={styles.logoPill}>
                <View style={styles.logoBody} />
                <View style={styles.logoCrossH} />
                <View style={styles.logoCrossV} />
              </View>
            </View>
            <Text style={styles.brand}>PharmaCare</Text>
          </View>

          <Text style={styles.header}>Welcome back</Text>
          <Text style={styles.subheader}>
            Login to continue your pharmacy workflow
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Username or email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={palette.muted}
              autoCapitalize="none"
              autoCorrect={false}
              value="admin@pharmacare.com"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={palette.muted}
              secureTextEntry
              value="**********"
            />
          </View>

          <View style={styles.rowBetween}>
            <View style={styles.checkWrap}>
              <View style={styles.checkbox} />
              <Text style={styles.checkText}>Remember me</Text>
            </View>
            <Text style={styles.linkText}>Forgot password?</Text>
          </View>

          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Login</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
            <Pressable style={styles.socialButton}>
              <Text style={styles.socialText}>Google</Text>
            </Pressable>
            <Pressable style={styles.socialButton}>
              <Text style={styles.socialText}>Apple</Text>
            </Pressable>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don’t have an account?</Text>
            <Link href="/signup" asChild>
              <Pressable>
                <Text style={styles.footerLink}>Sign up</Text>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 36,
    justifyContent: "center",
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 24,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 10,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    gap: 10,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: palette.greenPastel,
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
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5faf7",
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: palette.text,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 22,
  },
  checkWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  },
  linkText: {
    color: palette.emeraldDark,
    fontWeight: "700",
    fontSize: 13,
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#dfeee7",
  },
  dividerText: {
    marginHorizontal: 12,
    color: palette.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    backgroundColor: "#f4faf7",
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  socialText: {
    color: palette.text,
    fontWeight: "700",
    fontSize: 14,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
