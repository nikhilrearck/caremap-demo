import Header from "@/components/shared/Header";
import { PatientContext } from "@/context/PatientContext";
import { InsightsRequest, InsightsResponse } from "@/services/common/types";
import { getWeeklyInsights } from "@/services/core/InsightsService";
import { ROUTES } from "@/utils/route";
import palette from "@/utils/theme/color";
import { router, useFocusEffect } from "expo-router";
import moment from "moment";
import React, { useCallback, useContext, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

const weeklyData1 = [
  { value: 20, label: "Mon" },
  { value: 45, label: "Tue" },
  { value: 28, label: "Wed" },
  { value: 80, label: "Thu" },
  { value: 99, label: "Fri" },
  { value: 43, label: "Sat" },
  { value: 50, label: "Sun" },
];

const weeklyData2 = [
  { value: 15, label: "Mon" },
  { value: 35, label: "Tue" },
  { value: 20, label: "Wed" },
  { value: 70, label: "Thu" },
  { value: 90, label: "Fri" },
  { value: 30, label: "Sat" },
  { value: 40, label: "Sun" },
];

export default function Insights() {
  const { patient } = useContext(PatientContext);

  const currentDate: string = moment().format("MM-DD-YYYY");

 useFocusEffect(
    useCallback(() => {
    const fetchInsights = async () => {
      if (!patient) {
        router.replace(ROUTES.MY_HEALTH);
        return;
      }

      try {
        // 1. Prepare request (patientId + selectedDate)
        const req: InsightsRequest = {
          patientId: patient?.id,
          selectedDate: currentDate,
        };

        // 2. Call backend service
        const res: InsightsResponse = await getWeeklyInsights(req);

        // 3. Log response for debugging
        console.log("Weekly Insights:", JSON.stringify(res, null, 2));
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
    };

    fetchInsights();
  }, [])
 );

  return (


    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="Insights"
        right={
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1 bg-white p-4">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Weekly Performance
        </Text>

        {/* Single Line Chart */}
        <LineChart
          data={weeklyData1}
          height={250}
          width={350}
          color="#4f46e5"
          thickness={3}
          showDataPointOnFocus
          focusEnabled
          dataPointsColor="#4f46e5"
          xAxisLabelTextStyle={{ color: "gray", fontSize: 12 }}
          yAxisTextStyle={{ color: "gray", fontSize: 12 }}
          renderTooltip={(item: { value: number; label: string }) => (
            <View
              style={{ backgroundColor: palette.primary }}
              className=" px-2 py-1 rounded-lg"
            >
              <Text className="text-white text-sm">{item.value}</Text>
            </View>
          )}
        />

        <Text className="text-xl font-bold text-gray-800 mt-8 mb-4">
          Comparison (Two Lines)
        </Text>

        {/* Dual Line Chart */}
        <LineChart
          data={weeklyData1}
          data2={weeklyData2}
          height={250}
          width={350}
          color1="#4f46e5"
          color2="#22c55e"
          thickness={3}
          showDataPointOnFocus
          focusEnabled
          dataPointsColor1="#4f46e5"
          dataPointsColor2="#22c55e"
          xAxisLabelTextStyle={{ color: "gray", fontSize: 12 }}
          yAxisTextStyle={{ color: "gray", fontSize: 12 }}
          renderTooltip={(item: { value: number; label: string }) => (
            <View
              style={{ backgroundColor: palette.primary }}
              className=" px-2 py-1 rounded-lg"
            >
              <Text className="text-white text-sm">{item.value}</Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// import ComingSoonScreen from "@/components/shared/ComingSoonScreen";
// import { SafeAreaView } from "react-native-safe-area-context";
// export default function Insight() {
//   return (
//     <SafeAreaView className="flex-1 ">

//       <ComingSoonScreen />
//     </SafeAreaView>
//   );
// }
