import { BaseModel } from '@/services/database/BaseModel';
import { TrackResponse } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class TrackResponseModel extends BaseModel<TrackResponse> {
    constructor() {
        super(tables.TRACK_RESPONSE);
    }
}