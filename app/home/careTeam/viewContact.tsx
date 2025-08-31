import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Share,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Linking from "expo-linking";
import Header from "@/components/shared/Header";
import palette from "@/utils/theme/color";
import { getContactById } from "@/services/core/ContactService";
import { Contact } from "@/services/database/migrations/v1/schema_v1";
import { PatientContext } from "@/context/PatientContext";
import {
  Phone,
  Mail,
  User2,
  PencilLine,
  MessageSquare,
  Share2,
  ChevronRight,
  Info,
} from "lucide-react-native";
import { logger } from "@/services/logging/logger";

type Params = { contactId?: string | number };

export default function ViewContact() {
  const { patient } = useContext(PatientContext);
  const params = useLocalSearchParams() as Params;
  const router = useRouter();
  const contactId = params.contactId ? Number(params.contactId) : undefined;
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!contactId) return;
    try {
      const c = await getContactById(contactId);
      setContact(c ?? null);
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    load();
  }, [load]);

  const initials = (c?: Contact | null) =>
    c
      ? `${(c.first_name || "").charAt(0)}${(c.last_name || "").charAt(0)}`
          .trim()
          .toUpperCase()
      : "";

  // const sanitizePhone = (raw?: string | null) =>
  //   (raw || "")
  //     .trim()
  //     .replace(/[\s\-().]/g, "")
  //     .replace(/^\+{2,}/, "+");

  // const openDialer = async (phone?: string | null) => {
  //   if (!phone) return;
  //   try {
  //     await Linking.openURL(`tel:${phone}`);
  //   } catch {
  //     Alert.alert("Unable to open dialer");
  //   }
  // };

  const openDialer = (phone?: string | null) => {
    if (!phone) return;
    const scheme = Platform.OS === "ios" ? "tel://" : "tel:";
    Linking.openURL(`${scheme}${phone}`).catch(() =>
      Alert.alert("Unable to open dialer.")
    );
  };

  const openSMS = async (phone?: string | null) => {
    if (!phone) return;
    try {
      await Linking.openURL(`sms:${phone}`);
    } catch {
      Alert.alert("Unable to open messages");
    }
  };

  const openEmail = async (email?: string | null) => {
    if (!email) return;
    try {
      await Linking.openURL(`mailto:${email}`);
    } catch {
      Alert.alert("Unable to open mail app");
    }
  };
  const shareContact = async () => {
    if (!contact) return;
    try {
      await Share.share({
        title: "Contact",
        message: `${contact.first_name} ${contact.last_name}${
          contact.relationship ? " (" + contact.relationship + ")" : ""
        }\n${contact.phone_number || ""}\n${contact.email || ""}`,
      });
    } catch (e) {
      logger.debug("Share error", e);
    }
  };

  const InfoItem = ({
    label,
    value,
    icon,
    onPress,
  }: {
    label: string;
    value?: string | null;
    icon: React.ReactNode;
    onPress?: () => void;
  }) => {
    const tappable = !!onPress && !!value;
    return (
      <TouchableOpacity
        className="flex-row items-center py-3"
        activeOpacity={tappable ? 0.65 : 1}
        onPress={() => tappable && onPress && onPress()}
      >
        <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-[#F1F3F5]">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-[10px] font-semibold tracking-wider text-gray-500 mb-0.5">
            {label}
          </Text>
          <Text
            numberOfLines={2}
            className={`text-[15px] font-medium ${
              value ? "text-gray-800" : "text-gray-400 italic"
            }`}
          >
            {value || "—"}
          </Text>
        </View>
        {tappable && <ChevronRight size={18} color="#C5CAD0" />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#F5F7F9" }}>
      <Header
        title="Contact Details"
        right={
          contact && (
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center px-1"
              onPress={() =>
                router.push({
                  pathname: "/home/careTeam/form",
                  params: { mode: "edit", contactId: contact.id },
                })
              }
            >
              <PencilLine size={16} color="white" />
              <Text
                className="text-lg font-semibold ml-2 text-white"
                // style={{ color: palette.primary }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          )
        }
      />
      {loading ? (
        <View className="flex-1 items-center justify-center px-8">
          <ActivityIndicator color={palette.primary} />
          <Text className="mt-2 text-sm text-gray-500">Loading contact...</Text>
        </View>
      ) : !contact ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-gray-500 text-base">Contact not found.</Text>
          <TouchableOpacity
            className="mt-5 px-5 py-4 rounded-xl"
            style={{ backgroundColor: palette.primary }}
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 18, paddingBottom: 140 }}
        >
          {/* Profile */}
          <View
            className="bg-white rounded-3xl items-center mb-4 px-5 py-5"
            style={styles.shadowCard}
          >
            {/* <View
              className="w-[92px] h-[92px] rounded-full mb-5 items-center justify-center border-2"
              style={{
                backgroundColor: palette.primary + "20",
                borderColor: palette.primary + "55",
              }}
            >
              <Text
                className="font-bold"
                style={{ fontSize: 36, color: palette.primary }}
              >
                {initials(contact)}
              </Text>
            </View> */}
            <Text
              className="text-[22px] font-bold text-[#111C28] text-center"
              style={{ color: palette.primary }}
            >
              {contact.first_name} {contact.last_name}
            </Text>
            {!!contact.relationship && (
              <View className="mt-2 px-4 py-1.5 rounded-2xl bg-[#E9EEF2]">
                <Text className="text-sm font-semibold text-gray-600">
                  {contact.relationship}
                </Text>
              </View>
            )}

            <View className="flex-row justify-around mt-6 w-full px-1">
              <MiniAction
                label="Call"
                icon={<Phone size={20} color={palette.primary} />}
                disabled={!contact.phone_number}
                onPress={() => openDialer(contact.phone_number)}
              />
              <MiniAction
                label="Message"
                icon={<MessageSquare size={20} color={palette.primary} />}
                disabled={!contact.phone_number}
                onPress={() => openSMS(contact.phone_number)}
              />
              <MiniAction
                label="Email"
                icon={<Mail size={20} color={palette.primary} />}
                disabled={!contact.email}
                onPress={() => openEmail(contact.email)}
              />
              {/* <MiniAction
                label="Share"
                icon={<Share2 size={20} color={palette.primary} />}
                onPress={shareContact}
              /> */}
            </View>
          </View>

          {/* Contact Info */}
          <View
            className="bg-white rounded-3xl px-4 py-3.5 mb-4"
            style={styles.shadowLight}
          >
            <Text className="text-[12px] font-bold tracking-wider text-gray-500 mb-1.5">
              CONTACT INFO
            </Text>
            <InfoItem
              label="Phone"
              value={contact.phone_number}
              icon={<Phone size={18} color="#6B7280" />}
              onPress={() => openDialer(contact.phone_number)}
            />
            {/* <Separator /> */}
            {/* <InfoItem
              label="Message"
              value={contact.phone_number}
              icon={<MessageSquare size={18} color="#6B7280" />}
              onPress={() => openSMS(contact.phone_number)}
            /> */}
            <Separator />
            <InfoItem
              label="Email"
              value={contact.email}
              icon={<Mail size={18} color="#6B7280" />}
              onPress={() => openEmail(contact.email)}
            />
            <Separator />
            <InfoItem
              label="Role / Relationship"
              value={contact.relationship}
              icon={<User2 size={18} color="#6B7280" />}
            />
          </View>

          {/* Notes */}
          {contact.description ? (
            <View
              className="bg-white rounded-3xl px-4 py-3.5"
              style={styles.shadowLight}
            >
              <Text className="text-[12px] font-bold tracking-wider text-gray-500 mb-2">
                DESCRIPTION
              </Text>
              <View className="flex-row items-center">
                <View
                  className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: palette.primary + "10" }}
                >
                  <Info size={18} color={palette.primary} />
                </View>
                <Text className="text-[15px] text-black flex-1 ">
                  {contact.description}
                </Text>
              </View>
            </View>
          ) : null}
        </ScrollView>
      )}

      {!loading && contact && (
        <View className="absolute left-0 right-0 bottom-4 px-4">
          <TouchableOpacity
            activeOpacity={0.75}
            className="rounded-xl items-center py-3"
            style={{ backgroundColor: palette.primary }}
            onPress={() => router.back()}
          >
            <Text className="text-white text-base font-semibold">Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

function MiniAction({
  label,
  icon,
  onPress,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      className="items-center w-[70px]"
      activeOpacity={disabled ? 1 : 0.7}
      onPress={() => !disabled && onPress && onPress()}
    >
      <View
        className="w-[54px] h-[54px] rounded-2xl items-center justify-center mb-1 border"
        style={{
          backgroundColor: palette.primary + "10",
          borderColor: palette.primary + "30",
          opacity: disabled ? 0.35 : 1,
        }}
      >
        {icon}
      </View>
      <Text
        className={`text-[12px] font-semibold ${
          disabled ? "text-gray-400" : "text-gray-700"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const Separator = () => (
  <View
    className="h-px"
    style={{ backgroundColor: "#E4E7EB", marginLeft: 45 }}
  />
);

const styles = StyleSheet.create({
  shadowCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 1.5,
    elevation: 1, // Android
  },
  shadowLight: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 1.5, // for a soft blur
    elevation: 1,
  },
});

// IOS shadow:
// shadowColor: "#000",
// shadowOpacity: 0.03,
// shadowRadius: 12,
// shadowOffset: { width: 0, height: 4 },
