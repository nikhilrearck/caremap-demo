import { useRouter } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";

export default function Landing() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg text-black">
        Landing page
        <TouchableOpacity onPress={() => router.push("/public/onboarding")}>
          <Text className="text-blue-500 mt-4">Go to onboarding</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
}
