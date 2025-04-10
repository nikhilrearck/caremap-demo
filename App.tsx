import { StatusBar } from "expo-status-bar";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StyleSheet, Text, View } from "react-native";
import Counter from "./components/app-components/Counter";

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <View style={styles.container}>
        {/* <Text>Open up App.tsx to start working on your app!</Text> */}

        <Counter />

        <StatusBar style="auto" />
      </View>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
