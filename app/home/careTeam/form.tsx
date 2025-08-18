import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/shared/Header";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "lucide-react-native";
import { careTeamContacts, CareContact } from "./index";
import { SafeAreaView } from "react-native-safe-area-context";
import { LabeledTextInput } from "@/components/shared/labeledTextInput";
import palette from "@/utils/theme/color";

type Params = {
  mode?: string;
  contactId?: string;
};

export default function CareTeamForm() {
  const params = useLocalSearchParams() as Params;
  console.log(params);
  const router = useRouter();
  const mode = (params.mode as string) ?? "add"; // "add" | "view" | "edit"
  const contactId = params.contactId;

  const existingContact = contactId
    ? careTeamContacts.find((c) => c.id === contactId)
    : undefined;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    relationship: "",
    phone: "",
    description: "",
    email: "",
  });

  useEffect(() => {
    if (existingContact) {
      setForm({
        firstName: existingContact.firstName,
        lastName: existingContact.lastName,
        relationship: existingContact.relationship,
        phone: existingContact.phone ?? "",
        description: existingContact.description ?? "",
        email: existingContact.email ?? "",
      });
    } else {
      // If add mode, clear
      if (mode === "add") {
        setForm({
          firstName: "",
          lastName: "",
          relationship: "",
          phone: "",
          description: "",
          email: "",
        });
      }
    }
  }, [existingContact, mode]);

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";

  const relationshipOptions = [
    "Physician",
    "Nurse",
    "Urologist",
    "Gastroenterologist",
    "Behavioral Health Nurse Practitioner",
    "School Psychologist",
    "Music Therapist",
    "Occupational Therapist",
    "School Nurse",
    "Other Care Provider",
    "Mother",
    "Father",
    "Grandmother",
    "Grandfather",
    "Friend",
    "Guardian",
    "Other",
  ];

  const handleSave = () => {
    // TODO: call backend API to create/update contact
    if (isAddMode) {
      const newContact: CareContact = {
        id: Date.now().toString(),
        firstName: form.firstName,
        lastName: form.lastName,
        relationship: form.relationship,
        phone: form.phone,
        description: form.description,
        email: form.email,
      };
      console.log("Create contact:", newContact);
    } else {
      console.log("Update contact:", { id: contactId, ...form });
    }
    // router.back();
    router.replace("/home/careTeam");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Header
        title={
          isAddMode
            ? "Add Contact"
            : isEditMode
            ? "Edit Contact"
            : "View Contact"
        }
        right={
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white">Cancel</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* First Name */}
        {/* <Text className="text-gray-500 text-sm mb-1">First Name</Text>
        <TextInput
          className="bg-white p-3 rounded-lg mb-4 border border-gray-300"
          editable={!isViewMode}
          value={form.firstName}
          onChangeText={(t) => setForm((p) => ({ ...p, firstName: t }))}
          placeholder="Enter first name here"
        /> */}
        <LabeledTextInput
          label="First Name"
          value={form.firstName}
          editable={!isViewMode}
          onChangeText={(t) => setForm((p) => ({ ...p, firstName: t }))}
        />

        {/* Last Name */}
        {/* <Text className="text-gray-500 text-sm mb-1">Last Name</Text>
        <TextInput
          className="bg-white p-3 rounded-lg mb-4 border border-gray-300"
          editable={!isViewMode}
          value={form.lastName}
          onChangeText={(t) => setForm((p) => ({ ...p, lastName: t }))}
          placeholder="Enter last name here"
        /> */}
        <LabeledTextInput
          label="Last Name"
          value={form.lastName}
          editable={!isViewMode}
          onChangeText={(t) => setForm((p) => ({ ...p, lastName: t }))}
        />

        {/* Relationship (GlueStack Select) */}
        <View className="mb-3">
          <Text className="text-gray-500 text-sm mb-1">Relationship</Text>
          <Select
            selectedValue={form.relationship}
            isDisabled={isViewMode}
            onValueChange={(value: string) =>
              setForm((p) => ({ ...p, relationship: value }))
            }
          >
            <SelectTrigger
              className="flex flex-row justify-between items-center bg-white rounded-lg border border-gray-300 px-3"
              variant="outline"
              size="xl"
            >
              {/* <SelectInput placeholder="Select relationship" /> */}
              <Text
                className={
                  form.relationship ? "text-gray-900" : "text-gray-400"
                }
              >
                {form.relationship || "Select relationship"}
              </Text>
              <SelectIcon className="" as={ChevronDownIcon} />
            </SelectTrigger>

            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>

                {relationshipOptions.map((rel) => (
                  <SelectItem key={rel} label={rel} value={rel} />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>

        {/* Phone */}
        {/* <Text className="text-gray-500 text-sm mb-1">Phone Number</Text>
        <TextInput
          className="bg-white p-3 rounded-lg mb-4 border border-gray-300"
          editable={!isViewMode}
          value={form.phone}
          onChangeText={(t) => setForm((p) => ({ ...p, phone: t }))}
          placeholder="+91 0000000000"
          keyboardType="phone-pad"
        /> */}
        <LabeledTextInput
          label="Phone Number"
          value={form.phone}
          editable={!isViewMode}
          onChangeText={(t) => setForm((p) => ({ ...p, phone: t }))}
        />

        {/* Description */}
        {/* <Text className="text-gray-500 text-sm mb-1">Description</Text>
        <TextInput
          className="bg-white p-3 rounded-lg mb-4 border border-gray-300"
          editable={!isViewMode}
          value={form.description}
          onChangeText={(t) => setForm((p) => ({ ...p, description: t }))}
          placeholder="Enter description"
          multiline
          style={{ minHeight: 90, textAlignVertical: "top" }}
        /> */}
        <LabeledTextInput
          label="Description"
          value={form.description}
          editable={!isViewMode}
          onChangeText={(t) => setForm((p) => ({ ...p, description: t }))}
        />

        {/* Email */}
        {/* <Text className="text-gray-500 text-sm mb-1">Email</Text>
        <TextInput
          className="bg-white p-3 rounded-lg mb-6 border border-gray-300"
          editable={!isViewMode}
          value={form.email}
          onChangeText={(t) => setForm((p) => ({ ...p, email: t }))}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
        /> */}
        <LabeledTextInput
          label="Email"
          value={form.email}
          editable={!isViewMode}
          onChangeText={(t) => setForm((p) => ({ ...p, email: t }))}
        />

        {/* Action Buttons */}
        {isViewMode ? (
          <View className="space-y-3">
            {/* Close Button */}
            {/* <TouchableOpacity
              style={{ backgroundColor: palette.primary }}
              className="p-3 rounded-lg"
              onPress={() => router.back()}
            >
              <Text className="text-white text-center font-semibold">
                Close
              </Text>
            </TouchableOpacity> */}

            {/* Edit Button */}
            <TouchableOpacity
              style={{ backgroundColor: palette.primary }}
              className="p-3 rounded-lg"
              onPress={() =>
                router.push({
                  pathname: "/home/careTeam/form",
                  params: { mode: "edit", contactId },
                })
              }
            >
              <Text className="text-white text-center font-semibold">Edit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Save Button */
          <TouchableOpacity
            style={{ backgroundColor: palette.primary }}
            className="p-3 rounded-lg"
            onPress={handleSave}
          >
            <Text className="text-white text-center font-semibold">Save</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
