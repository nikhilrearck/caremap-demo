import React from "react";
import { View, Text } from "react-native";
import ResponseOption from "./ResponseOption";

import { Question, Response } from "@/context/TrackContext";

import palette from "@/utils/theme/color";

export default function MCQQuestion({
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

      {responses.map((opt) => (
        <ResponseOption
          key={opt.id}
          label={String(opt.text)}
          selected={value === opt.text}
          onPress={() => onChange(String(opt.text))}
        />
      ))}
    </View>
  );
}
