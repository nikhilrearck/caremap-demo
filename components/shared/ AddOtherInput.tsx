import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import palette from "@/utils/theme/color";

type AddOtherInputProps = {
  onSubmit: (val: string) => void;
};

export default function AddOtherInput({ onSubmit }: AddOtherInputProps) {
  const [showInput, setShowInput] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const handleSubmit = () => {
    if (!customInput.trim()) return;

    const newVal = customInput.trim();
    onSubmit(newVal);

    setCustomInput("");
    setShowInput(false);
    Keyboard.dismiss();
  };

  return (
    <View className="mt-4">
      {showInput ? (
        <View className="flex-row items-center">
          <TextInput
            value={customInput}
            onChangeText={setCustomInput}
            placeholder="Type your answer..."
            placeholderTextColor="#999"
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-base"
          />

          {/* ✔ Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!customInput.trim()}
            className={`ml-3 rounded-full px-4 py-3 ${
              customInput.trim() ? "" : "bg-gray-300"
            }`}
            style={customInput.trim() ? { backgroundColor: palette.primary } : {}}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
          </TouchableOpacity>

          {/* ✖ Button */}
          <TouchableOpacity
            onPress={() => {
              setCustomInput("");
              setShowInput(false);
            }}
            className="ml-2 rounded-full px-4 py-3"
            style={{ backgroundColor: palette.primary }}
          >
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setShowInput(true)}
          className="mt-2 py-3 px-4 rounded-xl border border-dashed border-gray-400 items-center"
        >
          <Text className="text-gray-600 font-medium">+ Add other</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
