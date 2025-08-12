import Header from "@/components/shared/Header";
import TrackCalendar from "@/components/shared/track-shared-components/TrackCalender";
import TrackCard from "@/components/shared/track-shared-components/TrackCard";
import { Divider } from "@/components/ui/divider";
import { PatientContext } from "@/context/PatientContext";
import { TrackContext } from "@/context/TrackContext";
import { getTrackCategoriesWithItemsAndProgress } from "@/services/core/TrackService";
import { ROUTES } from "@/utils/route";
import palette from "@/utils/theme/color";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TrackScreen() {
  const { patient } = useContext(PatientContext);
  const { categories, setCategories } = useContext(TrackContext);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [formattedDate, setFormattedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const router = useRouter();

  useEffect(() => {
    if (!patient) {
      router.replace(ROUTES.MY_HEALTH);
      return;
    }
    const loadTrackItemsForSelectedDate = async () => {
      const newFormattedDate = selectedDate.format("MM-DD-YYYY");
      setFormattedDate(newFormattedDate);
      const res = await getTrackCategoriesWithItemsAndProgress(
        patient.id,
        newFormattedDate
      );
      setCategories(res);
    };

    loadTrackItemsForSelectedDate();
  }, [selectedDate]);

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
        {categories.length === 0 ? (
          <Text className="text-gray-500">No items added for this date</Text>
        ) : (
          categories.map((cat) =>
            cat.items.length > 0 ? (
              <View key={cat.id} className="mb-6">
                {/* Category title */}
                <Text
                  className="font-bold text-lg mb-2"
                  style={{ color: palette.heading }}
                >
                  {cat.name}
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
