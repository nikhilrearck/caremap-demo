import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
    <GluestackUIProvider mode="light">
      <Stack
        screenOptions={{
          headerShown: false,
          headerBackVisible: false,
        }}
      />
    </GluestackUIProvider>
  );
};

export default RootLayout;
