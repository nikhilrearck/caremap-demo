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

export const isExistingPatientByUserId = async (userId: string): Promise<boolean> => {
    const existingPatient = await getPatientByUserId(userId);
    return !!existingPatient;
}

export const isExistingPatientById = async (id: number): Promise<boolean> => {
    const existingPatient = await getPatient(id);
    return !!existingPatient;
}

export const isExistingPatientSnapshot = async (patientId: number): Promise<boolean> => {
    const existingSnapshot = await getPatientSnapshot(patientId);
    return !!existingSnapshot;
}

export const isExistingMedicalCondition = async (id: number): Promise<boolean> => {
    const existingCondition = await getMedicalCondition(id);
    return !!existingCondition;
}

export const isExistingMedicalEquipment = async (id: number): Promise<boolean> => {
    const existingEquipment = await getMedicalEquipment(id);
    return !!existingEquipment;
}

export const createPatient = async (user: User): Promise<Patient> => {
    return useModel(patientModel, async (model) => {
        const exists = await isExistingPatientByUserId(user.id);
        if (exists) {
            const patient = await getPatientByUserId(user.id);
            return patient!;
        }

        const newPatient: Partial<Patient> = {
            user_id: user.id,
            name: user.name
        };
        await model.insert(newPatient);
        const patient = await getPatientByUserId(user.id);
        logger.debug(`Patient saved to DB successfully`, `${newPatient.name}`);
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

export const updatePatient = async (patientUpdate: Partial<Patient>, whereMap: Partial<Patient>): Promise<Patient | null> => {
    return useModel(patientModel, async (model) => {

        const existingPatient = await model.getFirstByFields(whereMap);
        if (!existingPatient) {
            logger.debug("Patient not found for update: ", whereMap);
            return null;
        }

        const updatedPatient = await model.updateByFields(patientUpdate, whereMap);
        logger.debug("Updated DB Patient data: ", updatedPatient);
        return updatedPatient;
    });
}

export const getAllPatients = async (): Promise<Patient[]> => {
    return useModel(patientModel, async (model) => {
        return model.getAll();
    });
}

// PatientSnapshot Methods (Create, Read, Update)
export const createPatientSnapshot = async (snapshot: Partial<PatientSnapshot>): Promise<PatientSnapshot | null> => {
    return useModel(snapshotModel, async (model) => {
        if (!snapshot.patient_id || !(await isExistingPatientById(snapshot.patient_id))) {
            logger.debug("Cannot create snapshot: Patient does not exist", snapshot.patient_id);
            return null;
        }

        const existingSnapshot = await getPatientSnapshot(snapshot.patient_id);
        if (existingSnapshot) {
            logger.debug("Snapshot already exists for patient: ", snapshot.patient_id);
            return existingSnapshot;
        }

        const now = new Date().toISOString();
        const newSnapshot = {
            ...snapshot,
            created_at: new Date(),
            updated_at: new Date(),
        };

        const created = await model.insert(newSnapshot);
        logger.debug("Snapshot created: ", created);
        return created;
    });
}

export const getPatientSnapshot = async (patientId: number): Promise<PatientSnapshot | null> => {
    return useModel(snapshotModel, async (model) => {
        const result = await model.getFirstByFields({ patient_id: patientId });
        logger.debug("DB Patient Snapshot data: ", result);
        return result;
    });
}

export const updatePatientSnapshot = async (snapshotUpdate: Partial<PatientSnapshot>, whereMap: Partial<PatientSnapshot>): Promise<PatientSnapshot | null> => {
    return useModel(snapshotModel, async (model) => {
        const existingSnapshot = await model.getFirstByFields(whereMap);
        if (!existingSnapshot) {
            logger.debug("Snapshot not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...snapshotUpdate,
            updated_at: new Date()
        };
        const updatedSnapshot = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated DB Patient Snapshot data: ", updatedSnapshot);
        return updatedSnapshot;
    });
}

// MedicalCondition Methods (CRUD)
export const createMedicalCondition = async (condition: Partial<MedicalCondition>): Promise<MedicalCondition | null> => {
    return useModel(medicalConditionModel, async (model) => {
        if (!condition.patient_id || !(await isExistingPatientById(condition.patient_id))) {
            logger.debug("Cannot create medical condition: Patient does not exist", condition.patient_id);
            return null;
        }

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
        return created;
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

export const updateMedicalCondition = async (medicalConditionUpdate: Partial<MedicalCondition>, whereMap: Partial<MedicalCondition>): Promise<MedicalCondition | null> => {
    return useModel(medicalConditionModel, async (model) => {
        const existingCondition = await model.getFirstByFields(whereMap);
        if (!existingCondition) {
            logger.debug("Medical Condition not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...medicalConditionUpdate,
            updated_at: new Date()
        };
        const updatedCondition = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated Medical Condition: ", updatedCondition);
        return updatedCondition;
    });
}

export const deleteMedicalCondition = async (id: number): Promise<boolean> => {
    return useModel(medicalConditionModel, async (model) => {

        if (!(await isExistingMedicalCondition(id))) {
            logger.debug("Medical Condition not found for deletion: ", id);
            return false;
        }

        await model.deleteByFields({ id });
        logger.debug("Deleted Medical Condition: ", id);
        return true;
    });
}

// MedicalEquipment Methods (CRUD)
export const createMedicalEquipment = async (equipment: Partial<MedicalEquipment>): Promise<MedicalEquipment | null> => {
    return useModel(medicalEquipmentModel, async (model) => {
        if (!equipment.patient_id || !(await isExistingPatientById(equipment.patient_id))) {
            logger.debug("Cannot create medical equipment: Patient does not exist", equipment.patient_id);
            return null;
        }

        const now = new Date().toISOString();
        const newEquipment = {
            ...equipment,
            created_at: now,
            updated_at: now,
            linked_health_system: equipment.linked_health_system || false
        };
        const created = await model.insert(newEquipment);
        logger.debug("Medical Equipment created: ", created);
        return created;
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

export const updateMedicalEquipment = async (medicalEquipmentUpdate: Partial<MedicalEquipment>, whereMap: Partial<MedicalEquipment>): Promise<MedicalEquipment | null> => {
    return useModel(medicalEquipmentModel, async (model) => {
        const existingEquipment = await model.getFirstByFields(whereMap);
        if (!existingEquipment) {
            logger.debug("Medical Equipment not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...medicalEquipmentUpdate,
            updated_at: new Date()
        };
        const updatedEquipment = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated Medical Equipment: ", updatedEquipment);
        return updatedEquipment;
    });
}

export const deleteMedicalEquipment = async (id: number): Promise<boolean> => {
    return useModel(medicalEquipmentModel, async (model) => {

        if (!(await isExistingMedicalEquipment(id))) {
            logger.debug("Medical Equipment not found for deletion: ", id);
            return false;
        }

        await model.deleteByFields({ id });
        logger.debug("Deleted Medical Equipment: ", id);
        return true;
    });
}

