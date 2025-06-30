import { useDB } from '@/services/database/db';
import { MedicalCondition, MedicalEquipment, Patient, PatientSnapshot, User } from '@/services/database/migrations/v1/schema_v1';
import { MedicalConditionModel } from '@/services/database/models/MedicalConditionModel';
import { MedicalEquipmentModel } from '@/services/database/models/MedicalEquipmentModel';
import { PatientModel } from '@/services/database/models/PatientModel';
import { PatientSnapshotModel } from '@/services/database/models/PatientSnapshotModel';
import { logger } from '@/services/logging/logger';

// Single shared instances of models
const patientModel = new PatientModel();
const snapshotModel = new PatientSnapshotModel();
const medicalConditionModel = new MedicalConditionModel();
const medicalEquipmentModel = new MedicalEquipmentModel();

// Helper function to lazily initialize a model with the DB instance.
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

export const updatePatient = async (patientUpdate: Partial<Patient>, whereMap: Partial<Patient>): Promise<Patient> => {
    return useModel(patientModel, async (model) => {
        const updatedPatient = await model.updateByFields(patientUpdate, whereMap);
        logger.debug("Updated DB Patient data: ", updatedPatient);
        return updatedPatient!;
    });
}

export const getAllPatients = async (): Promise<Patient[]> => {
    return useModel(patientModel, async (model) => {
        return model.getAll();
    });
}

// PatientSnapshot Methods (Create, Read, Update)
export const createPatientSnapshot = async (snapshot: Partial<PatientSnapshot>): Promise<PatientSnapshot> => {
    return useModel(snapshotModel, async (model) => {
        const now = new Date().toISOString();
        const newSnapshot = {
            ...snapshot,
            created_at: now,
            updated_at: now,
        };

        const created = await model.insert(newSnapshot);
        logger.debug("Snapshot created: ", created);
        return created!;
    });
}

export const getPatientSnapshot = async (patientId: number): Promise<PatientSnapshot | null> => {
    return useModel(snapshotModel, async (model) => {
        const result = await model.getFirstByFields({ patient_id: patientId });
        logger.debug("DB Patient Snapshot data: ", result);
        return result;
    });
}

export const updatePatientSnapshot = async (snapshotUpdate: Partial<PatientSnapshot>, whereMap: Partial<PatientSnapshot>): Promise<PatientSnapshot> => {
    return useModel(snapshotModel, async (model) => {
        const updateData = {
            ...snapshotUpdate,
            updated_at: new Date().toISOString()
        };
        const updatedSnapshot = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated DB Patient Snapshot data: ", updatedSnapshot);
        return updatedSnapshot!;
    });
}

// MedicalCondition Methods (CRUD)
export const createMedicalCondition = async (condition: Partial<MedicalCondition>): Promise<MedicalCondition> => {
    return useModel(medicalConditionModel, async (model) => {
        const now = new Date().toISOString();
        const newCondition = {
            ...condition,
            diagnosed_at: condition.diagnosed_at || now,
            created_at: now,
            updated_at: now,
            linked_health_system: condition.linked_health_system || false
        };

        const created = await model.insert(newCondition);
        logger.debug("Medical Condition created: ", created);
        return created!;
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

export const updateMedicalCondition = async (medicalConditionUpdate: Partial<MedicalCondition>, whereMap: Partial<MedicalCondition>): Promise<MedicalCondition> => {
    return useModel(medicalConditionModel, async (model) => {
        const updateData = {
            ...medicalConditionUpdate,
            updated_at: new Date().toISOString()
        };
        const updatedCondition = await model.updateByFields(updateData, whereMap);
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
        const now = new Date().toISOString();
        const newEquipment = {
            ...equipment,
            created_at: now,
            updated_at: now,
            linked_health_system: equipment.linked_health_system || false
        };
        const created = await model.insert(newEquipment);
        logger.debug("Medical Equipment created: ", created);
        return created!;
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

export const updateMedicalEquipment = async (medicalEquipmentUpdate: Partial<MedicalEquipment>, whereMap: Partial<MedicalEquipment>): Promise<MedicalEquipment> => {
    return useModel(medicalEquipmentModel, async (model) => {
        const updateData = {
            ...medicalEquipmentUpdate,
            updated_at: new Date().toISOString()
        };
        const updatedEquipment = await model.updateByFields(updateData, whereMap);
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

