import {  TouchableOpacity, Text,View } from "react-native";
import { useContext } from "react";
import { useRouter } from "expo-router";
import ComingSoonScreen from "@/components/shared/ComingSoonScreen";
import { UserContext } from "@/context/UserContext";
import { PatientContext } from "@/context/PatientContext";
import { signOut as clearTokens} from "@/services/auth-service/google-auth";
import { CustomButton } from "@/components/shared/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/shared/Header";

export default function More() {
  const router = useRouter();
  const { setUserData } = useContext(UserContext);
  // const { setPatientData } = useContext(PatientContext);

  const handleSignOut = async () => {
    try {
      // 1️⃣ Clear tokens
      await clearTokens();

      // 2️⃣ Reset contexts
      await setUserData(null);
      // setPatientData(null);
      // ???

      // 3️⃣ Navigate to login
      router.replace("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
   <SafeAreaView className="flex-1 bg-white">
    <Header
        title="More"
        right={
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
        }
      />
      {/* Main content */}

      <ComingSoonScreen />

      {/* Sign Out button at the bottom */}
      <View className="px-4 pb-6">
        <CustomButton
          title="Sign Out"
          onPress={handleSignOut}
        />
      </View>
    </SafeAreaView>
  );
}

 