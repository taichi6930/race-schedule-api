import * as fs from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';

// 定数定義
export const NAR_PLACE_CSV_PATH = path.join(
    process.cwd(),
    'volume/data/nar-place.csv',
);
const DB_PATH = path.join(process.cwd(), 'volume/data/race-schedule.db');
const DB_FOLDER = path.dirname(DB_PATH);

// シングルトンインスタンス
let database: Database.Database | undefined;

interface NarPlaceData {
    id: string;
    datetime: string;
    location: string;
}

/**
 * nar_place_data テーブルのセットアップ
 * @param db
 */
const setupNarPlaceDataTable = (db: Database.Database): void => {
    try {
        db.exec(`
            CREATE TABLE IF NOT EXISTS nar_place_data (
                id TEXT PRIMARY KEY,
                datetime TEXT NOT NULL,
                location TEXT NOT NULL,
                updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
                created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
            );

            CREATE TRIGGER IF NOT EXISTS update_nar_place_timestamp
            AFTER UPDATE ON nar_place_data
            BEGIN
                UPDATE nar_place_data
                SET updated_at = DATETIME('now', 'localtime')
                WHERE id = NEW.id;
            END;
        `);
    } catch (error) {
        console.error('テーブル作成エラー:', error);
        throw error;
    }
};

// テーブルのセットアップ
function setupTables(db: Database.Database): void {
    setupNarPlaceDataTable(db);
}

// データベースの初期化
function initializeDatabase(): Database.Database {
    try {
        if (!fs.existsSync(DB_FOLDER)) {
            fs.mkdirSync(DB_FOLDER, { recursive: true });
            console.log(`ディレクトリを作成しました: ${DB_FOLDER}`);
        }

        const db = new Database(DB_PATH, { verbose: console.log });
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        setupTables(db);
        return db;
    } catch (error) {
        console.error('データベース初期化エラー:', error);
        throw error;
    }
}

// CSVの行をパースする関数
function parseCSVLine(line: string): string[] {
    return line.split(',').map((field) => field.trim());
}

// 日付文字列をパースする関数
function parseJSDateString(dateStr: string): Date | undefined {
    const date = new Date(dateStr);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

// データベースのセットアップ
export function setupDatabase(): boolean {
    try {
        database ??= initializeDatabase();
        return true;
    } catch (error) {
        console.error('データベースセットアップエラー:', error);
        return false;
    }
}

// SQLiteコマンドの確認
export function checkSqliteCommand(): boolean {
    try {
        database ??= initializeDatabase();
        return true;
    } catch (error) {
        console.error('SQLiteコマンド確認エラー:', error);
        return false;
    }
}

// SQLiteコマンドを実行
export function runSqliteCommand(
    query: string,
    params: unknown[] = [],
): string | undefined {
    try {
        database ??= initializeDatabase();
        const statement = database.prepare(query);

        const result = database.transaction(() => {
            return statement.all(params);
        })();

        if (Array.isArray(result)) {
            return result
                .map((row) => {
                    if (
                        row !== null &&
                        typeof row === 'object' &&
                        Object.keys(row).length > 0
                    ) {
                        return Object.values(row).join('|');
                    }
                    return '';
                })
                .filter(Boolean)
                .join('\n');
        }
        return undefined;
    } catch (error) {
        console.error('SQLiteコマンド実行エラー:', error);
        return undefined;
    }
}

/**
 * 地方競馬開催場所のCSVファイルをインポートしてデータベースに登録
 */
export const createNarPlaceData = (): boolean => {
    try {
        if (!fs.existsSync(NAR_PLACE_CSV_PATH)) {
            console.error('CSVファイルが見つかりません:', NAR_PLACE_CSV_PATH);
            return false;
        }

        database ??= initializeDatabase();

        const fileContent = fs.readFileSync(NAR_PLACE_CSV_PATH, 'utf8');
        const lines = fileContent.split('\n');

        if (lines.length < 2) {
            console.error('CSVファイルが空か、ヘッダーのみです。');
            return false;
        }

        const [headerLine, ...dataLines] = lines;
        const headers = parseCSVLine(headerLine);

        if (headers.length < 4) {
            console.error('CSVヘッダーが不正です。');
            return false;
        }

        const insert = database.prepare(`
        INSERT OR REPLACE INTO nar_place_data (id, datetime, location)
        VALUES (@id, @datetime, @location)
    `);

        const insertMany = database.transaction((items: NarPlaceData[]) => {
            for (const item of items) {
                insert.run(item);
            }
        });

        const validData: NarPlaceData[] = [];

        for (const line of dataLines) {
            if (line.trim()) {
                const fields = parseCSVLine(line);
                if (fields.length >= 4) {
                    const [id, dateTime, location] = fields;
                    const parsedDateTime = parseJSDateString(dateTime);

                    if (parsedDateTime) {
                        validData.push({
                            id,
                            datetime: parsedDateTime.toISOString(),
                            location: location.replace(/'/g, "''"),
                        });
                    }
                }
            }
        }

        if (validData.length > 0) {
            insertMany(validData);
            return true;
        }

        console.error('有効なデータが見つかりません。');
        return false;
    } catch (error) {
        console.error('地方競馬開催場所データの作成エラー:', error);
        return false;
    }
};

// サンプルデータの作成
export function createSampleData(): boolean {
    return createNarPlaceData();
}

// メイン関数
export function main(): void {
    console.log('データベースのセットアップを開始します...');
    try {
        if (!setupDatabase()) {
            throw new Error('データベースのセットアップに失敗しました。');
        }

        if (checkSqliteCommand()) {
            console.log('SQLiteコマンドの確認に成功しました。');
            if (createSampleData()) {
                console.log('サンプルデータの作成に成功しました。');
            } else {
                console.error('サンプルデータの作成に失敗しました。');
            }
        } else {
            console.error('SQLiteコマンドの確認に失敗しました。');
        }
    } catch (error) {
        console.error('メイン処理でエラーが発生しました:', error);
    }
}
