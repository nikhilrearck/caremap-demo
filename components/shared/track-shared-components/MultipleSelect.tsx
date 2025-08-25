import {
  Question,
  ResponseOption as _ResponseOption,
} from "@/services/database/migrations/v1/schema_v1";
import { logger } from "@/services/logging/logger";
import palette from "@/utils/theme/color";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ResponseOption from "./ResponseOption";

export default function MSQQuestion({
  question,
  value = [],
  onChange,
  responses = [],
  handleAddOption,
}: {
  question: Question;
  value?: string[];
  onChange: (val: string[]) => void;
  handleAddOption: (ques_id: number, val: string) => void;
  responses?: _ResponseOption[];
}) {
  const [customInput, setCustomInput] = useState("");

  const toggleOption = (opt: string) => {
    logger.debug("Toggling option:", opt, "Current value:", value);
    if (value.includes(opt)) {
      const updated = value.filter((v) => v !== opt);
      logger.debug("Removed option:", opt, "Updated value:", updated);
      onChange(updated);
    } else {
      const updated = [...value, opt];
      logger.debug("Added option:", opt, "Updated value:", updated);
      onChange(updated);
    }
  };

  const handleCustomSubmit = () => {
    logger.debug("Submitting custom input:", customInput);
    if (!customInput.trim()) return;

    const newVal = customInput.trim();
    if (!value.includes(newVal)) {
      const updated = [...value, newVal];
      handleAddOption(question.id, newVal);
      logger.debug("Added custom value:", newVal, "Updated value:", updated);
      onChange(updated);
    }

    setCustomInput("");
    Keyboard.dismiss();
  };

  return (
    <View className="mb-6">
      <Text
        style={{ color: palette.secondary }}
        className="font-bold text-lg mb-3"
      >
        {question.text}
      </Text>

      {/* Normal response options */}
      {responses
        .filter((opt) => String(opt.text).toLowerCase() !== "other")
        .map((opt) => {
          const label = String(opt.text);
          return (
            <ResponseOption
              key={opt.id}
              label={label}
              selected={value.includes(label)}
              onPress={() => toggleOption(label)}
            />
          );
        })}

      {/* Custom responses */}
      {value
        .filter(
          (val) =>
            !responses.some(
              (opt) => String(opt.text).toLowerCase() === val.toLowerCase()
            )
        )
        .map((custom) => (
          <ResponseOption
            key={custom}
            label={custom}
            selected={value.includes(custom)}
            onPress={() => toggleOption(custom)}
          />
        ))}

      {/* Custom input card */}
      <View className="mt-4">
        <Text className="mb-3 text-gray-700 text-base">
          Enter your custom option:
        </Text>
        <View className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <View className="flex-row items-center">
            <TextInput
              value={customInput}
              onChangeText={(text) => {
                setCustomInput(text);
              }}
              placeholder="Add Option"
              placeholderTextColor="#999"
              onSubmitEditing={handleCustomSubmit}
              returnKeyType="done"
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 24,
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: "#f9f9f9",
                fontSize: 17,
              }}
            />

            <TouchableOpacity
              onPress={handleCustomSubmit}
              disabled={!customInput.trim()}
              style={{
                marginLeft: 12,
                backgroundColor: customInput.trim()
                  ? palette.secondary
                  : "#ccc",
                borderRadius: 30,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <Ionicons name="checkmark" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
