import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
export default function Login() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg text-black">
        Login page
        <TouchableOpacity onPress={() => router.push("/home/profile")}>
          <Text className="text-blue-500 mt-4">Go to profile</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
}
