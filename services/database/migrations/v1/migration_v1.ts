import { logger } from "@/services/logging/logger";
import { SQLiteDatabase } from "expo-sqlite";
import { tables } from "./schema_v1";

export const up = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${tables.USER} (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      profile_picture_url TEXT
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      age INTEGER,
      relationship TEXT,
      weight REAL,
      height REAL,
      gender TEXT,
      birthdate TEXT,
      FOREIGN KEY(user_id) REFERENCES ${tables.USER}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT_SNAPSHOT} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      summary TEXT,
      health_issues TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.MEDICAL_CONDITION} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      condition_name TEXT NOT NULL,
      source TEXT,
      diagnosed_date TEXT,
      notes TEXT,
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.MEDICAL_EQUIPMENT} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      equipment_name TEXT NOT NULL,
      usage_description TEXT,
      is_daily_use INTEGER NOT NULL DEFAULT 0,
      added_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.HIGH_LEVEL_GOAL} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      goal_title TEXT NOT NULL,
      description TEXT,
      target_date TEXT,
      source TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );
  `);

  logger.debug(`Tables created for V1.`);
};