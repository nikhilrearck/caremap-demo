import { TrackCategoryModel } from '@/services/database/models/TrackCategoryModel';
import { TrackItemModel } from '@/services/database/models/TrackItemModel';
import { QuestionModel } from '@/services/database/models/QuestionModel';
import { ResponseOptionModel } from '@/services/database/models/ResponseOptionModel';
import { TrackResponseModel } from '@/services/database/models/TrackResponseModel';
import { TrackItemEntryModel } from '@/services/database/models/TrackItemEntryModel';
import { logger } from '@/services/logging/logger';
import { getCurrentTimestamp } from '@/services/core/utils';
import { useModel } from '@/services/database/BaseModel';
import { TrackCategoryWithItems, QuestionWithOptions, TrackItemWithProgress } from '@/services/common/types';
import { tables } from '@/services/database/migrations/v1/schema_v1';


// Single shared instance of models
const trackCategoryModel = new TrackCategoryModel();
const trackItemModel = new TrackItemModel();
const questionModel = new QuestionModel();
const responseOptionModel = new ResponseOptionModel();
const trackResponseModel = new TrackResponseModel();
const trackItemEntryModel = new TrackItemEntryModel();


/**
* Fetches all categories with their items and progress for a specific date.
* Used in: /track/index.tsx
*/
export const getTrackCategoriesWithItemsAndProgress = async (
  patientId: number,
  date: string
): Promise<TrackCategoryWithItems[]> => {
  return useModel(trackCategoryModel, async (categoryModel) => {
    const categories = await categoryModel.getAll();

    // Explicitly fetch only required fields for TrackItemWithProgress
    const items = await useModel(trackItemModel, (itemModel) =>
      itemModel.runQuery(
        `
        SELECT 
          ti.id,
          ti.name,TrackService3.ts
          ti.category_id,
          COUNT(DISTINCT r.question_id) AS completed,
          COUNT(DISTINCT q.id) AS total,
          CASE WHEN tie.id IS NULL THEN 0 ELSE 1 END AS started
        FROM track_items ti
        LEFT JOIN track_item_entries tie 
          ON tie.track_item_id = ti.id AND tie.patient_id = ? AND tie.date = ?
        LEFT JOIN responses r 
          ON r.track_item_entry_id = tie.id
        LEFT JOIN track_questions q
          ON q.track_item_id = ti.id
        GROUP BY ti.id
      `,
        [patientId, date]
      )
    );

    // Group items under categories
    return categories.map((cat: any) => ({
      category: cat,
      items: items.filter((i: any) => i.category_id === cat.id)
        .map<TrackItemWithProgress>((row: any) => ({
          item: {
            id: row.id,
            name: row.name,
            category_id: row.category_id,
          },
          completed: row.completed,
          total: row.total,
          started: !!row.started,
        })),
    }));
  });
};

/**
* Adds an item to be tracked for a patient on a specific date.
* Used in: "Add New Item" action in /track/index.tsx
*/
export const addTrackItemForDate = async (
  patientId: number,
  itemId: number,
  date: string
): Promise<number> => {
  return useModel(trackItemEntryModel, async (model) => {
    const existing = await model.getFirstByFields({
      patient_id: patientId,
      track_item_id: itemId,
      date,
    });
    if (existing) return existing.id;
    return await model.create({
      patient_id: patientId,
      track_item_id: itemId,
      date,
    });
  });
};

/**
* Fetches questions with their options for a specific item.
* Used in: /track/questions/[itemId].tsx
*/
export const getQuestionsWithOptions = async (
  itemId: number
): Promise<QuestionWithOptions[]> => {
  return useModel(questionModel, async (model) => {
    const questions = await model.getByFields({ track_item_id: itemId });

    const allOptions = await useModel(responseOptionModel, (optModel) =>
      optModel.getAll()
    );

    return questions.map((q) => ({
      question: q,
      options: allOptions.filter((opt) => opt.question_id === q.id),
      existingResponse: undefined, // Filled later if entry is known
    }));
  });
};

/**
* Saves an answer for a question under a track_item_entry.
* Used in: /track/questions/[itemId].tsx
*/
export const saveResponse = async (
  entryId: number,
  questionId: number,
  answer: string | number | boolean
): Promise<void> => {
  return useModel(trackResponseModel, async (model) => {
    const existing = await model.getFirstByFields({
      track_item_entry_id: entryId,
      question_id: questionId,
    });

    const payload = {
      answer: JSON.stringify(answer),
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      await model.update(existing.id, payload);
    } else {
      await model.create({
        track_item_entry_id: entryId,
        question_id: questionId,
        ...payload,
        created_at: new Date().toISOString(),
      });
    }
  });
};

/**
* Adds a new option dynamically to a MSQ question.
* Used in: /components/OptionEditor.tsx
*/
export const addOptionToQuestion = async (
  questionId: number,
  label: string
): Promise<number> => {
  return useModel(responseOptionModel, async (model) => {
    return await model.create({
      question_id: questionId,
      label,
      value: label.toLowerCase().replace(/\s+/g, "_"),
    });
  });
};