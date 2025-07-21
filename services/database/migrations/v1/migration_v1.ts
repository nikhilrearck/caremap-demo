import { logger } from "@/services/logging/logger";
import { SQLiteDatabase } from "expo-sqlite";
import { tables } from "@/services/database/migrations/v1/schema_v1";

export const up = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${tables.USER} (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      blood_type TEXT,
      date_of_birth TEXT,
      first_name TEXT NOT NULL,
      gender TEXT,
      height REAL,
      height_unit TEXT,
      last_name TEXT NOT NULL,
      middle_name TEXT,
      profile_picture TEXT,
      relationship TEXT,
      weight REAL,
      weight_unit TEXT,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES ${tables.USER}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT_SNAPSHOT} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      health_issues TEXT DEFAULT NULL,
      patient_overview TEXT DEFAULT NULL,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT_CONDITION} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      condition_name TEXT NOT NULL,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT_EQUIPMENT} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      equipment_name TEXT NOT NULL UNIQUE COLLATE NOCASE,
      equipment_description TEXT,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT_GOAL} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      goal_description TEXT NOT NULL,
      target_date TEXT DEFAULT NULL,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT_EMERGENCY_CARE} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      topic TEXT NOT NULL,
      details TEXT DEFAULT NULL,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT_ALLERGY} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      topic TEXT NOT NULL,
      details TEXT DEFAULT NULL,
      onset_date TEXT NOT NULL DEFAULT (datetime('now')),
      severity TEXT CHECK(severity IN ('Mild', 'Moderate', 'Severe')) DEFAULT NULL,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT_MEDICATION} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      name TEXT NOT NULL,
      details TEXT NOT NULL,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT_NOTE} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      topic TEXT NOT NULL,
      details TEXT DEFAULT NULL,
      reminder_date TEXT DEFAULT NULL,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.HOSPITALIZATION} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      admission_date TEXT NOT NULL,
      discharge_date TEXT NOT NULL,
      details TEXT DEFAULT NULL,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.SURGERY_PROCEDURE} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      procedure_name TEXT NOT NULL,
      facility TEXT DEFAULT NULL,
      complications TEXT DEFAULT NULL,
      surgeon_name TEXT DEFAULT NULL,
      procedure_date TEXT NOT NULL,
      details TEXT DEFAULT NULL,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.DISCHARGE_INSTRUCTION} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      summary TEXT NOT NULL,
      discharge_date TEXT NOT NULL,
      details TEXT DEFAULT NULL,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );
  `);

  logger.debug(`Tables created for V1.`);
};