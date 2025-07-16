import { BaseModel } from '@/services/database/BaseModel';
import { PatientCondition } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class PatientConditionModel extends BaseModel<PatientCondition> {
    constructor() {
        super(tables.PATIENT_CONDITION);
    }
} 