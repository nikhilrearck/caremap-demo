import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Checkbox } from "@/components/ui/checkbox";
import palette from "@/utils/theme/color";

export default function MedicalEquipment() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View
        style={{ backgroundColor: palette.primary }}
        className="py-3 bg-[#49AFBE] flex-row items-center"
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 ml-2">
          <ChevronLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-white font-bold ml-4">
          Medical Equipment
        </Text>
      </View>

      <View className="p-4">
        <Text className="text-gray-600 mb-6">
          Enter any medical devices or equipment that you rely on for daily
          living
        </Text>

        {/* Equipment List */}
        <View className="mb-6">
          {/* Equipment 1 */}
          <View className="flex-row items-start mb-4">
            <Checkbox
              size="md"
              isInvalid={false}
              isDisabled={false}
              value={""}
            ></Checkbox>

            <View className="ml-3 flex-1">
              <Text className="font-bold">Equipment 1</Text>
              <Text className="text-gray-500 mt-1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Text>
            </View>
          </View>

          {/* Equipment 2 */}
          <View className="flex-row items-start mb-4">
            <Checkbox
              size="md"
              isInvalid={false}
              isDisabled={false}
              value={""}
            ></Checkbox>

            <View className="ml-3 flex-1">
              <Text className="font-bold">Equipment 2</Text>
              <Text className="text-gray-500 mt-1">
                Morbi felis libero, vulputate et sapien a, ornare fermentum
                lectus.
              </Text>
            </View>
          </View>
        </View>

        {/* Delete Button */}
        <TouchableOpacity className="border border-red-500 py-2 rounded-lg mb-6">
          <Text className="text-red-500 font-bold text-center">Delete</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="border-t border-gray-300 my-4" />

        {/* Add Equipment Section */}
        <Text className="text-lg font-semibold mb-4">
          Add medical equipment
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4"
          placeholder="Enter equipment name"
        />
        <TouchableOpacity
          style={{ backgroundColor: palette.primary }}
          className="bg-[#49AFBE] py-3 rounded-lg"
        >
          <Text className="text-white font-bold text-center">
            Add Equipment
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
