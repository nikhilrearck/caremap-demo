import { BaseModel } from '@/services/database/BaseModel';
import { PatientNote } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class PatientNoteModel extends BaseModel<PatientNote> {
    constructor() {
        super(tables.PATIENT_NOTE);
    }
} 