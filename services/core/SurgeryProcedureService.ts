import { SurgeryProcedure } from '@/services/database/migrations/v1/schema_v1';
import { SurgeryProcedureModel } from '@/services/database/models/SurgeryProcedureModel';
import { logger } from '@/services/logging/logger';
import { getCurrentTimestamp } from '@/services/core/utils';
import { isExistingPatientById } from '@/services/core/PatientService';
import { useModel } from '@/services/database/BaseModel';

// Single shared instance of model
const surgeryProcedureModel = new SurgeryProcedureModel();

export const isExistingSurgeryProcedure = async (id: number): Promise<boolean> => {
    const existingSurgeryProcedure = await getSurgeryProcedure(id);
    return !!existingSurgeryProcedure;
}

export const createSurgeryProcedure = async (surgeryProcedure: Partial<SurgeryProcedure>): Promise<SurgeryProcedure | null> => {
    return useModel(surgeryProcedureModel, async (model) => {
        if (!surgeryProcedure.patient_id || !(await isExistingPatientById(surgeryProcedure.patient_id))) {
            logger.debug("Cannot create surgery procedure: Patient does not exist", surgeryProcedure.patient_id);
            return null;
        }

        if (!surgeryProcedure.procedure_name || !surgeryProcedure.procedure_date) {
            logger.debug("Cannot create surgery procedure: Procedure name and date are required");
            return null;
        }

        const now = getCurrentTimestamp();
        const newSurgeryProcedure = {
            ...surgeryProcedure,
            created_date: now,
            updated_date: now
        };

        const created = await model.insert(newSurgeryProcedure);
        logger.debug("Surgery Procedure created: ", created);
        return created;
    });
}

export const getSurgeryProcedure = async (id: number): Promise<SurgeryProcedure | null> => {
    return useModel(surgeryProcedureModel, async (model) => {
        const result = await model.getFirstByFields({ id });
        logger.debug("DB Surgery Procedure data: ", result);
        return result;
    });
}

export const getSurgeryProceduresByPatientId = async (patientId: number): Promise<SurgeryProcedure[]> => {
    return useModel(surgeryProcedureModel, async (model) => {
        const result = await model.getByFields({ patient_id: patientId });
        logger.debug("DB Surgery Procedure data by patient ID: ", result);
        return result;
    });
}

export const updateSurgeryProcedure = async (surgeryProcedureUpdate: Partial<SurgeryProcedure>, whereMap: Partial<SurgeryProcedure>): Promise<SurgeryProcedure | null> => {
    return useModel(surgeryProcedureModel, async (model) => {
        const existingSurgeryProcedure = await model.getFirstByFields(whereMap);
        if (!existingSurgeryProcedure) {
            logger.debug("Surgery Procedure not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...surgeryProcedureUpdate,
            updated_date: getCurrentTimestamp()
        };

        const updatedSurgeryProcedure = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated Surgery Procedure: ", updatedSurgeryProcedure);
        return updatedSurgeryProcedure;
    });
}

export const deleteSurgeryProcedure = async (id: number): Promise<boolean> => {
    return useModel(surgeryProcedureModel, async (model) => {
        if (!(await isExistingSurgeryProcedure(id))) {
            logger.debug("Surgery Procedure not found for deletion: ", id);
            return false;
        }

        await model.deleteByFields({ id });
        logger.debug("Deleted Surgery Procedure: ", id);
        return true;
    });
} 