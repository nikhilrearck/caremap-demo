import { useDB } from '@/services/database/db';
import { logger } from '@/services/logging/logger';

// Helper function to lazily initialize a model with the DB instance.
export async function useModel<T>(model: any, fn: (model: any) => Promise<T>): Promise<T> {
    return useDB(async (db) => {
        model.setDB(db);
        return fn(model);
    });
}

// Helper function to get current timestamp
export function getCurrentTimestamp(): Date {
    return new Date();
} 