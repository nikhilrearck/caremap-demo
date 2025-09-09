// import React, { useState } from "react";
// import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import AddQuestionForm, { Question } from "@/components/shared/track-shared-components/AddQuestionForm";
// import ActionPopover from "@/components/shared/ActionPopover";
// import { CustomButton } from "@/components/shared/CustomButton";
// import { ROUTES } from "@/utils/route";

// export default function AddQuestionScreen() {
//   const router = useRouter();
// const { existing, goalName } = useLocalSearchParams<{ existing?: string; goalName?: string }>();
//   const [questions, setQuestions] = useState<Question[]>(
//     existing ? JSON.parse(existing) : []
//   );
//   const [editingIndex, setEditingIndex] = useState<number | null>(null);

//   const handleAddQuestion = (q: Question) => {
//     if (editingIndex !== null) {
//       // update existing
//       const updated = [...questions];
//       updated[editingIndex] = q;
//       setQuestions(updated);
//       setEditingIndex(null);
//     } else {
//       // add new
//       setQuestions([...questions, q]);
//     }
//   };

//   const handleDelete = (index: number) => {
//     const updated = [...questions];
//     updated.splice(index, 1);
//     setQuestions(updated);
//   };

//   const handleSaveAll = () => {
//     router.push({

//       pathname: ROUTES.TRACK_CUSTOM_GOALS,
//       params: { addedQuestions: JSON.stringify(questions),
//         goalName,
//        },
//     });
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <ScrollView className="p-4">
//         {/* Add / Edit form */}
//         <AddQuestionForm
//           key={editingIndex ?? "new"} // reset form when editing changes
//           onSave={handleAddQuestion}
//           editing={editingIndex !== null ? questions[editingIndex] : null}
//         />

//         {/* List of questions */}
//         <Text className="font-bold text-lg mt-4 mb-2">Questions Added</Text>
//         {questions.length === 0 ? (
//           <Text className="text-gray-500">No questions yet. Add one above.</Text>
//         ) : (
//           questions.map((q, i) => (
//             <View
//               key={i}
//               className="flex-row justify-between items-center p-3 mb-2 border rounded-lg border-gray-300 bg-gray-50"
//             >
//               <View className="flex-1 mr-2">
//                 <Text className="font-semibold" numberOfLines={1}>
//                   {i + 1}. {q.text}
//                 </Text>
//                 <Text className="text-sm text-gray-500">Type: {q.type}</Text>
//               </View>
//               <ActionPopover
//                 onEdit={() => setEditingIndex(i)}
//                 onDelete={() => handleDelete(i)}
//               />
//             </View>
//           ))
//         )}
//       </ScrollView>

//       {/* Save all button */}
//       <View className="px-4 py-3 border-t border-gray-200 bg-white">
//         <CustomButton
//           title="Save All"
//           onPress={handleSaveAll}
//           disabled={questions.length === 0}
//         />
//       </View>
//     </SafeAreaView>
//   );
// }

import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import AddQuestionForm, {
  Question,
} from "@/components/shared/track-shared-components/AddQuestionForm";
import { ROUTES } from "@/utils/route";
import Header from "@/components/shared/Header";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function AddQuestionScreen() {
  const router = useRouter();
  const { goalName, existing, editIndex } = useLocalSearchParams<{
    goalName?: string;
    existing?: string;
    editIndex?: string;
  }>();

  const existingQuestions: Question[] = existing ? JSON.parse(existing) : [];

  const handleSave = (q: Question) => {
    let updatedQuestions = [...existingQuestions];

    if (editIndex !== undefined) {
      // Editing existing question
      updatedQuestions[Number(editIndex)] = q;
    } else {
      // Adding new question
      updatedQuestions.push(q);
    }

    console.log("Add Question :", JSON.stringify(updatedQuestions));

    router.replace({
      pathname: ROUTES.TRACK_CUSTOM_GOALS,
      params: { addedQuestions: JSON.stringify(updatedQuestions), goalName },
    });

  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="Add Custom Goal"
        right={
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView className="p-4">
        <AddQuestionForm
          onSave={handleSave}
          editing={
            editIndex !== undefined
              ? existingQuestions[Number(editIndex)]
              : null
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}
