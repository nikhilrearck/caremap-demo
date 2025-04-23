// app/profile.tsx
import { useLocalSearchParams } from "expo-router";
import { Image } from "react-native";
// import { Text, View } from "@gluestack-ui/themed";
import { Text, View } from "react-native";

export default function Profile() {
  const { user } = useLocalSearchParams();

  const parsedUser = user ? JSON.parse(user as string) : null;
  console.log(user);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      {parsedUser ? (
        <>
          <Image
            source={{ uri: parsedUser.picture }}
            className="w-24 h-24 rounded-full"
          />
          <Text className="text-xl font-bold mt-4">{parsedUser.name}</Text>
          <Text>{parsedUser.email}</Text>
        </>
      ) : (
        <Text>No user data.</Text>
      )}
    </View>
  );
}
