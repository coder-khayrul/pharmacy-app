import { Link } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const palette = {
  emerald: "#0e9d77",
  emeraldDark: "#0a7d61",
  emeraldSoft: "#dff8ee",
  mint: "#cfeee2",
  card: "#f8fffd",
  text: "#123129",
  muted: "#5d7d73",
  white: "#ffffff",
  shadow: "rgba(14, 157, 119, 0.18)",
};

function BrandMark() {
  return (
    <View style={styles.brandIconWrap}>
      <View style={styles.brandPill}>
        <View style={styles.brandBody} />
        <View style={styles.brandPlusHorizontal} />
        <View style={styles.brandPlusVertical} />
      </View>
    </View>
  );
}

export default function WelcomeScreen() {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [floatAnim]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundGlowOne} />
      <View style={styles.backgroundGlowTwo} />

      <Animated.View
        style={[styles.heroCard, { transform: [{ translateY: floatAnim }] }]}
      >
        <BrandMark />
        <Text style={styles.brandText}>PharmaCare</Text>
        <Text style={styles.subtitle}>
          Pharmacy Management App UI (Core Sketch)
        </Text>
      </Animated.View>

      <View style={styles.actionsWrap}>
        <Link href="/login" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Login</Text>
          </Pressable>
        </Link>

        <Link href="/signup" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Create account</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Secure medicine inventory</Text>
        <Text style={styles.footerDot}>•</Text>
        <Text style={styles.footerText}>Fast checkout</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#edfef7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    overflow: "hidden",
  },
  backgroundGlowOne: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(11, 159, 122, 0.12)",
    top: -90,
    left: -80,
  },
  backgroundGlowTwo: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "rgba(0, 195, 144, 0.08)",
    right: -120,
    bottom: -80,
  },
  heroCard: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 30,
  },
  brandIconWrap: {
    width: 132,
    height: 132,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  brandPill: {
    width: 118,
    height: 94,
    borderRadius: 48,
    backgroundColor: "#f6fffb",
    borderWidth: 10,
    borderColor: palette.emerald,
    transform: [{ rotate: "-28deg" }],
    justifyContent: "center",
    alignItems: "center",
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.25,
    shadowRadius: 22,
    elevation: 10,
  },
  brandBody: {
    width: 62,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.emerald,
    position: "absolute",
    left: 26,
    top: 26,
  },
  brandPlusHorizontal: {
    position: "absolute",
    width: 24,
    height: 8,
    backgroundColor: "#ffffff",
    borderRadius: 6,
  },
  brandPlusVertical: {
    position: "absolute",
    width: 8,
    height: 24,
    backgroundColor: "#ffffff",
    borderRadius: 6,
  },
  brandText: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "800",
    color: palette.emeraldDark,
    letterSpacing: -1.4,
  },
  subtitle: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600",
    color: palette.muted,
    maxWidth: 330,
  },
  actionsWrap: {
    width: "100%",
    maxWidth: 360,
    gap: 14,
  },
  primaryButton: {
    backgroundColor: palette.emerald,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: palette.emerald,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
  },
  primaryButtonText: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "rgba(14, 157, 119, 0.08)",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(14, 157, 119, 0.18)",
  },
  secondaryButtonText: {
    color: palette.emeraldDark,
    fontSize: 18,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
    gap: 8,
  },
  footerText: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  footerDot: {
    color: palette.emerald,
    fontSize: 20,
    marginTop: -2,
  },
});
