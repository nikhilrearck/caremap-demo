import { BaseModel } from "@/services/database/BaseModel";
import { Contact } from "@/services/database/migrations/v1/schema_v1";
import { tables } from "@/services/database/migrations/v1/schema_v1";

export class ContactModel extends BaseModel<Contact> {
  constructor() {
    super(tables.CONTACT);
  }
}
