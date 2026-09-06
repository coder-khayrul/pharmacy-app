import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const palette = {
  background: "#f3fbf7",
  white: "#ffffff",
  text: "#123129",
  muted: "#668179",
  border: "#e0eee8",
  emerald: "#0e9d77",
  emeraldDark: "#087457",
  mint: "#dff8ee",
  orange: "#f2a65a",
  orangeSoft: "#fff1df",
  blue: "#648bd8",
  blueSoft: "#e9efff",
  red: "#d86c61",
};

const stats = [
  { label: "Total sales", value: "$18,450", change: "+12.8%", tone: palette.emerald, icon: "$" },
  { label: "Orders today", value: "128", change: "+8.4%", tone: palette.blue, icon: "#" },
  { label: "Low stock items", value: "16", change: "Needs attention", tone: palette.orange, icon: "!" },
  { label: "Customers", value: "2,840", change: "+4.6%", tone: palette.red, icon: "o" },
];

const orders = [
  { id: "#PC-1048", customer: "Amina Rahman", items: "3 items", amount: "$42.80", status: "Paid", tone: palette.mint },
  { id: "#PC-1047", customer: "Daniel Smith", items: "5 items", amount: "$86.20", status: "Processing", tone: palette.blueSoft },
  { id: "#PC-1046", customer: "Nadia Khan", items: "2 items", amount: "$19.50", status: "Paid", tone: palette.mint },
  { id: "#PC-1045", customer: "James Wilson", items: "7 items", amount: "$124.90", status: "Pending", tone: palette.orangeSoft },
];

const inventory = [
  { name: "Paracetamol 500mg", detail: "Only 8 units left", level: 8, tone: palette.red },
  { name: "Amoxicillin 250mg", detail: "Only 14 units left", level: 18, tone: palette.orange },
  { name: "Omeprazole 20mg", detail: "Only 22 units left", level: 28, tone: palette.orange },
];

const footerItems = [
  { label: "Home", icon: "⌂", tab: "Overview" },
  { label: "Inventory", icon: "▦", tab: "Inventory" },
  { label: "Orders", icon: "≡", tab: "Orders" },
  { label: "Customers", icon: "○", tab: "Customers" },
];

function BrandMark() {
  return (
    <View style={styles.logoBadge}>
      <View style={styles.logoPill}>
        <View style={styles.logoCrossHorizontal} />
        <View style={styles.logoCrossVertical} />
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState("Overview");
  const isWide = width >= 800;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.shell, isWide && styles.wideShell]}>
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <BrandMark />
              <View>
                <Text style={styles.brand}>PharmaCare</Text>
                <Text style={styles.brandCaption}>PHARMACY MANAGEMENT</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <Pressable style={styles.iconButton} accessibilityLabel="Notifications">
                <Text style={styles.iconText}>!</Text>
                <View style={styles.notificationDot} />
              </Pressable>
              <View style={styles.avatar}><Text style={styles.avatarText}>AD</Text></View>
              {isWide ? <Text style={styles.userName}>Admin</Text> : null}
              <Pressable onPress={() => router.replace("/login")} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Log out</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.navigation}>
            {["Overview", "Inventory", "Orders", "Customers"].map((tab) => (
              <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.navItem, activeTab === tab && styles.navItemActive]}>
                <Text style={[styles.navText, activeTab === tab && styles.navTextActive]}>{tab}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.eyebrow}>MONDAY, 06 SEPTEMBER 2026</Text>
              <Text style={styles.title}>Good morning, Admin</Text>
              <Text style={styles.subtitle}>Here&apos;s what&apos;s happening at your pharmacy today.</Text>
            </View>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonIcon}>+</Text>
              <Text style={styles.primaryButtonText}>New sale</Text>
            </Pressable>
          </View>

          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.tone + "18" }]}>
                  <Text style={[styles.statIconText, { color: stat.tone }]}>{stat.icon}</Text>
                </View>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={[styles.statChange, { color: stat.tone }]}>{stat.change}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.contentGrid, isWide && styles.contentGridWide]}>
            <View style={styles.mainColumn}>
              <View style={styles.panel}>
                <View style={styles.panelHeader}>
                  <View><Text style={styles.panelTitle}>Sales overview</Text><Text style={styles.panelHint}>Revenue performance this week</Text></View>
                  <Pressable style={styles.periodButton}><Text style={styles.periodText}>This week  v</Text></Pressable>
                </View>
                <View style={styles.chartSummary}><Text style={styles.chartTotal}>$4,280</Text><Text style={styles.chartChange}>+18.2% from last week</Text></View>
                <View style={styles.chart}>
                  {[42, 62, 50, 76, 58, 92, 70].map((height, index) => (
                    <View key={index} style={styles.chartColumn}>
                      <View style={[styles.chartBar, { height, backgroundColor: index === 5 ? palette.emerald : palette.mint }]} />
                      <Text style={styles.chartDay}>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.panel}>
                <View style={styles.panelHeader}><View><Text style={styles.panelTitle}>Recent orders</Text><Text style={styles.panelHint}>Your latest pharmacy transactions</Text></View><Pressable><Text style={styles.viewAll}>View all</Text></Pressable></View>
                {orders.map((order) => (
                  <View key={order.id} style={styles.orderRow}>
                    <View style={[styles.orderIcon, { backgroundColor: order.tone }]}><Text style={styles.orderIconText}>+</Text></View>
                    <View style={styles.orderCustomer}><Text style={styles.orderId}>{order.id}</Text><Text style={styles.orderMeta}>{order.customer} · {order.items}</Text></View>
                    <Text style={styles.orderAmount}>{order.amount}</Text>
                    <Text style={[styles.orderStatus, { color: order.status === "Pending" ? palette.orange : palette.emeraldDark }]}>{order.status}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sideColumn}>
              <View style={styles.panel}>
                <View style={styles.panelHeader}><View><Text style={styles.panelTitle}>Low stock alert</Text><Text style={styles.panelHint}>Items that need replenishing</Text></View><Text style={styles.alertCount}>16</Text></View>
                {inventory.map((item) => (
                  <View key={item.name} style={styles.inventoryRow}><View style={styles.inventoryCopy}><Text style={styles.inventoryName}>{item.name}</Text><Text style={styles.inventoryDetail}>{item.detail}</Text><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${item.level}%`, backgroundColor: item.tone }]} /></View></View><Text style={[styles.inventoryChevron, { color: item.tone }]}>›</Text></View>
                ))}
                <Pressable style={styles.outlineButton}><Text style={styles.outlineButtonText}>Review inventory</Text></Pressable>
              </View>
              <View style={styles.tipPanel}><Text style={styles.tipLabel}>QUICK TIP</Text><Text style={styles.tipTitle}>Keep your shelves ready.</Text><Text style={styles.tipCopy}>Review low stock items before the afternoon rush to avoid missed sales.</Text><Pressable><Text style={styles.tipLink}>Open inventory  →</Text></Pressable></View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footerMenu}>
        <View style={styles.footerMenuInner}>
          {footerItems.map((item) => (
            <Pressable
              key={item.label}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => setActiveTab(item.tab)}
              style={styles.footerItem}
            >
              <View style={[styles.footerIconWrap, activeTab === item.tab && styles.footerIconWrapActive]}>
                <Text style={[styles.footerIcon, activeTab === item.tab && styles.footerIconActive]}>{item.icon}</Text>
              </View>
              <Text style={[styles.footerLabel, activeTab === item.tab && styles.footerLabelActive]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  scrollContent: { paddingBottom: 124 },
  shell: { width: "100%", paddingHorizontal: 20 },
  wideShell: { maxWidth: 1180, alignSelf: "center", paddingHorizontal: 32 },
  header: { minHeight: 82, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: palette.border },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoBadge: { width: 38, height: 38, borderRadius: 13, backgroundColor: palette.mint, justifyContent: "center", alignItems: "center" },
  logoPill: { width: 22, height: 17, borderRadius: 12, backgroundColor: palette.emerald, transform: [{ rotate: "-28deg" }], justifyContent: "center", alignItems: "center" },
  logoCrossHorizontal: { position: "absolute", width: 10, height: 3, borderRadius: 2, backgroundColor: palette.white },
  logoCrossVertical: { position: "absolute", width: 3, height: 10, borderRadius: 2, backgroundColor: palette.white },
  brand: { color: palette.emeraldDark, fontSize: 21, fontWeight: "800" },
  brandCaption: { color: palette.muted, fontSize: 8, fontWeight: "700", letterSpacing: 1 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.border, alignItems: "center", justifyContent: "center" },
  iconText: { color: palette.emeraldDark, fontWeight: "800" },
  notificationDot: { position: "absolute", top: 7, right: 8, width: 5, height: 5, borderRadius: 3, backgroundColor: palette.orange },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: palette.emerald, justifyContent: "center", alignItems: "center" },
  avatarText: { color: palette.white, fontSize: 11, fontWeight: "800" },
  userName: { color: palette.text, fontSize: 14, fontWeight: "700", marginLeft: -5 },
  logoutButton: { paddingVertical: 8, paddingLeft: 2 },
  logoutText: { color: palette.muted, fontSize: 13, fontWeight: "700" },
  navigation: { flexDirection: "row", gap: 22, borderBottomWidth: 1, borderBottomColor: palette.border },
  navItem: { paddingVertical: 15, borderBottomWidth: 2, borderBottomColor: "transparent" },
  navItemActive: { borderBottomColor: palette.emerald },
  navText: { color: palette.muted, fontSize: 13, fontWeight: "700" },
  navTextActive: { color: palette.emeraldDark },
  greetingRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", paddingTop: 32, paddingBottom: 25, gap: 16 },
  eyebrow: { color: palette.emerald, fontSize: 10, fontWeight: "800", letterSpacing: 1.2, marginBottom: 7 },
  title: { color: palette.text, fontSize: 28, fontWeight: "800" },
  subtitle: { color: palette.muted, fontSize: 14, marginTop: 6 },
  primaryButton: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: palette.emerald, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16 },
  primaryButtonIcon: { color: palette.white, fontSize: 19, fontWeight: "400" },
  primaryButtonText: { color: palette.white, fontSize: 13, fontWeight: "800" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: { flexGrow: 1, flexBasis: 190, minHeight: 142, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.border, borderRadius: 12, padding: 16 },
  statIcon: { width: 32, height: 32, borderRadius: 9, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  statIconText: { fontSize: 17, fontWeight: "800" },
  statLabel: { color: palette.muted, fontSize: 12, fontWeight: "700" },
  statValue: { color: palette.text, fontSize: 24, fontWeight: "800", marginTop: 5 },
  statChange: { fontSize: 11, fontWeight: "700", marginTop: 7 },
  contentGrid: { gap: 14, marginTop: 14 },
  contentGridWide: { flexDirection: "row", alignItems: "flex-start" },
  mainColumn: { flex: 1, gap: 14 },
  sideColumn: { flex: 0.62, gap: 14 },
  panel: { backgroundColor: palette.white, borderRadius: 12, borderWidth: 1, borderColor: palette.border, padding: 18 },
  panelHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  panelTitle: { color: palette.text, fontSize: 16, fontWeight: "800" },
  panelHint: { color: palette.muted, fontSize: 11, marginTop: 4 },
  periodButton: { borderWidth: 1, borderColor: palette.border, borderRadius: 7, paddingHorizontal: 9, paddingVertical: 7 },
  periodText: { color: palette.muted, fontSize: 11, fontWeight: "700" },
  chartSummary: { flexDirection: "row", alignItems: "baseline", gap: 10, marginTop: 22 },
  chartTotal: { color: palette.text, fontSize: 25, fontWeight: "800" },
  chartChange: { color: palette.emerald, fontSize: 11, fontWeight: "700" },
  chart: { height: 150, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around", marginTop: 6, paddingTop: 25 },
  chartColumn: { height: "100%", alignItems: "center", justifyContent: "flex-end", gap: 7 },
  chartBar: { width: 22, borderRadius: 6 },
  chartDay: { color: palette.muted, fontSize: 10 },
  viewAll: { color: palette.emeraldDark, fontSize: 12, fontWeight: "800" },
  orderRow: { minHeight: 62, flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderTopColor: palette.border, marginTop: 14, paddingTop: 13, gap: 10 },
  orderIcon: { width: 32, height: 32, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  orderIconText: { color: palette.emeraldDark, fontSize: 17, fontWeight: "800" },
  orderCustomer: { flex: 1 },
  orderId: { color: palette.text, fontSize: 12, fontWeight: "800" },
  orderMeta: { color: palette.muted, fontSize: 11, marginTop: 4 },
  orderAmount: { color: palette.text, fontSize: 12, fontWeight: "800" },
  orderStatus: { width: 64, fontSize: 11, fontWeight: "800", textAlign: "right" },
  alertCount: { color: palette.orange, backgroundColor: palette.orangeSoft, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 6, fontSize: 12, fontWeight: "800" },
  inventoryRow: { flexDirection: "row", alignItems: "center", gap: 10, borderTopWidth: 1, borderTopColor: palette.border, marginTop: 15, paddingTop: 14 },
  inventoryCopy: { flex: 1 },
  inventoryName: { color: palette.text, fontSize: 12, fontWeight: "800" },
  inventoryDetail: { color: palette.muted, fontSize: 11, marginTop: 4 },
  progressTrack: { height: 5, backgroundColor: palette.background, borderRadius: 3, marginTop: 9, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  inventoryChevron: { fontSize: 24, fontWeight: "400" },
  outlineButton: { alignItems: "center", borderWidth: 1, borderColor: palette.border, borderRadius: 8, paddingVertical: 10, marginTop: 18 },
  outlineButtonText: { color: palette.emeraldDark, fontSize: 12, fontWeight: "800" },
  tipPanel: { backgroundColor: palette.emeraldDark, borderRadius: 12, padding: 19 },
  tipLabel: { color: palette.mint, fontSize: 9, fontWeight: "800", letterSpacing: 1.2 },
  tipTitle: { color: palette.white, fontSize: 18, fontWeight: "800", marginTop: 12 },
  tipCopy: { color: "#bce6d7", fontSize: 12, lineHeight: 18, marginTop: 8 },
  tipLink: { color: palette.white, fontSize: 12, fontWeight: "800", marginTop: 18 },
  footerMenu: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingBottom: 12, paddingTop: 8, backgroundColor: "rgba(243, 251, 247, 0.96)", borderTopWidth: 1, borderTopColor: palette.border },
  footerMenuInner: { width: "100%", maxWidth: 620, alignSelf: "center", minHeight: 62, flexDirection: "row", alignItems: "center", justifyContent: "space-around", backgroundColor: palette.white, borderWidth: 1, borderColor: palette.border, borderRadius: 18, paddingHorizontal: 8, shadowColor: palette.emeraldDark, shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 8 },
  footerItem: { minWidth: 66, alignItems: "center", justifyContent: "center", paddingVertical: 6, gap: 3 },
  footerIconWrap: { width: 32, height: 27, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  footerIconWrapActive: { backgroundColor: palette.mint },
  footerIcon: { color: palette.muted, fontSize: 18, lineHeight: 20, fontWeight: "700" },
  footerIconActive: { color: palette.emeraldDark },
  footerLabel: { color: palette.muted, fontSize: 10, fontWeight: "700" },
  footerLabelActive: { color: palette.emeraldDark },
});