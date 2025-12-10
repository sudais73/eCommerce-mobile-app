import SafeScreen from "@/components/SafeScreen";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
<SafeAreaProvider>
    <SafeScreen>
    <Stack screenOptions={{ headerShown: false }}>

      {/* Auth Stack */}
      <Stack.Screen name="(auth)" />

      {/* Main Tabs */}
      <Stack.Screen name="(tabs)" />

      {/* Index (redirect logic) */}
      <Stack.Screen name="index" />

    </Stack>
    </SafeScreen>
     </SafeAreaProvider>

  );
}
