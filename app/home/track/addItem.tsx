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
  const [selectableCategories, setSelectableCategories] = useState<
    TrackCategoryWithSelectableItems[]
  >([]);

  useEffect(() => {
    const existingCategoryGroups = selectedByDate[date] || [];
    const mergedCategories = sampleData.map((categoryGroup) => {
      const existingCategoryGroup = existingCategoryGroups.find(
        (c) => c.category.id === categoryGroup.category.id
      );
      return {
        ...categoryGroup,
        items: categoryGroup.items.map((itemObj) => ({
          ...itemObj,
          selected: !!existingCategoryGroup?.items.some(
            (i) => i.item.id === itemObj.item.id
          ),
        })),
      };
    });
    setSelectableCategories(mergedCategories);
  }, [date, selectedByDate]);

  const toggleSelect = (categoryIndex: number, itemIndex: number) => {
    setSelectableCategories((prev) =>
      prev.map((categoryGroup, catIndex) =>
        catIndex === categoryIndex
          ? {
              ...categoryGroup,
              items: categoryGroup.items.map((itemObj, iIndex) =>
                iIndex === itemIndex
                  ? { ...itemObj, selected: !itemObj.selected }
                  : itemObj
              ),
            }
          : categoryGroup
      )
    );
  };

  const handleSave = () => {
    selectableCategories.forEach((categoryGroup) => {
      categoryGroup.items.forEach((itemObj) => {
        if (itemObj.selected) {
          addItemForDate(date, categoryGroup.category, itemObj.item);
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
        {selectableCategories.map((categoryGroup, categoryIndex) => (
          <View key={categoryGroup.category.id} className="mb-6">
            <Text
              style={{ color: palette.heading }}
              className="font-bold text-xl mb-3"
            >
              {categoryGroup.category.name}
            </Text>
            {categoryGroup.items.map((itemObj, itemIndex) => (
              <TouchableOpacity
                key={itemObj.item.id}
                onPress={() => toggleSelect(categoryIndex, itemIndex)}
                className={`flex-row items-center justify-between border rounded-xl py-3 px-4 mb-2 
                  ${
                    itemObj.selected
                      ? "bg-cyan-100 border-cyan-400"
                      : "bg-gray-100 border-gray-300"
                  }`}
              >
                <Text className="text-[15px]">{itemObj.item.name}</Text>
                {itemObj.selected && (
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
