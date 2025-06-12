import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Camera, ChevronDownIcon } from "lucide-react-native";
import { CalendarDaysIcon, Icon } from "@/components/ui/icon";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";

import { Patient } from "@/services/database/migrations/v1/schema_v1";
import { useSQLiteContext } from "expo-sqlite";
import { PatientModel } from "@/services/database/models/PatientModel";
import { useRouter } from "expo-router";
import { ROUTES } from "@/utils/route";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format, differenceInYears } from "date-fns";
import { UserContext} from "@/context/UserContext";
import { PatientContext } from "@/context/PatientContext";

export default function EditProfilePage() {
  const{user, setUserData }= useContext(UserContext)
  const { patient, setPatientData } = useContext(PatientContext)
  
  const [newPatient, setNewPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const db = useSQLiteContext();
  const patientModel = new PatientModel(db);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  
   // setUserData on mount
  useEffect(() => {
    const init = async () => {
      await setUserData();
    };
    init();
  }, []);

  //  setPatientData after user is set
  useEffect(() => {
    if (user) {
      setPatientData(user.id);
    }
  }, [user]);

  //  once both user and patient are available, update local state
  useEffect(() => {
    if (user && patient) {
      setNewPatient(patient);
      setLoading(false);
    }
  }, [user, patient]);

// Function to calculate age from birthdate
  const calculateAge = (
    birthdate: string | null | undefined
  ): number | null => {
    if (!birthdate) return null;
    try {
      const birthDate = new Date(birthdate);
      const today = new Date();
      return differenceInYears(today, birthDate);
    } catch (error) {
      console.error("Error calculating age:", error);
      return null;
    }
  };
  // Function to handle date selection
  const handleConfirm = (date: Date) => {
    const formatted = format(date, "yyyy-MM-dd");
    const age = calculateAge(formatted);

    setNewPatient((prev) =>
      prev
        ? {
            ...prev,
            birthdate: formatted,
            age: age !== null ? age : prev.age,
          }
        : prev
    );
    setDatePickerVisibility(false);
  };

  
  const handleSave = async () => {
    if (!user) return;

    try {
      await patientModel.updateByFields(
        {
          age: newPatient?.age,
          weight: newPatient?.weight,
          relationship: newPatient?.relationship,
          gender: newPatient?.gender,
          birthdate: newPatient?.birthdate,
        },
        { user_id: user.id }
      );

      await patientModel.getPatientByUserId(user.id);
      console.log("Profile updated");

      router.replace(ROUTES.MY_HEALTH);
    } catch (err) {
      console.log(" Save Error: ", err);
    }
  };

  if (loading || !user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
  function LabeledDisplayField({ label, value }: { label: string; value: string }) {
  return (
    <View className="mb-4">
      <Text className="text-gray-500 text-sm mb-1">{label}</Text>
      <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
        <Text className="text-gray-700">{value}</Text>
      </View>
    </View>
  );
}


  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="py-2 bg-[#49AFBE]">
        <Text className="text-xl text-white font-bold text-center">
          Edit Profile
        </Text>

        <View className="flex-row mb-5 items-center justify-start px-4 ">
          <Avatar size="xl">
            <AvatarImage source={{ uri: user.picture }} />
            <View className="absolute bottom-0 right-0 bg-white rounded-full p-1 ">
              <Icon as={Camera} size="sm" className="text-black" />
            </View>
          </Avatar>
          <View className="ml-16">
            <Text className="text-lg text-white font-semibold">
              {patient?.name}
            </Text>
            <Text className="text-white">Age: {patient?.age}</Text>
            <Text className="text-white">Weight: {patient?.weight} kg</Text>
          </View>
        </View>
      </View>
      {/* edit profile form -newPatient*/}
      <View className="p-4">
        <LabeledDisplayField label="Name" value={newPatient?.name ?? user.name} />

        <View className="mb-4">
          <Text className="text-gray-500 text-sm mb-1">Birthdate</Text>
          <TouchableOpacity
            className="border flex flex-row justify-between items-center border-gray-300 rounded-lg p-3"
            onPress={() => setDatePickerVisibility(true)}
          >
            <Text className="text-gray-700">
              {newPatient?.birthdate
                ? format(new Date(newPatient.birthdate), "yyyy-MM-dd")
                : "Select birthdate"}
            </Text>
            <Icon
              as={CalendarDaysIcon}
              className="text-typography-500 m-2 w-4 h-4"
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisibility(false)}
            maximumDate={new Date()} // Prevent selecting future dates
          />
        </View>

        <LabeledDisplayField
  label="Age"
  value={
    newPatient?.age ? `${newPatient.age} years` : "Not specified"
  }
/>

        <View className="mb-4">
          <Text className="text-gray-500 text-sm mb-1">Weight (in Kg)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-gray-700"
            keyboardType="numeric"
            value={newPatient?.weight?.toString() ?? ""}
            onChangeText={(text) =>
              setNewPatient((prev) =>
                prev ? { ...prev, weight: parseFloat(text) } : prev
              )
            }
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 text-sm mb-1">Relationship</Text>

          <Select
            selectedValue={newPatient?.relationship}
            onValueChange={(value) =>
              setNewPatient((prev) =>
                prev ? { ...prev, relationship: value } : prev
              )
            }
          >
            <SelectTrigger
              className="flex flex-row justify-between items-center "
              variant="outline"
              size="lg"
            >
              <SelectInput placeholder="Select relationship" />
              <SelectIcon className="mr-3" as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectItem label="Self" value="self" />
                <SelectItem label="Parent" value="parent" />
                <SelectItem label="Child" value="child" />
                <SelectItem label="Spouse" value="spouse" />
                <SelectItem label="Sibling" value="sibling" />
                <SelectItem label="Grandparent" value="grandparent" />
                <SelectItem label="Grandchild" value="grandchild" />
                <SelectItem label="Relative" value="relative" />
                <SelectItem label="Friend" value="friend" />
                <SelectItem label="Guardian" value="guardian" />
                <SelectItem label="Other" value="other" />
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>

        <View className="mb-6">
          <Text className="text-gray-500 text-sm mb-1">Gender</Text>
          <Select
            selectedValue={newPatient?.gender}
            onValueChange={(value) =>
              setNewPatient((prev) =>
                prev ? { ...prev, gender: value } : prev
              )
            }
          >
            <SelectTrigger
              className="flex flex-row justify-between items-center "
              variant="outline"
              size="lg"
            >
              <SelectInput placeholder="Select Gender" />
              <SelectIcon className="mr-3" as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectItem label="Male" value="male" />
                <SelectItem label="Female" value="female" />
                <SelectItem label="Other" value="other" />
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>

        <TouchableOpacity
          className="bg-[#49AFBE] py-3 rounded-lg"
          onPress={handleSave}
        >
          <Text className="text-white font-bold text-center">Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}