import { SQLITE_DB_NAME } from "@/utils/config";
import { SQLiteDatabase } from "expo-sqlite";
import * as v1 from './migrations/v1/migration_v1';

export const DB_NAME = SQLITE_DB_NAME;
export const DB_VERSION = 1;

export const useDatabase = (db: SQLiteDatabase) => {

    const runMigrations = async () => {
        const result = await db.getAllAsync<{ user_version: number }>(
            `PRAGMA user_version;`
        );
        const currentVersion = result[0]?.user_version ?? 0;

        console.log("DB version: ", currentVersion);

        if (currentVersion < DB_VERSION) {
            await db.withTransactionAsync(async () => {
                if (currentVersion < 1) {
                    await v1.up(db);
                }
                await db.execAsync(`PRAGMA user_version = ${DB_VERSION}`);
            });
        }
    };

    return { db, runMigrations };
};