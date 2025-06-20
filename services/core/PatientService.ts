import { useDB } from '@/services/database/db';
import { Patient, User } from '@/services/database/migrations/v1/schema_v1';
import { PatientModel } from '@/services/database/models/PatientModel';
import { logger } from '@/services/logging/logger';

// Single shared instance of PatientModel
const patientModel = new PatientModel();

// Runs a callback with a PatientModel instance that is lazily initialized with the database.
async function usePatientModel<T>(fn: (model: PatientModel) => Promise<T>): Promise<T> {
    return useDB(async (db) => {
        if (!patientModel['db']) {
            patientModel.setDB(db);
        }
        return fn(patientModel);
    });
}

export const isExistingPatient = async (userId: string): Promise<boolean> => {
    const existingPatient = await getPatientByUserId(userId);
    if (existingPatient) {
        return true;
    }
    return false;
}


export const createPatient = async (user: User): Promise<Patient> => {
    return usePatientModel(async (model) => {
        let patient;
        patient = await getPatientByUserId(user.id);
        if (!patient) {
            const newPatient: Partial<Patient> = {
                user_id: user.id,
                name: user.name
            };
            patient = await model.insert(newPatient);
            logger.debug(`Patient saved to DB successfully`, `${newPatient.name}`);
        }
        return patient;
    });
}

export const getPatientByUserId = async (userId: string): Promise<Patient | null> => {
    return usePatientModel(async (model) => {
        const result = await model.getFirstByFields({ user_id: userId });
        logger.debug("DB Patient data: ", result);
        return result;
    });
}

export const getPatient = async (id: number): Promise<Patient | null> => {
    return usePatientModel(async (model) => {
        const result = await model.getFirstByFields({ id: id });
        logger.debug("DB Patient data: ", result);
        return result;
    });
}

export const updatePatient = async (patient: Partial<Patient>, conditions: Partial<Patient>): Promise<Patient> => {
    return usePatientModel(async (model) => {
        let updatedPatient;
        updatedPatient = await model.updateByFields(patient, conditions);
        logger.debug("Updated DB Patient data: ", `${updatedPatient}`);
        return updatedPatient;
    });
}

export const getAllPatients = async (): Promise<Patient[]> => {
    return usePatientModel(async (model) => {
        return await model.getAll();
    });
}

