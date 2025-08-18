import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import ActionPopover from "@/components/shared/ActionPopover";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/shared/Header";
import palette from "@/utils/theme/color";

export type CareContact = {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phone?: string;
  description?: string;
  email?: string;
};

// Data (matches the screenshot — includes repeats like your mock)
export let careTeamContacts: CareContact[] = [
  {
    id: "1",
    firstName: "Sal",
    lastName: "Petrillo",
    relationship: "Behavioral Health Nurse Practitioner",
    phone: "+1 234 567 8900",
    email: "sal.petrillo@example.com",
    description: "demo demo demo",
  },
  {
    id: "2",
    firstName: "Rue",
    lastName: "McClanahan",
    relationship: "Nurse",
    phone: "+91 98765 43210",
    email: "rue.mc@example.com",
  },
  {
    id: "3",
    firstName: "Rose",
    lastName: "Nylund",
    relationship: "Urologist",
    phone: "",
    email: "",
  },
  {
    id: "4",
    firstName: "Estelle",
    lastName: "Getty",
    relationship: "Gastroenterologist",
    phone: "",
    email: "",
  },
  {
    id: "5",
    firstName: "Miles",
    lastName: "Webber",
    relationship: "School Psychologist",
    phone: "",
    email: "",
  },
  // duplicates for long list (to resemble the screenshot)
  {
    id: "6",
    firstName: "Estelle",
    lastName: "Getty",
    relationship: "Music Therapist",
  },
  {
    id: "7",
    firstName: "Miles",
    lastName: "Webber",
    relationship: "School Nurse",
  },
  {
    id: "8",
    firstName: "Estelle",
    lastName: "Getty",
    relationship: "Gastroenterologist",
  },
  {
    id: "9",
    firstName: "Miles",
    lastName: "Webber",
    relationship: "Mother",
  },
  {
    id: "10",
    firstName: "Estelle",
    lastName: "Getty",
    relationship: "Father",
  },
  {
    id: "11",
    firstName: "Estelle",
    lastName: "Getty",
    relationship: "Father",
  },
  {
    id: "12",
    firstName: "Estelle",
    lastName: "Getty",
    relationship: "Father",
  },
  // {
  //   id: "13",
  //   firstName: "Estelle",
  //   lastName: "Getty",
  //   relationship: "Father",
  // },
  // {
  //   id: "14",
  //   firstName: "Estelle",
  //   lastName: "Getty",
  //   relationship: "Father",
  // },
];

export default function CareTeamListScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: CareContact }) => (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <View className="flex-row items-center">
        {/* checkbox mimic */}
        <View>
          <Text className="text-base font-semibold">
            {item.firstName} {item.lastName}
          </Text>
          <Text className="text-sm text-gray-500">{item.relationship}</Text>
        </View>
      </View>
      {/* Use your ActionPopover; we map its editLabel/deleteLabel to View/Edit */}
      <ActionPopover
        // editLabel="View"
        // deleteLabel="Edit"
        onView={() =>
          router.push({
            pathname: "/home/careTeam/form",
            params: { mode: "view", contactId: item.id },
          })
        }
        onEdit={() =>
          router.push({
            pathname: "/home/careTeam/form",
            params: { mode: "edit", contactId: item.id },
          })
        }
        onDelete={() => console.log("Delete functionality not implemented yet")}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* header */}
      <Header
        title="Track"
        right={
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/home/careTeam/form",
                params: { mode: "add" },
              })
            }
          >
            <View className="bg-white px-3 py-1.5 rounded-lg">
              <Text className="font-bold" style={{ color: palette.primary }}>
                Add Contact
              </Text>
            </View>
          </TouchableOpacity>
        }
      />

      {/* card-like container */}
      <View
        className="mx-4 mt-4 bg-white rounded-xl overflow-hidden border border-gray-200"
        style={{ marginBottom: 100 }}
      >
        {/* header row inside card */}
        <View className="px-4 py-3 border-b border-gray-200">
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-medium text-gray-700">Name</Text>
            {/* <Text className="text-sm text-gray-700"></Text> */}
          </View>
        </View>

        <FlatList
          data={careTeamContacts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}
