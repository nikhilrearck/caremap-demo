import Header from "@/components/shared/Header";
import QuestionRenderer from "@/components/shared/track-shared-components/QuestionRenderer";
import { useCustomToast } from "@/components/shared/useCustomToast";
import { PatientContext } from "@/context/PatientContext";
import { TrackContext } from "@/context/TrackContext";
import { UserContext } from "@/context/UserContext";
import {
  addOptionToQuestion,
  getQuestionsWithOptions,
  saveResponse,
} from "@/services/core/TrackService";
import {
  Question,
  ResponseOption,
} from "@/services/database/migrations/v1/schema_v1";
import { ROUTES } from "@/utils/route";
import palette from "@/utils/theme/color";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuestionFlowScreen() {
  const { itemId, itemName, entryId } = useLocalSearchParams<{
    itemId: string;
    itemName: string;
    entryId: string;
  }>();

  const router = useRouter();
  const showToast = useCustomToast();
  const { user } = useContext(UserContext);
  const { patient } = useContext(PatientContext);
  const { setRefreshData } = useContext(TrackContext);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [responseOptions, setResponseOptions] = useState<ResponseOption[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentOptions, setCurrentOptions] = useState<ResponseOption[]>([]);

  const itemIdNum = Number(itemId);
  const entryIdNum = Number(entryId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [customOptions, setCustomOptions] = useState<Record<number, string>>(
    {}
  );

  // Utility to check if a question is visible given current answers
  const isQuestionVisible = (
    q: Question,
    answers: Record<number, any>
  ): boolean => {
    if (!q.parent_question_id || !q.display_condition) return true;

    try {
      const cond = JSON.parse(q.display_condition);
      const parentAnswer = answers[q.parent_question_id];

      if (cond.eq !== undefined) return parentAnswer === cond.eq;
      if (cond.neq !== undefined) return parentAnswer !== cond.neq;
      if (cond.gt !== undefined) return Number(parentAnswer) > cond.gt;
      if (cond.gte !== undefined) return Number(parentAnswer) >= cond.gte;
      if (cond.lt !== undefined) return Number(parentAnswer) < cond.lt;
      if (cond.lte !== undefined) return Number(parentAnswer) <= cond.lte;
      if (cond.contains !== undefined && Array.isArray(parentAnswer)) {
        return parentAnswer.includes(cond.contains);
      }
      return true;
    } catch {
      return true;
    }
  };

  // Compute visibleQuestions dynamically (no separate state needed)
  const visibleQuestions = questions.filter((q) =>
    isQuestionVisible(q, answers)
  );

  // isLast now checks against last visible question, not total questions
  const isLast =
    currentQuestion &&
    visibleQuestions.length > 0 &&
    visibleQuestions[visibleQuestions.length - 1].id === currentQuestion.id;

  useEffect(() => {
    if (!user) {
      router.replace(ROUTES.LOGIN);
      return;
    }
    if (!patient) {
      router.replace(ROUTES.MY_HEALTH);
      return;
    }

    const loadQuestionsWithOptions = async () => {
      if (!itemIdNum) return;
      const questionWithOptions = await getQuestionsWithOptions(
        itemIdNum,
        entryIdNum
      );

      const questionsArray = questionWithOptions.map((qwo) => qwo.question);
      const responseOptionsArray = questionWithOptions.flatMap(
        (qwo) => qwo.options
      );

      const existingResponses: Record<number, any> = {};

      questionWithOptions.forEach((qwo) => {
        const response = qwo.existingResponse;
        if (response && response.question_id != null) {
          let answerValue: any = response.answer;
          try {
            answerValue = JSON.parse(answerValue);
          } catch {
            // leave as-is if not JSON
          }
          existingResponses[response.question_id] = answerValue;
        }
      });

      setQuestions(questionsArray);
      setResponseOptions(responseOptionsArray);
      setAnswers(existingResponses);
    };

    loadQuestionsWithOptions();
  }, [itemIdNum]);

  // Update currentQuestion & options whenever answers or index change
  useEffect(() => {
    if (questions.length > 0) {
      const filtered = visibleQuestions; // already computed based on answers

      const currentQ = filtered[currentIndex] || null;
      const optionsForCurrent = responseOptions.filter(
        (r) => r.question_id === currentQ?.id
      );

      setCurrentQuestion(currentQ);
      setCurrentOptions(optionsForCurrent);
    }
  }, [questions, responseOptions, currentIndex, answers]);

  // Answer setter
  const handleSetAnswer = (val: any) => {
    if (!currentQuestion?.id) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
  };

  // Add custom option (MSQ only)
  const handleAddOption = (question_id: number, newOption: string) => {
    setCustomOptions((prev) => ({ ...prev, [question_id]: newOption }));
  };

  const submitAnswers = async (responseObj: Record<number, any>) => {
    if (!user?.id) throw new Error("Authentication ERROR");
    if (!patient?.id) throw new Error("Authentication ERROR");

    try {
      for (const [questionIdStr, answerObj] of Object.entries(responseObj)) {
        const questionId = Number(questionIdStr);
        if (answerObj === null || answerObj === undefined) continue;

        // add custom options if present
        for (const [customQuesIdStr, customVal] of Object.entries(
          customOptions
        )) {
          const customQuesId = Number(customQuesIdStr);
          if (JSON.stringify(answerObj).includes(customVal)) {
            await addOptionToQuestion(customQuesId, customVal);
          }
        }

        await saveResponse(
          entryIdNum,
          questionId,
          answerObj,
          user.id,
          patient.id
        );
      }
    } catch (error) {
      console.error("Error saving answers:", error);
    }
  };

  const handleNext = async () => {
    if (
      currentQuestion &&
      currentQuestion.required &&
      (answers[currentQuestion.id] === undefined ||
        answers[currentQuestion.id] === null)
    ) {
      showToast({
        title: "Answer required",
        description: "Please answer the question before proceeding.",
      });
      return;
    }

    if (isLast) {
      await submitAnswers(answers);
      router.back();
      setRefreshData(true);
    } else {
      setCurrentIndex((p) => p + 1); // 🔹 move to next visible question
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Header
        title={itemName}
        right={
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white font-medium">Cancel</Text>
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
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          >
            {currentQuestion.instructions && (
              <Text className="text-base text-gray-600 mb-2">
                {currentQuestion.instructions}
              </Text>
            )}

            <QuestionRenderer
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              setAnswer={handleSetAnswer}
              responses={currentOptions}
              setCustomOption={handleAddOption}
            />
          </ScrollView>

          {/* Fixed bottom buttons */}
          <View className="flex-row p-4 border-t border-gray-200 bg-white">
            {/* Skip (only if not required and not last visible) */}
            {!currentQuestion.required && !isLast && (
              <TouchableOpacity
                className="flex-1 py-3 rounded-lg border border-gray-300 mr-2"
                onPress={() => {
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id]: null,
                  }));
                  setCurrentIndex((p) => p + 1); // 🔹 skip respects visibleQuestions now
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
