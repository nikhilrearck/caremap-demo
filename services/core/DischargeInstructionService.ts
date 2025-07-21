import { DischargeInstruction } from '@/services/database/migrations/v1/schema_v1';
import { DischargeInstructionModel } from '@/services/database/models/DischargeInstructionModel';
import { logger } from '@/services/logging/logger';
import { getCurrentTimestamp } from '@/services/core/utils';
import { isExistingPatientById } from '@/services/core/PatientService';
import { useModel } from '@/services/database/BaseModel';

// Single shared instance of model
const dischargeInstructionModel = new DischargeInstructionModel();

export const isExistingDischargeInstruction = async (id: number): Promise<boolean> => {
    const existingDischargeInstruction = await getDischargeInstruction(id);
    return !!existingDischargeInstruction;
}

export const createDischargeInstruction = async (dischargeInstruction: Partial<DischargeInstruction>): Promise<DischargeInstruction | null> => {
    return useModel(dischargeInstructionModel, async (model) => {
        if (!dischargeInstruction.patient_id || !(await isExistingPatientById(dischargeInstruction.patient_id))) {
            logger.debug("Cannot create discharge instruction: Patient does not exist", dischargeInstruction.patient_id);
            return null;
        }

        if (!dischargeInstruction.summary || !dischargeInstruction.discharge_date) {
            logger.debug("Cannot create discharge instruction: Summary and discharge date are required");
            return null;
        }

        const now = getCurrentTimestamp();
        const newDischargeInstruction = {
            ...dischargeInstruction,
            created_date: now,
            updated_date: now
        };

        const created = await model.insert(newDischargeInstruction);
        logger.debug("Discharge Instruction created: ", created);
        return created;
    });
}

export const getDischargeInstruction = async (id: number): Promise<DischargeInstruction | null> => {
    return useModel(dischargeInstructionModel, async (model) => {
        const result = await model.getFirstByFields({ id });
        logger.debug("DB Discharge Instruction data: ", result);
        return result;
    });
}

export const getDischargeInstructionsByPatientId = async (patientId: number): Promise<DischargeInstruction[]> => {
    return useModel(dischargeInstructionModel, async (model) => {
        const result = await model.getAllByFields({ patient_id: patientId });
        logger.debug("DB Discharge Instruction data by patient ID: ", result);
        return result;
    });
}

export const updateDischargeInstruction = async (dischargeInstructionUpdate: Partial<DischargeInstruction>, whereMap: Partial<DischargeInstruction>): Promise<DischargeInstruction | null> => {
    return useModel(dischargeInstructionModel, async (model) => {
        const existingDischargeInstruction = await model.getFirstByFields(whereMap);
        if (!existingDischargeInstruction) {
            logger.debug("Discharge Instruction not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...dischargeInstructionUpdate,
            updated_date: getCurrentTimestamp()
        };

        const updatedDischargeInstruction = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated Discharge Instruction: ", updatedDischargeInstruction);
        return updatedDischargeInstruction;
    });
}

export const deleteDischargeInstruction = async (id: number): Promise<boolean> => {
    return useModel(dischargeInstructionModel, async (model) => {
        if (!(await isExistingDischargeInstruction(id))) {
            logger.debug("Discharge Instruction not found for deletion: ", id);
            return false;
        }

        await model.deleteByFields({ id });
        logger.debug("Deleted Discharge Instruction: ", id);
        return true;
    });
} 