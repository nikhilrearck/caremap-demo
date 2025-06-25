import { useDB } from '@/services/database/db';
import { Patient, User, PatientSnapshot, MedicalCondition, MedicalEquipment } from '@/services/database/migrations/v1/schema_v1';
import { PatientModel } from '@/services/database/models/PatientModel';
import { PatientSnapshotModel } from '@/services/database/models/PatientSnapshotModel';
import { MedicalConditionModel } from '@/services/database/models/MedicalConditionModel';
import { MedicalEquipmentModel } from '@/services/database/models/MedicalEquipmentModel';
import { logger } from '@/services/logging/logger';

// Single shared instances of models
const patientModel = new PatientModel();
const snapshotModel = new PatientSnapshotModel();
const medicalConditionModel = new MedicalConditionModel();
const medicalEquipmentModel = new MedicalEquipmentModel();

// Helper functions to use models with DB
async function useModel<T>(model: any, fn: (model: any) => Promise<T>): Promise<T> {
    return useDB(async (db) => {
        model.setDB(db);
        return fn(model);
    });
}

export const isExistingPatient = async (userId: string): Promise<boolean> => {
    const existingPatient = await getPatientByUserId(userId);
    return !!existingPatient;
}

export const createPatient = async (user: User): Promise<Patient> => {
    return useModel(patientModel, async (model) => {
        let patient = await getPatientByUserId(user.id);
        if (!patient) {
            const newPatient: Partial<Patient> = {
                user_id: user.id,
                name: user.name
            };
            await model.insert(newPatient);
            patient = await getPatientByUserId(user.id);
            logger.debug(`Patient saved to DB successfully`, `${newPatient.name}`);
        }
        return patient!;
    });
}

export const getPatientByUserId = async (userId: string): Promise<Patient | null> => {
    return useModel(patientModel, async (model) => {
        const result = await model.getFirstByFields({ user_id: userId });
        logger.debug("DB Patient data: ", result);
        return result;
    });
}

export const getPatient = async (id: number): Promise<Patient | null> => {
    return useModel(patientModel, async (model) => {
        const result = await model.getFirstByFields({ id });
        logger.debug("DB Patient data: ", result);
        return result;
    });
}

export const updatePatient = async (patient: Partial<Patient>, conditions: Partial<Patient>): Promise<Patient> => {
    return useModel(patientModel, async (model) => {
        await model.updateByFields(patient, conditions);
        const updatedPatient = await model.getFirstByFields(conditions);
        logger.debug("Updated DB Patient data: ", updatedPatient);
        return updatedPatient!;
    });
}

export const getAllPatients = async (): Promise<Patient[]> => {
    return useModel(patientModel, async (model) => {
        return model.getAll();
    });
}

// PatientSnapshot Methods (Read, Update)
export const getPatientSnapshot = async (patientId: number): Promise<PatientSnapshot | null> => {
    return useModel(snapshotModel, async (model) => {
        const result = await model.getFirstByFields({ patient_id: patientId });
        logger.debug("DB Patient Snapshot data: ", result);
        return result;
    });
}

export const updatePatientSnapshot = async (snapshot: Partial<PatientSnapshot>, conditions: Partial<PatientSnapshot>): Promise<PatientSnapshot> => {
    return useModel(snapshotModel, async (model) => {
        await model.updateByFields(snapshot, conditions);
        const updatedSnapshot = await model.getFirstByFields(conditions);
        logger.debug("Updated DB Patient Snapshot data: ", updatedSnapshot);
        return updatedSnapshot!;
    });
}

// MedicalCondition Methods (CRUD)
export const createMedicalCondition = async (condition: Partial<MedicalCondition>): Promise<MedicalCondition> => {
    return useModel(medicalConditionModel, async (model) => {
        await model.insert(condition);
        const newCondition = await model.getFirstByFields(condition);
        logger.debug("Medical Condition created: ", newCondition);
        return newCondition!;
    });
}

export const getMedicalCondition = async (id: number): Promise<MedicalCondition | null> => {
    return useModel(medicalConditionModel, async (model) => {
        const result = await model.getFirstByFields({ id });
        logger.debug("DB Medical Condition data: ", result);
        return result;
    });
}

export const getMedicalConditionsByPatient = async (patientId: number): Promise<MedicalCondition[]> => {
    return useModel(medicalConditionModel, async (model) => {
        const results = await model.getByFields({ patient_id: patientId });
        logger.debug("DB Medical Conditions for patient: ", results);
        return results;
    });
}

export const updateMedicalCondition = async (condition: Partial<MedicalCondition>, conditions: Partial<MedicalCondition>): Promise<MedicalCondition> => {
    return useModel(medicalConditionModel, async (model) => {
        await model.updateByFields(condition, conditions);
        const updatedCondition = await model.getFirstByFields(conditions);
        logger.debug("Updated Medical Condition: ", updatedCondition);
        return updatedCondition!;
    });
}

export const deleteMedicalCondition = async (id: number): Promise<void> => {
    return useModel(medicalConditionModel, async (model) => {
        await model.deleteByFields({ id });
        logger.debug("Deleted Medical Condition: ", id);
    });
}

// MedicalEquipment Methods (CRUD)
export const createMedicalEquipment = async (equipment: Partial<MedicalEquipment>): Promise<MedicalEquipment> => {
    return useModel(medicalEquipmentModel, async (model) => {
        await model.insert(equipment);
        const newEquipment = await model.getFirstByFields(equipment);
        logger.debug("Medical Equipment created: ", newEquipment);
        return newEquipment!;
    });
}

export const getMedicalEquipment = async (id: number): Promise<MedicalEquipment | null> => {
    return useModel(medicalEquipmentModel, async (model) => {
        const result = await model.getFirstByFields({ id });
        logger.debug("DB Medical Equipment data: ", result);
        return result;
    });
}

export const getMedicalEquipmentByPatient = async (patientId: number): Promise<MedicalEquipment[]> => {
    return useModel(medicalEquipmentModel, async (model) => {
        const results = await model.getByFields({ patient_id: patientId });
        logger.debug("DB Medical Equipment for patient: ", results);
        return results;
    });
}

export const updateMedicalEquipment = async (equipment: Partial<MedicalEquipment>, conditions: Partial<MedicalEquipment>): Promise<MedicalEquipment> => {
    return useModel(medicalEquipmentModel, async (model) => {
        await model.updateByFields(equipment, conditions);
        const updatedEquipment = await model.getFirstByFields(conditions);
        logger.debug("Updated Medical Equipment: ", updatedEquipment);
        return updatedEquipment!;
    });
}

export const deleteMedicalEquipment = async (id: number): Promise<void> => {
    return useModel(medicalEquipmentModel, async (model) => {
        await model.deleteByFields({ id });
        logger.debug("Deleted Medical Equipment: ", id);
    });
}

