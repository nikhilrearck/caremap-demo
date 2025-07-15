import { BaseModel } from '@/services/database/BaseModel';
import { PatientAllergy } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class PatientAllergyModel extends BaseModel<PatientAllergy> {
    constructor() {
        super(tables.PATIENT_ALLERGY);
    }
} 