import * as child_process from 'node:child_process';
import * as fs from 'node:fs';
import path from 'node:path';

// データベースファイルのパスを設定
const DB_PATH = path.join(process.cwd(), 'volume/data/race-schedule.db');
const DB_FOLDER = path.dirname(DB_PATH);

// CSVファイルのパスを設定
const NAR_PLACE_CSV_PATH = path.join(
    process.cwd(),
    'lib/src/gateway/mockData/csv/nar/placeList.csv',
);

const JRA_PLACE_CSV_PATH = path.join(
    process.cwd(),
    'lib/src/gateway/mockData/csv/jra/placeList.csv',
);

// JavaScriptのDate文字列を解析する関数
function parseJSDateString(dateStr: string): Date | undefined {
    try {
        // "Fri Jun 20 2025 10:00:00 GMT+0900 (Japan Standard Time)" 形式を解析
        const date = new Date(dateStr);

        // 無効な日付でないことを確認
        if (Number.isNaN(date.getTime())) {
            return undefined;
        }

        return date;
    } catch (error) {
        console.error('日付解析エラー:', error);
        return undefined;
    }
}

// CSV行をパースする関数 (簡易的なCSVパーサー)
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    // 最後のフィールドを追加
    result.push(current);
    return result;
}

// SQLiteデータベースファイルを作成または確認
function setupDatabase(): boolean {
    // フォルダが存在しない場合は作成
    if (!fs.existsSync(DB_FOLDER)) {
        fs.mkdirSync(DB_FOLDER, { recursive: true });
        console.log(`ディレクトリを作成しました: ${DB_FOLDER}`);
    }

    // データベースファイルが存在するか確認
    if (fs.existsSync(DB_PATH)) {
        console.log(`既存のデータベースファイルを使用します: ${DB_PATH}`);
        return true;
    } else {
        console.log(`データベースファイルが存在しません: ${DB_PATH}`);
        console.log('新しいデータベースファイルを作成します...');

        try {
            // 空のファイルを作成
            fs.writeFileSync(DB_PATH, '', 'utf8');
            console.log(`データベースファイルを作成しました: ${DB_PATH}`);
            return true;
        } catch (error) {
            console.error('データベースファイル作成エラー:', error);
            return false;
        }
    }
}

// システムにsqliteコマンドがあるか確認
function checkSqliteCommand(): boolean {
    try {
        const result = child_process.execSync('which sqlite3', {
            encoding: 'utf8',
        });
        console.log(`SQLiteコマンドが見つかりました: ${result.trim()}`);
        return true;
    } catch {
        console.log('システムにSQLiteコマンドがインストールされていません。');
        console.log(
            'brew install sqlite3 または apt-get install sqlite3 などでインストールできます。',
        );
        return false;
    }
}

// SQLiteコマンドを実行
export function runSqliteCommand(command: string): string | undefined {
    try {
        // コマンドが空でないことを確認
        if (!command || command.trim() === '') {
            console.warn('空のSQLiteコマンドが実行されました');
            return undefined;
        }

        // 実行するコマンドをログに出力（オプション）
        // console.debug(`SQLiteコマンド実行: ${command.substring(0, 50)}${command.length > 50 ? '...' : ''}`);

        const result = child_process.execSync(
            `sqlite3 "${DB_PATH}" "${command}"`,
            { encoding: 'utf8' },
        );
        return result.trim();
    } catch (error) {
        // エラーの詳細を出力
        if (error instanceof Error) {
            console.error(`SQLiteコマンド実行エラー: ${error.message}`);
        } else {
            console.error('SQLiteコマンド実行エラー:', error);
        }
        return undefined;
    }
}

// サンプルテーブルとデータを作成
function createSampleData(): boolean {
    console.log('サンプルテーブルを作成します...');

    // NARの場所データ用テーブル作成
    let createTableResult = runSqliteCommand(`
        CREATE TABLE IF NOT EXISTS place_data (
            id TEXT PRIMARY KEY,
            race_type TEXT NOT NULL,
            datetime TEXT NOT NULL,
            location TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
            updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
        );
    `);

    // updated_atを自動更新するトリガーを作成
    createTableResult = runSqliteCommand(`
        DROP TRIGGER IF EXISTS update_place_timestamp;
        CREATE TRIGGER update_place_timestamp AFTER UPDATE ON place_data
        BEGIN
            UPDATE place_data SET updated_at = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
        END;
    `);

    if (createTableResult !== undefined) {
        console.log('テーブルとトリガーを作成しました');

        // NARの場所データチェック
        const countResult = runSqliteCommand(
            'SELECT COUNT(*) FROM place_data;',
        );
        const count = Number.parseInt(countResult ?? '0', 10);
        console.log(`NAR場所データの件数: ${count}`);

        return true;
    }

    return false;
}

// データベースファイルの情報を表示
function showDatabaseInfo(): void {
    console.log('\nデータベース情報:');

    // ファイルサイズを取得
    const stats = fs.statSync(DB_PATH);
    console.log(`ファイルサイズ: ${stats.size} バイト`);

    // テーブル一覧を取得
    console.log('\nテーブル一覧:');
    const tables = runSqliteCommand(
        "SELECT name FROM sqlite_master WHERE type='table';",
    );
    console.log(tables ?? 'テーブルがありません');

    // 各テーブルのスキーマを表示
    if (tables !== undefined && tables.trim() !== '') {
        console.log('\n各テーブルのスキーマ:');
        const tableNames = tables.split('\n');
        for (const tableName of tableNames) {
            if (tableName.trim()) {
                console.log(`\nテーブル: ${tableName}`);
                const schema = runSqliteCommand(
                    `PRAGMA table_info(${tableName});`,
                );
                console.log(schema ?? 'スキーマ情報がありません');
            }
        }
    }
}

// CSVファイルを読み込み、SQLiteデータベースに登録する
function importCsvToNarPlaceDatabase(csvPath?: string): boolean {
    const targetCsvPath = csvPath ?? NAR_PLACE_CSV_PATH;
    console.log(`CSVファイル ${targetCsvPath} からデータを読み込みます...`);

    // CSVファイルが存在するか確認
    if (!fs.existsSync(targetCsvPath)) {
        console.error(`CSVファイル ${targetCsvPath} が見つかりません。`);
        return false;
    }

    try {
        // CSVファイルを読み込む
        const fileContent = fs.readFileSync(targetCsvPath, 'utf8');
        const lines = fileContent.split('\n');

        // ヘッダー行をスキップするために、最初の行を取得してヘッダー情報を解析
        if (lines.length < 2) {
            console.error('CSVファイルにデータがありません。');
            return false;
        }

        const headerLine = lines[0].trim();
        const headers = parseCSVLine(headerLine);
        console.log('CSVヘッダー:', headers);

        // NARの場所データ用テーブルは既に存在することを確認
        runSqliteCommand(`
            CREATE TABLE IF NOT EXISTS place_data (
                id TEXT PRIMARY KEY,
                race_type TEXT NOT NULL,
                datetime TEXT NOT NULL,
                location TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
                updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
            );
        `);

        // updated_atを自動更新するトリガーを作成
        runSqliteCommand(`
            DROP TRIGGER IF EXISTS update_place_timestamp;
            CREATE TRIGGER update_place_timestamp AFTER UPDATE ON place_data
            BEGIN
                UPDATE place_data SET updated_at = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
            END;
        `);

        console.log('テーブルとトリガーを作成しました');

        // 既存のデータを削除（オプションで指定可能）
        runSqliteCommand(`DELETE FROM place_data;`);
        console.log('既存のデータを削除しました');

        // SQLiteの制約上、トランザクションは正常に機能しない場合があるため、
        // 自動コミットモードを利用してデータを挿入します
        console.log('データ挿入を開始します...');

        // データの挿入
        let insertCount = 0;
        let errorCount = 0;
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // 空行をスキップ

            try {
                // CSVの各フィールドを取得
                const fields = parseCSVLine(line);
                if (fields.length < 4) {
                    console.warn(
                        `行 ${i + 1}: 不正なフィールド数です。スキップします。`,
                    );
                    continue; // 不正な行をスキップ
                }

                const [id, dateTime, location, updateDate] = fields;

                // 日付時刻を処理（JavaScriptのDate文字列からISO形式に変換）
                const parsedDateTime = parseJSDateString(dateTime);
                const parsedUpdateDate = parseJSDateString(updateDate);

                if (!parsedDateTime || !parsedUpdateDate) {
                    console.warn(
                        `行 ${i + 1}: 日付の解析に失敗しました。スキップします。`,
                    );
                    errorCount++;
                    continue;
                }

                // SQLインジェクション対策としてエスケープ処理
                const escapedLocation = location.replace(/'/g, "''");

                // データを挿入
                const insertResult = runSqliteCommand(`
                    INSERT INTO place_data (
                        id, 
                        race_type,
                        datetime, 
                        location
                    )
                    VALUES (
                        '${id}', 
                        'nar',
                        '${parsedDateTime.toISOString()}', 
                        '${escapedLocation}'
                    );
                `);

                if (insertResult === undefined) {
                    errorCount++;
                } else {
                    insertCount++;
                }
            } catch (error) {
                console.error(
                    `行 ${i + 1} の処理中にエラーが発生しました:`,
                    error,
                );
                errorCount++;
                // 個別の行のエラーはトランザクション全体を失敗させないように処理を続行
            }
        }

        console.log(
            `CSVファイルから ${insertCount} 件のデータを登録しました。`,
        );
        if (errorCount > 0) {
            console.warn(`${errorCount} 件のエラーが発生しました。`);
        }

        // 登録したデータを表示（サンプルとして先頭10件だけ）
        console.log('\nCSVから登録したNAR場所データ（先頭10件）:');
        const importedData = runSqliteCommand(
            'SELECT * FROM place_data LIMIT 10;',
        );
        console.log(importedData ?? 'データがありません');

        // 登録したデータの件数を表示
        const totalCount = runSqliteCommand('SELECT COUNT(*) FROM place_data;');
        console.log(`\n登録データの総件数: ${totalCount ?? 0}`);

        return true;
    } catch (error) {
        console.error('CSVファイルの読み込みエラー:', error);
        return false;
    }
}

// CSVファイルを読み込み、SQLiteデータベースに登録する
function importCsvToJraPlaceDatabase(): boolean {
    const targetCsvPath = JRA_PLACE_CSV_PATH;
    console.log(`CSVファイル ${targetCsvPath} からデータを読み込みます...`);

    // CSVファイルが存在するか確認
    if (!fs.existsSync(targetCsvPath)) {
        console.error(`CSVファイル ${targetCsvPath} が見つかりません。`);
        return false;
    }

    try {
        // CSVファイルを読み込む
        const fileContent = fs.readFileSync(targetCsvPath, 'utf8');
        const lines = fileContent.split('\n');

        // ヘッダー行をスキップするために、最初の行を取得してヘッダー情報を解析
        if (lines.length < 2) {
            console.error('CSVファイルにデータがありません。');
            return false;
        }

        const headerLine = lines[0].trim();
        const headers = parseCSVLine(headerLine);
        console.log('CSVヘッダー:', headers);

        // JRAの場所データ用テーブルは既に存在することを確認
        runSqliteCommand(`
            CREATE TABLE IF NOT EXISTS place_held_data (
                id TEXT PRIMARY KEY,
                race_type TEXT NOT NULL,
                held_times INTEGER NOT NULL,
                held_day_times INTEGER NOT NULL,
                created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
                updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
            );
        `);

        // updated_atを自動更新するトリガーを作成
        runSqliteCommand(`
            DROP TRIGGER IF EXISTS update_place_held_timestamp;
            CREATE TRIGGER update_place_held_timestamp AFTER UPDATE ON place_held_data
            BEGIN
                UPDATE place_held_data SET updated_at = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
            END;
        `);

        // SQLiteの制約上、トランザクションは正常に機能しない場合があるため、
        // 自動コミットモードを利用してデータを挿入します
        console.log('データ挿入を開始します...');

        // データの挿入
        let insertCount = 0;
        let errorCount = 0;
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // 空行をスキップ

            try {
                // CSVの各フィールドを取得
                const fields = parseCSVLine(line);
                if (fields.length < 6) {
                    console.warn(
                        `行 ${i + 1}: 不正なフィールド数です。スキップします。`,
                    );
                    continue; // 不正な行をスキップ
                }

                const [
                    id,
                    dateTime,
                    location,
                    heldTimes,
                    heldDayTimes,
                    updateDate,
                ] = fields;

                // 日付時刻を処理（JavaScriptのDate文字列からISO形式に変換）
                const parsedDateTime = parseJSDateString(dateTime);
                const parsedUpdateDate = parseJSDateString(updateDate);

                if (!parsedDateTime || !parsedUpdateDate) {
                    console.warn(
                        `行 ${i + 1}: 日付の解析に失敗しました。スキップします。`,
                    );
                    errorCount++;
                    continue;
                }

                // SQLインジェクション対策としてエスケープ処理
                const escapedLocation = location.replace(/'/g, "''");

                // データを挿入
                const insertResult = runSqliteCommand(`
                    INSERT INTO place_data (
                        id,
                        race_type,
                        datetime,
                        location
                    )
                    VALUES (
                        '${id}',
                        'jra',
                        '${parsedDateTime.toISOString()}',
                        '${escapedLocation}'
                    );
                `);

                // データを挿入
                const insertResult2 = runSqliteCommand(`
                    INSERT INTO place_held_data (
                        id,
                        race_type,
                        held_times,
                        held_day_times
                    )
                    VALUES (
                        '${id}',
                        'jra',
                        ${Number.parseInt(heldTimes, 10)},
                        ${Number.parseInt(heldDayTimes, 10)}
                    );
                `);

                if (insertResult === undefined && insertResult2 === undefined) {
                    errorCount++;
                } else {
                    insertCount++;
                }
            } catch (error) {
                console.error(
                    `行 ${i + 1} の処理中にエラーが発生しました:`,
                    error,
                );
                errorCount++;
                // 個別の行のエラーはトランザクション全体を失敗させないように処理を続行
            }
        }

        console.log(
            `CSVファイルから ${insertCount} 件のデータを登録しました。`,
        );
        if (errorCount > 0) {
            console.warn(`${errorCount} 件のエラーが発生しました。`);
        }

        // 登録したデータを表示（サンプルとして先頭10件だけ）
        console.log('\nCSVから登録したJRA場所データ（先頭10件）:');
        const importedData = runSqliteCommand(
            'SELECT * FROM place_data LIMIT 10;',
        );
        console.log(importedData ?? 'データがありません');

        // 登録したデータの件数を表示
        const totalCount = runSqliteCommand('SELECT COUNT(*) FROM place_data;');
        console.log(`\n登録データの総件数: ${totalCount ?? 0}`);

        return true;
    } catch (error) {
        console.error('CSVファイルの読み込みエラー:', error);
        return false;
    }
}

// メイン処理
function main(): void {
    console.log('SQLiteサンドボックスを開始します...');

    // データベースファイルのセットアップ
    if (!setupDatabase()) {
        console.error('データベースのセットアップに失敗しました。');
        return;
    }

    // SQLiteコマンドの確認
    if (checkSqliteCommand()) {
        // コマンドライン引数で動作を指定
        const args = new Set(process.argv.slice(2));

        if (args.has('--import-csv') || args.has('-i')) {
            // CSVデータのインポート
            if (importCsvToNarPlaceDatabase()) {
                console.log('CSVデータのインポートが完了しました。');
            } else {
                console.error('CSVデータのインポートに失敗しました。');
            }
            if (importCsvToJraPlaceDatabase()) {
                console.log('CSVデータのインポートが完了しました。');
            } else {
                console.error('CSVデータのインポートに失敗しました。');
            }
        } else {
            // 通常のサンプルデータ処理
            if (createSampleData()) {
                // データベース情報の表示
                showDatabaseInfo();
            }
        }
    } else {
        console.log(
            'データベースファイルは作成されましたが、SQLiteコマンドがないため操作できません。',
        );
    }

    console.log('\nSQLiteサンドボックスが完了しました。');
}

// スクリプトを実行
main();
