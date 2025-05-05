import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { View, Text } from "react-native";
import {  useRouter } from "expo-router";


type Slide = {
  title: string;
  image: any;
};

const slides: Slide[] = [
  {
    title: "Connect with care teams and family members",
    image: require("../../assets/doc-1.webp"),
  },
  {
    title: "Set goals, monitor progress and chart results",
    image: require("../../assets/doc-2.webp"),
  },
  {
    title: "View and share a snapshot of the latest health record",
    image: require("../../assets/doc-3.webp"),
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleDotPress = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Image
        source={slides[currentSlide].image}
        className="w-72 h-72 mb-8 rounded-lg"
        resizeMode="contain"
      />

      <Text className="text-xl font-semibold text-center mb-6 text-[#49AFBE]">
        {slides[currentSlide].title}
      </Text>

      {/* Progress Dots */}
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

      {/* Bottom Buttons */}
      <View className="w-full items-center">
        {currentSlide < slides.length - 1 ? (
          <TouchableOpacity
            className="bg-[#49AFBE]  py-3 px-6 rounded-full mb-2"
        onPress={() => router.push("/auth/login")}

            // onPress={() => navigation.replace("Login")}
          >
            <Text className="  text-white   font-semibold">Skip</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-[#49AFBE] py-3 px-6 rounded-full"
            onPress={() => router.push("/auth/login")}
            // onPress={() => navigation.replace("Login")}
          >
            <Text className="text-white font-semibold">Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
