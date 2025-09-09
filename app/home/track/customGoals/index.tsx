// import Header from "@/components/shared/Header";
// import { PatientContext } from "@/context/PatientContext";
// import { TrackContext } from "@/context/TrackContext";
// import { UserContext } from "@/context/UserContext";
// import { useCustomToast } from "@/components/shared/useCustomToast";
// import { ROUTES } from "@/utils/route";
// import palette from "@/utils/theme/color";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import React, { useContext, useEffect, useState } from "react";
// import {
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { addCustomGoal } from "@/services/core/TrackService";
// // import AddQuestionForm, {
// // } from "@/components/shared/track-shared-components/AddQuestionForm";
// import { CustomButton } from "@/components/shared/CustomButton";
// import { LabeledTextInput } from "@/components/shared/labeledTextInput";

// // AddQuestionForm.tsx
// export interface QuestionInput {
//   text: string;
//   type: string;
//   required: boolean;
//   options: string[];
// }

// interface Props {
//   onSave: (q: QuestionInput) => void;
//   editing?: QuestionInput | null;
// }
// export default function CustomGoals() {
//   const router = useRouter();
//   const showToast = useCustomToast();

//   const { user } = useContext(UserContext);
//   const { patient } = useContext(PatientContext);
//   const { selectedDate, setRefreshData } = useContext(TrackContext);

//   const [goalName, setGoalName] = useState("");
//   const [questions, setQuestions] = useState<QuestionInput[]>([]);

//   // Load questions if passed from previous screen
//   const { addedQuestions, goalName: passedGoalName } = useLocalSearchParams<{
//     addedQuestions?: string;
//     goalName?: string;
//   }>();

//   useEffect(() => {
//     if (addedQuestions) {
//       try {
//         setQuestions(JSON.parse(addedQuestions));
//       } catch (err) {
//         showToast({
//           title: "Invalid questions param",
//           description:
//             err instanceof Error ? err.message : "Failed to parse questions.",
//         });
//       }
//     }

//     if (passedGoalName) {
//       setGoalName(passedGoalName); // ✅ always restore
//     }
//   }, [addedQuestions, passedGoalName]);

//   const handleSaveGoal = async () => {
//     if (!user?.id) return router.replace(ROUTES.LOGIN);
//     if (!patient?.id) return router.replace(ROUTES.MY_HEALTH);

//     if (!goalName.trim()) {
//       showToast({
//         title: "Goal name required",
//         description: "Please enter a goal name.",
//       });
//       return;
//     }
//     if (questions.length === 0) {
//       showToast({
//         title: "Add questions",
//         description: "Please add at least one question.",
//       });
//       return;
//     }

//     try {
//       await addCustomGoal({
//         name: goalName.trim(),
//         userId: user.id,
//         patientId: patient.id,
//         date: selectedDate,
//         questions,
//       });
//       showToast({ title: "Success", description: "Custom goal saved!" });
//       setRefreshData(true);
//       router.replace(ROUTES.TRACK_ADD_ITEM);
//     } catch (err) {
//       console.error(err);
//       showToast({ title: "Error", description: "Failed to save goal." });
//     }
//   };

//   // const handleAddQuestion = (q: QuestionInput) => {
//   //   setQuestions([...questions, q]);
//   // };

//   const isDisabled = !goalName.trim() || questions.length === 0;

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <Header
//         title="Add Custom Goal"
//         right={
//           <TouchableOpacity onPress={() => router.back()}>
//             <Text className="text-white font-medium">Cancel</Text>
//           </TouchableOpacity>
//         }
//       />

//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1"
//       >
//         {/* Main content */}
//         <ScrollView
//           contentContainerClassName="px-4 pt-5 pb-28" // leave space for bottom button
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* Goal name */}
//           <LabeledTextInput
//             label="Goal Name"
//             value={goalName}
//             onChangeText={setGoalName}
//           />

//           {/* Questions list */}
//           <Text
//             style={{ color: palette.heading }}
//             className="font-bold text-lg mb-2"
//           >
//             Questions
//           </Text>

//           {/* <AddQuestionForm onSave={handleAddQuestion} /> */}

//           <TouchableOpacity
//             onPress={() =>
//               router.push({
//                 pathname: ROUTES.TRACK_CUSTOM_GOALS_ADD_QUESTIONS,
//                 params: {
//                   existing: JSON.stringify(questions),
//                   goalName: goalName,
//                 },
//               })
//             }
//             className="bg-gray-200 px-4 py-3 rounded-lg mb-4"
//           >
//             <Text className="text-black font-semibold">+ Add Question</Text>
//           </TouchableOpacity>

//           {questions.length === 0 ? (
//             <Text className="text-gray-500 mb-6">No questions added yet.</Text>
//           ) : (
//             questions.map((q, i) => (
//               <View
//                 key={i}
//                 className="p-3 mb-3 border rounded-lg border-gray-300 bg-gray-50"
//               >
//                 <Text className="font-semibold mb-1">
//                   {i + 1}. {q.text}
//                 </Text>
//                 <Text className="text-sm text-gray-500">Type: {q.type}</Text>
//               </View>
//             ))
//           )}
//         </ScrollView>

//         {/* Fixed Save button */}
//         <View className="absolute bottom-0 left-0 right-0 px-4 bg-white border-t border-gray-200">
//           <CustomButton
//             title="Save Goal"
//             onPress={handleSaveGoal}
//             disabled={isDisabled}
//           />
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }
import Header from "@/components/shared/Header";
import { PatientContext } from "@/context/PatientContext";
import { TrackContext } from "@/context/TrackContext";
import { UserContext } from "@/context/UserContext";
import { useCustomToast } from "@/components/shared/useCustomToast";
import { ROUTES } from "@/utils/route";
import palette from "@/utils/theme/color";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addCustomGoal } from "@/services/core/TrackService";

import { CustomButton } from "@/components/shared/CustomButton";
import { LabeledTextInput } from "@/components/shared/labeledTextInput";
import ActionPopover from "@/components/shared/ActionPopover";

// AddQuestionForm.tsx
export interface QuestionInput {
  text: string;
  type: string;
  required: boolean;
  options: string[];
}

export default function CustomGoals() {
  const router = useRouter();
  const showToast = useCustomToast();

  const { user } = useContext(UserContext);
  const { patient } = useContext(PatientContext);
  const { selectedDate, setRefreshData } = useContext(TrackContext);

  const [goalName, setGoalName] = useState("");
  const [questions, setQuestions] = useState<QuestionInput[]>([]);

  // Load questions if passed from previous screen
  const {
    newQuestion,
    editingIndex,
    goalName: passedGoalName,
    addedQuestions,
  } = useLocalSearchParams<{
    newQuestion?: string;
    editingIndex?: string;
    goalName?: string;
    addedQuestions?: string;
  }>();

  useEffect(() => {
    if (addedQuestions) {
      try {
        const parsed = JSON.parse(addedQuestions) as QuestionInput[];
        setQuestions(parsed); // ✅ overwrite with updated full list
      } catch (err) {
        showToast({
          title: "Invalid data",
          description: "Could not parse updated questions.",
        });
      }
    } else if (newQuestion) {
      try {
        const parsed = JSON.parse(newQuestion) as QuestionInput;
        if (editingIndex !== undefined) {
          const idx = parseInt(editingIndex, 10);
          setQuestions((prev) => prev.map((q, i) => (i === idx ? parsed : q)));
        } else {
          setQuestions((prev) => [...prev, parsed]);
        }
      } catch (err) {
        showToast({
          title: "Invalid question",
          description: "Could not parse question data.",
        });
      }
    }

    if (passedGoalName) {
      setGoalName(passedGoalName);
    }
  }, [addedQuestions, newQuestion, editingIndex, passedGoalName]);

  const handleDelete = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveGoal = async () => {
    if (!user?.id) return router.replace(ROUTES.LOGIN);
    if (!patient?.id) return router.replace(ROUTES.MY_HEALTH);

    if (!goalName.trim()) {
      showToast({
        title: "Goal name required",
        description: "Please enter a goal name.",
      });
      return;
    }
    if (questions.length === 0) {
      showToast({
        title: "Add questions",
        description: "Please add at least one question.",
      });
      return;
    }

    try {
      await addCustomGoal({
        name: goalName.trim(),
        userId: user.id,
        patientId: patient.id,
        date: selectedDate,
        questions,
      });
      showToast({ title: "Success", description: "Custom goal saved!" });
      setRefreshData(true);
      router.replace(ROUTES.TRACK_ADD_ITEM);
    } catch (err) {
      console.error(err);
      showToast({ title: "Error", description: "Failed to save goal." });
    }
  };

  const isDisabled = !goalName.trim() || questions.length === 0;

  return (
    <SafeAreaView edges={['right', 'top', 'left']} className="flex-1 bg-white">
      <Header
        title="Add Custom Goal"
        right={
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Main content */}
        <ScrollView
          contentContainerClassName="px-4 pt-5 pb-28" // leave space for bottom button
          keyboardShouldPersistTaps="handled"
        >

          {/* Goal name */}
          <Text
            style={{ color: palette.heading }}
            className="text-xl font-semibold "
          >
            Goal Name
          </Text>
          <LabeledTextInput
            label="Type your Goal Name.."
            value={goalName}
            onChangeText={setGoalName}
          />

          {/* Questions list */}
          <Text
            style={{ color: palette.heading }}
            className="font-bold text-xl "
          >
            Questions
          </Text>

          {/* {questions.length === 0 ? (
            <Text className="text-gray-500 text-center mb-6">Please add questions.</Text>
          ) : (
            questions.map((q, i) => (
              <View
                key={i}
                className="flex-row justify-between items-center p-3 mb-3 border rounded-lg border-gray-300 bg-gray-50"
              >
                <View className="flex-1 mr-2">
                  <Text className="font-semibold mb-1">
                    {i + 1}. {q.text}
                  </Text>
                  <Text className="text-sm text-gray-500">Type: {q.type}</Text>
                </View>
                <ActionPopover
                  onEdit={() =>
                    router.push({
                      pathname: ROUTES.TRACK_CUSTOM_GOALS_ADD_QUESTIONS,
                      params: {
                        existing: JSON.stringify(questions),
                        goalName,
                        editIndex: i.toString(),
                      },
                    })
                  }
                  onDelete={() => handleDelete(i)}
                />
              </View>
            ))
          )} */}
          <View className="flex-1">
  <FlatList
    data={questions}
    keyExtractor={(_, index) => index.toString()}
    scrollEnabled={false}
    showsVerticalScrollIndicator={false}
    renderItem={({ item, index }) => (
      <View className="border border-gray-300 rounded-lg mb-3 px-3 py-3">
        <View className="flex-row items-center justify-between">
          {/* Question text */}
          <View className="flex-row items-center space-x-2">
            <Text className="text-lg max-w-[220px] text-left font-medium">
              {index + 1}. {item.text}
            </Text>
          </View>

          {/* Right side: Type + Actions */}
          <View className="flex-row items-center">
            <Text className="text-base text-gray-700 mr-3">
              {item.type}
            </Text>

            <ActionPopover
              onEdit={() =>
                router.push({
                  pathname: ROUTES.TRACK_CUSTOM_GOALS_ADD_QUESTIONS,
                  params: {
                    existing: JSON.stringify(questions),
                    goalName,
                    editIndex: index.toString(),
                  },
                })
              }
              onDelete={() => handleDelete(index)}
            />
          </View>
        </View>

        {/* Options (for MCQ/MSQ) */}
        {item.options?.length > 0 && (
          <View className="px-3 mt-2">
            <Text className="text-sm text-gray-700">
              Options: {item.options.join(", ")}
            </Text>
          </View>
        )}

        {/* Required toggle display */}
        <View className="px-3 mt-1">
          <Text className="text-sm text-gray-500">
            {item.required ? "Required" : "Optional"}
          </Text>
        </View>
      </View>
    )}
    ListEmptyComponent={
      <Text className="text-gray-500 text-center">No questions added yet.</Text>
    }
    style={{ minHeight: 50 }}
  />
</View>

        </ScrollView>

        {/* Fixed Save button */}
        <View className="bg-white absolute bottom-0 left-0 right-0 px-4 py-4  border-t border-gray-200">
          {/* Add Question button */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: ROUTES.TRACK_CUSTOM_GOALS_ADD_QUESTIONS,
                params: {
                  existing: JSON.stringify(questions),
                  goalName,
                },
              })
            }
            className="flex-row items-center justify-center border border-dashed border-gray-400 rounded-xl py-3 px-4 mb-3"
          >
            <Text className="text-cyan-600 font-semibold">+ Add Question</Text>
          </TouchableOpacity>

          {/* Save Goal button */}
          <CustomButton
            title="Save Goal"
            onPress={handleSaveGoal}
            disabled={isDisabled}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
