import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import {
  Popover,
  PopoverBackdrop,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from "@/components/ui/popover";
import { MaterialIcons } from "@expo/vector-icons";

interface ActionPopoverProps {
  onView?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
  viewLabel?: string;
  icon?: React.ReactNode;
}

export default function ActionPopover({
  onView,
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  viewLabel = "View",
  icon,
}: ActionPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close popover, then navigate
  const handleView = () => {
    setIsOpen(false);
    onView && onView();
  };

  const handleEdit = () => {
    setIsOpen(false);
    onEdit();
    // setTimeout(onEdit, 50); // Wait for popover to close before navigating
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete();
    // setTimeout(onDelete, 50);
  };

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      shouldOverlapWithTrigger={false}
      placement="bottom"
      size="md"
      crossOffset={-30}
      trigger={(triggerProps) => (
        <TouchableOpacity
          {...triggerProps}
          hitSlop={10}
          onPress={() => setIsOpen(true)}
        >
          {icon || <MaterialIcons name="more-vert" size={20} />}
        </TouchableOpacity>
      )}
    >
      <PopoverBackdrop />
      <PopoverContent
        className="bg-gray-50 pt-1 pb-0 px-4"
        style={{ minWidth: 110, minHeight: 85 }}
      >
        <PopoverArrow className="bg-gray-50" />
        <PopoverBody>
          {onView && (
            <>
              <TouchableOpacity
                className="flex-row items-center py-2"
                onPress={handleView}
              >
                <MaterialIcons
                  name="visibility"
                  size={20}
                  style={{ marginRight: 8 }}
                />
                <Text className="text-lg">{viewLabel}</Text>
              </TouchableOpacity>
              <View className="h-px bg-gray-300" />
            </>
          )}
          <TouchableOpacity
            className="flex-row items-center py-2"
            onPress={handleEdit}
          >
            <MaterialIcons name="edit" size={20} style={{ marginRight: 8 }} />
            <Text className="text-lg">{editLabel}</Text>
          </TouchableOpacity>
          <View className="h-px bg-gray-300" />
          <TouchableOpacity
            className="flex-row items-center py-2"
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={20} style={{ marginRight: 8 }} />
            <Text className="text-lg">{deleteLabel}</Text>
          </TouchableOpacity>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
