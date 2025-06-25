import { BaseModel } from "@/services/database/BaseModel";
import { MedicalCondition, tables } from "@/services/database/migrations/v1/schema_v1";

export class MedicalConditionModel extends BaseModel<MedicalCondition> {
    constructor() {
        super(tables.MEDICAL_CONDITION);
    }
} 