import { BaseModel } from "@/services/database/BaseModel";
import { User, tables } from "@/services/database/migrations/v1/schema_v1";

export class UserModel extends BaseModel<User> {

  constructor() {
    super(tables.USER);
  }

}