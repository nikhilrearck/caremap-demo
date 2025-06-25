import { PatientSnapshot, MedicalCondition, MedicalEquipment, HighLevelGoal } from "@/services/database/migrations/v1/schema_v1";

export const patientSnapshots: Partial<PatientSnapshot>[] = [
  {
    patient_id: 1,
    summary: 'Generally healthy, managing chronic conditions well',
    health_issues: 'Mild asthma, seasonal allergies'
  },
  {
    patient_id: 1,
    summary: 'Stable condition, following treatment plan',
    health_issues: 'Asthma well-controlled, allergy symptoms minimal'
  }
];

export const medicalConditions: Partial<MedicalCondition>[] = [
  {
    patient_id: 1,
    condition_name: 'Asthma',
    source: 'Dr. Smith',
    diagnosed_date: '2020-03-15',
    notes: 'Mild persistent asthma, well controlled with inhaler'
  },
  {
    patient_id: 1,
    condition_name: 'Seasonal Allergies',
    source: 'Dr. Johnson',
    diagnosed_date: '2019-05-20',
    notes: 'Primarily affected during spring and fall'
  },
  {
    patient_id: 1,
    condition_name: 'Hypertension',
    source: 'Dr. Williams',
    diagnosed_date: '2021-01-10',
    notes: 'Controlled with lifestyle modifications'
  }
];

export const medicalEquipment: Partial<MedicalEquipment>[] = [
  {
    patient_id: 1,
    equipment_name: 'Albuterol Inhaler',
    usage_description: 'Use as needed for asthma symptoms',
    is_daily_use: true
  },
  {
    patient_id: 1,
    equipment_name: 'Blood Pressure Monitor',
    usage_description: 'Monitor BP twice daily',
    is_daily_use: true
  },
  {
    patient_id: 1,
    equipment_name: 'Peak Flow Meter',
    usage_description: 'Check lung function when symptoms worsen',
    is_daily_use: false
  }
];

export const highLevelGoals: Partial<HighLevelGoal>[] = [
  {
    patient_id: 1,
    goal_title: 'Improve Asthma Control',
    description: 'Reduce rescue inhaler use to less than twice per week',
    target_date: '2024-12-31',
    source: 'Self'
  },
  {
    patient_id: 1,
    goal_title: 'Better Allergy Management',
    description: 'Identify and avoid specific triggers',
    target_date: '2024-06-30',
    source: 'Allergist'
  },
  {
    patient_id: 1,
    goal_title: 'Maintain Healthy Blood Pressure',
    description: 'Keep BP below 120/80 through diet and exercise',
    target_date: '2024-12-31',
    source: 'Primary Care'
  }
]; 