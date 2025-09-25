import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import palette from "@/utils/theme/color";
import {
  createPatientCondition,
  getPatientConditionsByPatientId,
  updatePatientCondition,
  deletePatientCondition,
} from "@/services/core/PatientConditionService";
import { PatientContext } from "@/context/PatientContext";
import { CustomAlertDialog } from "@/components/shared/CustomAlertDialog";
import Header from "@/components/shared/Header";
import ActionPopover from "@/components/shared/ActionPopover";
import { useCustomToast } from "@/components/shared/useCustomToast";
import { PatientCondition } from "@/services/database/migrations/v1/schema_v1";
import { logger } from "@/services/logging/logger";
import { router } from "expo-router";
import { CustomButton } from "@/components/shared/CustomButton";
import { Divider } from "@/components/ui/divider";
import { Icon } from "@/components/ui/icon";
import {
  Link,
  Calendar,
  Plus,
  Lightbulb,
  Stethoscope,
} from "lucide-react-native";
import { CustomFormInput } from "@/components/shared/CustomFormInput";

const linkedHealthSystem: string[] = [
  "Attention Deficient and Hyperactivity Disorder (ADHD)",
  "Irritable Bowel Syndrome (IBS)",
];

export default function MedicalConditions() {
  const { patient } = useContext(PatientContext);
  const [userConditions, setUserConditions] = useState<PatientCondition[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCondition, setEditingCondition] = useState<
    PatientCondition | undefined
  >(undefined);

  // for Alert while delete
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [conditionToDelete, setConditionToDelete] =
    useState<PatientCondition | null>(null);

  // Custom toast
  const showToast = useCustomToast();

  const fetchConditions = async () => {
    if (!patient?.id) {
      logger.debug("No patient id found");
      return;
    }

    try {
      const conditions = await getPatientConditionsByPatientId(patient.id);
      setUserConditions(conditions);
    } catch (e) {
      logger.debug(String(e));
    }
  };

  useEffect(() => {
    fetchConditions();
  }, [patient]);

  // add/update medicalCondition
  const handleAddUpdateMedicalCondition = async (condition: {
    id?: number;
    condition_name: string;
  }) => {
    if (!patient?.id) return;
    if (condition.id) {
      //edit
      await updatePatientCondition(
        { condition_name: condition.condition_name }, // fields to update
        { id: condition.id } // where clause
      );
      await fetchConditions(); // Refresh list after editing
      showToast({
        title: "Condition updated",
        description: "Medical condition updated successfully!",
      });
    } else {
      // Add new condition
      await createPatientCondition({
        patient_id: patient.id,
        condition_name: condition.condition_name,
      });
      await fetchConditions(); // Refresh list after adding
      showToast({
        title: "Condition added",
        description: "Medical condition added successfully!",
      });
    }
  };

  // open edit form
  const handleEdit = (condition: PatientCondition) => {
    setEditingCondition(condition);
    setShowAddForm(true);
  };

  if (showAddForm) {
    return (
      <AddMedicalConditionsPage
        onClose={() => {
          setShowAddForm(false);
          setEditingCondition(undefined);
        }}
        handleAddUpdateMedicalCondition={handleAddUpdateMedicalCondition}
        editingCondition={editingCondition}
      />
    );
  }

  // Format date for display
  function getFormattedConditionDate(condition: PatientCondition): string {
    const showUpdated =
      condition.updated_date &&
      condition.updated_date !== condition.created_date;
    const dateToShow = showUpdated
      ? condition.updated_date
      : condition.created_date;
    return dateToShow
      ? new Date(dateToShow)
          .toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "-")
      : "";
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Header
        title="Medical Conditions"
        right={
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
        }
      />

      <View className="px-5 pt-5 flex-1">
        {/* Linked Health System */}
        <View className="mb-6">
          <View className="flex-row items-center">
            <Icon as={Stethoscope} size="xl" color={palette.primary} />
            <View className="ml-1 flex-1">
              <Text
                className="text-xl font-semibold"
                style={{ color: palette.primary }}
              >
                Medical Conditions (Linked Health System)
              </Text>
              <Text className="text-sm text-gray-700">
                Automatically imported from your healthcare provider
              </Text>
            </View>
          </View>

          <Text
            className="text-base text-gray-600 text-right mb-3"
            style={{ textAlign: "right" }}
          >
            {linkedHealthSystem.length}{" "}
            {linkedHealthSystem.length === 1 ? "item" : "items"}
          </Text>

          {/* <Divider className="bg-gray-300 my-3" /> */}

          <View>
            <FlatList
              data={linkedHealthSystem}
              renderItem={({ item }) => (
                <View className="border border-gray-200 rounded-lg px-2 py-3 bg-gray-100 mb-3">
                  <Text className="text-lg">{item}</Text>
                </View>
              )}
              keyExtractor={(_, index) => index.toString()}
              ListEmptyComponent={
                <Text className="text-gray-500 text-lg">
                  No user linked health system found.
                </Text>
              }
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
              style={{ minHeight: 50, maxHeight: 200 }}
            />
          </View>
        </View>

        {/* User Entered */}
        <View className="flex-1">
          <View className="flex-row items-center">
            <Icon as={Stethoscope} size="xl" color={palette.primary} />
            <View className="ml-1 flex-1">
              <Text
                className="text-xl font-semibold"
                style={{ color: palette.primary }}
              >
                Medical Conditions (User entered)
              </Text>
              <Text className="text-sm text-gray-700">
                Conditions you've added manually
              </Text>
            </View>
          </View>

          <Text
            className="text-base text-gray-600 text-right mb-3"
            style={{ textAlign: "right" }}
          >
            {userConditions.length}{" "}
            {userConditions.length === 1 ? "item" : "items"}
          </Text>
          {/* <Divider className="bg-gray-300 my-3" /> */}

          <View className="flex-1">
            <FlatList
              data={userConditions}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => {
                const formattedDate = getFormattedConditionDate(item);
                return (
                  <View className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-3 shadow-sm">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <View className="flex-1">
                          <Text
                            className="text-base font-medium"
                            // style={{ color: palette.heading }}
                            numberOfLines={1}
                          >
                            {item.condition_name}
                          </Text>
                          {!!formattedDate && (
                            <View className="flex-row items-center mt-1">
                              <Icon
                                as={Calendar}
                                size="sm"
                                className="text-gray-600 mr-1"
                              />
                              <Text className="text-sm text-gray-600">
                                {formattedDate}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <ActionPopover
                        onEdit={() => {
                          handleEdit(item);
                        }}
                        onDelete={() => {
                          setConditionToDelete(item);
                          setShowAlertDialog(true);
                        }}
                      />
                    </View>
                  </View>
                );
              }}
              ListEmptyComponent={
                <View className="items-center justify-center py-12">
                  <Text className="text-gray-500 text-base text-center">
                    No medical conditions found.
                  </Text>
                  <Text className="text-gray-400 text-sm text-center mt-1">
                    Add your first condition below
                  </Text>
                </View>
              }
              style={{ minHeight: 50 }}
            />
          </View>
        </View>

        <Divider className="bg-gray-300 mb-2" />

        {/* Add Condition Button */}
        <CustomButton
          title="Add medical condition"
          onPress={() => setShowAddForm(true)}
        />
      </View>

      <CustomAlertDialog
        isOpen={showAlertDialog}
        onClose={() => setShowAlertDialog(false)}
        description={conditionToDelete?.condition_name}
        onConfirm={async () => {
          if (conditionToDelete) {
            await deletePatientCondition(conditionToDelete.id);
            await fetchConditions();
            showToast({
              title: "Condition deleted",
              description: "Medical condition deleted successfully!",
            });
          }
          setShowAlertDialog(false);
          setConditionToDelete(null);
        }}
      >
        {/* children prop */}
        {/* <View className="flex-row items-center justify-between border border-gray-300 rounded-lg px-3 py-3 mb-3">
          <View className="flex-row items-center">
            <Text className="text-lg px-1 text-left">
              {conditionToDelete?.condition_name}
            </Text>
          </View>
        </View> */}
      </CustomAlertDialog>
    </SafeAreaView>
  );
}

function AddMedicalConditionsPage({
  onClose,
  handleAddUpdateMedicalCondition,
  editingCondition,
}: {
  onClose: () => void;
  handleAddUpdateMedicalCondition: (condition: {
    id?: number;
    condition_name: string;
  }) => void;
  editingCondition?: { id: number; condition_name: string };
}) {
  const [condition, setCondition] = useState(
    editingCondition?.condition_name || ""
  );

  const isDisabled = condition.trim().length === 0;

  const handleSave = () => {
    if (isDisabled) return;
    handleAddUpdateMedicalCondition({
      id: editingCondition?.id,
      condition_name: condition.trim(),
    });
    onClose(); // Go back to list
  };

  // Common conditions data
  const commonConditions = [
    "Diabetes Type 2",
    "High Blood Pressure",
    "Asthma",
    "Arthritis",
    "Depression",
    "Anxiety",
  ];

  // Handle selecting a common condition
  const selectCommonCondition = (selectedCondition: string) => {
    setCondition(selectedCondition);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Header
        title="Medical Conditions"
        right={
          <TouchableOpacity onPress={onClose}>
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
        }
        onBackPress={onClose}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        className="bg-white"
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        behavior={"padding"}
        // keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          className="px-5 pt-5 flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title with icon */}
          <View className="flex-row items-center mb-4">
            <Icon as={Stethoscope} size="xl" color={palette.primary} />
            <Text
              className="text-xl font-semibold ml-2"
              style={{ color: palette.primary }}
            >
              {editingCondition
                ? "Update your current medical condition"
                : "Add your current medical condition"}
            </Text>
          </View>

          {/* Input field */}
          <CustomFormInput
            className="mb-2"
            label="Medical Condition*"
            value={condition}
            onChangeText={setCondition}
            placeholder="Enter condition name"
          />

          {/* Helper text */}
          <Text className="text-sm text-gray-600 mb-6">
            Enter a medical condition you've been diagnosed with
          </Text>

          {/* Common Conditions Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <Icon as={Lightbulb} size="sm" className="text-orange-500 mr-2" />
              <Text className="text-lg font-semibold">Common Conditions</Text>
            </View>

            {/* Common conditions grid */}
            <View className="flex-row flex-wrap -mx-1">
              {commonConditions.map((commonCondition, index) => (
                <View key={index} className="w-1/2 px-1 mb-3">
                  <TouchableOpacity
                    onPress={() => selectCommonCondition(commonCondition)}
                    className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-3 w-full"
                    activeOpacity={0.7}
                  >
                    <Text className="text-base font-medium text-center">
                      {commonCondition}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Save button */}
        <View className="px-5">
          <CustomButton
            title={editingCondition ? "Update" : "Save"}
            disabled={isDisabled}
            onPress={handleSave}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
