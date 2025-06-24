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
}

export interface MedicalCondition {
  id: number;
  patient_id: number;
  condition_name: string;
  source: string;
  diagnosed_date: string;
  notes: string;
}

export interface MedicalEquipment {
  id: number;
  patient_id: number;
  equipment_name: string;
  usage_description: string;
  is_daily_use: boolean;
  added_at: string;
}

export interface HighLevelGoal {
  id: number;
  patient_id: number;
  goal_title: string;
  description: string;
  target_date: string;
  source: string;
  created_at: string;
}

export const tables = {
  USER: 'users',
  PATIENT: 'patients',
  PATIENT_SNAPSHOT: 'patient_snapshots',
  MEDICAL_CONDITION: 'medical_conditions',
  MEDICAL_EQUIPMENT: 'medical_equipment',
  HIGH_LEVEL_GOAL: 'high_level_goals'
}