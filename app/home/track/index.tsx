import React, { useContext, useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { UserContext } from "@/context/UserContext";
import { PatientContext } from "@/context/PatientContext";
import {
  getTrackCategoriesWithItemsAndProgress,
  addTrackItemForDate,
  getQuestionsWithOptions,
  saveResponse,
  addOptionToQuestion,
} from "@/services/core/TrackService";
import palette from "@/utils/theme/color";

interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface TestResults {
  [key: string]: TestResult;
}

function TrackTestScreen() {
  const { user } = useContext(UserContext);
  const { patient } = useContext(PatientContext);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResults>({});
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setLoading(true);
    try {
      const result = await testFunction();
      setResults((prev: TestResults) => ({ ...prev, [testName]: { success: true, data: result } }));
      Alert.alert('Success', `${testName} completed successfully!`);
    } catch (error) {
      console.error(`${testName} error:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResults((prev: TestResults) => ({ ...prev, [testName]: { success: false, error: errorMessage } }));
      Alert.alert('Error', `${testName} failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetCategories = async () => {
    if (!patient?.id) throw new Error('No patient ID available');
    return await getTrackCategoriesWithItemsAndProgress(patient.id, currentDate);
  };

  const testAddTrackItem = async () => {
    if (!patient?.id) throw new Error('No patient ID available');
    return await addTrackItemForDate(patient.id, 1, currentDate);
  };

  const testGetQuestions = async () => {
    return await getQuestionsWithOptions(1);
  };

  const testSaveResponse = async () => {
    if (!patient?.id) throw new Error('No patient ID available');
    // First add a track item to get an entry ID
    const entryId = await addTrackItemForDate(patient.id, 1, currentDate);
    return await saveResponse(entryId, 1, "Test answer mouse");
  };

  const testAddOption = async () => {
    return await addOptionToQuestion(1, "New Test Option 3");
  };

  const TestButton = ({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`p-3 rounded-lg mb-3 ${disabled || loading ? 'bg-gray-300' : 'bg-blue-500'}`}
    >
      <Text className={`text-center font-semibold ${disabled || loading ? 'text-gray-500' : 'text-white'}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const ResultDisplay = ({ title, result }: { title: string; result: TestResult }) => (
    <View className="mb-4 p-3 bg-gray-100 rounded-lg">
      <Text className="font-bold text-sm mb-1">{title}</Text>
      <Text className="text-xs text-gray-600">
        {result?.success ? '✅ Success' : '❌ Failed'}
      </Text>
      {result?.error && (
        <Text className="text-xs text-red-600 mt-1">{result.error}</Text>
      )}
      {result?.data && (
        <Text className="text-xs text-gray-700 mt-1">
          {JSON.stringify(result.data, null, 2)}
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="mb-6">
        <Text style={{ color: palette.primary }} className="text-2xl font-bold mb-2">
          Track Module Test
        </Text>
        <Text className="text-sm text-gray-600 mb-4">
          Test all TrackService backend methods
        </Text>
        
        {!patient?.id && (
          <View className="bg-yellow-100 p-3 rounded-lg mb-4">
            <Text className="text-yellow-800 font-semibold">⚠️ No Patient Context</Text>
            <Text className="text-yellow-700 text-sm">Some tests require patient context</Text>
          </View>
        )}

        {loading && (
          <View className="bg-blue-100 p-3 rounded-lg mb-4">
            <Text className="text-blue-800 font-semibold">🔄 Running test...</Text>
          </View>
        )}
      </View>

      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3">Test Methods</Text>
        
        <TestButton
          title="1. Get Categories with Items & Progress"
          onPress={() => runTest('getCategories', testGetCategories)}
          disabled={!patient?.id}
        />
        
        <TestButton
          title="2. Add Track Item for Date"
          onPress={() => runTest('addTrackItem', testAddTrackItem)}
          disabled={!patient?.id}
        />
        
        <TestButton
          title="3. Get Questions with Options"
          onPress={() => runTest('getQuestions', testGetQuestions)}
        />
        
        <TestButton
          title="4. Save Response"
          onPress={() => runTest('saveResponse', testSaveResponse)}
          disabled={!patient?.id}
        />
        
        <TestButton
          title="5. Add Option to Question"
          onPress={() => runTest('addOption', testAddOption)}
        />
      </View>

      {Object.keys(results).length > 0 && (
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Test Results</Text>
          {Object.entries(results).map(([key, result]) => (
            <ResultDisplay key={key} title={key} result={result} />
          ))}
        </View>
      )}

      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3">Debug Info</Text>
        <View className="bg-gray-100 p-3 rounded-lg">
          <Text className="text-sm text-gray-700">
            <Text className="font-semibold">User ID:</Text> {user?.id || 'Not available'}
          </Text>
          <Text className="text-sm text-gray-700">
            <Text className="font-semibold">Patient ID:</Text> {patient?.id || 'Not available'}
          </Text>
          <Text className="text-sm text-gray-700">
            <Text className="font-semibold">Test Date:</Text> {currentDate}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

export default TrackTestScreen;