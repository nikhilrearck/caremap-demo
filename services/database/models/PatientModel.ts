import { BaseModel } from "@/services/database/BaseModel";
import { Patient, tables } from "@/services/database/migrations/v1/schema_v1";

export class PatientModel extends BaseModel<Patient> {

  constructor() {
    super(tables.PATIENT);
  }

}
