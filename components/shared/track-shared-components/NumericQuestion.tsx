import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import {
  Question,
  ResponseOption as _ResponseOption,
} from "@/services/database/migrations/v1/schema_v1";

export default function NumericQuestion({
  question,
  value,
  onChange,
  responses,
}: {
  question: Question;
  value: number;
  onChange: (val: number) => void;
  responses: _ResponseOption[];
}) {
  const [inputValue, setInputValue] = useState(value?.toString() || "");

  const handleInputChange = (text: string) => {
    setInputValue(text);
    // Parse the input to a number
    const numericValue = parseFloat(text);
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    }
    // else if (text === "" || text === "-") {
    //   // Allow empty string or just minus sign while typing
    //   onChange(0);
    // }
  };

  const handleInputBlur = () => {
    // Ensure we have a valid number when input loses focus
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) {
      setInputValue("0");
      onChange(0);
    } else {
      setInputValue(numericValue.toString());
      onChange(numericValue);
    }
  };

  const decrementValue = () => {
    const newValue = Math.max((value || 0) - 1, 0);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const incrementValue = () => {
    const newValue = (value || 0) + 1;
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  return (
    <View className="mb-4">
      <Text className="font-bold text-xl mb-2">{question.text}</Text>

      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={decrementValue}
          className="bg-gray-300 px-4 py-2 rounded-lg mr-4"
        >
          <Text className="text-lg font-semibold">-</Text>
        </TouchableOpacity>

        <TextInput
          value={inputValue}
          onChangeText={handleInputChange}
          keyboardType="numeric"
          className="border border-gray-300 px-3 py-2 rounded-lg text-center text-lg min-w-[80px] mx-2"
          // placeholder="0"
          onBlur={handleInputBlur}
        />

        <TouchableOpacity
          onPress={incrementValue}
          className="bg-gray-300 px-4 py-2 rounded-lg ml-4"
        >
          <Text className="text-lg font-semibold">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
