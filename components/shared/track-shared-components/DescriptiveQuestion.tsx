import React from "react";
import { View, Text, TextInput } from "react-native";

import palette from "@/utils/theme/color";
import { Question, Response } from "@/context/TrackContext";

export default function DescriptiveQuestion({
  question,
  value,
  onChange,
  responses,
}: {
  question: Question;
  value: string;
  onChange: (val: string) => void;
  responses: Response[];
}) {
  return (
    <View className="mb-4">
      <Text
        style={{ color: palette.secondary }}
        className="font-bold text-xl mb-2"
      >
        {question.text}
      </Text>

      <TextInput
        placeholder="Enter your answer"
        className="border border-gray-300 rounded-lg p-3 h-32 text-base text-gray-900"
        multiline
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}
