import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, Alert, TextInput } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text as UIText } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { UserContext } from "@/context/UserContext";
import { 
  createContact, 
  getAllContacts, 
  updateContact, 
  deleteContact 
} from "@/services/core/ContactService";
import { Contact } from "@/services/database/migrations/v1/schema_v1";
import palette from "@/utils/theme/color";

function CareTeam() {
  const { user } = useContext(UserContext);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state for creating/editing contacts
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    relationship: "",
    phone_number: "",
    email: "",
    description: ""
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Load contacts on component mount
  useEffect(() => {
    if (user?.id) {
      loadContacts();
    }
  }, [user]);

  const loadContacts = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const result = await getAllContacts(user.id);
      setContacts(result);
    } catch (error) {
      Alert.alert("Error", "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    
    if (!formData.first_name || !formData.last_name || !formData.relationship || !formData.phone_number) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        // Update existing contact
        const result = await updateContact(formData, { id: editingId });
        if (result) {
          Alert.alert("Success", "Contact updated successfully");
          setEditingId(null);
          resetForm();
          loadContacts();
        }
      } else {
        // Create new contact
        const result = await createContact(formData, user.id);
        if (result) {
          Alert.alert("Success", "Contact created successfully");
          resetForm();
          loadContacts();
        }
      }
    } catch (error: any) {
      // Handle unique constraint errors
      if (error.message === "Phone number already exists") {
        Alert.alert("Error", "This phone number is already registered with another contact");
      } else if (error.message === "Email already exists") {
        Alert.alert("Error", "This email address is already registered with another contact");
      } else {
        Alert.alert("Error", "Failed to save contact");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setFormData({
      first_name: contact.first_name,
      last_name: contact.last_name,
      relationship: contact.relationship,
      phone_number: contact.phone_number,
      email: contact.email || "",
      description: contact.description || ""
    });
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this contact?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const success = await deleteContact(id);
              if (success) {
                Alert.alert("Success", "Contact deleted successfully");
                loadContacts();
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete contact");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      relationship: "",
      phone_number: "",
      email: "",
      description: ""
    });
    setEditingId(null);
  };

  const cancelEdit = () => {
    resetForm();
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Heading size="xl" className="text-center mb-6" style={{ color: palette.primary }}>
        Care Team Testing
      </Heading>

      {/* Form Section */}
      <Box className="bg-gray-50 p-4 rounded-lg mb-6">
        <Heading size="lg" className="mb-4">
          {editingId ? "Edit Contact" : "Add New Contact"}
        </Heading>
        
        <View className="space-y-3">
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            placeholder="First Name *"
            value={formData.first_name}
            onChangeText={(text: string) => setFormData({...formData, first_name: text})}
          />
          
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            placeholder="Last Name *"
            value={formData.last_name}
            onChangeText={(text: string) => setFormData({...formData, last_name: text})}
          />
          
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            placeholder="Relationship *"
            value={formData.relationship}
            onChangeText={(text: string) => setFormData({...formData, relationship: text})}
          />
          
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            placeholder="Phone Number *"
            value={formData.phone_number}
            onChangeText={(text: string) => setFormData({...formData, phone_number: text})}
            keyboardType="phone-pad"
          />
          
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            placeholder="Email (optional)"
            value={formData.email}
            onChangeText={(text: string) => setFormData({...formData, email: text})}
            keyboardType="email-address"
          />
          
          <Textarea>
            <TextareaInput
              placeholder="Description (optional)"
              value={formData.description}
              onChangeText={(text: string) => setFormData({...formData, description: text})}
            />
          </Textarea>
        </View>

        <View className="flex-row space-x-2 mt-4">
          <Button
            style={{ backgroundColor: palette.primary }}
            className="flex-1"
            onPress={handleSubmit}
            disabled={loading}
          >
            <ButtonText className="text-white">
              {loading ? "Saving..." : (editingId ? "Update" : "Add")}
            </ButtonText>
          </Button>
          
          {editingId && (
            <Button
              style={{ backgroundColor: "#6B7280" }}
              className="flex-1"
              onPress={cancelEdit}
              disabled={loading}
            >
              <ButtonText className="text-white">Cancel</ButtonText>
            </Button>
          )}
        </View>
      </Box>

      {/* Contacts List */}
      <Box className="bg-gray-50 p-4 rounded-lg">
        <View className="flex-row justify-between items-center mb-4">
          <Heading size="lg">Contacts ({contacts.length})</Heading>
      <Button
        style={{ backgroundColor: palette.primary }}
            className="px-4"
            onPress={loadContacts}
            disabled={loading}
          >
            <ButtonText className="text-white">Refresh</ButtonText>
          </Button>
        </View>

        {loading ? (
          <UIText className="text-center text-gray-500">Loading...</UIText>
        ) : contacts.length === 0 ? (
          <UIText className="text-center text-gray-500">No contacts found</UIText>
        ) : (
          <View className="space-y-3">
            {contacts.map((contact) => (
              <Box key={contact.id} className="bg-white p-3 rounded border">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <UIText className="font-bold text-lg">
                      {contact.first_name} {contact.last_name}
                    </UIText>
                    <UIText className="text-gray-600">{contact.relationship}</UIText>
                    <UIText className="text-gray-600">{contact.phone_number}</UIText>
                    {contact.email && (
                      <UIText className="text-gray-600">{contact.email}</UIText>
                    )}
                    {contact.description && (
                      <UIText className="text-gray-500 text-sm mt-1">{contact.description}</UIText>
                    )}
                  </View>
                  <View className="flex-row space-x-2">
                    <Button
                      style={{ backgroundColor: "#3B82F6" }}
                      className="px-3 py-1"
                      onPress={() => handleEdit(contact)}
      >
                      <ButtonText className="text-white text-sm">Edit</ButtonText>
                    </Button>
                    <Button
                      style={{ backgroundColor: "#EF4444" }}
                      className="px-3 py-1"
                      onPress={() => handleDelete(contact.id)}
                    >
                      <ButtonText className="text-white text-sm">Delete</ButtonText>
      </Button>
                  </View>
                </View>
              </Box>
            ))}
    </View>
        )}
      </Box>
    </ScrollView>
  );
}

export default CareTeam;

