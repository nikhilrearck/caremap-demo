import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import palette from "@/utils/theme/color";

interface HeaderProps {
  title: string | number;
  showBackButton?: boolean;
  onBackPress?: () => void;
  right?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  right,
}) => {
  const router = useRouter();

  return (
    <View
      style={{ backgroundColor: palette.primary }}
      className="p-2 flex-row items-center justify-between "
    >
      {/* Left section */}
      <View style={{ width: 50, alignItems: "flex-start" }}>
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
      </View>

      {/* Center title */}
      <Text className="text-xl text-white font-bold text-center flex-1">
        {title}
      </Text>

      {/* Right section */}
      <View style={{ minWidth: 60, alignItems: "flex-end" }}>
        {right ? right : <View className="p-2" />}
      </View>
    </View>
  );
};

export default Header;
