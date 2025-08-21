import { BaseModel } from '@/services/database/BaseModel';
import { ResponseOption } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class ResponseOptionModel extends BaseModel<ResponseOption> {
    constructor() {
        super(tables.RESPONSE_OPTION);
    }
}