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
      <ScrollView className="flex-1 bg-white pt-5 px-4">
        <Text
          className="text-xl font-bold mb-4"
          style={{ color: palette.heading }}
        >
          Weekly Performance
        </Text>
        <View
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 1,
            backgroundColor: palette.gradientStart,
          }}
          className="mb-6 py-3 px-0 rounded-xl"
        >
          <Text className="text-lg font-semibold text-gray-700 px-4 mb-1">
            Exercise Frequency
          </Text>
          <LineChart
            data={weeklyData1}
            curved
            height={150}
            thickness={2}
            color1={palette?.primary}
            dataPointsColor1={palette?.primary}
            hideRules
            showVerticalLines
            initialSpacing={15}
            spacing={48}
            endSpacing={0}
            // showScrollIndicator
            yAxisTextStyle={{ color: "#9CA3AF", fontSize: 11 }}
            xAxisLabelTextStyle={{ color: "#6B7280", fontSize: 11 }}
            yAxisColor="rgba(0,0,0,0.25)"
            xAxisColor="rgba(0,0,0,0.25)"
            // yAxisColor="transparent"
            // xAxisColor="transparent"
            noOfSections={5}
            // maxValue={100}
            verticalLinesColor="rgba(0,0,0,0.06)"
            verticalLinesThickness={1}
            // focusEnabled={true}
            // focusedDataPointColor={"transparent"}
            // textFontSize={14}
            // textColor={"#1F2937"}
            // textShiftY={1}
            // showTextOnFocus={true}
            dataPointsRadius={3}
          />
        </View>

        <View
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 1,
            backgroundColor: palette.gradientStart,
          }}
          className="mb-4 py-3 px-0 rounded-xl"
        >
          <Text className="text-lg font-semibold text-gray-700 px-4 mb-1">
            Medication Usage
          </Text>
          <LineChart
            data={weeklyData1}
            data2={weeklyData2}
            curved
            height={150}
            thickness={2}
            color1={palette?.primary}
            color2={"#ff7b00"}
            // dataPointsColor="green"
            dataPointsColor1={palette?.primary}
            dataPointsColor2={"#ff7b00"}
            hideRules
            showVerticalLines
            initialSpacing={15}
            spacing={48}
            endSpacing={0}
            // showScrollIndicator
            yAxisTextStyle={{ color: "#9CA3AF", fontSize: 11 }}
            xAxisLabelTextStyle={{ color: "#6B7280", fontSize: 11 }}
            yAxisColor="rgba(0,0,0,0.25)"
            xAxisColor="rgba(0,0,0,0.25)"
            // yAxisColor="transparent"
            // xAxisColor="transparent"
            noOfSections={5}
            // maxValue={100}
            verticalLinesColor="rgba(0,0,0,0.06)"
            verticalLinesThickness={1}
            // focusEnabled={true}
            // focusedDataPointColor={"transparent"}
            // textFontSize={14}
            // textColor={"#1F2937"}
            // textShiftY={1}
            // showTextOnFocus={true}
            dataPointsRadius={3}
          />
          {/* Legend with circular badges */}
          <View className="flex-row items-center mt-2 px-4">
            <View className="flex-row items-center mr-8">
              <View
                style={{ backgroundColor: palette.primary }}
                className="w-3 h-3 rounded-full mr-2"
              />
              <Text className="text-sm font-medium text-gray-700">
                Current Week
              </Text>
            </View>
            <View className="flex-row items-center">
              <View
                style={{ backgroundColor: "#ff7b00" }}
                className="w-3 h-3 rounded-full mr-2"
              />
              <Text className="text-sm font-medium text-gray-700">
                Previous Week
              </Text>
            </View>
          </View>
        </View>
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
