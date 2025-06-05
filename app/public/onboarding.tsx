import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slide } from "@/services/common/interface";

const slides: Slide[] = [
  {
    title: "Connect with care teams and family members",
    image: require("../../assets/images/intro1.png"),
  },
  {
    title: "Set goals, monitor progress and chart results",
    image: require("../../assets/images/intro2.png"),
  },
  {
    title: "View and share a snapshot of the latest health record",
    image: require("../../assets/images/intro3.png"),
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const handleDotPress = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <LinearGradient colors={["#F1FDFF", "#DCFBFF"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 justify-center items-center  px-6">
        <Image
          source={slides[currentSlide].image}
          className="w-[400px] h-[360px] mb-2 rounded-lg"
          resizeMode="contain"
        />

        <Text className="text-[28px] font-semibold text-center mb-[80px] text-[#058295]">
          {slides[currentSlide].title}
        </Text>

        <View className="flex-row items-center mb-8">
          {slides.map((_, index) => (
            <TouchableOpacity
              key={index}
              className={`h-2 rounded-full ${
                index === currentSlide ? "w-8 bg-[#49AFBE] " : "w-4 bg-gray-300"
              } mx-1`}
              onPress={() => handleDotPress(index)}
            />
          ))}
        </View>

        <View className="w-full items-center">
          {currentSlide < slides.length - 1 ? (
            <Button
              className="bg-[#49AFBE] py-3 px-7  rounded-[30px] h-[45px]"
              variant="solid"
              action="secondary"
              onPress={async () => {
                await AsyncStorage.setItem("isFirstLaunch", "true");
                router.push("/auth/login");
              }}
            >
              <ButtonText className="  text-white  text-lg  font-semibold">
                Skip
              </ButtonText>
            </Button>
          ) : (
            <Button
              className="bg-[#49AFBE] w-[150px] rounded-[30px] h-[45px]"
              variant="solid"
              action="secondary"
              onPress={async () => {
                await AsyncStorage.setItem("isFirstLaunch", "true");
                router.push("/auth/login");
              }}
            >
              <ButtonText className="text-lg text-white">
                Get Started
              </ButtonText>
            </Button>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
