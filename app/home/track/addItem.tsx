import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "@/components/shared/Header";
import { CheckIcon, Icon } from "@/components/ui/icon";
import palette from "@/utils/theme/color";
import {
  TrackCategoryWithSelectableItems,
  useSelectedItems,
} from "@/context/TrackContext";

const sampleData: TrackCategoryWithSelectableItems[] = [
  {
    category: { id: 1, name: "Meds and Treatment" },
    items: [
      {
        item: { id: 101, category_id: 1, name: "Emergency Medication" },
        selected: false,
      },
      {
        item: { id: 102, category_id: 1, name: "Home Spirometry use" },
        selected: false,
      },
      {
        item: { id: 103, category_id: 1, name: "Airway clearance treatment" },
        selected: false,
      },
      {
        item: {
          id: 104,
          category_id: 1,
          name: "Transplant medication adherence",
        },
        selected: false,
      },
      {
        item: { id: 105, category_id: 1, name: "Medication Tracking" },
        selected: false,
      },
    ],
  },
  {
    category: { id: 2, name: "Major Events" },
    items: [
      {
        item: { id: 201, category_id: 2, name: "Sick Visits" },
        selected: false,
      },
      { item: { id: 202, category_id: 2, name: "Falls" }, selected: false },
      {
        item: { id: 203, category_id: 2, name: "Work/School absences" },
        selected: false,
      },
    ],
  },
  {
    category: { id: 3, name: "Physical Symptoms" },
    items: [
      { item: { id: 301, category_id: 3, name: "Pain" }, selected: false },
      { item: { id: 302, category_id: 3, name: "Cough" }, selected: false },
    ],
  },
];

export default function AddItem() {
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date: string }>();

  const { selectedByDate, addItemForDate } = useSelectedItems();
  const [categories, setCategories] = useState<
    TrackCategoryWithSelectableItems[]
  >([]);

  useEffect(() => {
    const existingCats = selectedByDate[date] || [];
    const merged = sampleData.map((cat) => {
      const existingCat = existingCats.find(
        (c) => c.category.id === cat.category.id
      );
      return {
        ...cat,
        items: cat.items.map((itm) => ({
          ...itm,
          selected: !!existingCat?.items.some((i) => i.item.id === itm.item.id),
        })),
      };
    });
    setCategories(merged);
  }, [date, selectedByDate]);

  const toggleSelect = (categoryIndex: number, itemIdx: number) => {
    setCategories((prev) =>
      prev.map((cat, cIdx) =>
        cIdx === categoryIndex
          ? {
              ...cat,
              items: cat.items.map((itm, iIdx) =>
                iIdx === itemIdx ? { ...itm, selected: !itm.selected } : itm
              ),
            }
          : cat
      )
    );
  };

  const handleSave = () => {
    categories.forEach((cat) => {
      cat.items.forEach((itm) => {
        if (itm.selected) {
          addItemForDate(date, cat.category, itm.item);
        }
      });
    });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="Select care items to track"
        right={
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerClassName="px-4 pb-12 pt-5">
        {categories.map((category, catIdx) => (
          <View key={category.category.id} className="mb-6">
            <Text 
            style={{ color: palette.heading }}
            className="font-bold text-xl mb-3">
              {category.category.name}
            </Text>
            {category.items.map((itm, itemIdx) => (
              <TouchableOpacity
                key={itm.item.id}
                onPress={() => toggleSelect(catIdx, itemIdx)}
                className={`flex-row items-center justify-between border rounded-xl py-3 px-4 mb-2 
                  ${
                    itm.selected
                      ? "bg-cyan-100 border-cyan-400"
                      : "bg-gray-100 border-gray-300"
                  }`}
              >
                <Text className="text-[15px]">{itm.item.name}</Text>
                {itm.selected && (
                  <Icon
                    as={CheckIcon}
                    size="xl"
                    style={{ color: palette.primary }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TouchableOpacity
          onPress={handleSave}
          style={{ backgroundColor: palette.primary }}
          className="rounded-lg py-3 items-center"
        >
          <Text className="text-white font-bold text-[16px]">Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
