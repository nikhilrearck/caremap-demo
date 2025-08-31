import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  //   Linking,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/shared/Header";
import palette from "@/utils/theme/color";
import { getContactById } from "@/services/core/ContactService";
import { Contact } from "@/services/database/migrations/v1/schema_v1";
import { PatientContext } from "@/context/PatientContext";
import { Phone, Mail, Info, User2, PencilLine } from "lucide-react-native";
import { logger } from "@/services/logging/logger";
import * as Linking from "expo-linking";
type Params = {
  contactId?: string | number;
};
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

  const openDialer = (phone?: string | null) => {
    if (!phone) return;
    const scheme = Platform.OS === "ios" ? "tel://" : "tel:";
    Linking.openURL(`${scheme}${phone}`).catch(() =>
      Alert.alert("Unable to open dialer.")
    );
  };

  const openEmail = (email?: string | null) => {
    if (!email) return;
    Linking.openURL(`mailto:${email}`).catch(() =>
      Alert.alert("Unable to open mail app.")
    );
  };

  const InfoRow = ({
    label,
    value,
    icon,
    onPress,
    highlight,
  }: {
    label: string;
    value?: string | null;
    icon: React.ReactNode;
    onPress?: () => void;
    highlight?: boolean;
  }) => {
    const disabled = !value;
    return (
      <TouchableOpacity
        activeOpacity={onPress && !disabled ? 0.6 : 1}
        onPress={() => {
          if (disabled) return;
          onPress && onPress();
        }}
      >
        <View
          className="flex-row items-center px-4 py-3 rounded-2xl mb-3"
          style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#E4E6EA",
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: highlight
                ? palette.primary + "22"
                : palette.primary + "12",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            {icon}
          </View>
          <View style={{ flex: 1 }}>
            <Text className="text-xs text-gray-500 mb-0.5">{label}</Text>
            <Text
              className={`text-base ${
                value ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {value || "—"}
            </Text>
          </View>
          {onPress && !disabled && (
            <Text
              style={{
                color: palette.primary,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              {label === "Phone" ? "Call" : label === "Email" ? "Email" : ""}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Header
        title="View contact"
        right={
          contact && (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/home/careTeam/form",
                  params: { mode: "edit", contactId: contact.id },
                })
              }
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <PencilLine size={16} color={palette.primary} />
                <Text
                  style={{
                    fontWeight: "600",
                    color: palette.primary,
                    fontSize: 14,
                  }}
                >
                  Edit
                </Text>
              </View>
            </TouchableOpacity>
          )
        }
      />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={palette.primary} />
          <Text className="mt-3 text-gray-500">Loading contact...</Text>
        </View>
      ) : !contact ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-gray-500 text-center">
            Contact not found or was removed.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 px-5 py-3 rounded-xl"
            style={{ backgroundColor: palette.primary }}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 48 }}
        >
          {/* Hero */}
          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: 24,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                backgroundColor: palette.primary + "1A",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
                borderWidth: 2,
                borderColor: palette.primary + "33",
              }}
            >
              <Text
                style={{
                  fontSize: 35,
                  fontWeight: "600",
                  color: palette.primary,
                }}
              >
                {initials(contact)}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "700",
                color: "#121212",
                textAlign: "center",
              }}
            >
              {contact.first_name} {contact.last_name}
            </Text>
            {!!contact.relationship && (
              <View
                style={{
                  marginTop: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  backgroundColor: palette.primary + "15",
                  borderRadius: 24,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    letterSpacing: 0.3,
                    color: palette.primary,
                    textTransform: "uppercase",
                  }}
                >
                  {contact.relationship}
                </Text>
              </View>
            )}
          </View>
          {/* Quick Actions */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 28,
              gap: 28,
            }}
          >
            <QuickAction
              label="Call"
              icon={
                <Phone size={24} color={palette.primary} strokeWidth={2.2} />
              }
              disabled={!contact.phone_number}
              onPress={() => openDialer(contact.phone_number)}
            />
            <QuickAction
              label="Email"
              icon={
                <Mail size={24} color={palette.primary} strokeWidth={2.2} />
              }
              disabled={!contact.email}
              onPress={() => openEmail(contact.email)}
            />
          </View>
          {/* Info Section */}
          <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#3A3F47",
                marginBottom: 12,
              }}
            >
              Contact Info
            </Text>
            <InfoRow
              label="Phone"
              value={contact.phone_number}
              icon={<Phone size={20} color={palette.primary} />}
              onPress={() => openDialer(contact.phone_number)}
              highlight
            />
            <InfoRow
              label="Email"
              value={contact.email}
              icon={<Mail size={20} color={palette.primary} />}
              onPress={() => openEmail(contact.email)}
            />
            <InfoRow
              label="Role / Relationship"
              value={contact.relationship}
              icon={<User2 size={20} color={palette.primary} />}
            />
          </View>
          {/* Notes / Description */}
          {contact.description ? (
            <View style={{ paddingHorizontal: 24, marginTop: 14 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#3A3F47",
                  marginBottom: 12,
                }}
              >
                Notes
              </Text>
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  padding: 18,
                  borderWidth: 1,
                  borderColor: "#E4E6EA",
                  flexDirection: "row",
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    backgroundColor: palette.primary + "12",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Info size={20} color={palette.primary} />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    lineHeight: 22,
                    color: "#262A30",
                    flex: 1,
                  }}
                >
                  {contact.description}
                </Text>
              </View>
            </View>
          ) : null}
          {/* Bottom Spacing */}
          <View style={{ height: 48 }} />
        </ScrollView>
      )}
      {/* Footer Close Button */}
      {!loading && contact && (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 12,
            paddingHorizontal: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text
              style={{
                color: "#111",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
function QuickAction({
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
      activeOpacity={disabled ? 1 : 0.65}
      onPress={() => !disabled && onPress && onPress()}
      style={{ alignItems: "center" }}
    >
      <View
        style={{
          width: 66,
          height: 66,
          borderRadius: 22,
          backgroundColor: disabled ? "#E5E7EB" : palette.primary + "1A",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: disabled ? "#D1D5DB" : palette.primary + "33",
        }}
      >
        {icon}
      </View>
      <Text
        style={{
          marginTop: 6,
          fontSize: 13,
          fontWeight: "600",
          color: disabled ? "#9CA3AF" : "#374151",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
