import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";

export default function Index() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg text-black">
        Index page
        <TouchableOpacity onPress={() => router.push("/public/landing")}>
          <Button size="md" variant="solid" action="primary">
            <ButtonText>Go to landing</ButtonText>
          </Button>
        </TouchableOpacity>
      </Text>
    </View>
  );
}
