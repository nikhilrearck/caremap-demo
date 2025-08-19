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
  const router = useRouter();

  const { patient } = useContext(PatientContext);
  const {
    categories,
    setCategories,
    refreshData,
    setRefreshData,
    selectedDate,
    setSelectedDate,
  } = useContext(TrackContext);

  const [currentSelectedDate, setCurrentSelectedDate] = useState(moment());

  useEffect(() => {
    const formatted = currentSelectedDate.format("MM-DD-YYYY");
    if (selectedDate !== formatted) {
      setSelectedDate(formatted);
    }
  }, [currentSelectedDate, selectedDate]);

  useEffect(() => {
    if (!patient) {
      router.replace(ROUTES.MY_HEALTH);
      return;
    }

    refreshData ?? setRefreshData(false);

    const loadTrackItemsForSelectedDate = async () => {
      const res = await getTrackCategoriesWithItemsAndProgress(
        patient.id,
        currentSelectedDate.format("MM-DD-YYYY")
      );
      setCategories(res);
      // setSelectedDate(currentSelectedDate.format("MM-DD-YYYY"));
    };

    loadTrackItemsForSelectedDate();
  }, [patient, currentSelectedDate, refreshData]);

  const handleAddItem = () => {
    router.push({
      pathname: "/home/track/addItem",
      // params: { date: currentSelectedDate.format("MM-DD-YYYY") },
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
                Add Item
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
        selectedDate={currentSelectedDate}
        onDateSelected={setCurrentSelectedDate}
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
                    date={currentSelectedDate.format("MM-DD-YYYY")}
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
