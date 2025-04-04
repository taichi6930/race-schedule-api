import 'reflect-metadata';

import type { Database } from 'better-sqlite3';

import { withDatabase } from '../src/utility/sqlite';

/**
 * データベースの初期化
 */
const initDatabase = async (): Promise<void> => {
    return new Promise<void>((resolve) => {
        console.log('データベースの初期化を開始します...');

        // サンプルのスケジュールデータ
        const schedulesSampleData = [
            {
                id: 'nar2025040427',
                location: '園田',
                type: 'nar',
                date_time: '2025-04-04T00:00:00.000Z',
            },
            {
                id: 'nar2025040528',
                location: '姫路',
                type: 'nar',
                date_time: '2025-04-05T00:00:00.000Z',
            },
            {
                id: 'nar2025040631',
                location: '高知',
                type: 'nar',
                date_time: '2025-04-06T00:00:00.000Z',
            },
        ];

        withDatabase((db: Database) => {
            // 古いテーブルの削除
            db.exec(`
                DROP TABLE IF EXISTS place_schedules;
            `);

            // テーブルの作成
            db.exec(`
                -- 開催スケジュール
                CREATE TABLE place_schedules (
                    id TEXT PRIMARY KEY,           -- 一意のID
                    location TEXT NOT NULL,        -- 場所名（例：園田）
                    type TEXT NOT NULL,            -- 種別（nar, jra, keirin, etc）
                    date_time TEXT NOT NULL,       -- 開催日時
                    created_at TEXT NOT NULL,      -- 作成日時
                    updated_at TEXT NOT NULL       -- 更新日時
                );
            `);

            console.log('テーブルを作成しました');

            const now = new Date().toISOString();

            // スケジュールデータの登録
            for (const schedule of schedulesSampleData) {
                db.prepare(
                    `INSERT INTO place_schedules (id, location, type, date_time, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?)`,
                ).run(
                    schedule.id,
                    schedule.location,
                    schedule.type,
                    schedule.date_time,
                    now,
                    now,
                );
            }

            console.log('スケジュールデータを登録しました');
            console.log('初期化が完了しました');
            resolve();
        });
    });
};

/**
 * メインの実行関数
 */
const main = async (): Promise<void> => {
    try {
        await initDatabase();
    } catch (error: unknown) {
        console.error('データベースの初期化に失敗しました:', error);
    }
};

// スクリプトの実行
void main();
