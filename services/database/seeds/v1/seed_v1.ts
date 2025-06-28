import { SQLiteDatabase } from "expo-sqlite";
import { tables } from "@/services/database/migrations/v1/schema_v1";
import { 
    samplePatientSnapshots, 
    sampleMedicalConditions, 
    sampleMedicalEquipment,
    sampleHighLevelGoals 
} from "@/services/database/seeds/v1/sample_data";
import { logger } from "@/services/logging/logger";

// To escape single quotes in SQL strings to prevent SQL injection
const escapeSQL = (str: string | undefined) => (str || '').replace(/'/g, "''");

export async function seedDatabase(db: SQLiteDatabase) {
    try {
        // Insert patient snapshots
        for (const snapshot of samplePatientSnapshots) {
            if (!snapshot.patient_id) continue;
            await db.execAsync(
                `INSERT INTO ${tables.PATIENT_SNAPSHOT} (
                    patient_id, 
                    summary, 
                    health_issues,
                    created_at,
                    updated_at
                ) VALUES (
                    ${snapshot.patient_id},
                    '${escapeSQL(snapshot.summary)}',
                    '${escapeSQL(snapshot.health_issues)}',
                    '${snapshot.created_at || new Date().toISOString()}',
                    '${snapshot.updated_at || new Date().toISOString()}'
                )`
            );
        }

        // Insert medical conditions
        for (const condition of sampleMedicalConditions) {
            if (!condition.patient_id || !condition.condition_name) continue;
            await db.execAsync(
                `INSERT INTO ${tables.MEDICAL_CONDITION} (
                    patient_id,
                    condition_name,
                    diagnosed_at,
                    linked_health_system,
                    created_at,
                    updated_at
                ) VALUES (
                    ${condition.patient_id},
                    '${escapeSQL(condition.condition_name)}',
                    '${condition.diagnosed_at || new Date().toISOString()}',
                    ${condition.linked_health_system ? 1 : 0},
                    '${condition.created_at || new Date().toISOString()}',
                    '${condition.updated_at || new Date().toISOString()}'
                )`
            );
        }

        // Insert medical equipment
        for (const equipment of sampleMedicalEquipment) {
            if (!equipment.patient_id || !equipment.equipment_name) continue;
            await db.execAsync(
                `INSERT INTO ${tables.MEDICAL_EQUIPMENT} (
                    patient_id,
                    equipment_name,
                    description,
                    linked_health_system,
                    created_at,
                    updated_at
                ) VALUES (
                    ${equipment.patient_id},
                    '${escapeSQL(equipment.equipment_name)}',
                    '${escapeSQL(equipment.description)}',
                    ${equipment.linked_health_system ? 1 : 0},
                    '${equipment.created_at || new Date().toISOString()}',
                    '${equipment.updated_at || new Date().toISOString()}'
                )`
            );
        }

        // Insert high level goals
        for (const goal of sampleHighLevelGoals) {
            if (!goal.patient_id || !goal.goal_description) continue;
            await db.execAsync(
                `INSERT INTO ${tables.HIGH_LEVEL_GOAL} (
                    patient_id,
                    goal_description,
                    target_date,
                    created_at,
                    updated_at
                ) VALUES (
                    ${goal.patient_id},
                    '${escapeSQL(goal.goal_description)}',
                    '${goal.target_date || new Date().toISOString()}',
                    '${goal.created_at || new Date().toISOString()}',
                    '${goal.updated_at || new Date().toISOString()}'
                )`
            );
        }

    logger.debug('Sample data seeded successfully.');
  } catch (error) {
    logger.debug('Error seeding data:', error);
  }
}; 