import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Text, TextInput, useColorScheme } from "react-native";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

type ComponentDefaults = {
  defaultProps?: {
    style?: unknown;
  };
};

const textWithDefaults = Text as typeof Text & ComponentDefaults;
const textInputWithDefaults = TextInput as typeof TextInput & ComponentDefaults;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      textWithDefaults.defaultProps = {
        ...textWithDefaults.defaultProps,
        style: [{ fontFamily: "Montserrat_400Regular" }, textWithDefaults.defaultProps?.style],
      };
      textInputWithDefaults.defaultProps = {
        ...textInputWithDefaults.defaultProps,
        style: [{ fontFamily: "Montserrat_400Regular" }, textInputWithDefaults.defaultProps?.style],
      };
    }

    const hideSplash = async () => {
      if (fontsLoaded || fontError) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplash();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}
      />
    </ThemeProvider>
  );
}
