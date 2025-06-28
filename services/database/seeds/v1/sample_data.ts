import { PatientSnapshot, MedicalCondition, MedicalEquipment, HighLevelGoal } from "@/services/database/migrations/v1/schema_v1";

// Helper function to get current timestamp in ISO format
const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

export const samplePatientSnapshots: Partial<PatientSnapshot>[] = [
    {
        patient_id: 1,
        summary: "Patient is showing good progress with diabetes management and physical therapy. Blood sugar levels are stabilizing and mobility has improved.",
        health_issues: "Type 2 Diabetes, Hypertension, Chronic Back Pain, Asthma",
        created_at: lastWeek,
        updated_at: now
    }
];

export const sampleMedicalConditions: Partial<MedicalCondition>[] = [
    {
        patient_id: 1,
        condition_name: "Type 2 Diabetes",
        diagnosed_at: "2023-06-15T10:00:00Z",
        linked_health_system: true,
        created_at: lastWeek,
        updated_at: now
    },
    {
        patient_id: 1,
        condition_name: "Hypertension",
        diagnosed_at: "2023-07-20T14:30:00Z",
        linked_health_system: true,
        created_at: lastWeek,
        updated_at: now
    },
    {
        patient_id: 1,
        condition_name: "Chronic Back Pain",
        diagnosed_at: "2023-05-10T09:15:00Z",
        linked_health_system: false,
        created_at: yesterday,
        updated_at: now
    },
    {
        patient_id: 1,
        condition_name: "Asthma",
        diagnosed_at: "2023-03-25T08:45:00Z",
        linked_health_system: true,
        created_at: now,
        updated_at: now
    }
];

export const sampleMedicalEquipment: Partial<MedicalEquipment>[] = [
    {
        patient_id: 1,
        equipment_name: "Continuous Glucose Monitor",
        description: "Dexcom G6 CGM system for real-time blood glucose monitoring",
        linked_health_system: true,
        created_at: lastWeek,
        updated_at: now
    },
    {
        patient_id: 1,
        equipment_name: "Blood Pressure Monitor",
        description: "Omron BP monitor for daily blood pressure readings",
        linked_health_system: true,
        created_at: lastWeek,
        updated_at: now
    },
    {
        patient_id: 1,
        equipment_name: "TENS Unit",
        description: "Portable TENS device for pain management",
        linked_health_system: false,
        created_at: yesterday,
        updated_at: now
    },
    {
        patient_id: 1,
        equipment_name: "Peak Flow Meter",
        description: "Personal peak flow meter for daily lung function monitoring",
        linked_health_system: true,
        created_at: now,
        updated_at: now
    }
];

export const sampleHighLevelGoals: Partial<HighLevelGoal>[] = [
    {
        patient_id: 1,
        goal_description: "Reduce A1C levels to below 6.5% through diet and exercise",
        target_date: "2024-06-30T00:00:00Z",
        created_at: lastWeek,
        updated_at: now
    },
    {
        patient_id: 1,
        goal_description: "Maintain blood pressure below 130/80 consistently",
        target_date: "2024-03-31T00:00:00Z",
        created_at: lastWeek,
        updated_at: now
    },
    {
        patient_id: 1,
        goal_description: "Complete physical therapy program and return to regular walking routine",
        target_date: "2024-04-15T00:00:00Z",
        created_at: yesterday,
        updated_at: now
    }
]; 