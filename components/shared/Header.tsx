import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import palette from "@/utils/theme/color";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
}) => {
  const router = useRouter();

  return (
    <View
      style={{ backgroundColor: palette.primary }}
      className="py-3 flex-row items-center justify-between px-4"
    >
      {showBackButton ? (
        <TouchableOpacity
          onPress={onBackPress ?? (() => router.back())}
          className="p-2"
        >
          <ChevronLeft color="white" size={24} />
        </TouchableOpacity>
      ) : (
        <View className="p-2" />
      )}

      <View className="absolute left-0 right-0 items-center">
        <Text className="text-xl text-white font-bold">{title}</Text>
      </View>

      <View className="p-2" />
    </View>
  );
};

export default Header;
