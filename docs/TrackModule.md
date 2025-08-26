# Track Module Documentation

## Overview

The Track Module is a comprehensive health and wellness tracking system that allows users to monitor various health metrics through categorized items, questions, and responses. It provides a flexible, data-driven approach to health tracking with support for multiple question types and response formats.

## Architecture

### Data Structure

```
TrackCategory
├── TrackItem
    ├── Question
        └── ResponseOption (for MCQ/MSQ)
    └── TrackItemEntry (patient-specific tracking)
        └── TrackResponse (patient answers)
```

### Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `TRACK_CATEGORY` | Health categories | `id`, `name` |
| `TRACK_ITEM` | Trackable items | `id`, `category_id`, `name` |
| `QUESTION` | Questions for items | `id`, `item_id`, `text`, `type` |
| `RESPONSE_OPTION` | MCQ/MSQ options | `id`, `question_id`, `text` |
| `TRACK_ITEM_ENTRY` | Patient tracking entries | `id`, `patient_id`, `track_item_id`, `date` |
| `TRACK_RESPONSE` | Patient answers | `id`, `track_item_entry_id`, `question_id`, `answer` |

## API Methods

### 1. `getTrackCategoriesWithItemsAndProgress(patientId, date)`

**Purpose:** Fetches all categories with their items and tracking progress for a specific patient and date.

**Returns:** `TrackCategoryWithItems[]`

**Features:**
- Shows all available categories and items
- Indicates which items are being tracked (`started`)
- Shows progress tracking (`completed`, `total`)
- Uses optimized SQL join for efficient data retrieval

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Health & Wellness",
    "items": [
      {
        "item": {
          "id": 1,
          "category_id": 1,
          "name": "Daily Water Intake",
          "created_date": "2024-01-01T00:00:00.000Z",
          "updated_date": "2024-01-01T00:00:00.000Z"
        },
        "completed": 0,
        "total": 0,
        "started": true
      }
    ]
  }
]
```

### 2. `addTrackItemForDate(patientId, itemId, date)`

**Purpose:** Links a track item to a patient for a specific date.

**Returns:** `number` (entry ID)

**Features:**
- Creates a `TrackItemEntry` record
- Prevents duplicate entries for same patient/item/date
- Returns the entry ID for subsequent operations

### 3. `getQuestionsWithOptions(itemId)`

**Purpose:** Fetches all questions for a track item with their response options.

**Returns:** `QuestionWithOptions[]`

**Question Types Supported:**
- `numeric`: Number input
- `boolean`: Yes/No
- `mcq`: Single choice
- `msq`: Multiple choice
- `text`: Free text

**Example Response:**
```json
[
  {
    "question": {
      "id": 1,
      "item_id": 1,
      "text": "How many glasses of water did you drink today?",
      "type": "numeric",
      "required": true
    },
    "options": [],
    "existingResponse": null
  },
  {
    "question": {
      "id": 2,
      "item_id": 2,
      "text": "How did you feel this morning?",
      "type": "mcq",
      "required": true
    },
    "options": [
      {"id": 1, "text": "Happy"},
      {"id": 2, "text": "Sad"}
    ],
    "existingResponse": null
  }
]
```

### 4. `saveResponse(entryId, questionId, answer)`

**Purpose:** Saves or updates a patient's response to a question.

**Parameters:**
- `entryId`: Track item entry ID
- `questionId`: Question ID
- `answer`: Response data (any type, stored as JSON)

**Features:**
- Updates existing responses or creates new ones
- Stores answers as JSON strings
- Handles all question types

### 5. `addOptionToQuestion(questionId, label)`

**Purpose:** Dynamically adds a new response option to an MCQ/MSQ question.

**Returns:** `number` (new option ID)

**Use Case:** Allows users to add custom options during tracking.

## Data Flow

### 1. Initial Load
```
User opens Track screen
↓
getTrackCategoriesWithItemsAndProgress()
↓
Display categories with items and progress
```

### 2. Start Tracking
```
User selects item to track
↓
addTrackItemForDate()
↓
getQuestionsWithOptions()
↓
Display questions for user to answer
```

### 3. Answer Questions
```
User answers questions
↓
saveResponse() for each question
↓
Update progress display
```
