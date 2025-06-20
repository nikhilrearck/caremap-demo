import { View, Text } from "react-native";
import { signOut } from "@/services/auth-service/google-auth";
function careTeam() {

  const handleSignOut = async () => {
    await signOut();
    router.replace(`${ROUTES.LOGIN}`);
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text style={{ color: palette.primary }} className="text-2xl font-bold ">
        careTeam
      </Text>
      <Button
        style={{ backgroundColor: palette.primary }}
        className=" w-[150px] rounded-[30px] h-[45px]"
        variant="solid"
        action="secondary"
        onPress={handleSignOut}
      >
        <ButtonText className="text-lg text-white">Sign Out</ButtonText>
      </Button>
      <Text className="text-lg text-gray-500 mt-2">Coming soon...</Text>
    </View>
  );
}

export default careTeam;

import { router } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";import palette from "@/utils/theme/color";
import { ROUTES } from "@/utils/route";

