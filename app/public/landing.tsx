import { Image } from "react-native";
import { View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
export default function Landing() {
  const router = useRouter();
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image
        source={require("@/assets/logo-Caremap.png")}
        style={{ width: 343, height: 158, marginBottom: 50 }}
        resizeMode="contain"
      />

      <Button
        className="bg-[#49AFBE] w-[207px] rounded-[30px] h-[45px]  "
        variant="solid"
        action="primary"
        onPress={() => router.push("/public/onboarding")}
        
      >
        <ButtonText className="text-lg font-bold">Let's start</ButtonText>
      </Button>
    </View>
  );
}
