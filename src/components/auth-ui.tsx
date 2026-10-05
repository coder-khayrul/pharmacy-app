import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const colors = {
  green: "#0e9d77",
  greenDark: "#087457",
  text: "#123129",
  muted: "#648078",
  border: "#dfeee7",
  red: "#c73f49",
};

type PasswordFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  autoComplete?: "current-password" | "new-password";
};

export function PasswordField({
  label,
  value,
  onChangeText,
  placeholder,
  autoComplete,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordWrap}>
        <TextInput
          style={styles.passwordInput}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          secureTextEntry={!isVisible}
          autoCapitalize="none"
          autoComplete={autoComplete}
          value={value}
          onChangeText={onChangeText}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isVisible ? "Hide password" : "Show password"}
          onPress={() => setIsVisible((current) => !current)}
          hitSlop={10}
          style={styles.eyeButton}
        >
          <View style={styles.eyeShape}>
            <View style={styles.eyePupil} />
          </View>
          {!isVisible && <View style={styles.eyeSlash} />}
        </Pressable>
      </View>
    </View>
  );
}

export function PasswordRequirements({ password }: { password: string }) {
  const rules = [
    { label: "At least 6 characters", valid: password.length >= 6 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /\d/.test(password) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <View style={styles.rulesList}>
      {rules.map((rule) => (
        <View key={rule.label} style={styles.ruleRow}>
          <View style={[styles.ruleIcon, rule.valid ? styles.ruleIconValid : styles.ruleIconInvalid]}>
            <Text style={[styles.ruleIconText, rule.valid ? styles.validText : styles.invalidText]}>
              {rule.valid ? "✓" : "×"}
            </Text>
          </View>
          <Text style={[styles.ruleText, rule.valid && styles.ruleTextValid]}>{rule.label}</Text>
        </View>
      ))}
    </View>
  );
}

export function FormToast({
  message,
  kind,
  onDismiss,
}: {
  message: string;
  kind: "error" | "success" | "info";
  onDismiss: () => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    if (!message) return;
    opacity.setValue(0);
    translateY.setValue(-12);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, speed: 20, bounciness: 4, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(onDismiss, 4200);
    return () => clearTimeout(timer);
  }, [message, onDismiss, opacity, translateY]);

  if (!message) return null;

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      style={[
        styles.toast,
        kind === "error" ? styles.toastError : kind === "success" ? styles.toastSuccess : styles.toastInfo,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.toastMark}>
        <Text style={styles.toastMarkText}>{kind === "error" ? "!" : kind === "success" ? "✓" : "i"}</Text>
      </View>
      <Text style={styles.toastMessage}>{message}</Text>
      <Pressable onPress={onDismiss} accessibilityRole="button" accessibilityLabel="Dismiss notification" hitSlop={8}>
        <Text style={styles.toastClose}>×</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 14,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  passwordWrap: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7faf8",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingLeft: 14,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 13,
    color: colors.text,
    fontSize: 15,
  },
  eyeButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  eyeShape: {
    width: 19,
    height: 13,
    borderWidth: 1.7,
    borderColor: colors.muted,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  eyePupil: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.muted,
  },
  eyeSlash: {
    position: "absolute",
    width: 23,
    height: 1.5,
    backgroundColor: colors.muted,
    transform: [{ rotate: "-42deg" }],
  },
  rulesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: -4,
    marginBottom: 14,
  },
  ruleRow: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ruleIcon: {
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  ruleIconValid: {
    backgroundColor: "#e4f7ee",
    borderColor: "#a9dec2",
  },
  ruleIconInvalid: {
    backgroundColor: "#fff0f0",
    borderColor: "#edc2c4",
  },
  ruleIconText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "900",
  },
  validText: {
    color: colors.greenDark,
  },
  invalidText: {
    color: colors.red,
  },
  ruleText: {
    color: colors.red,
    fontSize: 10,
    fontWeight: "600",
  },
  ruleTextValid: {
    color: colors.greenDark,
  },
  toast: {
    position: "absolute",
    zIndex: 50,
    elevation: 15,
    top: 10,
    right: 14,
    width: "88%",
    maxWidth: 420,
    minHeight: 58,
    borderRadius: 15,
    paddingHorizontal: 13,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#123129",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
  },
  toastError: {
    backgroundColor: "#fff7f6",
    borderWidth: 1,
    borderColor: "#f1c4c0",
  },
  toastSuccess: {
    backgroundColor: "#f2fbf5",
    borderWidth: 1,
    borderColor: "#bfe4ca",
  },
  toastInfo: {
    backgroundColor: "#f1f8ff",
    borderWidth: 1,
    borderColor: "#bfdcf0",
  },
  toastMark: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "rgba(18, 49, 41, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  toastMarkText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  toastMessage: {
    color: colors.text,
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
  },
  toastClose: {
    color: colors.muted,
    fontSize: 22,
    lineHeight: 24,
    marginLeft: 8,
  },
});
