import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as SecureStore from "expo-secure-store";
import { useRouter, Redirect } from "expo-router";
import { useAuth } from "../context/AuthProvider"; 

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "632730531479-bu7oo9o00u849kttciqbkvri3ght24ia.apps.googleusercontent.com",
    redirectUri: "com.btsavvy.caremap:/oauthredirect",
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    const checkAuthState = async () => {
      const token = await SecureStore.getItemAsync("auth_token");
      const userData = await SecureStore.getItemAsync("user");
      console.log("Token:", token);
      console.log("User Data1:", userData);
      if (token && userData) {
        setUser(JSON.parse(userData));
        console.log("User Data2:", userData);

        router.replace("/home/profile");
      }
    };

    checkAuthState();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleSignIn(authentication.accessToken);
      }
    }
  }, [response]);

  const handleSignIn = async (token: string) => {
    try {
      const userInfo = await fetchUserInfo(token);

      await SecureStore.setItemAsync("auth_token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(userInfo));

      setUser(userInfo);
      router.replace("/home/profile");
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const fetchUserInfo = async (token: string) => {
    const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  };

  if (user) {
    return <Redirect href="/home/profile" />;
  }

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold text-center mb-8">Welcome</Text>

      <Text className="text-center text-lg mb-10 px-4">
        Teams of family members, doctors, nurses, and case managers work
        together to care for children with complex medical issues.
      </Text>

      <Button className="bg-black w-[80%] rounded-xl my-4">
        <ButtonText className="text-lg text-white font-bold">
          {" "}
          Sign in with Apple
        </ButtonText>
      </Button>

      <Button
        onPress={() => promptAsync()}
        className="bg-[#49AFBE] w-[80%] rounded-xl my-6"
      >
        <ButtonText className="text-lg font-bold">
          Sign in with Google
        </ButtonText>
      </Button>
      <View className="flex-row">
        <Text className="text-gray-500 mr-2">Terms of Use</Text>
        <Text className="text-gray-500">Privacy Policy</Text>
      </View>
    </View>
  );
}
