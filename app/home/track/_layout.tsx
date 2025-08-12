// import { TrackContextProvider } from "@/context/TrackContext";
import { TrackContextProvider } from "@/context/TrackContext";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <TrackContextProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="questions/[itemId]" />
        <Stack.Screen name="addItem" />
      </Stack>
     </TrackContextProvider>
  );
};

export default StackLayout;
