export const sampleTrackCategories = [
  { id: 1, name: 'Health & Wellness' },
  { id: 2, name: 'Fitness Tracking' },
  { id: 3, name: 'Nutrition' },
];

export const sampleTrackItems = [
  // Health & Wellness
  { id: 1, category_id: 1, name: 'Daily Water Intake' },
  { id: 2, category_id: 1, name: 'Morning Mood' },
  // Fitness Tracking
  { id: 3, category_id: 2, name: 'Exercise Routine' },
  // Nutrition
  { id: 4, category_id: 3, name: 'Meal Quality' },
];

export const sampleQuestions = [
  // Daily Water Intake
  {
    id: 1,
    item_id: 1,
    text: 'How many glasses of water did you drink today?',
    type: 'numeric',
    required: true,
  },
  // Morning Mood
  {
    id: 2,
    item_id: 2,
    text: 'How did you feel this morning?',
    type: 'mcq',
    required: true,
  },
  // Exercise Routine
  {
    id: 3,
    item_id: 3,
    text: 'Did you exercise today?',
    type: 'boolean',
    required: true,
  },
  {
    id: 4,
    item_id: 3,
    text: 'What type of exercises did you do?',
    type: 'msq',
    required: false,
  },
  // Meal Quality
  {
    id: 5,
    item_id: 4,
    text: 'How would you rate your meals today?',
    type: 'mcq',
    required: true,
  },
  {
    id: 6,
    item_id: 4,
    text: 'Any food sensitivities or issues?',
    type: 'text',
    required: false,
  },
];

export const sampleResponseOptions = [
  // Morning Mood (MCQ)
  { id: 1, question_id: 2, text: 'Happy' },
  { id: 2, question_id: 2, text: 'Sad' },
  { id: 3, question_id: 2, text: 'Neutral' },
  { id: 4, question_id: 2, text: 'Anxious' },
  // Exercise Routine (MSQ)
  { id: 5, question_id: 4, text: 'Cardio' },
  { id: 6, question_id: 4, text: 'Strength' },
  { id: 7, question_id: 4, text: 'Yoga' },
  { id: 8, question_id: 4, text: 'Stretching' },
  // Meal Quality (MCQ)
  { id: 9, question_id: 5, text: 'Healthy' },
  { id: 10, question_id: 5, text: 'Moderate' },
  { id: 11, question_id: 5, text: 'Unhealthy' },
];