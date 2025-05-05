

import { View, Text, Image } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuth } from "../context/AuthProvider";
import { router } from "expo-router"; // Import Expo Router

export default function Profile() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut(); // Execute the logout logic
    router.replace("/public/landing"); // Redirect to landing page
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Not logged in</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-6">
      <View className="flex-1 items-center justify-center bg-white">
        <Image 
          source={{ uri: user.picture }} 
          className="w-24 h-24 rounded-full" 
        />
        <Text className="text-xl font-bold mt-4">{user.name}</Text>
        <Text className="text-gray-600">{user.email}</Text>
      </View>

      <Button 
        onPress={handleLogout} // Use the new handler
        action="negative"
        variant="outline"
        className="mt-auto"
      >
        <ButtonText>Log Out</ButtonText>
      </Button>
    </View>
  );
}