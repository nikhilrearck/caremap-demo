import { BaseModel } from '@/services/database/BaseModel';
import { SurgeryProcedure } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';
 
export class SurgeryProcedureModel extends BaseModel<SurgeryProcedure> {
    constructor() {
        super(tables.SURGERY_PROCEDURE);
    }
} 