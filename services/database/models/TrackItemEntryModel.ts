import { BaseModel } from '@/services/database/BaseModel';
import { TrackItemEntry } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class TrackItemEntryModel extends BaseModel<TrackItemEntry> {
    constructor() {
        super(tables.TRACK_ITEM_ENTRY);
    }
}