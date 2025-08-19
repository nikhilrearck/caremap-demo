import Header from "@/components/shared/Header";
import QuestionRenderer from "@/components/shared/track-shared-components/QuestionRenderer";
import { useCustomToast } from "@/components/shared/useCustomToast";
import { TrackContext } from "@/context/TrackContext";
import {
  getQuestionsWithOptions,
  saveResponse,
} from "@/services/core/TrackService";
import {
  Question,
  ResponseOption,
} from "@/services/database/migrations/v1/schema_v1";
import palette from "@/utils/theme/color";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuestionFlowScreen() {
  const { itemId, itemName } = useLocalSearchParams<{
    itemId: string;
    itemName: string;
  }>();

  const router = useRouter();
  const showToast = useCustomToast();
  const { setRefreshData } = useContext(TrackContext);

  // sampleQuestions
  const [questions, setQuestions] = useState<Question[]>([]);

  // sampleResponse
  const [responseOptions, setResponseOptions] = useState<ResponseOption[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentOptions, setCurrentOptions] = useState<ResponseOption[]>([]);

  const itemIdNum = Number(itemId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  const isLast = currentIndex === questions.length - 1;

  useEffect(() => {
    const loadQuestionsWithOptions = async () => {
      if (!itemIdNum) return;
      const questionWithOptions = await getQuestionsWithOptions(itemIdNum);

      const questionsArray = questionWithOptions.map((qwo) => qwo.question);
      const responseOptionsArray = questionWithOptions.flatMap(
        (qwo) => qwo.options
      );

      setQuestions(questionsArray);
      setResponseOptions(responseOptionsArray);
    };
    loadQuestionsWithOptions();
  }, [itemIdNum]);

  useEffect(() => {
    if (questions.length > 0) {
      const itemQuestions = questions.filter((q) => q.item_id === itemIdNum);
      const currentQ = itemQuestions[currentIndex] || null;
      const optionsForCurrent = responseOptions.filter(
        (r) => r.question_id === currentQ?.id
      );

      setCurrentQuestion(currentQ);
      setCurrentOptions(optionsForCurrent);
    }
  }, [questions, responseOptions, currentIndex, itemIdNum]);

  const submitAnswers = (responseObj: Record<number, any>) => {
    Object.entries(responseObj).forEach(([questionId, answerObj]) => {
      console.log(
        `Question id: ${questionId} , answerObj: ${JSON.stringify(answerObj)}`
      );
      saveResponse(
        itemIdNum,
        Number(questionId),
        JSON.stringify(answerObj)
      ).then(() => {
        console.log("Answer saved successfully.");
      });
    });
  };

  // Answer setter (used by QuestionRenderer)
  const handleSetAnswer = (val: any) => {
    if (!currentQuestion || !currentQuestion.id) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion?.id]: val }));
  };

  // helper to compute how many questions have been answered for this item
  const countAnswered = (answersObj: Record<number, any>) =>
    questions.reduce(
      (acc, q) =>
        acc +
        (answersObj[q.id] !== undefined && answersObj[q.id] !== null ? 1 : 0),
      0
    );

  const handleNext = () => {
    // check required
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

    // compute answered count BEFORE navigating
    const answeredNow = countAnswered(answers);

    if (isLast) {
      // mark fully completed (ensure completed === total)
      submitAnswers(answers);
      setRefreshData(true);
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
            <Text style={{ color: "white", fontWeight: "500" }}>Cancel</Text>
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
              responses={currentOptions}
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
