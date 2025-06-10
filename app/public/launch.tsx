import { Image } from "react-native";
import { View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import palette from "@/theme/color";
export default function Landing() {
  const router = useRouter();
  return (
    <LinearGradient
      colors={[palette.gradientStart, palette.gradientEnd]}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 justify-center items-center">
        <Image
          source={require("@/assets/images/careMap-logo.png")}
          style={{ width: 343, height: 158, marginBottom: 150 }}
          resizeMode="contain"
        />
        <Button
          style={{ backgroundColor: palette.primary }}
          className=" w-[207px] rounded-[30px] h-[45px]"
          variant="solid"
          action="secondary"
          onPress={() => router.push("/public/onboarding")}
        >
          <ButtonText className="text-lg text-white font-bold">
            Get Started
          </ButtonText>
        </Button>
      </SafeAreaView>
    </LinearGradient>
  );
}
