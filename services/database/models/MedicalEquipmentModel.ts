import { BaseModel } from "@/services/database/BaseModel";
import { MedicalEquipment, tables } from "@/services/database/migrations/v1/schema_v1";

export class MedicalEquipmentModel extends BaseModel<MedicalEquipment> {
    constructor() {
        super(tables.MEDICAL_EQUIPMENT);
    }
} 