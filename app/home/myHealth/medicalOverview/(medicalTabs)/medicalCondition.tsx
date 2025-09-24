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
          <Text
            className="text-xl font-semibold"
            style={{ color: palette.heading }}
          >
            Medical Conditions (Linked Health System)
          </Text>

          <Divider className="bg-gray-300 my-3" />

          <View>
            <FlatList
              data={linkedHealthSystem}
              renderItem={({ item }) => (
                <View className="border border-gray-200 rounded-lg p-2 bg-gray-100 mb-3">
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
          <Text
            className="text-xl font-semibold"
            style={{ color: palette.heading }}
          >
            Medical Conditions (User entered)
          </Text>

          <Divider className="bg-gray-300 my-3" />

          <View className="flex-1">
            <FlatList
              data={userConditions}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => {
                const formattedDate = getFormattedConditionDate(item);
                return (
                  <View className="flex-row items-center justify-between border border-gray-300 rounded-lg px-3 py-3 mb-3">
                    <View className="flex-row items-center space-x-2">
                      <Text className="text-lg ml-3 max-w-[220px] text-left">
                        {item.condition_name}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-lg text-gray-500 mr-3">
                        {formattedDate}
                      </Text>
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
                <Text className="text-gray-500 text-lg">
                  No Medical conditions found.
                </Text>
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
  // console.log(condition);

  const isDisabled = condition.trim().length === 0;

  const handleSave = () => {
    if (isDisabled) return;
    handleAddUpdateMedicalCondition({
      id: editingCondition?.id,
      condition_name: condition.trim(),
    });
    onClose(); // Go back to list
  };

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
          <Text
            className="text-xl font-medium mb-3"
            style={{ color: palette.heading }}
          >
            {editingCondition
              ? "Update your current medical condition"
              : "Add your current medical condition"}
          </Text>

          <Textarea
            size="lg"
            isReadOnly={false}
            isInvalid={false}
            isDisabled={false}
            className="w-full"
          >
            <TextareaInput
              placeholder="Enter condition..."
              textAlignVertical="top"
              value={condition}
              onChangeText={setCondition}
            />
          </Textarea>
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
