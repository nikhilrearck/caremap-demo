// src/context/PatientContext.tsx
import React, { createContext, PropsWithChildren, useCallback, useState, useContext } from "react";
import { Patient } from "@/services/database/migrations/v1/schema_v1";
import { useSQLiteContext } from "expo-sqlite";
import { PatientModel } from "@/services/database/models/PatientModel";
import { UserContext } from "./UserContext";

interface PatientContextType {
  patient: Patient | null;
  setPatientData: (userId: string) => Promise<void>;
  clearPatient: () => void;
}

export const PatientContext = createContext<PatientContextType>({
  patient: null,
  setPatientData: async (_userId: string) => {},
  clearPatient: () => {},
});

export function PatientProvider({ children }: PropsWithChildren) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const db = useSQLiteContext();
  const patientModel = new PatientModel(db);
  const { user } = useContext(UserContext);

  const setPatientData = useCallback(
    async (userId: string) => {
      try {
        let patientData = await patientModel.getPatientByUserId(userId);
        if (!patientData) {
          await patientModel.insert({
            user_id: userId,
            name: user?.name || "",
          });
          patientData = await patientModel.getPatientByUserId(userId);
        }
        setPatient(patientData);
      } catch (error) {
        console.error("Failed to fetch or insert patient:", error);
      }
    },
    [user]
  );

  const clearPatient = useCallback(() => {
    setPatient(null);
  }, []);

  return (
    <PatientContext.Provider
      value={{
        patient,
        setPatientData,
        clearPatient,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}