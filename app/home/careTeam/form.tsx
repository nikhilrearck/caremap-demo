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
// import { careTeamContacts, CareContact } from "./index";

import { SafeAreaView } from "react-native-safe-area-context";
import { LabeledTextInput } from "@/components/shared/labeledTextInput";
import palette from "@/utils/theme/color";
import { useContext } from "react";
import { PatientContext } from "@/context/PatientContext";
import {
  createContact,
  updateContact,
  getContact,
} from "@/services/core/ContactService";
import { Contact } from "@/services/database/migrations/v1/schema_v1";
import { useCustomToast } from "@/components/shared/useCustomToast";

type Params = {
  mode?: string;
  contactId?: number;
};

export default function CareTeamForm() {
  const { patient } = useContext(PatientContext);
  const params = useLocalSearchParams() as Params;
  // const params = useLocalSearchParams();
  // console.log(params);
  const router = useRouter();
  const mode = (params.mode as string) ?? "add"; // "add" | "view" | "edit"
  const contactId = params.contactId;
  // console.log(typeof contactId);
  // Custom toast
  const showToast = useCustomToast();

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";

  // const existingContact = contactId
  //   ? careTeamContacts.find((c) => c.id === contactId)
  //   : undefined;
  // Fetch contact from backend if editing or viewing
  // const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Partial<Contact>>({
    first_name: "",
    last_name: "",
    relationship: "",
    phone_number: "",
    description: "",
    email: "",
  });

  useEffect(() => {
    if ((isEditMode || isViewMode) && contactId) {
      getContact(Number(contactId)).then((contact) => {
        if (contact) {
          setForm({
            first_name: contact.first_name,
            last_name: contact.last_name,
            relationship: contact.relationship,
            phone_number: contact.phone_number,
            description: contact.description,
            email: contact.email,
          });
        }
      });
    } else if (isAddMode) {
      setForm({
        first_name: "",
        last_name: "",
        relationship: "",
        phone_number: "",
        description: "",
        email: "",
      });
    }
  }, [contactId, mode]);

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

  const handleSave = async () => {
    if (!patient?.id) return;
    try {
      if (isAddMode) {
        await createContact(
          {
            first_name: form.first_name ?? "",
            last_name: form.last_name ?? "",
            relationship: form.relationship ?? "",
            phone_number: form.phone_number ?? "",
            description: form.description,
            email: form.email,
          },
          patient.id
        );
        showToast({
          title: "Contact added",
          description: "Contact added successfully!",
        });
      } else if (isEditMode && contactId) {
        await updateContact(
          {
            first_name: form.first_name ?? "",
            last_name: form.last_name ?? "",
            relationship: form.relationship ?? "",
            phone_number: form.phone_number ?? "",
            description: form.description,
            email: form.email,
          },
          { id: Number(contactId) }
        );
        showToast({
          title: "Contact updated",
          description: "Contact updated successfully!",
        });
      }
      // router.back();
      router.replace("/home/careTeam");
    } catch (e) {
      console.log(e);
    }
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
          value={form.first_name ?? ""}
          editable={!isViewMode}
          onChangeText={(t) => setForm((p) => ({ ...p, first_name: t }))}
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
          value={form.last_name ?? ""}
          editable={!isViewMode}
          onChangeText={(t) => setForm((p) => ({ ...p, last_name: t }))}
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
                className={`text-base ${
                  form.relationship ? "text-gray-900" : "text-gray-400"
                }`}
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
          value={form.phone_number ?? ""}
          editable={!isViewMode}
          onChangeText={(t) => setForm((p) => ({ ...p, phone_number: t }))}
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
          value={form.description ?? ""}
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
          value={form.email ?? ""}
          editable={!isViewMode}
          onChangeText={(t) => setForm((p) => ({ ...p, email: t }))}
        />

        {/* Action Buttons */}
        {isViewMode ? (
          <View className="space-y-3">
            {/* Close Button */}
            <TouchableOpacity
              style={{ backgroundColor: palette.primary }}
              className="p-3 rounded-lg"
              onPress={() => router.back()}
            >
              <Text className="text-white text-center font-semibold">
                Close
              </Text>
            </TouchableOpacity>

            {/* Edit Button */}
            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
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
