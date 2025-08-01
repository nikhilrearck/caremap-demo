import { Contact } from '@/services/database/migrations/v1/schema_v1';
import { ContactModel } from '@/services/database/models/ContactModel';
import { logger } from '@/services/logging/logger';
import { getCurrentTimestamp } from '@/services/core/utils';
import { useModel } from '@/services/database/BaseModel';
import { getPatientByUserId } from './PatientService';

// Single shared instance of model
const contactModel = new ContactModel();

// Initialize contact table if it doesn't exist
export const initializeContactTable = async (): Promise<void> => {
    return useModel(contactModel, async (model) => {
        try {
            // Try to create the table - this will fail silently if it already exists
            await model.run(`
                CREATE TABLE IF NOT EXISTS CONTACT (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    patient_id INTEGER NOT NULL,
                    first_name TEXT NOT NULL,
                    last_name TEXT NOT NULL,
                    relationship TEXT NOT NULL,
                    phone_number TEXT NOT NULL,
                    description TEXT,
                    email TEXT,
                    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (patient_id) REFERENCES PATIENT(id) ON DELETE CASCADE
                )
            `);
            logger.debug("Contact table initialized successfully");
        } catch (error) {
            logger.debug("Contact table initialization error:", error);
        }
    });
};

export const createContact = async (contact: Omit<Contact, 'id' | 'patient_id' | 'created_date' | 'updated_date'>, userId: string): Promise<Contact | null> => {
    return useModel(contactModel, async (model) => {
        try {
            // Get the current patient for this user
            const patient = await getPatientByUserId(userId);
            if (!patient) {
                logger.debug("Cannot create contact: Patient not found for user");
                return null;
            }

            if (!contact.first_name || !contact.last_name || !contact.relationship || !contact.phone_number) {
                logger.debug("Cannot create contact: Required fields missing");
                return null;
            }

            const now = getCurrentTimestamp();
            const newContact = {
                ...contact,
                patient_id: patient.id,
                created_date: now,
                updated_date: now
            };

            const created = await model.insert(newContact);
            logger.debug("Contact created: ", created);
            
            // If we got a raw SQLite result instead of a contact object, fetch the contact
            if (created && !created.id && created.lastInsertRowId) {
                return getContactById(created.lastInsertRowId);
            }
            
            return created;
        } catch (error) {
            logger.debug("Error creating contact, table may not exist:", error);
            return null;
        }
    });
}

export const getContact = async (id: number): Promise<Contact | null> => {
    return useModel(contactModel, async (model) => {
        const result = await model.getFirstByFields({ id });
        logger.debug("DB Contact data: ", result);
        return result;
    });
}

export const getContactById = async (id: number): Promise<Contact | null> => {
    return getContact(id);
}

export const updateContact = async (contactUpdate: Partial<Contact>, whereMap: Partial<Contact>): Promise<Contact | null> => {
    return useModel(contactModel, async (model) => {
        const existingContact = await model.getFirstByFields(whereMap);
        if (!existingContact) {
            logger.debug("Contact not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...contactUpdate,
            updated_date: getCurrentTimestamp()
        };
        const updatedContact = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated Contact: ", updatedContact);
        return updatedContact;
    });
}

export const deleteContact = async (id: number): Promise<boolean> => {
    return useModel(contactModel, async (model) => {
        const existingContact = await getContact(id);
        if (!existingContact) {
            logger.debug("Contact not found for deletion: ", id);
            return false;
        }

        await model.deleteByFields({ id });
        logger.debug("Deleted Contact: ", id);
        return true;
    });
}

export const getAllContacts = async (userId: string): Promise<Contact[]> => {
    return useModel(contactModel, async (model) => {
        try {
            // Get the current patient for this user
            const patient = await getPatientByUserId(userId);
            if (!patient) {
                return [];
            }

            return await model.getByFields({ patient_id: patient.id });
        } catch (error) {
            // If table doesn't exist, return empty array (fallback to sample data in UI)
            logger.debug("Error fetching contacts, table may not exist:", error);
            return [];
        }
    });
} 