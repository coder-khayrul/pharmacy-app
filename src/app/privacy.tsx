import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const sections = [
  {
    title: "Information used",
    body: "When you register, PharmaCare uses your name and email address to create and identify your account. Your password is stored by the service as a protected hash, not as readable text.",
  },
  {
    title: "Email verification",
    body: "A one-time verification code is sent to the email address you provide. Pending signup details and the code are retained only while verification is active; the code expires after 10 minutes and failed attempts are limited.",
  },
  {
    title: "How information is used",
    body: "Account information is used to provide sign-in and the pharmacy management features. Do not enter sensitive medical information into account fields.",
  },
  {
    title: "Your choices",
    body: "You can choose not to create an account. For questions about access, correction, or deletion of account information, contact the pharmacy or service administrator managing this installation.",
  },
];

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.topLabel}>PHARMACARE</Text>
        <View style={styles.topSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>ACCOUNT & DATA</Text>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.intro}>A short explanation of the information used to create and protect your PharmaCare account.</Text>
        <View style={styles.updatedRow}>
          <View style={styles.updatedDot} />
          <Text style={styles.updatedText}>For the current app registration flow</Text>
        </View>
        {sections.map((section, index) => (
          <View style={styles.section} key={section.title}>
            <View style={styles.sectionNumber}><Text style={styles.sectionNumberText}>0{index + 1}</Text></View>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionBody}>{section.body}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.disclaimer}>This project notice should be reviewed and adapted by the organization operating the app before production use.</Text>
        <Pressable style={styles.doneButton} onPress={() => router.back()}>
          <Text style={styles.doneButtonText}>Back to registration</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f4fbf7" },
  topBar: {
    height: 58,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e3eee8",
  },
  backButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#e7f6ee", alignItems: "center", justifyContent: "center" },
  backIcon: { color: "#087457", fontSize: 30, lineHeight: 33, marginTop: -3 },
  topLabel: { color: "#087457", fontSize: 12, fontWeight: "800", letterSpacing: 1.2 },
  topSpacer: { width: 38 },
  content: { width: "100%", maxWidth: 680, alignSelf: "center", paddingHorizontal: 26, paddingTop: 34, paddingBottom: 40 },
  eyebrow: { color: "#0e9d77", fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: "#123129", fontSize: 34, fontWeight: "800", marginTop: 9 },
  intro: { color: "#648078", fontSize: 15, lineHeight: 23, marginTop: 12, maxWidth: 550 },
  updatedRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 19, marginBottom: 25 },
  updatedDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#f2a65a" },
  updatedText: { color: "#648078", fontSize: 11, fontWeight: "700" },
  section: { flexDirection: "row", paddingVertical: 17, borderTopWidth: 1, borderTopColor: "#e3eee8" },
  sectionNumber: { width: 40, height: 30, borderRadius: 10, backgroundColor: "#e5f5ed", alignItems: "center", justifyContent: "center", marginRight: 13 },
  sectionNumberText: { color: "#087457", fontSize: 10, fontWeight: "800" },
  sectionCopy: { flex: 1 },
  sectionTitle: { color: "#123129", fontSize: 15, fontWeight: "800", marginBottom: 6 },
  sectionBody: { color: "#648078", fontSize: 13, lineHeight: 20 },
  disclaimer: { color: "#826838", backgroundColor: "#fff7e8", borderRadius: 12, padding: 13, fontSize: 11, lineHeight: 17, marginTop: 18 },
  doneButton: { backgroundColor: "#0e9d77", minHeight: 52, borderRadius: 15, alignItems: "center", justifyContent: "center", marginTop: 22 },
  doneButtonText: { color: "#ffffff", fontSize: 14, fontWeight: "800" },
});
