import { BaseModel } from '@/services/database/BaseModel';
import { TrackCategory } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class TrackCategoryModel extends BaseModel<TrackCategory> {
    constructor() {
        super(tables.TRACK_CATEGORY);
    }
}