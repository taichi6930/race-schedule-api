import { existsSync, mkdirSync } from 'node:fs';

import Database from 'better-sqlite3';

import { DB_FOLDER, DB_PATH } from './constants';


export const setupDatabase = (): Database.Database => {
    try {
        ensureDatabaseFolder();
        return new Database(DB_PATH);
    } catch (error) {
        console.error('データベースの初期化中にエラーが発生しました:', error);
        throw error;
    }
};


const ensureDatabaseFolder = (): void => {
    if (!existsSync(DB_FOLDER)) {
        mkdirSync(DB_FOLDER, { recursive: true });
    }
};
