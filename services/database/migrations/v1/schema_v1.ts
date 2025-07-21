export interface User {
  id: string;
  email: string;
  name: string;
};

export interface Patient {
  id: number;
  user_id: string;
  blood_type?: string;
  date_of_birth?: Date;
  first_name: string;
  gender?: string;
  height?: number;
  height_unit?: string;
  last_name: string;
  middle_name?: string;
  profile_picture?: string;
  relationship?: string;
  weight?: number;
  weight_unit?: string;
  created_date: Date;
  updated_date: Date;
}

export interface PatientSnapshot {
  id: number;
  patient_id: number;
  health_issues?: string;
  patient_overview?: string;
  created_date: Date;
  updated_date: Date;
}

export interface PatientCondition {
  id: number;
  patient_id: number;
  linked_health_system: boolean;
  condition_name: string;
  created_date: Date;
  updated_date: Date;
}

export interface PatientEquipment {
  id: number;
  patient_id: number;
  linked_health_system: boolean;
  equipment_name: string;
  equipment_description?: string;
  created_date: Date;
  updated_date: Date;
}

export interface PatientGoal {
  id: number;
  patient_id: number;
  linked_health_system: boolean;
  goal_description: string;
  target_date?: Date;
  created_date: Date;
  updated_date: Date;
}

export interface PatientEmergencyCare {
  id: number;
  patient_id: number;
  linked_health_system: boolean;
  topic: string;
  details?: string;
  created_date: Date;
  updated_date: Date;
}

export interface PatientAllergy {
  id: number;
  patient_id: number;
  linked_health_system: boolean;
  topic: string;
  details?: string;
  onset_date: Date;
  severity?: 'Mild' | 'Moderate' | 'Severe';
  created_date: Date;
  updated_date: Date;
}

export interface PatientMedication {
  id: number;
  patient_id: number;
  linked_health_system: boolean;
  name: string;
  details: string;
  created_date: Date;
  updated_date: Date;
}

export interface PatientNote {
  id: number;
  patient_id: number;
  topic: string;
  details?: string;
  reminder_date?: Date;
  created_date: Date;
  updated_date: Date;
}

export interface Hospitalization {
  id: number;
  patient_id: number;
  linked_health_system: boolean;
  admission_date: Date;
  discharge_date: Date;
  details?: string;
  created_date: Date;
  updated_date: Date;
}

export interface SurgeryProcedure {
  id: number;
  patient_id: number;
  linked_health_system: boolean;
  procedure_name: string;
  facility?: string;
  complications?: string;
  surgeon_name?: string;
  procedure_date: Date;
  details?: string;
  created_date: Date;
  updated_date: Date;
}

export interface DischargeInstruction {
  id: number;
  patient_id: number;
  linked_health_system: boolean;
  summary: string;
  discharge_date: Date;
  details?: string;
  created_date: Date;
  updated_date: Date;
}

export const tables = {
  USER: 'USER',
  PATIENT: 'PATIENT',
  PATIENT_SNAPSHOT: 'PATIENT_SNAPSHOT',
  PATIENT_CONDITION: 'PATIENT_CONDITION',
  PATIENT_EQUIPMENT: 'PATIENT_EQUIPMENT',
  PATIENT_GOAL: 'PATIENT_GOAL',
  PATIENT_EMERGENCY_CARE: 'PATIENT_EMERGENCY_CARE',
  PATIENT_ALLERGY: 'PATIENT_ALLERGY',
  PATIENT_MEDICATION: 'PATIENT_MEDICATION',
  PATIENT_NOTE: 'PATIENT_NOTE',
  HOSPITALIZATION: 'HOSPITALIZATION',
  SURGERY_PROCEDURE: 'SURGERY_PROCEDURE',
  DISCHARGE_INSTRUCTION: 'DISCHARGE_INSTRUCTION'
}