import { BaseModel } from '@/services/database/BaseModel';
import { DischargeInstruction } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';
 
export class DischargeInstructionModel extends BaseModel<DischargeInstruction> {
    constructor() {
        super(tables.DISCHARGE_INSTRUCTION);
    }
} 