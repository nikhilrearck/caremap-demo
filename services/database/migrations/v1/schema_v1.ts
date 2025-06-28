export interface User {
  id: string;
  name: string;
  email: string;
  profile_picture_url: string;
};

export interface Patient {
  id: number;
  user_id: string;
  name: string;
  age?: number;
  relationship?: string;
  weight?: number;
  height?: number;
  gender?: string;
  birthdate?: string;
}

export interface PatientSnapshot {
  id: number;
  patient_id: number;
  summary: string;
  health_issues: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalCondition {
  id: number;
  patient_id: number;
  condition_name: string;
  diagnosed_at?: string;
  created_at: string;
  updated_at: string;
  linked_health_system: boolean;
}

export interface MedicalEquipment {
  id: number;
  patient_id: number;
  equipment_name: string;
  description: string;
  linked_health_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface HighLevelGoal {
  id: number;
  patient_id: number;
  goal_description: string;
  target_date: string;
  created_at: string;
  updated_at: string;
}

export const tables = {
  USER: 'users',
  PATIENT: 'patients',
  PATIENT_SNAPSHOT: 'patient_snapshots',
  MEDICAL_CONDITION: 'medical_conditions',
  MEDICAL_EQUIPMENT: 'medical_equipment',
  HIGH_LEVEL_GOAL: 'high_level_goals'
}