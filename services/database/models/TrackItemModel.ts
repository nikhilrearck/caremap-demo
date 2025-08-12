import { BaseModel } from '@/services/database/BaseModel';
import { TrackItem } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class TrackItemModel extends BaseModel<TrackItem> {
    constructor() {
        super(tables.TRACK_ITEM);
    }
}