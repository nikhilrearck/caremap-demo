# CareMap Service Methods Documentation

## Table of Contents
- [Patient Snapshot Methods](#patient-snapshot-methods)
- [Medical Condition Methods](#medical-condition-methods)
- [Medical Equipment Methods](#medical-equipment-methods)
- [Notes & Best Practices](#notes--best-practices)

## Patient Snapshot Methods

### Get Patient Snapshot
Retrieves the latest health snapshot for a specific patient.

**Request:**
```typescript
getPatientSnapshot(patientId: number): Promise<PatientSnapshot | null>
```

**Parameters:**
- `patientId` (number, required): The ID of the patient

**Response:**
```typescript
{
    id: number;
    patient_id: number;
    summary: string;
    health_issues: string;
    created_at: string;    // ISO date string
    updated_at: string;    // ISO date string
}
```

**Example:**
```typescript
// Request
const snapshot = await getPatientSnapshot(123);

// Response
{
    id: 1,
    patient_id: 123,
    summary: "Patient is stable and responding well to treatment",
    health_issues: "Blood pressure normalized, mild joint pain persists",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T15:30:00Z"
}
```

### Update Patient Snapshot
Updates an existing patient snapshot.

**Request:**
```typescript
updatePatientSnapshot(
    snapshot: Partial<PatientSnapshot>,
    snapshotUpdate: Partial<PatientSnapshot>
): Promise<PatientSnapshot>
```

**Parameters:**
- `snapshot` (object, required): The fields to update
  - All fields are optional
- `snapshotUpdate` (object, required): The conditions to identify the snapshot to update

**Example:**
```typescript
// Request
const updatedSnapshot = await updatePatientSnapshot(
    {
        summary: "Updated health status",
        health_issues: "Blood pressure normal"
    },
    { patient_id: 123 }
);

// Response
{
    id: 1,
    patient_id: 123,
    summary: "Updated health status",
    health_issues: "Blood pressure normal",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-21T09:15:00Z"  // Automatically updated
}
```

## Medical Condition Methods

### Create Medical Condition
Creates a new medical condition record for a patient.

**Request:**
```typescript
createMedicalCondition(condition: Partial<MedicalCondition>): Promise<MedicalCondition>
```

**Parameters:**
- `condition` (object, required):
  - `patient_id` (number, required): The ID of the patient
  - `condition_name` (string, required): Name of the condition
  - `diagnosed_at` (string, optional): ISO date string of diagnosis
  - `linked_health_system` (boolean, optional): Default false

**Example:**
```typescript
// Request
const newCondition = await createMedicalCondition({
    patient_id: 123,
    condition_name: "Type 2 Diabetes",
    diagnosed_at: "2024-01-15T10:00:00Z",
    linked_health_system: true
});

// Response
{
    id: 1,
    patient_id: 123,
    condition_name: "Type 2 Diabetes",
    diagnosed_at: "2024-01-15T10:00:00Z",
    linked_health_system: true,
    created_at: "2024-01-21T09:15:00Z",
    updated_at: "2024-01-21T09:15:00Z"
}
```

### Get Medical Condition
Retrieves a specific medical condition by ID.

**Request:**
```typescript
getMedicalCondition(id: number): Promise<MedicalCondition | null>
```

**Parameters:**
- `id` (number, required): The ID of the medical condition

**Example:**
```typescript
// Request
const condition = await getMedicalCondition(1);

// Response
{
    id: 1,
    patient_id: 123,
    condition_name: "Type 2 Diabetes",
    diagnosed_at: "2024-01-15T10:00:00Z",
    linked_health_system: true,
    created_at: "2024-01-21T09:15:00Z",
    updated_at: "2024-01-21T09:15:00Z"
}
```

### Get Medical Conditions By Patient
Retrieves all medical conditions for a specific patient.

**Request:**
```typescript
getMedicalConditionsByPatient(patientId: number): Promise<MedicalCondition[]>
```

**Parameters:**
- `patientId` (number, required): The ID of the patient

**Example:**
```typescript
// Request
const conditions = await getMedicalConditionsByPatient(123);

// Response
[
    {
        id: 1,
        patient_id: 123,
        condition_name: "Type 2 Diabetes",
        diagnosed_at: "2024-01-15T10:00:00Z",
        linked_health_system: true,
        created_at: "2024-01-21T09:15:00Z",
        updated_at: "2024-01-21T09:15:00Z"
    },
    // ... more conditions
]
```

### Update Medical Condition
Updates an existing medical condition.

**Request:**
```typescript
updateMedicalCondition(
    condition: Partial<MedicalCondition>,
    conditionUpdate: Partial<MedicalCondition>
): Promise<MedicalCondition>
```

**Parameters:**
- `condition` (object, required): The fields to update
- `conditionUpdate` (object, required): The conditions to identify the condition to update

**Example:**
```typescript
// Request
const updated = await updateMedicalCondition(
    {
        condition_name: "Type 2 Diabetes - Controlled",
        linked_health_system: false
    },
    { id: 1 }
);

// Response
{
    id: 1,
    patient_id: 123,
    condition_name: "Type 2 Diabetes - Controlled",
    diagnosed_at: "2024-01-15T10:00:00Z",
    linked_health_system: false,
    created_at: "2024-01-21T09:15:00Z",
    updated_at: "2024-01-21T10:30:00Z"  // Automatically updated
}
```

### Delete Medical Condition
Deletes a medical condition record.

**Request:**
```typescript
deleteMedicalCondition(id: number): Promise<void>
```

**Parameters:**
- `id` (number, required): The ID of the medical condition to delete

**Example:**
```typescript
// Request
await deleteMedicalCondition(1);

// Response
// No response body (void)
```


## Medical Equipment Methods

### Create Medical Equipment
Creates a new medical equipment record for a patient.

**Request:**
```typescript
createMedicalEquipment(equipment: Partial<MedicalEquipment>): Promise<MedicalEquipment>
```

**Parameters:**
- `equipment` (object, required):
  - `patient_id` (number, required): The ID of the patient
  - `equipment_name` (string, required): Name of the equipment
  - `description` (string, optional): Description of the equipment
  - `linked_health_system` (boolean, optional): Default false

**Example:**
```typescript
// Request
const newEquipment = await createMedicalEquipment({
    patient_id: 123,
    equipment_name: "Glucose Monitor",
    description: "Continuous glucose monitoring system",
    linked_health_system: true
});

// Response
{
    id: 1,
    patient_id: 123,
    equipment_name: "Glucose Monitor",
    description: "Continuous glucose monitoring system",
    linked_health_system: true,
    created_at: "2024-01-21T09:15:00Z",
    updated_at: "2024-01-21T09:15:00Z"
}
```

### Get Medical Equipment
Retrieves a specific medical equipment by ID.

**Request:**
```typescript
getMedicalEquipment(id: number): Promise<MedicalEquipment | null>
```

**Parameters:**
- `id` (number, required): The ID of the medical equipment

**Example:**
```typescript
// Request
const equipment = await getMedicalEquipment(1);

// Response
{
    id: 1,
    patient_id: 123,
    equipment_name: "Glucose Monitor",
    description: "Continuous glucose monitoring system",
    linked_health_system: true,
    created_at: "2024-01-21T09:15:00Z",
    updated_at: "2024-01-21T09:15:00Z"
}
```

### Get Medical Equipment By Patient
Retrieves all medical equipment for a specific patient.

**Request:**
```typescript
getMedicalEquipmentByPatient(patientId: number): Promise<MedicalEquipment[]>
```

**Parameters:**
- `patientId` (number, required): The ID of the patient

**Example:**
```typescript
// Request
const equipment = await getMedicalEquipmentByPatient(123);

// Response
[
    {
        id: 1,
        patient_id: 123,
        equipment_name: "Glucose Monitor",
        description: "Continuous glucose monitoring system",
        linked_health_system: true,
        created_at: "2024-01-21T09:15:00Z",
        updated_at: "2024-01-21T09:15:00Z"
    },
    // ... more equipment
]
```

### Update Medical Equipment
Updates an existing medical equipment record.

**Request:**
```typescript
updateMedicalEquipment(
    equipment: Partial<MedicalEquipment>,
    equipmentUpdate: Partial<MedicalEquipment>
): Promise<MedicalEquipment>
```

**Parameters:**
- `equipment` (object, required): The fields to update
- `equipmentUpdate` (object, required): The conditions to identify the equipment to update

**Example:**
```typescript
// Request
const updated = await updateMedicalEquipment(
    {
        description: "Updated monitoring system with alerts",
        linked_health_system: true
    },
    { id: 1 }
);

// Response
{
    id: 1,
    patient_id: 123,
    equipment_name: "Glucose Monitor",
    description: "Updated monitoring system with alerts",
    linked_health_system: true,
    created_at: "2024-01-21T09:15:00Z",
    updated_at: "2024-01-21T11:45:00Z"  // Automatically updated
}
```

### Delete Medical Equipment
Deletes a medical equipment record.

**Request:**
```typescript
deleteMedicalEquipment(id: number): Promise<void>
```

**Parameters:**
- `id` (number, required): The ID of the medical equipment to delete

**Example:**
```typescript
// Request
await deleteMedicalEquipment(1);

// Response
// No response body (void)
```

## Notes & Best Practices

### Timestamps
- All timestamps (`created_at`, `updated_at`, `diagnosed_at`) must be in ISO 8601 format
- `updated_at` is automatically set on all update operations
- `created_at` is automatically set on creation
- If `diagnosed_at` is not provided for medical conditions, it defaults to `created_at`

### Data Types
- Boolean fields (`linked_health_system`) are stored as INTEGER (0/1) in SQLite but exposed as boolean in TypeScript
- All IDs are auto-generated integers
- Text fields have no length limit (SQLite dynamic typing)

### Error Handling
- All methods may throw errors that should be handled by the caller
- Common error scenarios:
  - Invalid patient_id (foreign key constraint)
  - Invalid ID for update/delete operations
  - Network/database connection issues
  - Invalid data types

### Best Practices
1. Always handle the null case for get operations
2. Use try-catch blocks for error handling
3. Validate data before sending to the service methods
4. Check foreign key constraints before creating records
5. Use typescript types for better type safety

### Database Constraints
- Foreign key constraints are enforced
- `patient_id` must exist in patients table
- Required fields cannot be null
- IDs are unique and auto-incrementing

### Performance Considerations
- Use `getByPatient` methods for bulk retrieval
- Consider pagination for large datasets
- Index queries use primary keys for optimal performance 