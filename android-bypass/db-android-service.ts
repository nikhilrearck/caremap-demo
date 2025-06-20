import { logger } from "@/services/logging/logger";
import * as FileSystem from 'expo-file-system';
import { FORCE_DB_RESET_ANDROID } from "./config-android";
import { isAndroid } from "./google-auth-android";

export const handleAndroidDBReset = async (dbName: string) => {
    if (isAndroid && FORCE_DB_RESET_ANDROID) {
        const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
        const fileInfo = await FileSystem.getInfoAsync(dbPath);

        if (fileInfo.exists) {
            logger.debug(`[DB Reset] Deleting DB at: ${dbPath}`);
            await FileSystem.deleteAsync(dbPath, { idempotent: true });
        } else {
            logger.debug(`[DB Reset] No existing DB found at: ${dbPath}`);
        }
    }
}