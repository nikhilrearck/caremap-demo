import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import moment from "moment";
import { useSelectedItems } from "@/context/TrackContext";
import palette from "@/utils/theme/color";
import Header from "@/components/shared/Header";
import TrackCalendar from "@/components/shared/track-shared-components/TrackCalender";
import { Divider } from "@/components/ui/divider";
import TrackCard from "@/components/shared/track-shared-components/TrackCard";

export default function TrackScreen() {
  const { selectedByDate } = useSelectedItems();
  const [selectedDate, setSelectedDate] = useState(moment());
  const router = useRouter();

  const formattedDate = selectedDate.format("MM-DD-YYYY");
  const categoriesForDate = selectedByDate[formattedDate] || [];

  const handleAddItem = () => {
    router.push({
      pathname: "/home/track/addItem",
      params: { date: formattedDate },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* header */}
      <Header
        title="Track"
        right={
          <TouchableOpacity onPress={handleAddItem}>
            <View className="bg-white px-3 py-1.5 rounded-lg">
              <Text className="font-bold" style={{ color: palette.primary }}>
                Add
              </Text>
            </View>
          </TouchableOpacity>
        }
      />

      <View className="px-2">
        <Divider className="bg-gray-300" />
      </View>
{/* calendar */}
      <TrackCalendar
        selectedDate={selectedDate}
        onDateSelected={setSelectedDate}
      />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {categoriesForDate.length === 0 ? (
          <Text className="text-gray-500">No items added for this date</Text>
        ) : (
          categoriesForDate.map((cat) =>
            cat.items.length > 0 ? (
              <View key={cat.category.id} className="mb-6">
                {/* Category title */}
                <Text
                  className="font-bold text-lg mb-2"
                  style={{ color: palette.heading }}
                >
                  {cat.category.name}
                </Text>

                {/* Items under this category */}
                {cat.items.map((itm) => (
                  <TrackCard
                    key={itm.item.id}
                    item={itm.item}
                    completed={itm.completed}
                    total={itm.total}
                    date={formattedDate}
                  />
                ))}
              </View>
            ) : null
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
