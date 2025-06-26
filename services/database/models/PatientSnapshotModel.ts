import { BaseModel } from "@/services/database/BaseModel";
import { PatientSnapshot, tables } from "@/services/database/migrations/v1/schema_v1";

export class PatientSnapshotModel extends BaseModel<PatientSnapshot> {
    constructor() {
        super(tables.PATIENT_SNAPSHOT);
    }
} 