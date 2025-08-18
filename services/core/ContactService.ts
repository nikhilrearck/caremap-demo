import { Contact } from '@/services/database/migrations/v1/schema_v1';
import { ContactModel } from '@/services/database/models/ContactModel';
import { logger } from '@/services/logging/logger';
import { getCurrentTimestamp } from '@/services/core/utils';
import { useModel } from '@/services/database/BaseModel';
import { getPatientByUserId } from '@/services/core/PatientService';

// Single shared instance of model
const contactModel = new ContactModel();

export const isExistingContact = async (id: number): Promise<boolean> => {
    const existingContact = await getContact(id);
    return !!existingContact;
}

export const isPhoneNumberExists = async (phoneNumber: string, excludeId?: number): Promise<boolean> => {
    return useModel(contactModel, async (model) => {
        const whereClause: any = { phone_number: phoneNumber };
        if (excludeId) {
            whereClause.id = { $ne: excludeId };
        }
        const existingContact = await model.getFirstByFields(whereClause);
        return !!existingContact;
    });
}

export const isEmailExists = async (email: string, excludeId?: number): Promise<boolean> => {
    return useModel(contactModel, async (model) => {
        const whereClause: any = { email: email };
        if (excludeId) {
            whereClause.id = { $ne: excludeId };
        }
        const existingContact = await model.getFirstByFields(whereClause);
        return !!existingContact;
    });
}

export const createContact = async (contact: Partial<Contact>, userId: string): Promise<Contact | null> => {
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

            // Check for duplicate phone number
            if (await isPhoneNumberExists(contact.phone_number)) {
                logger.debug("Cannot create contact: Phone number already exists");
                throw new Error("Phone number already exists");
            }

            // Check for duplicate email if provided
            if (contact.email && await isEmailExists(contact.email)) {
                logger.debug("Cannot create contact: Email already exists");
                throw new Error("Email already exists");
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
            
            return created;
        } catch (error) {
            logger.debug("Error creating contact:", error);
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

export const getContactsByPatientId = async (patientId: number): Promise<Contact[]> => {
    return useModel(contactModel, async (model) => {
        const results = await model.getByFields({ patient_id: patientId });
        logger.debug("DB Contacts for patient: ", results);
        return results;
    });
}

export const updateContact = async (contactUpdate: Partial<Contact>, whereMap: Partial<Contact>): Promise<Contact | null> => {
    return useModel(contactModel, async (model) => {
        const existingContact = await model.getFirstByFields(whereMap);
        if (!existingContact) {
            logger.debug("Contact not found for update: ", whereMap);
            return null;
        }

        // Check for duplicate phone number if being updated
        if (contactUpdate.phone_number && contactUpdate.phone_number !== existingContact.phone_number) {
            if (await isPhoneNumberExists(contactUpdate.phone_number, existingContact.id)) {
                logger.debug("Cannot update contact: Phone number already exists");
                throw new Error("Phone number already exists");
            }
        }

        // Check for duplicate email if being updated
        if (contactUpdate.email && contactUpdate.email !== existingContact.email) {
            if (await isEmailExists(contactUpdate.email, existingContact.id)) {
                logger.debug("Cannot update contact: Email already exists");
                throw new Error("Email already exists");
            }
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
        if (!(await isExistingContact(id))) {
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
            logger.debug("Error fetching contacts", error);
            return [];
        }
    });
} 