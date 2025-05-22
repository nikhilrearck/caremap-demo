import { Spinner } from "@/components/ui/spinner";
import { hasStoredSession } from "@/services/auth-service/google-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Route } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import colors from "tailwindcss/colors";
import { ROUTES } from "@/utils/route";

export default function Index() {
  const [redirectTo, setRedirectTo] = useState<Route | null>(null);
  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        // Uncomment below line to Test the First Launch of the App.
        // await AsyncStorage.setItem("isFirstLaunch", "false");

        const isFirstLaunch = await AsyncStorage.getItem("isFirstLaunch");
        const valid = await hasStoredSession();

        if (isFirstLaunch === null || isFirstLaunch === "false") {
          setRedirectTo(ROUTES.LAUNCH);
        } else if (!valid) {
          setRedirectTo(ROUTES.LOGIN);
        } else {
          setRedirectTo(ROUTES.MYHEALTH);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setRedirectTo(ROUTES.LOGIN);
      }
    };

    checkAndRedirect();
  }, []);

  if (!redirectTo) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner size="large" color={colors.teal[600]} />
      </View>
    );
  }

  return <Redirect href={redirectTo} />;
}
