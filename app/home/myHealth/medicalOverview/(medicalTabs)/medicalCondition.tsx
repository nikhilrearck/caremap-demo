import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import palette from "@/utils/theme/color";
import {
  getMedicalConditionsByPatient,
  createMedicalCondition,
  deleteMedicalCondition,
  updateMedicalCondition,
} from "@/services/core/PatientService";
import { PatientContext } from "@/context/PatientContext";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function MedicalConditionsPage({
  onClose,
  handleAddMedicalCondition,
  editingCondition,
}: {
  onClose: () => void;
  handleAddMedicalCondition: (condition: { id?: number; name: string }) => void;
  editingCondition?: { id: number; name: string };
}) {
  const [condition, setCondition] = useState(editingCondition?.name || "");
  // console.log(condition);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View
          className="py-3 flex-row items-center"
          style={{ backgroundColor: palette.primary }}
        >
          <TouchableOpacity onPress={onClose} className="p-2 ml-2">
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-xl text-white font-bold ml-4">
            Medical Conditions
          </Text>
        </View>

        <View className="px-6 py-8">
          <Text
            className="text-lg font-medium mb-3"
            style={{ color: palette.heading }}
          >
            {editingCondition
              ? "Edit your child's current medical condition"
              : "Add your child's current medical condition"}
          </Text>

          <Textarea
            size="md"
            isReadOnly={false}
            isInvalid={false}
            isDisabled={false}
            className="w-full"
          >
            <TextareaInput
              placeholder="Enter condition"
              style={{ textAlignVertical: "top", fontSize: 16 }}
              value={condition}
              onChangeText={setCondition}
            />
          </Textarea>

          <TouchableOpacity
            className="py-3 rounded-md mt-3"
            style={{ backgroundColor: palette.primary }}
            onPress={() => {
              if (condition.trim()) {
                handleAddMedicalCondition({
                  id: editingCondition?.id,
                  name: condition.trim(),
                });
              }

              // console.log("Saved:", condition);
              onClose(); // Go back to list
            }}
          >
            <Text className="text-white font-bold text-center">
              {editingCondition ? "Update" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

interface Condition {
  id: number;
  name: string;
  date?: string;
  checked?: boolean;
}

export default function MedicalConditions() {
  const { patient } = useContext(PatientContext);
  const [userConditions, setUserConditions] = useState<Condition[]>([
    // {
    //   id: 1,
    //   name: "Irritable Bowel Syndrome (IBS)",
    //   date: "18 Apr, 2025",
    //   checked: false,
    // },
    // { id: 2, name: "Condition 1", date: "18 Apr, 2025", checked: false },
    // { id: 3, name: "Condition 2", date: "18 Apr, 2025", checked: false },
    // { id: 4, name: "Condition 3", date: "18 Apr, 2025", checked: false },
    // { id: 5, name: "Condition 4", date: "18 Apr, 2025", checked: false },
  ]);

  const fetchConditions = async () => {
    if (!patient?.id) {
      console.log("No patient id found");
      return;
    }

    try {
      const conditions = await getMedicalConditionsByPatient(patient.id);
      // console.log(conditions);
      setUserConditions(
        conditions.map((c) => {
          // Use updated_at if it's different from created_at, else use created_at
          const showUpdated = c.updated_at && c.updated_at !== c.created_at;
          const dateToShow = showUpdated ? c.updated_at : c.created_at;
          return {
            id: c.id,
            name: c.condition_name,
            date: dateToShow
              ? new Date(dateToShow)
                  .toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "2-digit",
                  })
                  .replace(/\//g, "-")
              : "",
            checked: false,
          };
        })
      );
      // console.log(userConditions);
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  useEffect(() => {
    fetchConditions();
  }, [patient]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCondition, setEditingCondition] = useState<
    { id: number; name: string } | undefined
  >(undefined);

  // to make delete btn disabled
  const anyChecked = userConditions.some((c) => c.checked);

  // add/update medicalCondition
  const handleAddMedicalCondition = async (condition: {
    id?: number;
    name: string;
  }) => {
    if (!patient?.id) return;
    if (condition.id) {
      //edit
      await updateMedicalCondition(
        { condition_name: condition.name }, // fields to update
        { id: condition.id } // where clause
      );
      await fetchConditions(); // Refresh list after editing
    } else {
      // Add new condition
      await createMedicalCondition({
        patient_id: patient.id,
        condition_name: condition.name,
      });
      await fetchConditions(); // Refresh list after adding
    }
  };

  // Delete checked condition
  const handleDelete = async () => {
    // Find all checked conditions
    const checkedConditions = userConditions.filter((c) => c.checked);
    // Delete each from DB
    for (const condition of checkedConditions) {
      await deleteMedicalCondition(condition.id);
    }
    // Refresh the list
    await fetchConditions();
  };

  // Toggle checkbox
  const handleToggleCheck = (id: number) => {
    setUserConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };

  // open edit form
  const handleEdit = (condition: { id: number; name: string }) => {
    // console.log(condition);
    setEditingCondition({ id: condition.id, name: condition.name });
    setShowAddForm(true);
  };

  if (showAddForm) {
    return (
      <MedicalConditionsPage
        onClose={() => {
          setShowAddForm(false);
          setEditingCondition(undefined);
        }}
        handleAddMedicalCondition={handleAddMedicalCondition}
        editingCondition={editingCondition}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View
          className="py-3 flex-row items-center"
          style={{ backgroundColor: palette.primary }}
        >
          <TouchableOpacity onPress={() => router.back()} className="p-2 ml-2">
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-xl text-white font-bold ml-4">
            Medical Conditions
          </Text>
        </View>

        <View className="p-5 flex-1">
          {/* Linked System */}
          <View className="mb-6 mt-4">
            <Text
              className="text-lg font-semibold"
              style={{ color: palette.heading }}
            >
              Medical Conditions (Linked Health System)
            </Text>

            {/* Like hr */}
            <View className="h-px bg-gray-300 my-3" />

            <View className="border border-gray-200 rounded-lg p-2 mb-2 mt-1 bg-gray-100">
              <Text className="text-lg">
                Attention Deficient and Hyperactivity Disorder (ADHD)
              </Text>
            </View>
            <View className="border border-gray-200 rounded-lg p-2 bg-gray-100">
              <Text className="text-lg">Irritable Bowel Syndrome (IBS)</Text>
            </View>
          </View>

          {/* User Entered */}
          <View className="mb-6 flex-1">
            <Text
              className="text-lg font-semibold"
              style={{ color: palette.heading }}
            >
              Medical Conditions (User entered)
            </Text>

            {/* Like hr */}
            <View className="h-px bg-gray-300 my-3" />

            <View>
              {/* <FlatList
              data={userConditions}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
              ListEmptyComponent={
                <Text className="text-gray-500">
                No Medical conditions found.
                </Text>
                }
                style={{ maxHeight: 380 }}
                renderItem={({ item: condition }) => (
                  <View
                  key={condition.id}
                  className="flex-row items-center justify-between border border-gray-300 rounded-lg px-3 py-3 mb-3"
                  >
                  <View className="flex-row items-center space-x-2">
                  <Checkbox
                  value={condition.name}
                  isChecked={condition.checked}
                  onChange={() => handleToggleCheck(condition.id)}
                  >
                  <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  </Checkbox>
                  <Text className="text-lg ml-3 max-w-52 text-left">
                  {condition.name}
                  </Text>
                  </View>
                  <View className="flex-row items-center">
                  <Text className="text-md text-gray-500 mr-2">
                  {condition.date}
                  </Text>
                  <TouchableOpacity onPress={() => handleEdit(condition)}>
                  <MaterialIcons
                  name="more-vert"
                  size={20}
                  // color="#9E9E9E"
                  />
                  </TouchableOpacity>
                  </View>
                  </View>
                  )}
                  /> */}
              <DraggableFlatList
                data={userConditions}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
                onDragEnd={({ data }) => setUserConditions(data)}
                renderItem={({ item: condition, drag, isActive }) => (
                  <ScaleDecorator>
                    <TouchableOpacity
                      onLongPress={drag}
                      disabled={isActive}
                      activeOpacity={1}
                      className="flex-row items-center justify-between border border-gray-300 rounded-lg px-3 py-3 mb-3"
                      style={{ backgroundColor: isActive ? "#f0f0f0" : "#fff" }}
                    >
                      <View className="flex-row items-center space-x-2">
                        <Checkbox
                          value={condition.name}
                          isChecked={condition.checked}
                          onChange={() => handleToggleCheck(condition.id)}
                        >
                          <CheckboxIndicator>
                            <CheckboxIcon as={CheckIcon} />
                          </CheckboxIndicator>
                        </Checkbox>
                        <Text className="text-lg ml-3 max-w-52 text-left">
                          {condition.name}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text className="text-md text-gray-500 mr-2">
                          {condition.date}
                        </Text>
                        <TouchableOpacity onPress={() => handleEdit(condition)}>
                          <MaterialIcons name="more-vert" size={20} />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </ScaleDecorator>
                )}
                ListEmptyComponent={
                  <Text className="text-gray-500">
                    No Medical conditions found.
                  </Text>
                }
                style={{ maxHeight: 380 }}
              />
            </View>

            <TouchableOpacity
              className="bg-gray-100 rounded-md p-1 w-24 self-end border"
              style={{
                borderBlockColor: palette.primary,
                opacity: anyChecked ? 1 : 0.6,
              }}
              disabled={!anyChecked}
              onPress={handleDelete}
            >
              <Text
                className="text-center text-lg"
                style={{ color: palette.primary }}
              >
                Delete
              </Text>
            </TouchableOpacity>

            {/* Like hr */}
            <View className="h-px bg-gray-300 my-3" />

            {/* Add Condition Button */}
            <TouchableOpacity
              className="rounded-md py-3 items-center mt-1"
              onPress={() => setShowAddForm(true)}
              style={{ backgroundColor: palette.primary }}
            >
              <Text className="text-white font-medium text-md">
                Add your child's current medical condition
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
