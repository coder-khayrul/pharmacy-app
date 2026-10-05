import { Link, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

  import { FormToast, PasswordField, PasswordRequirements } from "@/components/auth-ui";
  import { requestSignupVerification, verifySignupCode } from "@/lib/auth";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"details" | "verification">("details");
  const [toast, setToast] = useState<{ message: string; kind: "error" | "success" | "info" }>({ message: "", kind: "info" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const codeInput = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(rise, {
      toValue: 0,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [rise]);

  const showToast = (message: string, kind: "error" | "success" | "info" = "error") => {
    setToast({ message, kind });
  };

  const validateDetails = () => {
    if (!name.trim()) return "Enter your full name to continue.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Enter a valid email address.";
    if (password.length < 6) return "Your password needs at least 6 characters.";
    if (!/[A-Z]/.test(password)) return "Add at least one uppercase letter to your password.";
    if (!/[a-z]/.test(password)) return "Add at least one lowercase letter to your password.";
    if (!/\d/.test(password)) return "Add at least one number to your password.";
    if (!/[^A-Za-z0-9]/.test(password)) return "Add at least one special character to your password.";
    if (password !== confirmPassword) return "Your passwords do not match.";
    if (!acceptedTerms) return "Please accept the Privacy Policy to continue.";
    return "";
  };

  const requestCode = async () => {
    const validationMessage = validateDetails();
    if (validationMessage) {
      showToast(validationMessage);
      return;
    }

    setIsSubmitting(true);
    try {
      await requestSignupVerification({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        acceptedPolicy: "true",
      });
      setStep("verification");
      showToast("A 6-digit verification code was sent to your email.", "success");
    } catch (submitError) {
      showToast(submitError instanceof Error ? submitError.message : "Unable to send a verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeSignup = async () => {
    if (!/^\d{6}$/.test(verificationCode)) {
      showToast("Enter the complete 6-digit code from your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      await verifySignupCode(email.trim().toLowerCase(), verificationCode);
      setToast({ message: "Email verified. Your account is ready; please log in.", kind: "success" });
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => router.replace("/login"), 1800);
    } catch (submitError) {
      showToast(submitError instanceof Error ? submitError.message : "Unable to verify your email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FormToast message={toast.message} kind={toast.kind} onDismiss={() => setToast((current) => ({ ...current, message: "" }))} />
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

          <Text style={styles.header}>{step === "details" ? "Create account" : "Verify your email"}</Text>
          <Text style={styles.subheader}>
            {step === "details" ? "Set up your pharmacy management access" : `We sent a 6-digit code to ${email.trim()}`}
          </Text>

          <View style={styles.progressSection}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, step === "verification" && styles.progressComplete]} />
            </View>
            <Text style={styles.progressLabel}>{step === "details" ? "STEP 1 OF 2  ·  YOUR DETAILS" : "STEP 2 OF 2  ·  EMAIL VERIFICATION"}</Text>
          </View>

          {step === "details" ? (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full name</Text>
                <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor={palette.muted} value={name} onChangeText={setName} autoComplete="name" />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Email address</Text>
                <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor={palette.muted} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" value={email} onChangeText={setEmail} />
              </View>
              <PasswordField label="Password" placeholder="Create a password" value={password} onChangeText={setPassword} autoComplete="new-password" />
              <PasswordRequirements password={password} />
              <PasswordField label="Confirm password" placeholder="Re-enter your password" value={confirmPassword} onChangeText={setConfirmPassword} autoComplete="new-password" />

              <View style={styles.checkRow}>
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: acceptedTerms }}
                  onPress={() => setAcceptedTerms((current) => !current)}
                  style={[styles.checkbox, acceptedTerms && styles.checkboxSelected]}
                >
                  {acceptedTerms && <Text style={styles.checkboxCheck}>✓</Text>}
                </Pressable>
                <Text style={styles.checkText}>
                  I agree to the <Text style={styles.policyLink} onPress={() => router.push("/privacy")}>Privacy Policy</Text>
                </Text>
              </View>

              <Pressable style={[styles.primaryButton, isSubmitting && styles.disabledButton]} disabled={isSubmitting} onPress={requestCode}>
                <Text style={styles.primaryButtonText}>{isSubmitting ? "Sending code..." : "Next: verify email"}</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable style={styles.codeBoxes} onPress={() => codeInput.current?.focus()}>
                {Array.from({ length: 6 }, (_, index) => (
                  <View key={index} style={[styles.codeBox, verificationCode.length === index && styles.codeBoxActive]}>
                    <Text style={styles.codeDigit}>{verificationCode[index] || ""}</Text>
                  </View>
                ))}
                <TextInput
                  ref={codeInput}
                  value={verificationCode}
                  onChangeText={(value) => setVerificationCode(value.replace(/\D/g, "").slice(0, 6))}
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                  textContentType="oneTimeCode"
                  accessibilityLabel="Six-digit email verification code"
                  style={styles.hiddenCodeInput}
                  maxLength={6}
                />
              </Pressable>
              <Text style={styles.codeHelp}>Enter the code exactly as it appears in your inbox.</Text>
              <Pressable style={[styles.primaryButton, isSubmitting && styles.disabledButton]} disabled={isSubmitting} onPress={completeSignup}>
                <Text style={styles.primaryButtonText}>{isSubmitting ? "Verifying..." : "Verify and create account"}</Text>
              </Pressable>
              <Pressable style={styles.backAction} onPress={() => setStep("details")}>
                <Text style={styles.backActionText}>Back to details</Text>
              </Pressable>
            </>
          )}

          {step === "details" && <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/login" asChild><Pressable><Text style={styles.footerLink}>Login</Text></Pressable></Link>
          </View>}
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
  progressSection: {
    marginBottom: 20,
  },
  progressTrack: {
    height: 6,
    borderRadius: 4,
    backgroundColor: "#e7f1ec",
    overflow: "hidden",
  },
  progressFill: {
    width: "50%",
    height: "100%",
    backgroundColor: palette.emerald,
    borderRadius: 4,
  },
  progressComplete: {
    width: "100%",
  },
  progressLabel: {
    color: palette.muted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginTop: 8,
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
  checkboxSelected: {
    backgroundColor: palette.emerald,
  },
  checkboxCheck: {
    color: palette.white,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
  },
  checkText: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  policyLink: {
    color: palette.emeraldDark,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
  codeBoxes: {
    position: "relative",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
    marginTop: 8,
  },
  codeBox: {
    flex: 1,
    maxWidth: 52,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "#f7faf8",
    alignItems: "center",
    justifyContent: "center",
  },
  codeBoxActive: {
    borderColor: palette.emerald,
    borderWidth: 2,
    backgroundColor: palette.emeraldSoft,
  },
  codeDigit: {
    color: palette.text,
    fontSize: 21,
    fontWeight: "800",
  },
  hiddenCodeInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0.01,
  },
  codeHelp: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  backAction: {
    alignItems: "center",
    paddingVertical: 14,
  },
  backActionText: {
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
  disabledButton: {
    opacity: 0.65,
  },
  errorText: {
    color: "#c0392b",
    fontSize: 13,
    marginBottom: 12,
    textAlign: "center",
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
