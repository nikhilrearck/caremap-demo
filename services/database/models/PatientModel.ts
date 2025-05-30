import { SQLiteDatabase } from "expo-sqlite";
import { BaseModel } from "../BaseModel";
import { Patient, tables } from "../migrations/v1/schema_v1";

export class PatientModel extends BaseModel<Patient> {

  constructor(db: SQLiteDatabase) {
    super(db, `${tables.PATIENT}`);
  }

  async getPatientByUserId(userId: string): Promise<Patient | null> {
    const result = await this.db.getFirstAsync<Patient>(`SELECT * FROM ${tables.PATIENT} WHERE user_id = ?`, [userId]);
    console.log(result);
    return result;
  }

}
