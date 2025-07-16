import { BaseModel } from '@/services/database/BaseModel';
import { PatientEquipment } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class PatientEquipmentModel extends BaseModel<PatientEquipment> {
    constructor() {
        super(tables.PATIENT_EQUIPMENT);
    }
} 