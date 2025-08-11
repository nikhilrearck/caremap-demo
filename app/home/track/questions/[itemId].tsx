
import React, { useState } from "react";
import { Text, View, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import QuestionRenderer from "@/components/shared/track-shared-components/QuestionRenderer";
import Header from "@/components/shared/Header";
import palette from "@/utils/theme/color";
import { useCustomToast } from "@/components/shared/useCustomToast";
import { useSelectedItems } from "@/context/TrackContext";
import moment from "moment";
import { Question, Response } from "@/context/TrackContext";




const sampleQuestions: Question[] = [
  {
    id: 1,
    items_id: 101,
    type: "multi-choice",
    text: "What medications did you take?",
    instructions: "Select all that apply",
    required: true,
    created_Date: new Date(),
    updated_Date: new Date(),
  },
  {
    id: 2,
    items_id: 101,
    type: "counter",
    text: "How many times did you take medication last week?",
    instructions: "Tap + or - to adjust the count",
    required: false,
    created_Date: new Date(),
    updated_Date: new Date(),
  },
  {
    id: 3,
    items_id: 101,
    type: "boolean",
    text: "Did you visit the doctor this month?",
    instructions: "Choose Yes or No",
    required: true,
    created_Date: new Date(),
    updated_Date: new Date(),
  },

  {
    id: 4,
    items_id: 103,
    type: "text",
    text: "Describe any symptoms or reactions you had.",
    instructions: "Type your answer in detail",
    required: false,
    created_Date: new Date(),
    updated_Date: new Date(),
  },
  {
    id: 5,
    items_id: 103,
    type: "single-choice",
    text: "Select your mood today",
    instructions: "Select one option",
    required: true,
    created_Date: new Date(),
    updated_Date: new Date(),
  },
];

const sampleResponses: Response[] = [
  {
    id: 1,
    question_id: 1,
    text: "Breathing treatments/inhalers",
    created_Date: new Date(),
    updated_Date: new Date(),
  },
  {
    id: 2,
    question_id: 1,
    text: "Seizure medication",
    created_Date: new Date(),
    updated_Date: new Date(),
  },
  {
    id: 3,
    question_id: 1,
    text: "Prescription pain medication",
    created_Date: new Date(),
    updated_Date: new Date(),
  },
  {
    id: 4,
    question_id: 1,
    text: "Prescription anxiety medication",
    created_Date: new Date(),
    updated_Date: new Date(),
  },
  {
    id: 5,
    question_id: 1,
    text: "Other",
    created_Date: new Date(),
    updated_Date: new Date(),
  },
  {
    id: 6,
    question_id: 3,
    text: "Yes",
    created_Date: new Date(),
    updated_Date: new Date(),
  },
  {
    id: 7,
    question_id: 3,
    text: "No",
    created_Date: new Date(),
    updated_Date: new Date(),
  },
  {
    id: 8,
    question_id: 5,
    text: "Happy",
    created_Date: new Date(),
    updated_Date: new Date(),
  },
  {
    id: 9,
    question_id: 5,
    text: "Sad",
    created_Date: new Date(),
    updated_Date: new Date(),
  },
  {
    id: 10,
    question_id: 5,
    text: "Anxious",
    created_Date: new Date(),
    updated_Date: new Date(),
  },
  {
    id: 11,
    question_id: 5,
    text: "Angry",
    created_Date: new Date(),
    updated_Date: new Date(),
  },
  {
    id: 12,
    question_id: 5,
    text: "Neutral",
    created_Date: new Date(),
    updated_Date: new Date(),
  },
];
export default function QuestionFlowScreen() {
  const { itemId, itemName, date: routeDate } = useLocalSearchParams<{
    itemId: string;
    itemName: string;
    date?: string;
  }>();

  const router = useRouter();
  const showToast = useCustomToast();
  const { updateItemProgress } = useSelectedItems();

  const effectiveDate = routeDate || moment().format("MM-DD-YYYY");
  const itemIdNum = Number(itemId);

  // questions for the opened item
  const itemQuestions = sampleQuestions.filter((q) => q.items_id === itemIdNum);
  const totalQuestions = itemQuestions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  const currentQuestion = itemQuestions[currentIndex];
  const isLast = currentIndex === itemQuestions.length - 1;

  const questionResponses = sampleResponses.filter(
    (r) => r.question_id === currentQuestion?.id
  );

  // Answer setter (used by QuestionRenderer)
  const handleSetAnswer = (val: any) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
  };

  // helper to compute how many questions have been answered for this item
  const countAnswered = (answersObj: Record<number, any>) =>
    itemQuestions.reduce((acc, q) => acc + (answersObj[q.id] !== undefined && answersObj[q.id] !== null ? 1 : 0), 0);

  const handleNext = () => {
    // check required
    if (currentQuestion && currentQuestion.required && (answers[currentQuestion.id] === undefined || answers[currentQuestion.id] === null)) {
      showToast({
        title: "Answer required",
        description: "Please answer the question before proceeding.",
      });
      return;
    }

    // compute answered count BEFORE navigating
    const answeredNow = countAnswered(answers);
    // update progress in context (so TrackScreen can read it)
    updateItemProgress(effectiveDate, itemIdNum, answeredNow, totalQuestions);

    if (isLast) {
      // mark fully completed (ensure completed === total)
      updateItemProgress(effectiveDate, itemIdNum, totalQuestions, totalQuestions);
      router.back();
    } else {
      setCurrentIndex((p) => p + 1);
    }
  };
   return (
  
  <SafeAreaView className="flex-1 bg-white">
  {/* Header */}
  <Header
    title={itemName}
    right={
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: palette.primary, fontWeight: "500" }}>
          Cancel
        </Text>
      </TouchableOpacity>
    }
  />

  {/* Content */}
  {!currentQuestion ? (
    <View className="flex-1 justify-center items-center px-4">
      <Text className="text-gray-500 text-center">
        No questions found for this item.
      </Text>
    </View>
  ) : (
    <>
      {/* Scrollable area */}
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }} // extra bottom padding so content doesn't hide under buttons
      >
        {currentQuestion.instructions && (
          <Text className="text-sm text-gray-600 mb-2">
            {currentQuestion.instructions}
          </Text>
        )}

        <QuestionRenderer
          question={currentQuestion}
          answer={answers[currentQuestion.id]}
          setAnswer={handleSetAnswer}
          responses={questionResponses}
        />
      </ScrollView>

      {/* Fixed bottom buttons */}
      <View className="flex-row p-4 border-t border-gray-200 bg-white">
        {/* Skip */}
        {!currentQuestion.required && (
          <TouchableOpacity
            className="flex-1 py-3 rounded-lg border border-gray-300 mr-2"
            onPress={() => {
              setAnswers((prev) => ({
                ...prev,
                [currentQuestion.id]: null,
              }));
              const answeredNow = countAnswered({
                ...answers,
                [currentQuestion.id]: null,
              });
              updateItemProgress(
                effectiveDate,
                itemIdNum,
                answeredNow,
                totalQuestions
              );
              setCurrentIndex((p) => p + 1);
            }}
          >
            <Text className="text-center text-gray-500 font-medium">
              Skip
            </Text>
          </TouchableOpacity>
        )}

        {/* Next/Submit */}
        <TouchableOpacity
          style={{ backgroundColor: palette.primary }}
          className="flex-1 py-3 rounded-lg"
          onPress={handleNext}
        >
          <Text className="text-white font-bold text-center">
            {isLast ? "Submit" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )}
</SafeAreaView>

);

}


