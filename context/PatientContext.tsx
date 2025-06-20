import { UserContext } from "@/context/UserContext";
import { Patient } from "@/services/database/migrations/v1/schema_v1";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

interface PatientContextType {
  patient: Patient | null;
  setPatientData: (patient: Patient) => void;
}

export const PatientContext = createContext<PatientContextType>({
  patient: null,
  setPatientData: async (_patient: Patient | null) => {},
});

export function PatientProvider({ children }: PropsWithChildren) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const { user } = useContext(UserContext);

  const setPatientData = useCallback(
    async (patient: Patient) => {
      setPatient(patient);
    },
    [user]
  );

  return (
    <PatientContext.Provider
      value={{
        patient,
        setPatientData,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}
