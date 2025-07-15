# CareMap Service Layer Documentation

## Table of Contents
- [Overview](#overview)
- [Common Patterns](#common-patterns)
- [Services](#services)
  - [Patient Snapshot Service](#patient-snapshot-service)
  - [Patient Condition Service](#patient-condition-service)
  - [Patient Equipment Service](#patient-equipment-service)
  - [Patient Goal Service](#patient-goal-service)
  - [Patient Emergency Care Service](#patient-emergency-care-service)
  - [Patient Allergy Service](#patient-allergy-service)
  - [Patient Medication Service](#patient-medication-service)
  - [Patient Note Service](#patient-note-service)
- [Best Practices](#best-practices)

## Overview

The CareMap service layer provides a comprehensive API for managing patient health data. Each service follows consistent patterns for CRUD operations while handling specific data requirements for different health aspects.

## Common Patterns

All services follow these common patterns:

### Method Naming Convention
- `create[Entity]`: Creates a new record
- `get[Entity]`: Retrieves a single record by ID
- `get[Entity]ByPatientId`: Retrieves all records for a patient
- `update[Entity]`: Updates an existing record
- `delete[Entity]`: Deletes a record

### Common Parameters
- `patientId`: number (required) - The unique identifier for a patient
- `id`: number (required) - The unique identifier for a record
- `linked_health_system`: boolean - Indicates if the record is linked to an external health system
- `created_date`: Date - Automatically set on creation
- `updated_date`: Date - Automatically updated on modifications

### Response Format
All responses follow a consistent structure:
```typescript
{
    id: number;
    patient_id: number;
    linked_health_system?: boolean;
    created_date: Date;
    updated_date: Date;
    // Entity-specific fields...
}
```

## Services

### Patient Snapshot Service

Manages overall patient health snapshots.

#### Methods

```typescript
getPatientSnapshot(patientId: number): Promise<PatientSnapshot | null>
```
Returns the latest health snapshot for a patient.

**Response:**
```typescript
{
    id: number;
    patient_id: number;
    patient_overview: string;
    health_issues: string;
    created_date: Date;
    updated_date: Date;
}
```

**Example:**
```typescript
const snapshot = await getPatientSnapshot(123);
// {
//     id: 1,
//     patient_id: 123,
//     patient_overview: "Patient is stable and responding well to treatment",
//     health_issues: "Blood pressure normalized, mild joint pain persists",
//     created_date: "2024-01-15T10:00:00Z",
//     updated_date: "2024-01-20T15:30:00Z"
// }
```

### Patient Condition Service

Manages patient medical conditions.

#### Methods

```typescript
createPatientCondition(condition: Partial<PatientCondition>): Promise<PatientCondition>
getPatientCondition(id: number): Promise<PatientCondition | null>
getPatientConditionsByPatientId(patientId: number): Promise<PatientCondition[]>
updatePatientCondition(condition: Partial<PatientCondition>): Promise<PatientCondition>
deletePatientCondition(id: number): Promise<void>
```

**Data Structure:**
```typescript
{
    id: number;
    patient_id: number;
    condition_name: string;
    linked_health_system: boolean;
    created_date: Date;
    updated_date: Date;
}
```

### Patient Equipment Service

Manages patient medical equipment.

#### Methods

```typescript
createPatientEquipment(equipment: Partial<PatientEquipment>): Promise<PatientEquipment>
getPatientEquipment(id: number): Promise<PatientEquipment | null>
getPatientEquipmentByPatientId(patientId: number): Promise<PatientEquipment[]>
updatePatientEquipment(equipment: Partial<PatientEquipment>): Promise<PatientEquipment>
deletePatientEquipment(id: number): Promise<void>
```

**Data Structure:**
```typescript
{
    id: number;
    patient_id: number;
    equipment_name: string;
    equipment_description?: string;
    linked_health_system: boolean;
    created_date: Date;
    updated_date: Date;
}
```

### Patient Goal Service

Manages patient health goals.

#### Methods

```typescript
createPatientGoal(goal: Partial<PatientGoal>): Promise<PatientGoal>
getPatientGoal(id: number): Promise<PatientGoal | null>
getPatientGoalsByPatientId(patientId: number): Promise<PatientGoal[]>
updatePatientGoal(goal: Partial<PatientGoal>): Promise<PatientGoal>
deletePatientGoal(id: number): Promise<void>
```

**Data Structure:**
```typescript
{
    id: number;
    patient_id: number;
    goal_description: string;
    target_date?: Date;
    status?: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
    linked_health_system: boolean;
    created_date: Date;
    updated_date: Date;
}
```

### Patient Emergency Care Service

Manages patient emergency care information.

#### Methods

```typescript
createPatientEmergencyCare(care: Partial<PatientEmergencyCare>): Promise<PatientEmergencyCare>
getPatientEmergencyCare(id: number): Promise<PatientEmergencyCare | null>
getPatientEmergencyCareByPatientId(patientId: number): Promise<PatientEmergencyCare[]>
updatePatientEmergencyCare(care: Partial<PatientEmergencyCare>): Promise<PatientEmergencyCare>
deletePatientEmergencyCare(id: number): Promise<void>
```

**Data Structure:**
```typescript
{
    id: number;
    patient_id: number;
    topic: string;
    details?: string;
    linked_health_system: boolean;
    created_date: Date;
    updated_date: Date;
}
```

### Patient Allergy Service

Manages patient allergies.

#### Methods

```typescript
createPatientAllergy(allergy: Partial<PatientAllergy>): Promise<PatientAllergy>
getPatientAllergy(id: number): Promise<PatientAllergy | null>
getPatientAllergiesByPatientId(patientId: number): Promise<PatientAllergy[]>
updatePatientAllergy(allergy: Partial<PatientAllergy>): Promise<PatientAllergy>
deletePatientAllergy(id: number): Promise<void>
```

**Data Structure:**
```typescript
{
    id: number;
    patient_id: number;
    topic: string;
    details?: string;
    severity?: 'Mild' | 'Moderate' | 'Severe';
    onset_date: Date;
    linked_health_system: boolean;
    created_date: Date;
    updated_date: Date;
}
```

### Patient Medication Service

Manages patient medications.

#### Methods

```typescript
createPatientMedication(medication: Partial<PatientMedication>): Promise<PatientMedication>
getPatientMedication(id: number): Promise<PatientMedication | null>
getPatientMedicationsByPatientId(patientId: number): Promise<PatientMedication[]>
updatePatientMedication(medication: Partial<PatientMedication>): Promise<PatientMedication>
deletePatientMedication(id: number): Promise<void>
```

**Data Structure:**
```typescript
{
    id: number;
    patient_id: number;
    name: string;
    details: string;
    linked_health_system: boolean;
    created_date: Date;
    updated_date: Date;
}
```

### Patient Note Service

Manages patient notes.

#### Methods

```typescript
createPatientNote(note: Partial<PatientNote>): Promise<PatientNote>
getPatientNote(id: number): Promise<PatientNote | null>
getPatientNotesByPatientId(patientId: number): Promise<PatientNote[]>
updatePatientNote(note: Partial<PatientNote>): Promise<PatientNote>
deletePatientNote(id: number): Promise<void>
```

**Data Structure:**
```typescript
{
    id: number;
    patient_id: number;
    topic: string;
    details?: string;
    reminder_date?: Date;
    created_date: Date;
    updated_date: Date;
}
```

## Best Practices

### Error Handling
- Always wrap service calls in try-catch blocks
- Handle null responses from get operations
- Validate required fields before making service calls
- Check foreign key constraints (patient_id must exist)

### Data Validation
- Ensure dates are in ISO format
- Validate enum values (e.g., severity, status)
- Check string length and content where appropriate
- Validate numeric values are positive

### Performance
- Use getByPatientId for bulk retrieval
- Consider pagination for large datasets
- Cache frequently accessed data
- Use transactions for multiple operations

### Security
- Validate patient access permissions
- Sanitize input data
- Handle sensitive health information appropriately
- Log access to sensitive records

### Database
- Foreign key constraints are enforced
- Indexes are available on common query fields
- Automatic timestamp handling
- SQLite-specific considerations documented 