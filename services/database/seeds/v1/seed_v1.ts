import { SQLiteDatabase } from "expo-sqlite";
import { tables } from "@/services/database/migrations/v1/schema_v1";
import {
  patientSnapshots,
  medicalConditions,
  medicalEquipment,
  highLevelGoals
} from "./sample_data";
import { logger } from "@/services/logging/logger";

export const seed = async (db: SQLiteDatabase) => {
  try {

    for (const snapshot of patientSnapshots) {
      await db.execAsync(`
        INSERT INTO ${tables.PATIENT_SNAPSHOT} (patient_id, summary, health_issues)
        VALUES (${snapshot.patient_id}, '${snapshot.summary}', '${snapshot.health_issues}');
      `);
    }

    for (const condition of medicalConditions) {
      await db.execAsync(`
        INSERT INTO ${tables.MEDICAL_CONDITION} 
        (patient_id, condition_name, source, diagnosed_date, notes)
        VALUES (
          ${condition.patient_id},
          '${condition.condition_name}',
          '${condition.source}',
          '${condition.diagnosed_date}',
          '${condition.notes}'
        );
      `);
    }

    for (const equipment of medicalEquipment) {
      await db.execAsync(`
        INSERT INTO ${tables.MEDICAL_EQUIPMENT}
        (patient_id, equipment_name, usage_description, is_daily_use)
        VALUES (
          ${equipment.patient_id},
          '${equipment.equipment_name}',
          '${equipment.usage_description}',
          ${equipment.is_daily_use ? 1 : 0}
        );
      `);
    }

    for (const goal of highLevelGoals) {
      await db.execAsync(`
        INSERT INTO ${tables.HIGH_LEVEL_GOAL}
        (patient_id, goal_title, description, target_date, source)
        VALUES (
          ${goal.patient_id},
          '${goal.goal_title}',
          '${goal.description}',
          '${goal.target_date}',
          '${goal.source}'
        );
      `);
    }

    logger.debug('Sample data seeded successfully.');
  } catch (error) {
    logger.debug('Error seeding data:', error);
  }
}; 