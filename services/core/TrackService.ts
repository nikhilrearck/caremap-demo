import { TrackCategoryModel } from '@/services/database/models/TrackCategoryModel';
import { TrackItemModel } from '@/services/database/models/TrackItemModel';
import { QuestionModel } from '@/services/database/models/QuestionModel';
import { ResponseOptionModel } from '@/services/database/models/ResponseOptionModel';
import { TrackResponseModel } from '@/services/database/models/TrackResponseModel';
import { TrackItemEntryModel } from '@/services/database/models/TrackItemEntryModel';
import { logger } from '@/services/logging/logger';
import { getCurrentTimestamp } from '@/services/core/utils';
import { useModel } from '@/services/database/BaseModel';
import { TrackCategoryWithItems, QuestionWithOptions } from '@/services/common/types';
import { tables } from '@/services/database/migrations/v1/schema_v1';


// Single shared instance of models
const trackCategoryModel = new TrackCategoryModel();
const trackItemModel = new TrackItemModel();
const questionModel = new QuestionModel();
const responseOptionModel = new ResponseOptionModel();
const trackResponseModel = new TrackResponseModel();
const trackItemEntryModel = new TrackItemEntryModel();

export const getTrackCategoriesWithItemsAndProgress = async (
    patientId: number,
    date: string
): Promise<TrackCategoryWithItems[]> => {
    logger.debug('getTrackCategoriesWithItemsAndProgress called', { patientId, date });

    const result = await useModel(trackCategoryModel, async (categoryModel) => {
        const categories = await categoryModel.getAll();

        const items = await useModel(trackItemModel, async (itemModel: any) => {
            const result = await itemModel.runQuery(`
                 SELECT 
                    ti.id,
                    ti.name,
                    ti.category_id,
                    COUNT(DISTINCT r.question_id) AS completed,
                    COUNT(DISTINCT q.id) AS total,
                    CASE WHEN tie.id IS NULL THEN 0 ELSE 1 END AS started
                    FROM ${tables.TRACK_ITEM} ti
                    LEFT JOIN ${tables.TRACK_ITEM_ENTRY} tie 
                    ON tie.track_item_id = ti.id AND tie.patient_id = ? AND tie.date = ?
                    LEFT JOIN ${tables.TRACK_RESPONSE} r 
                    ON r.track_item_entry_id = tie.id
                    LEFT JOIN ${tables.QUESTION} q
                    ON q.item_id = ti.id
                    GROUP BY ti.id
            `, [patientId, date]);
            return result as any[];
        });

        // Group items under categories and transform to match new interface
        return categories.map((cat: any) => ({
            ...cat,
            items: items.filter((item: any) => item.category_id === cat.id).map((item: any) => ({
                item: {
                    id: item.id,
                    category_id: item.category_id,
                    name: item.name,
                    created_date: item.created_date,
                    updated_date: item.updated_date
                },
                completed: item.completed, // TODO: Calculate based on responses
                total: item.total, // TODO: Calculate based on questions
                started: item.started === 1,
            }))
        }));
    });

    logger.debug('getTrackCategoriesWithItemsAndProgress completed', JSON.stringify(result, null, 2));
    return result;
};

export const addTrackItemForDate = async (
    patientId: number,
    itemId: number,
    date: string
): Promise<number> => {
    logger.debug('addTrackItemForDate called', { patientId, itemId, date });

    const result = await useModel(trackItemEntryModel, async (model) => {
        const existing = await model.getFirstByFields({ patient_id: patientId, track_item_id: itemId, date });
        if (existing) return existing.id;
        const insertResult = await model.insert({
            user_id: 1, // TODO: Get from context
            patient_id: patientId,
            track_item_id: itemId,
            date,
        });
        return insertResult.lastInsertRowId;
    });

    logger.debug('addTrackItemForDate completed', { patientId, itemId, date, result });
    return result;
};

export const getQuestionsWithOptions = async (
    itemId: number
): Promise<QuestionWithOptions[]> => {
    logger.debug('getQuestionsWithOptions called', { itemId });

    const result = await useModel(questionModel, async (model) => {
        const questions = await model.getByFields({ item_id: itemId });

        const allOptions = await useModel(responseOptionModel, async (optModel: any) => {
            const result = await optModel.getAll();
            return result as any[];
        });

        return questions.map((q: any) => ({
            question: q,
            options: allOptions.filter((opt: any) => opt.question_id === q.id),
            existingResponse: undefined
        }));
    });

    logger.debug('getQuestionsWithOptions completed', { itemId });
    return result;
};

export const saveResponse = async (
    entryId: number,
    questionId: number,
    answer: unknown
): Promise<void> => {
    logger.debug('saveResponse called', { entryId, questionId, answer });

    const result = await useModel(trackResponseModel, async (model) => {
        const existing = await model.getFirstByFields({
            track_item_entry_id: entryId,
            question_id: questionId,
        });

        if (existing) {
            await model.updateByFields(
                {
                    answer: JSON.stringify(answer),
                    updated_date: getCurrentTimestamp(),
                },
                {
                    track_item_entry_id: entryId,
                    question_id: questionId,
                }
            );
        } else {
            await model.insert({
                user_id: 1, // TODO: Get from context
                patient_id: 1, // TODO: Get from context
                item_id: 1, // TODO: Get from context
                question_id: questionId,
                track_item_entry_id: entryId,
                answer: JSON.stringify(answer),
                created_date: getCurrentTimestamp(),
                updated_date: getCurrentTimestamp(),
            });
        }
    });

    logger.debug('saveResponse completed', { entryId, questionId, answer });
    return result;
};

export const addOptionToQuestion = async (
    questionId: number,
    label: string
): Promise<number> => {
    logger.debug('addOptionToQuestion called', { questionId, label });

    const result = await useModel(responseOptionModel, async (model) => {
        const insertResult = await model.insert({
            question_id: questionId,
            text: label,
            created_date: getCurrentTimestamp(),
            updated_date: getCurrentTimestamp(),
        });
        return insertResult.lastInsertRowId;
    });

    logger.debug('addOptionToQuestion completed', { questionId, label, result });
    return result;
};