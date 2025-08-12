import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Question, Response } from "@/context/TrackContext";

export default function NumericQuestion({
  question,
  value,
  onChange,
  responses, // included for consistency
}: {
  question: Question;
  value: number;
  onChange: (val: number) => void;
  responses: Response[];
}) {
  return (
    <View className="mb-4">
      <Text className="font-bold text-xl mb-2">{question.text}</Text>

      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => onChange(Math.max((value || 0) - 1, 0))}
          className="bg-gray-300 px-4 py-2 rounded-lg mr-4"
        >
          <Text>-</Text>
        </TouchableOpacity>

        <Text className="text-lg">{value ?? 0}</Text>

        <TouchableOpacity
          onPress={() => onChange((value || 0) + 1)}
          className="bg-gray-300 px-4 py-2 rounded-lg ml-4"
        >
          <Text>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
