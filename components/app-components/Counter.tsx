import React, { useState } from "react";
import { View } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";

export default function Counter() {
  const [count, setCount] = useState(0);

  const handleIncrease = () => setCount((prev) => prev + 1);
  const handleReset = () => setCount(0);

  return (
    <View>
      <Box className="bg-primary-500 p-0">
        <VStack space="md" reversed={false} className="p-0">
          <Text className="bg-white">Count: {count}</Text>
          <Button
            size="md"
            variant="solid"
            action="primary"
            onPress={handleIncrease}
          >
            <Text className="bg-white p-1">Increase</Text>
          </Button>
          <Button
            size="md"
            variant="solid"
            action="primary"
            onPress={handleReset}
          >
            <Text className="bg-white p-1">Reset</Text>
          </Button>
        </VStack>
      </Box>
    </View>
  );
}
