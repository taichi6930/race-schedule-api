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
                id: 'schedule_1',
                name: '園田',
                type: 'nar',
                prefecture: '兵庫県',
                date_time: '2025-04-04T10:00:00.000Z',
                event_type: 'regular',
            },
            {
                id: 'schedule_2',
                name: '姫路',
                type: 'nar',
                prefecture: '兵庫県',
                date_time: '2025-04-05T10:00:00.000Z',
                event_type: 'regular',
            },
            {
                id: 'schedule_3',
                name: '高知',
                type: 'nar',
                prefecture: '高知県',
                date_time: '2025-04-06T10:00:00.000Z',
                event_type: 'regular',
            },
        ];

        withDatabase((db: Database) => {
            // 古いテーブルの削除
            db.exec(`
                DROP TABLE IF EXISTS places;
                DROP TABLE IF EXISTS races;
                DROP TABLE IF EXISTS place_schedules;
                DROP TABLE IF EXISTS place_masters;
            `);

            // テーブルの作成
            db.exec(`
                -- 開催スケジュール
                CREATE TABLE place_schedules (
                    id TEXT PRIMARY KEY,           -- 一意のID
                    name TEXT NOT NULL,            -- 場所名（例：園田）
                    type TEXT NOT NULL,            -- 種別（nar, jra, keirin, etc）
                    prefecture TEXT NOT NULL,       -- 都道府県
                    date_time TEXT NOT NULL,       -- 開催日時
                    event_type TEXT NOT NULL,      -- イベントタイプ（通常開催/特別開催など）
                    created_at TEXT NOT NULL,      -- 作成日時
                    updated_at TEXT NOT NULL       -- 更新日時
                );
            `);

            console.log('テーブルを作成しました');

            const now = new Date().toISOString();

            // スケジュールデータの登録
            for (const schedule of schedulesSampleData) {
                db.prepare(
                    `INSERT INTO place_schedules (id, name, type, prefecture, date_time, event_type, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                ).run(
                    schedule.id,
                    schedule.name,
                    schedule.type,
                    schedule.prefecture,
                    schedule.date_time,
                    schedule.event_type,
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
