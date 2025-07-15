import { BaseModel } from '@/services/database/BaseModel';
import { PatientMedication } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class PatientMedicationModel extends BaseModel<PatientMedication> {
    constructor() {
        super(tables.PATIENT_MEDICATION);
    }
} 