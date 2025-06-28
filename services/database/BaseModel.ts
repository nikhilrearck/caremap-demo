import { logger } from '@/services/logging/logger';
import { SQLiteBindParams, SQLiteDatabase } from 'expo-sqlite';

export abstract class BaseModel<T> {

    protected db!: SQLiteDatabase;
    protected tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    setDB(db: SQLiteDatabase) {
        this.db = db;
    }

    // Wrapper method to run any SQL query safely inside a transaction using prepared statements
    protected async run(sql: string, params: any[] = []) {
        logger.debug("SQL: ", sql);
        logger.debug("Params: ", params);
        let result: any;
        await this.db.withTransactionAsync(async () => {
            const stmt = await this.db.prepareAsync(sql);
            try {
                result = await stmt.executeAsync(...params); // store the result
            }
            finally {
                await stmt.finalizeAsync(); // always finalize the statement
            }
        });

        return result;
    }

    async getAll(): Promise<T[]> {
        const sql = `SELECT * FROM ${this.tableName};`;
        logger.debug("SQL: ", sql);
        const result = await this.db.getAllAsync<T>(sql);
        logger.debug("Result: ", result.toString());
        return result;
    }

    async getFirstByFields(fields: Partial<T>): Promise<T | null> {
        if (!this.db) throw new Error('DB instance not set in BaseModel');

        // Filter out undefined fields to prevent SQLite errors
        const entries = Object.entries(fields).filter(([_, value]) => value !== undefined);
        const keys = entries.map(([key]) => key);
        const values = entries.map(([_, value]) => value) as SQLiteBindParams;

        if (keys.length === 0) return null;

        const conditions = keys.map((key) => `${key} = ?`).join(' AND ');
        const sql = `SELECT * FROM ${this.tableName} WHERE ${conditions} LIMIT 1`;

        const result = await this.db.getFirstAsync<T>(sql, values);
        return result ?? null;
    }

    async getByFields(fields: Partial<T>): Promise<T[]> {
        const keys = Object.keys(fields);
        const values = Object.values(fields);
        if (keys.length === 0) return [];
        const conditions = keys.map((key) => `${key} = ?`).join(' AND ');
        const sql = `SELECT * FROM ${this.tableName} WHERE ${conditions}`;
        const result = await this.run(sql, values);
        return result;
    }

    async insert(data: Partial<T>): Promise<any> {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map(() => '?').join(',');
        logger.debug(`Data: `, data);

        const sql = `INSERT INTO ${this.tableName} (${keys.join(',')}) VALUES (${placeholders})`;
        let result = await this.run(sql, values);
        return result.lastID;
    }

    async insertAll(data: Partial<T>[]): Promise<any> {
        if (data.length === 0) return;

        const keys = Object.keys(data[0]);
        const placeholders = `(${keys.map(() => '?').join(',')})`;
        const allPlaceholders = data.map(() => placeholders).join(', ');
        const values = data.flatMap(row => keys.map(key => row[key as keyof T]));

        const sql = `INSERT INTO ${this.tableName} (${keys.join(',')}) VALUES ${allPlaceholders};`;
        let result = await this.run(sql, values);
        return result;
    }

    async updateByFields(
        data: Partial<T>,         // fields to update
        conditions: Partial<T>    // where clause conditions
    ): Promise<any> {
        const setKeys = Object.keys(data);
        const setValues = Object.values(data);
        const setClause = setKeys.map(key => `${key} = ?`).join(', ');

        const whereKeys = Object.keys(conditions);
        const whereValues = Object.values(conditions);
        const whereClause = whereKeys.map(key => `${key} = ?`).join(' AND ');

        if (!setKeys.length || !whereKeys.length) {
            throw new Error("Update failed: missing update fields or conditions.");
        }

        const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE ${whereClause}`;
        const values = [...setValues, ...whereValues];

        let result = await this.run(sql, values);
        return result;
    }

    async deleteByFields(where: Partial<T>): Promise<void> {
        const keys = Object.keys(where);
        const values = Object.values(where);

        if (keys.length === 0) return;

        const whereClause = keys.map((key) => `${key} = ?`).join(' AND ');
        const sql = `DELETE FROM ${this.tableName} WHERE ${whereClause}`;

        await this.run(sql, values);
    }

}