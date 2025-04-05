import 'reflect-metadata';

import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { Database } from 'better-sqlite3';

import { withDatabase } from '../src/utility/sqlite';

interface ScheduleData {
    id: string;
    location: string;
    type: string;
    date_time: string;
}

/**
 * データベースの初期化
 */
const initDatabase = async (): Promise<void> => {
    console.log('データベースの初期化を開始します...');

    // CSVファイルからデータを読み込む
    const narCsvContent = await fs.readFile(
        path.join(__dirname, '../src/gateway/mockData/csv/nar/placeList.csv'),
        'utf8',
    );

    const jraCsvContent = await fs.readFile(
        path.join(__dirname, '../src/gateway/mockData/csv/jra/placeList.csv'),
        'utf8',
    );

    // CSVを解析してデータに変換
    const narLines = narCsvContent.split('\n');
    const narScheduleData: ScheduleData[] = narLines
        .slice(1) // ヘッダー行をスキップ
        .filter((line: string) => line.trim() !== '') // 空行を除外
        .map((line: string) => {
            const [id, dateTime, location] = line.split(',');
            return {
                id: id.trim(),
                location: location.trim(),
                type: 'nar',
                date_time: new Date(dateTime.trim()).toISOString(),
            };
        });

    const jraLines = jraCsvContent.split('\n');
    const jraScheduleData: ScheduleData[] = jraLines
        .slice(1) // ヘッダー行をスキップ
        .filter((line: string) => line.trim() !== '') // 空行を除外
        .map((line: string) => {
            const [id, dateTime, location] = line.split(',');
            return {
                id: id.trim(),
                location: location.trim(),
                type: 'jra',
                date_time: new Date(dateTime.trim()).toISOString(),
            };
        });
    // データを結合
    const scheduleData: ScheduleData[] = [
        ...narScheduleData,
        ...jraScheduleData,
    ];

    return new Promise<void>((resolve) => {
        withDatabase((db: Database) => {
            // 古いテーブルの削除
            db.exec('DROP TABLE IF EXISTS place_schedules;');

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
            for (const schedule of scheduleData) {
                db.prepare(
                    'INSERT INTO place_schedules (id, location, type, date_time, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
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
