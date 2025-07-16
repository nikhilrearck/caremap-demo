import { BaseModel } from '@/services/database/BaseModel';
import { Patient } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class PatientModel extends BaseModel<Patient> {
    constructor() {
        super(tables.PATIENT);
    }
}
