import { useDB } from '@/services/database/db';
import { User } from '@/services/database/migrations/v1/schema_v1';
import { UserModel } from '@/services/database/models/UserModel';
import { logger } from '@/services/logging/logger';

// Single shared instance of UserModel
const userModel = new UserModel();

// Runs a callback with a UserModel instance that is lazily initialized with the database.
async function useUserModel<T>(fn: (model: UserModel) => Promise<T>): Promise<T> {
    return useDB(async (db) => {
        if (!userModel['db']) {
            userModel.setDB(db);
        }
        return fn(userModel);
    });
}

export const isExistingUser = async (user: User): Promise<boolean> => {
    const existingUser = await getUser(user.email);
    if (existingUser) {
        return true;
    }
    return false;
}

export const createUser = async (newUser: User): Promise<User> => {
    return useUserModel(async (model) => {
        let user = newUser;
        const userExists = await isExistingUser(newUser);
        if (!userExists) {
            user = await model.insert(newUser);
            logger.debug(`User saved to DB successfully`, `${newUser.email}`);
        }
        return user;
    });
}

export const getUser = async (email: string): Promise<User | null> => {
    return useUserModel(async (model) => {
        const result = await model.getFirstByFields({ email: email });
        logger.debug("User stored in DB: ", result);
        return result;
    });
}

export const updateUser = async (user: Partial<User>, conditions: Partial<User>): Promise<User> => {
    return useUserModel(async (model) => {
        let updatedUser;
        updatedUser = await model.updateByFields(user, conditions);
        logger.debug("Updated DB User data: ", `${updatedUser}`);
        return updatedUser;
    });
}

export const getAllUsers = async (): Promise<User[]> => {
    return useUserModel(async () => {
        return await userModel.getAll();
    });
}
