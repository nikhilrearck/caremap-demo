import { Stack, Tabs } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

import "@/global.css";
import { AuthProvider } from "./context/AuthProvider";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </GluestackUIProvider>
  );
}
