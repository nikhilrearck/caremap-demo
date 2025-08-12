import { TrackProvider } from '@/context/TrackContext';
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <TrackProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="questions/[itemId]" />
        <Stack.Screen name="addItem" />
      </Stack>
     </TrackProvider>
  );
};

export default StackLayout;
