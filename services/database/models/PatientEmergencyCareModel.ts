import { BaseModel } from '@/services/database/BaseModel';
import { PatientEmergencyCare } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class PatientEmergencyCareModel extends BaseModel<PatientEmergencyCare> {
    constructor() {
        super(tables.PATIENT_EMERGENCY_CARE);
    }
} 