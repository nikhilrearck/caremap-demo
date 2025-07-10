// import { View, Text, TouchableOpacity, TextInput } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { router } from "expo-router";
// import { ChevronLeft } from "lucide-react-native";
// import { Checkbox } from "@/components/ui/checkbox";
// import palette from "@/utils/theme/color";

// export default function MedicalEquipment() {
//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <View
//         style={{ backgroundColor: palette.primary }}
//         className="py-3 bg-[#49AFBE] flex-row items-center"
//       >
//         <TouchableOpacity onPress={() => router.back()} className="p-2 ml-2">
//           <ChevronLeft color="white" size={24} />
//         </TouchableOpacity>
//         <Text className="text-xl text-white font-bold ml-4">
//           Medical Equipment
//         </Text>
//       </View>

//       <View className="p-4">
//         <Text className="text-gray-600 mb-6">
//           Enter any medical devices or equipment that you rely on for daily
//           living
//         </Text>

//         {/* Equipment List */}
//         <View className="mb-6">
//           {/* Equipment 1 */}
//           <View className="flex-row items-start mb-4">
//             <Checkbox
//               size="md"
//               isInvalid={false}
//               isDisabled={false}
//               value={""}
//             ></Checkbox>

//             <View className="ml-3 flex-1">
//               <Text className="font-bold">Equipment 1</Text>
//               <Text className="text-gray-500 mt-1">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//               </Text>
//             </View>
//           </View>

//           {/* Equipment 2 */}
//           <View className="flex-row items-start mb-4">
//             <Checkbox
//               size="md"
//               isInvalid={false}
//               isDisabled={false}
//               value={""}
//             ></Checkbox>

//             <View className="ml-3 flex-1">
//               <Text className="font-bold">Equipment 2</Text>
//               <Text className="text-gray-500 mt-1">
//                 Morbi felis libero, vulputate et sapien a, ornare fermentum
//                 lectus.
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Delete Button */}
//         <TouchableOpacity className="border border-red-500 py-2 rounded-lg mb-6">
//           <Text className="text-red-500 font-bold text-center">Delete</Text>
//         </TouchableOpacity>

//         {/* Divider */}
//         <View className="border-t border-gray-300 my-4" />

//         {/* Add Equipment Section */}
//         <Text className="text-lg font-semibold mb-4">
//           Add medical equipment
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg p-4 mb-4"
//           placeholder="Enter equipment name"
//         />
//         <TouchableOpacity
//           style={{ backgroundColor: palette.primary }}
//           className="bg-[#49AFBE] py-3 rounded-lg"
//         >
//           <Text className="text-white font-bold text-center">
//             Add Equipment
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, MoreVertical } from "lucide-react-native";
import { Checkbox } from "@/components/ui/checkbox";
import palette from "@/utils/theme/color";

export default function MedicalEquipment() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View
        style={{ backgroundColor: palette.primary }}
        className="py-3 flex-row items-center justify-between px-4"
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ChevronLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-white font-bold">Medical Equipment</Text>
        <TouchableOpacity className="p-2">
          <Text className="text-white">Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View className="p-4 bg-white flex-1">
        <Text className="text-[#298F9E] text-base font-semibold mb-4">
          Enter any medical devices or equipment that you rely on for daily livings
        </Text>

        {/* Divider */}
        <View className="border-t border-gray-300 mb-4" />

        {/* Equipment Card List */}
        {[1, 2].map((item, index) => (
          <View
            key={index}
            className="flex-row items-start border border-gray-300 rounded-xl p-4 mb-4"
          >
            <Checkbox className="mt-1" value="" />

            <View className="ml-3 flex-1">
              <Text className="font-semibold text-base">Equipment {item}</Text>
              <Text className="text-gray-500 text-sm mt-1">
                {item === 1
                  ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  : "Morbi felis libero, vulputate et sapien a, ornare fermentum lectus."}
              </Text>
            </View>

            {/* 3-dot menu icon */}
            <TouchableOpacity className="ml-2 mt-1">
              <MoreVertical size={18} color="#999" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Delete Button (Initially Disabled Style) */}
        <TouchableOpacity
          className="py-3 rounded-lg items-center justify-center border border-gray-300"
          disabled
        >
          <Text className="text-gray-400 font-semibold">Delete</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="border-t border-gray-300 my-4" />

        {/* Add Equipment */}
        <TouchableOpacity
          style={{ backgroundColor: palette.primary }}
          className="py-3 rounded-lg mt-2"
        >
          <Text className="text-white font-bold text-center">
            Add medical equipment
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

