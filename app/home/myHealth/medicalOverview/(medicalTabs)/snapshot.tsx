import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import palette from "@/utils/theme/color";

export default function Snapshot() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View
        style={{ backgroundColor: palette.primary }}
        className="py-3  flex-row items-center"
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 ml-2">
          <ChevronLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-white font-bold ml-4 items-center">
          Snapshot
        </Text>
      </View>

      <View className="p-4">
        <Text className="text-lg font-semibold mb-2">
          Describe about you / your child in 2-3 sentences
        </Text>
        <Text className="text-gray-500 mb-4">
          E.g. You may include your / your child's preferences, what they like
          or dislike. What are their motivations, goals and favorite things.
        </Text>

        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-6 h-32 text-gray-700"
          multiline
          placeholder="Type here..."
        />

        <View className="border-t border-gray-300 my-4" />

        <Text className="text-lg font-semibold mb-2">
          Describe your / your child's health issues in 2-3 sentences
        </Text>

        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-6 h-32 text-gray-700"
          multiline
          placeholder="Type here..."
          defaultValue={`Our daughter Isabella is 9 year old girl with Attention Deficit Hyperactivity Disorder (ADHD) and possibly Generalized Anxiety Disorder (GAD). Isabella is on a medication to manager her ADHD which has been working well and is fairly stable on most days. She does wet the bed and has episodes of Irritable Bowel Syndrome (IBS) which are highly uncomfortable for her. She is an active and engaging child whose favorite activities are swimming and dancing to musicals (her favorite soundtracks are Hamilton, Phantom of the Opera, Frozen and newsies).`}
        />

        <TouchableOpacity
          style={{ backgroundColor: palette.primary }}
          className=" py-3 rounded-lg"
        >
          <Text className="text-white font-bold text-center">Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
