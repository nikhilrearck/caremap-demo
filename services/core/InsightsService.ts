import { TrackResponseModel } from "@/services/database/models/TrackResponseModel";
import insightsConfig from "@/services/database/seeds/v1/insights.json";
import { DAY_LABELS, InsightsRequest, InsightsResponse, QuestionSeries, WeeklyPoint } from "../common/types";
import { useModel } from "../database/BaseModel";
import { tables } from "../database/migrations/v1/schema_v1";
import { logger } from "../logging/logger";


// Single shared instance of models
const trackResponseModel = new TrackResponseModel();

// Helper: MM-DD-YYYY format
const formatDateMMDDYYYY = (d: Date): string => {
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
};

// Compute calendar week bounds
const getCalendarWeekBounds = (selectedDate?: string): { weekStart: string; weekEnd: string; weekDays: string[] } => {
    let anchor: Date;
    try {
        if (selectedDate) {
            const [mm, dd, yyyy] = selectedDate.split("-").map(Number);
            anchor = new Date(yyyy, mm - 1, dd);
        } else {
            anchor = new Date();
        }
    } catch {
        anchor = new Date();
    }

    const dow = anchor.getDay(); // 0=Sun
    const sunday = new Date(anchor);
    sunday.setDate(anchor.getDate() - dow);
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);

    const weekDays: string[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        weekDays.push(formatDateMMDDYYYY(d));
    }

    return {
        weekStart: formatDateMMDDYYYY(sunday),
        weekEnd: formatDateMMDDYYYY(saturday),
        weekDays,
    };
};

// Map raw answers -> numeric values for charts
const mapAnswerValueByTransform = (rawAnswer: string | null, transform: string): number | null => {
    if (rawAnswer == null) return null;

    const normalized = String(rawAnswer).trim().toLowerCase();

    if (transform === "boolean") {
        if (["1", "true", "yes"].includes(normalized)) return 1;
        if (["0", "false", "no"].includes(normalized)) return 0;
        return null;
    }

    if (transform === "numeric") {
        const num = Number(rawAnswer);
        return Number.isNaN(num) ? null : num;
    }

    return null;
};

// Fetch all responses for patient + week + questionIds
const fetchWeeklyResponses = async (
    patientId: number,
    questionIds: number[],
    weekStart: string,
    weekEnd: string
) => {
    if (questionIds.length === 0) return [];

    const placeholders = questionIds.map(() => "?").join(",");
    const sql = `
    SELECT r.id as response_id,
           r.question_id,
           r.answer,
           tie.date as date
    FROM ${tables.TRACK_RESPONSE} r
    INNER JOIN ${tables.TRACK_ITEM_ENTRY} tie
      ON tie.id = r.track_item_entry_id
    WHERE tie.patient_id = ?
      AND r.question_id IN (${placeholders})
      AND tie.date BETWEEN ? AND ?
  `;

    const params: any[] = [patientId, ...questionIds, weekStart, weekEnd];

    return useModel(trackResponseModel, async (m: any) => {
        return (await m.runQuery(sql, params)) as {
            response_id: number;
            question_id: number;
            answer: string | null;
            date: string;
        }[];
    });
};

// Map DB rows -> QuestionSeries[]
const mapResponsesToSeries = (
    responses: { response_id: number; question_id: number; answer: string | null; date: string }[],
    weekDays: string[]
): QuestionSeries[] => {
    const series: QuestionSeries[] = [];

    for (const t of insightsConfig as any[]) {
        const topicId: number = t.topic_id;
        const topicName: string = t.topic;
        const qId: number = t.questionId;
        const transform: string = t.transform ?? "numeric";

        const points: WeeklyPoint[] = weekDays.map((day, idx) => {
            const row = responses.find((r) => r.question_id === qId && r.date === day);
            const value = row ? mapAnswerValueByTransform(row.answer, transform) : null;
            const responseId = row ? row.response_id : null;

            return {
                label: DAY_LABELS[idx],
                date: day,
                value,
                responseId,
            } as WeeklyPoint;
        });

        series.push({
            questionId: qId,
            transform,
            topicId,
            topic: topicName,
            points,
        });
    }

    return series;
};

// Public entrypoint
export const getWeeklyInsights = async (req: InsightsRequest): Promise<InsightsResponse> => {

    // Validate request
    if (!req || typeof req.patientId !== "number") {
        throw new Error("Invalid request: patientId is required");
    }

    // Determine the anchor date
    const defaultDate = formatDateMMDDYYYY(new Date());
    const anchorDate = req.selectedDate ?? defaultDate;

    // Compute the calendar week (Sun–Sat) based on anchorDate
    const { weekStart, weekEnd, weekDays } = getCalendarWeekBounds(anchorDate);

    // Collect all unique question_ids from insights.json
    const allQuestionIds = Array.from(new Set((insightsConfig as any[]).map((t) => t.questionId)));

    // Fetch responses within the week
    const responses = await fetchWeeklyResponses(req.patientId, allQuestionIds, weekStart, weekEnd);

    // Map into structured series per topic
    const series = mapResponsesToSeries(responses, weekDays);

    return {
        weekStart,
        weekEnd,
        series,
    };
};
