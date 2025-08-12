

import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import palette from "@/utils/theme/color";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { useRouter } from "expo-router";

interface TrackItem {
  id: number;
  name: string;
}

interface TrackCardProps {
  item: TrackItem;
  completed: number;
  total: number;
  date: string; // formatted date string
}
export default function TrackCard({ item, completed, total, date }: TrackCardProps) {
  const router = useRouter();
  const progressValue = total > 0 ? (completed / total) * 100 : 0;

  return (
    <View className="rounded-xl px-4 py-5 mb-4" style={{ backgroundColor: 
    palette.trackCardBackground
    }}>
      <View className="flex-row justify-between mb-3">
        
        <Text style={{ fontSize: 16, color: palette.secondary }}>{item.name}</Text>
        <Text style={{ fontSize: 14, color: palette.secondary }}>Weekly</Text>
      </View>

      {total > 0 && completed > 0 ? (
        <Progress value={progressValue} size="md" orientation="horizontal" className="w-full">
          <ProgressFilledTrack style={{ backgroundColor: palette.primary }} />
        </Progress>
      ) : (
        <TouchableOpacity
          style={{ backgroundColor: palette.primary }}
          className="py-3 rounded-lg items-center"
          onPress={() =>
            router.push({
              pathname: "/home/track/questions/[itemId]",
              params: {
                itemId: item.id.toString(),
                itemName: item.name,
                date,
              },
            })
          }
        >
          <Text className="text-white font-bold">Begin</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
