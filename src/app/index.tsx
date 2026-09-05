import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const palette = {
  emerald: "#0e9d77",
  emeraldDark: "#087457",
  emeraldSoft: "#dff8ee",
  mint: "#bfe9d9",
  pale: "#f3fcf8",
  text: "#102f27",
  muted: "#648078",
  white: "#ffffff",
  orange: "#f2a65a",
  purple: "#8c79c9",
  shadow: "rgba(14, 157, 119, 0.16)",
};

const slides = [
  {
    eyebrow: "WELCOME TO PHARMACARE",
    title: "Your pharmacy, in sync.",
    description:
      "A calmer way to manage medicines, inventory, orders, and payments from one smart workspace.",
    tone: palette.emerald,
    kind: "overview",
  },
  {
    eyebrow: "STAY AHEAD",
    title: "Know your stock at a glance.",
    description:
      "Track quantities, spot low-stock items, and keep expiry dates visible before they become a problem.",
    tone: palette.orange,
    kind: "inventory",
  },
  {
    eyebrow: "SIMPLE CHECKOUT",
    title: "From cart to care, effortlessly.",
    description:
      "Process orders, verify payments, and keep every sale connected to accurate inventory records.",
    tone: palette.purple,
    kind: "checkout",
  },
] as const;

type SlideKind = (typeof slides)[number]["kind"];

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

function FeatureArtwork({ kind, tone }: { kind: SlideKind; tone: string }) {
  if (kind === "inventory") {
    return (
      <View style={styles.artworkFrame}>
        <View style={styles.artworkHeader}>
          <View style={styles.artworkMenu} />
          <Text style={styles.artworkHeaderText}>Inventory</Text>
          <Text style={styles.artworkHeaderAction}>+</Text>
        </View>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>o</Text>
          <Text style={styles.searchText}>Search medicines</Text>
        </View>
        {[
          ["Napa 500mg", "150 in stock", "#dff8ee"],
          ["Seclo 20mg", "80 in stock", "#e7edff"],
          ["Ace 20mg", "12 in stock", "#fff0dc"],
        ].map(([name, stock, background]) => (
          <View style={styles.medicineRow} key={name}>
            <View style={[styles.medicineDot, { backgroundColor: background }]}>
              <View style={[styles.medicineDotInner, { backgroundColor: tone }]} />
            </View>
            <View style={styles.medicineCopy}>
              <Text style={styles.medicineName}>{name}</Text>
              <Text style={styles.medicineStock}>{stock}</Text>
            </View>
            <Text style={styles.rowChevron}>{">"}</Text>
          </View>
        ))}
        <View style={styles.alertStrip}>
          <Text style={[styles.alertMark, { color: tone }]}>!</Text>
          <Text style={styles.alertText}>3 items need attention</Text>
        </View>
      </View>
    );
  }

  if (kind === "checkout") {
    return (
      <View style={styles.artworkFrame}>
        <View style={styles.artworkHeader}>
          <View style={styles.artworkMenu} />
          <Text style={styles.artworkHeaderText}>Order summary</Text>
          <Text style={styles.artworkHeaderAction}>...</Text>
        </View>
        <View style={styles.checkoutBadge}>
          <View style={[styles.checkCircle, { backgroundColor: tone }]}>
            <Text style={styles.checkMark}>+</Text>
          </View>
          <View>
            <Text style={styles.checkoutTitle}>Payment verified</Text>
            <Text style={styles.checkoutSubtext}>Order #1025 is ready</Text>
          </View>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total amount</Text>
          <Text style={styles.totalValue}>$18.45</Text>
        </View>
        <View style={styles.invoiceLine} />
        <View style={styles.invoiceLineShort} />
        <View style={[styles.payButton, { backgroundColor: tone }]}>
          <Text style={styles.payButtonText}>View invoice</Text>
          <Text style={styles.payButtonArrow}>{">"}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.artworkFrame}>
      <View style={styles.artworkHeader}>
        <View style={styles.artworkMenu} />
        <Text style={styles.artworkHeaderText}>Good morning, Admin</Text>
        <View style={styles.notificationDot} />
      </View>
      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total sales</Text>
          <Text style={styles.statValue}>$18,450</Text>
          <View style={[styles.statBar, { backgroundColor: tone, width: "72%" }]} />
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Medicines</Text>
          <Text style={styles.statValue}>320</Text>
          <View style={[styles.statBar, { backgroundColor: palette.mint, width: "52%" }]} />
        </View>
      </View>
      <View style={styles.chartCard}>
        <View style={styles.chartCopy}>
          <Text style={styles.statLabel}>Weekly overview</Text>
          <Text style={styles.chartValue}>$4,280</Text>
        </View>
        <View style={styles.chartBars}>
          {[34, 54, 42, 76, 60, 88, 68].map((height, index) => (
            <View
              key={index}
              style={[
                styles.chartBar,
                { height, backgroundColor: index === 5 ? tone : palette.mint },
              ]}
            />
          ))}
        </View>
      </View>
      <View style={styles.recentRow}>
        <View style={styles.recentIcon} />
        <View style={styles.medicineCopy}>
          <Text style={styles.medicineName}>Recent orders</Text>
          <Text style={styles.medicineStock}>Everything in one view</Text>
        </View>
        <Text style={styles.rowChevron}>{">"}</Text>
      </View>
    </View>
  );
}

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef<FlatList<(typeof slides)[number]>>(null);
  const isLastSlide = activeIndex === slides.length - 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(Math.max(0, Math.min(nextIndex, slides.length - 1)));
  };

  const goNext = () => {
    if (isLastSlide) {
      router.replace("/login");
      return;
    }

    const nextIndex = activeIndex + 1;
    setActiveIndex(nextIndex);
    listRef.current?.scrollToOffset({ offset: nextIndex * width, animated: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundGlowOne} />
      <View style={styles.backgroundGlowTwo} />

      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <BrandMark />
          <Text style={styles.brandText}>PharmaCare</Text>
        </View>
        {!isLastSlide && (
          <Pressable onPress={() => router.replace("/login")} hitSlop={12}>
            <Text style={styles.skipText}>Skip tour</Text>
          </Pressable>
        )}
      </View>

      <Animated.FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(item) => item.kind}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <FeatureArtwork kind={item.kind} tone={item.tone} />
            <Text style={[styles.eyebrow, { color: item.tone }]}>{item.eyebrow}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.bottomArea}>
        <View style={styles.pagination}>
          {slides.map((slide, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 28, 8],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={slide.kind}
                style={[styles.paginationDot, { width: dotWidth }]}
              />
            );
          })}
        </View>

        <Pressable style={styles.primaryButton} onPress={goNext}>
          <Text style={styles.primaryButtonText}>{isLastSlide ? "Get started" : "Next"}</Text>
          <Text style={styles.primaryButtonArrow}>{">"}</Text>
        </Pressable>

        {isLastSlide && (
          <Pressable style={styles.secondaryAction} onPress={() => router.replace("/signup")}>
            <Text style={styles.secondaryActionText}>Create a new account</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.pale,
    paddingTop: 10,
    overflow: "hidden",
  },
  backgroundGlowOne: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(11, 159, 122, 0.10)",
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  brandIconWrap: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  brandPill: {
    width: 33,
    height: 27,
    borderRadius: 16,
    backgroundColor: palette.emerald,
    borderWidth: 4,
    borderColor: palette.emerald,
    transform: [{ rotate: "-28deg" }],
    justifyContent: "center",
    alignItems: "center",
  },
  brandBody: {
    width: 17,
    height: 11,
    borderRadius: 8,
    backgroundColor: palette.white,
    position: "absolute",
  },
  brandPlusHorizontal: {
    position: "absolute",
    width: 13,
    height: 4,
    backgroundColor: palette.white,
    borderRadius: 6,
  },
  brandPlusVertical: {
    position: "absolute",
    width: 4,
    height: 13,
    backgroundColor: palette.white,
    borderRadius: 6,
  },
  brandText: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    color: palette.emeraldDark,
    letterSpacing: -0.5,
  },
  skipText: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  slide: {
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 20,
  },
  artworkFrame: {
    width: "100%",
    maxWidth: 370,
    height: 310,
    backgroundColor: palette.white,
    borderRadius: 28,
    padding: 18,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 28,
  },
  artworkHeader: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#edf4f0",
    paddingBottom: 10,
  },
  artworkMenu: {
    width: 18,
    height: 12,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: palette.emerald,
    marginRight: 10,
  },
  artworkHeaderText: {
    flex: 1,
    color: palette.text,
    fontSize: 12,
    fontWeight: "800",
  },
  artworkHeaderAction: {
    color: palette.emerald,
    fontSize: 18,
    fontWeight: "800",
  },
  notificationDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: palette.orange,
  },
  statRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.pale,
    borderRadius: 14,
    padding: 12,
  },
  statLabel: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: "700",
  },
  statValue: {
    color: palette.text,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 6,
  },
  statBar: {
    height: 5,
    borderRadius: 4,
    marginTop: 10,
  },
  chartCard: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f9fcfb",
    borderWidth: 1,
    borderColor: "#edf4f0",
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    height: 104,
  },
  chartCopy: {
    width: "42%",
    alignSelf: "flex-start",
  },
  chartValue: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 7,
  },
  chartBars: {
    flex: 1,
    height: 70,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  chartBar: {
    width: 10,
    borderRadius: 5,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingHorizontal: 4,
  },
  recentIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: palette.emeraldSoft,
    marginRight: 10,
  },
  medicineCopy: {
    flex: 1,
  },
  medicineName: {
    color: palette.text,
    fontSize: 11,
    fontWeight: "800",
  },
  medicineStock: {
    color: palette.muted,
    fontSize: 10,
    marginTop: 3,
  },
  rowChevron: {
    color: palette.muted,
    fontSize: 17,
    fontWeight: "700",
  },
  searchBar: {
    height: 32,
    borderWidth: 1,
    borderColor: "#e4efea",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 14,
  },
  searchIcon: {
    color: palette.muted,
    fontSize: 13,
    marginRight: 7,
  },
  searchText: {
    color: "#9aafa8",
    fontSize: 10,
  },
  medicineRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#edf4f0",
  },
  medicineDot: {
    width: 29,
    height: 29,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  medicineDotInner: {
    width: 17,
    height: 8,
    borderRadius: 8,
    transform: [{ rotate: "-30deg" }],
  },
  alertStrip: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#fff8ed",
    borderRadius: 9,
    padding: 8,
  },
  alertMark: {
    fontWeight: "900",
    fontSize: 14,
    marginRight: 7,
  },
  alertText: {
    color: palette.text,
    fontSize: 10,
    fontWeight: "700",
  },
  checkoutBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.pale,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  checkCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkMark: {
    color: palette.white,
    fontSize: 27,
    fontWeight: "500",
    transform: [{ rotate: "45deg" }],
  },
  checkoutTitle: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "800",
  },
  checkoutSubtext: {
    color: palette.muted,
    fontSize: 10,
    marginTop: 5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  totalLabel: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  totalValue: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "900",
  },
  invoiceLine: {
    height: 7,
    width: "62%",
    backgroundColor: "#e9f2ee",
    borderRadius: 4,
    marginTop: 22,
  },
  invoiceLineShort: {
    height: 7,
    width: "40%",
    backgroundColor: "#edf5f1",
    borderRadius: 4,
    marginTop: 8,
  },
  payButton: {
    height: 42,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 20,
  },
  payButtonText: {
    color: palette.white,
    fontSize: 11,
    fontWeight: "800",
  },
  payButtonArrow: {
    color: palette.white,
    fontSize: 17,
    fontWeight: "700",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.3,
    textAlign: "center",
    marginBottom: 12,
  },
  title: {
    color: palette.text,
    fontSize: 31,
    lineHeight: 37,
    fontWeight: "900",
    letterSpacing: -0.7,
    textAlign: "center",
    maxWidth: 350,
  },
  description: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    maxWidth: 340,
    marginTop: 12,
  },
  bottomArea: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 28,
    marginBottom: 10,
  },
  paginationDot: {
    height: 8,
    borderRadius: 5,
    backgroundColor: palette.emerald,
  },
  primaryButton: {
    backgroundColor: palette.emerald,
    borderRadius: 16,
    minHeight: 56,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.emerald,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
  },
  primaryButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "700",
  },
  primaryButtonArrow: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
  },
  secondaryAction: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 4,
  },
  secondaryActionText: {
    color: palette.emeraldDark,
    fontSize: 14,
    fontWeight: "700",
  },
});
