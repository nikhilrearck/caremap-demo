import { BaseModel } from '@/services/database/BaseModel';
import { PatientGoal } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class PatientGoalModel extends BaseModel<PatientGoal> {
    constructor() {
        super(tables.PATIENT_GOAL);
    }
} 