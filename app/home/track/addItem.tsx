import Header from "@/components/shared/Header";
import { CheckIcon, Icon } from "@/components/ui/icon";
import { PatientContext } from "@/context/PatientContext";
import { TrackContext } from "@/context/TrackContext";
import { UserContext } from "@/context/UserContext";
import { TrackCategoryWithSelectableItems } from "@/services/common/types";
import {
  addTrackItemOnDate,
  getAllCategoriesWithSelectableItems,
  removeTrackItemFromDate,
} from "@/services/core/TrackService";
import { ROUTES } from "@/utils/route";
import palette from "@/utils/theme/color";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddItem() {
  const router = useRouter();

  const { user } = useContext(UserContext);
  const { patient } = useContext(PatientContext);
  const { selectedDate, setRefreshData } = useContext(TrackContext);
  const [selectableCategories, setSelectableCategories] = useState<
    TrackCategoryWithSelectableItems[]
  >([]);
  const selectableCategoriesRef = useRef<TrackCategoryWithSelectableItems[]>([]);
  const initialCategoriesRef = useRef<TrackCategoryWithSelectableItems[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace(ROUTES.LOGIN);
      return;
    }
    if (!patient) {
      router.replace(ROUTES.MY_HEALTH);
      return;
    }

    const loadSelectableItems = async () => {
      const res = await getAllCategoriesWithSelectableItems(
        patient.id,
        selectedDate
      );

      selectableCategoriesRef.current = res;
      initialCategoriesRef.current = res;
      setSelectableCategories(res);
    };
    loadSelectableItems();
  }, [patient, selectedDate]);

  const toggleSelect = (categoryIndex: number, itemIndex: number) => {
    setSelectableCategories((prev) => {
      const categoryGroup = prev[categoryIndex];
      const items = categoryGroup.items.map((item, i) =>
        i === itemIndex ? { ...item, selected: !item.selected } : item
      );

      const updatedGroup = { ...categoryGroup, items };
      const next = prev.map((group, i) =>
        i === categoryIndex ? updatedGroup : group
      );
      selectableCategoriesRef.current = next;
      return next;
    });
  };

  const handleSave = async () => {
    if (isLoading) return;
    if (!user?.id) throw new Error("Authentication ERROR");
    if (!patient?.id) throw new Error("Authentication ERROR");

    setIsLoading(true);

    try {
      const current = selectableCategoriesRef.current;
      const initial = initialCategoriesRef.current;

      for (let c = 0; c < current.length; c++) {
        const currentGroup = current[c];
        const initialGroup = initial[c];
        for (let i = 0; i < currentGroup.items.length; i++) {
          const currentItem = currentGroup.items[i];
          const initialItem = initialGroup?.items?.[i];
          const hasChanged = initialItem
            ? currentItem.selected !== initialItem.selected
            : currentItem.selected;

          if (!hasChanged) continue;

          if (currentItem.selected) {
            await addTrackItemOnDate(
              currentItem.item.id,
              user.id,
              patient.id,
              selectedDate
            );
          } else {
            await removeTrackItemFromDate(
              currentItem.item.id,
              user.id,
              patient.id,
              selectedDate
            );
          }
        }
      }

      initialCategoriesRef.current = selectableCategoriesRef.current;

      setRefreshData(true);
      router.back();
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
          style={{ backgroundColor: palette.primary }}
          className="rounded-lg py-3 items-center"
        >
          <Text className="text-white font-bold text-[16px]">Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

