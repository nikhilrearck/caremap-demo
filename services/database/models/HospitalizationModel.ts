import { BaseModel } from '@/services/database/BaseModel';
import { Hospitalization } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';
 
export class HospitalizationModel extends BaseModel<Hospitalization> {
    constructor() {
        super(tables.HOSPITALIZATION);
    }
} 