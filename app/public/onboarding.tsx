import { useRouter } from "expo-router";
import { Text ,View,TouchableOpacity} from "react-native"

export default function  Onboarding() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-white">
    <Text className="text-lg text-black">
      Onboarding page
      <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text className="text-blue-500 mt-4">Go to login</Text>
            </TouchableOpacity>
    </Text>
    </View>
  )
}

