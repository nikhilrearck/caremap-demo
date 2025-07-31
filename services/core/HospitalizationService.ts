import { Hospitalization } from '@/services/database/migrations/v1/schema_v1';
import { HospitalizationModel } from '@/services/database/models/HospitalizationModel';
import { logger } from '@/services/logging/logger';
import { getCurrentTimestamp } from '@/services/core/utils';
import { isExistingPatientById } from '@/services/core/PatientService';
import { useModel } from '@/services/database/BaseModel';

// Single shared instance of model
const hospitalizationModel = new HospitalizationModel();

export const isExistingHospitalization = async (id: number): Promise<boolean> => {
    const existingHospitalization = await getHospitalization(id);
    return !!existingHospitalization;
}

export const createHospitalization = async (hospitalization: Partial<Hospitalization>): Promise<Hospitalization | null> => {
    return useModel(hospitalizationModel, async (model) => {
        if (!hospitalization.patient_id || !(await isExistingPatientById(hospitalization.patient_id))) {
            logger.debug("Cannot create hospitalization: Patient does not exist", hospitalization.patient_id);
            return null;
        }

        if (!hospitalization.admission_date || !hospitalization.discharge_date) {
            logger.debug("Cannot create hospitalization: Admission date and discharge date are required");
            return null;
        }

        const now = getCurrentTimestamp();
        const newHospitalization = {
            ...hospitalization,
            created_date: now,
            updated_date: now
        };

        const created = await model.insert(newHospitalization);
        logger.debug("Hospitalization created: ", created);
        return created;
    });
}

export const getHospitalization = async (id: number): Promise<Hospitalization | null> => {
    return useModel(hospitalizationModel, async (model) => {
        const result = await model.getFirstByFields({ id });
        logger.debug("DB Hospitalization data: ", result);
        return result;
    });
}

export const getHospitalizationsByPatientId = async (patientId: number): Promise<Hospitalization[]> => {
    return useModel(hospitalizationModel, async (model) => {
        const result = await model.getByFields({ patient_id: patientId });
        logger.debug("DB Hospitalization data by patient ID: ", result);
        return result;
    });
}


export const updateHospitalization = async (hospitalizationUpdate: Partial<Hospitalization>, whereMap: Partial<Hospitalization>): Promise<Hospitalization | null> => {
    return useModel(hospitalizationModel, async (model) => {
        const existingHospitalization = await model.getFirstByFields(whereMap);
        if (!existingHospitalization) {
            logger.debug("Hospitalization not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...hospitalizationUpdate,
            updated_date: getCurrentTimestamp()
        };

        const updatedHospitalization = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated Hospitalization: ", updatedHospitalization);
        return updatedHospitalization;
    });
}

export const deleteHospitalization = async (id: number): Promise<boolean> => {
    return useModel(hospitalizationModel, async (model) => {
        if (!(await isExistingHospitalization(id))) {
            logger.debug("Hospitalization not found for deletion: ", id);
            return false;
        }

        await model.deleteByFields({ id });
        logger.debug("Deleted Hospitalization: ", id);
        return true;
    });
} 