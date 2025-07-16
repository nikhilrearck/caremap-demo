import { useDB } from '@/services/database/db';
import { logger } from '@/services/logging/logger';
import { differenceInYears } from 'date-fns';

// Helper function to get current timestamp
export function getCurrentTimestamp(): Date {
    return new Date();
}

// Helper function to calculateAge based on given date.
export const calculateAge = (date: Date | undefined | null): number | null => {
    if (!date) return null;
    try {
        const today = new Date();
        return differenceInYears(today, date);
    } catch (error) {
        console.error("Error calculating age:", error);
        return null;
    }
};