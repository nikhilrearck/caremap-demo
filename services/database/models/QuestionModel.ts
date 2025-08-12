import { BaseModel } from '@/services/database/BaseModel';
import { Question } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class QuestionModel extends BaseModel<Question> {
    constructor() {
        super(tables.QUESTION);
    }
}