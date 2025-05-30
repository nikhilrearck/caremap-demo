import React, { useEffect, useState } from "react";
import { View, Text, Image, Button } from "react-native";
import { router } from "expo-router";
import {
  initializeSession,
  signOut,
} from "@/services/auth-service/google-auth";
import { Patient, User } from "@/services/database/migrations/v1/schema_v1";
import { useSQLiteContext } from "expo-sqlite";
import { UserModel } from "@/services/database/models/UserModel";
import { PatientModel } from "@/services/database/models/PatientModel";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);

  const db = useSQLiteContext();
  const userModel = new UserModel(db);
  const patientModel = new PatientModel(db);

  useEffect(() => {
    console.log(`DB Path : "${db.databasePath}"`);
    initializeSession(setUser).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      handleUserInsert(user);
    }
  }, [user]);

  const handleUserInsert = async (currentUser: User) => {
    const existingUser = await userModel.getUser(currentUser.email);

    try {
      if (!existingUser) {
        await userModel.insert({
          id: user?.id,
          name: user?.name,
          email: user?.email,
        });

        const allUsers = await userModel.getAll();
        console.log("User: ", allUsers);
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const handlePatientData = async () => {
    console.log(user?.id);
    let patientData;
    try {
      if (user?.id) {
        patientData = await patientModel.getPatientByUserId(user.id);
        console.log("Patient: ", patientData);

        if (patientData) {
          console.log("Patient found...");
          setPatient(patientData);
        } else {
          console.log("Patient not found. Inserting...");
          await patientModel.insert({
            user_id: user?.id,
            name: `${user?.name}`,
          });
          const patientData = await patientModel.getPatientByUserId(user.id);
          console.log("Patient: ", patientData);
          setPatient(patientData);
        }
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/auth/login");
  };

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={{ uri: user.picture }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Patient name: {patient?.name}</Text>

      <Button title="Get Patient Data" onPress={handlePatientData} />

      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default Home;
