import { existsSync, mkdirSync } from 'node:fs';

import Database from 'better-sqlite3';

import { DB_FOLDER, DB_PATH } from './constants';

/**
 * データベースの初期設定を行う
 * @returns データベースインスタンス
 * @throws Error データベースの初期化に失敗した場合
 */
export const setupDatabase = (): Database.Database => {
    try {
        ensureDatabaseFolder();
        return new Database(DB_PATH);
    } catch (error) {
        console.error('データベースの初期化中にエラーが発生しました:', error);
        throw error;
    }
};

/**
 * データベースフォルダの存在確認と作成
 * @throws Error フォルダの作成に失敗した場合
 */
const ensureDatabaseFolder = (): void => {
    if (!existsSync(DB_FOLDER)) {
        mkdirSync(DB_FOLDER, { recursive: true });
    }
};
