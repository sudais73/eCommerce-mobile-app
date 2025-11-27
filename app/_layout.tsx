import SafeScreen from "@/components/SafeScreen";
import { Stack } from "expo-router";
import "react-native-reanimated";

export default function RootLayout() {
  return (
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
  );
}
