// import {
//   Question,
//   ResponseOption as _ResponseOption,
// } from "@/services/database/migrations/v1/schema_v1";
// import palette from "@/utils/theme/color";
// import React, { useState } from "react";
// import { Keyboard, Text, View } from "react-native";
// import ResponseOption from "./ResponseOption";
// import AddOtherInput from "../ AddOtherInput";

// export default function MSQQuestion({
//   question,
//   value = [],
//   onChange,
//   responses = [],
//   handleAddOption,
// }: {
//   question: Question;
//   value?: string[];
//   onChange: (val: string[]) => void;
//   handleAddOption: (ques_id: number, val: string) => void;
//   responses?: _ResponseOption[];
// }) {
//   // const [customInput, setCustomInput] = useState("");
//   // const [showCustomInput, setShowCustomInput] = useState(false);

//   const toggleOption = (opt: string) => {
//     if (value.includes(opt)) {
//       const updated = value.filter((v) => v !== opt);
//       onChange(updated);
//     } else {
//       const updated = [...value, opt];
//       onChange(updated);
//     }
//   };

//   // const handleCustomSubmit = () => {
//   //   if (!customInput.trim()) return;

//   //   const newVal = customInput.trim();
//   //   if (!value.includes(newVal)) {
//   //     const updated = [...value, newVal];
//   //     handleAddOption(question.id, newVal);
//   //     onChange(updated);
//   //   }

//   //   setCustomInput("");
//   //   setShowCustomInput(false);
//   //   Keyboard.dismiss();
//   // };

//   return (
//     <View className="mb-6">
//       <Text
//         style={{ color: palette.secondary }}
//         className="font-bold text-lg mb-3"
//       >
//         {question.text}
//       </Text>

//       {/* Normal response options */}
//       {responses
//         .filter((opt) => String(opt.text).toLowerCase() !== "other")
//         .map((opt) => {
//           const label = String(opt.text);
//           return (
//             <ResponseOption
//               key={opt.id}
//               label={label}
//               selected={value.includes(label)}
//               onPress={() => toggleOption(label)}
//             />
//           );
//         })}

//       {/* Custom responses already selected */}
//       {value
//         .filter(
//           (val) =>
//             !responses.some(
//               (opt) => String(opt.text).toLowerCase() === val.toLowerCase()
//             )
//         )
//         .map((custom) => (
//           <ResponseOption
//             key={custom}
//             label={custom}
//             selected={value.includes(custom)}
//             onPress={() => toggleOption(custom)}
//           />
//         ))}

//       {/* Add Other toggle / Input */}
//       <AddOtherInput
//         onSubmit={(newVal) => {
//           if (!value.includes(newVal)) {
//             const updated = [...value, newVal];
//             handleAddOption(question.id, newVal);
//             onChange(updated);
//           }
//         }}
//       />
//     </View>
//   );
// }
import React from "react";
import { Text, View } from "react-native";
import {
  Question,
  ResponseOption as ResponseOptionType,
} from "@/services/database/migrations/v1/schema_v1";
import palette from "@/utils/theme/color";
import ResponseOption from "./ResponseOption";
import AddOtherInput from "../ AddOtherInput";

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
  responses?: ResponseOptionType[];
}) {
  const toggleOption = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
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

      {/* Custom responses already selected */}
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

      {/* Add Other toggle / Input */}
      <AddOtherInput
        onSubmit={(newVal) => {
          if (!value.includes(newVal)) {
            const updated = [...value, newVal];
            handleAddOption(question.id, newVal);
            onChange(updated);
          }
        }}
      />
    </View>
  );
}
