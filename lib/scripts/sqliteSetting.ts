import * as child_process from 'node:child_process';
import * as fs from 'node:fs';

import { setupDatabase } from '../src/utility/sqlite/settings/dbConfig';
import { MigrationRunner } from '../src/utility/sqlite/migrations/index';
import {
    DB_PATH,
    DB_FOLDER,
    NAR_PLACE_CSV_PATH,
    JRA_PLACE_CSV_PATH,
} from '../src/utility/sqlite/settings/constants';

/**
 * CSV行をパースする簡易的なパーサー
 * @param line - CSVの行文字列
 * @returns パースされたフィールドの配列
 */
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

    result.push(current);
    return result;
}

/**
 * JavaScriptのDate文字列を解析する
 * @param dateStr - 日付文字列
 * @returns パースされたDateオブジェクト、失敗時はundefined
 */
function parseJSDateString(dateStr: string): Date | undefined {
    try {
        const date = new Date(dateStr);
        return Number.isNaN(date.getTime()) ? undefined : date;
    } catch (error) {
        console.error('日付解析エラー:', error);
        return undefined;
    }
}

/**
 * データベース設定管理クラス
 * Clean Architecture: Infrastructure層の責務
 */
class DatabaseConfigManager {
    /**
     * データベースの初期セットアップを実行
     * @returns セットアップ成功時はtrue
     */
    public setupDatabase(): boolean {
        try {
            this.ensureDatabaseFolder();
            const dbExists = fs.existsSync(DB_PATH);
            
            if (dbExists) {
                console.log(`既存のデータベースファイルを使用します: ${DB_PATH}`);
            } else {
                console.log('新しいデータベースファイルを作成します...');
                fs.writeFileSync(DB_PATH, '', 'utf8');
                console.log(`データベースファイルを作成しました: ${DB_PATH}`);
            }
            
            return true;
        } catch (error) {
            console.error('データベースファイル作成エラー:', error);
            return false;
        }
    }

    /**
     * データベースフォルダの存在確認と作成
     */
    private ensureDatabaseFolder(): void {
        if (!fs.existsSync(DB_FOLDER)) {
            fs.mkdirSync(DB_FOLDER, { recursive: true });
            console.log(`ディレクトリを作成しました: ${DB_FOLDER}`);
        }
    }

    /**
     * SQLiteコマンドの可用性をチェック
     * @returns SQLiteコマンドが利用可能な場合はtrue
     */
    public checkSqliteCommand(): boolean {
        try {
            const result = child_process.execSync('which sqlite3', {
                encoding: 'utf8',
            });
            console.log(`SQLiteコマンドが見つかりました: ${result.trim()}`);
            return true;
        } catch {
            console.log('システムにSQLiteコマンドがインストールされていません。');
            console.log('brew install sqlite3 または apt-get install sqlite3 などでインストールできます。');
            return false;
        }
    }
}

/**
 * SQLiteコマンド実行サービス  
 * Clean Architecture: Infrastructure層の責務
 */
class SqliteCommandService {
    /**
     * SQLiteコマンドを実行
     * @param command - 実行するSQLコマンド
     * @returns 実行結果、エラー時はundefined
     */
    public execute(command: string): string | undefined {
        if (!command || command.trim() === '') {
            console.warn('空のSQLiteコマンドが実行されました');
            return undefined;
        }

        try {
            const result = child_process.execSync(
                `sqlite3 "${DB_PATH}" "${command}"`,
                { encoding: 'utf8' },
            );
            return result.trim();
        } catch (error) {
            this.handleError(error);
            return undefined;
        }
    }

    /**
     * エラーハンドリング
     * @param error - 発生したエラー
     */
    private handleError(error: unknown): void {
        if (error instanceof Error) {
            console.error(`SQLiteコマンド実行エラー: ${error.message}`);
        } else {
            console.error('SQLiteコマンド実行エラー:', error);
        }
    }
}

/**
 * データベース情報表示サービス
 * Clean Architecture: Use Case層の責務  
 */
class DatabaseInfoService {
    constructor(private readonly sqliteService: SqliteCommandService) {}

    /**
     * データベースファイルの情報を表示
     */
    public showDatabaseInfo(): void {
        console.log('\nデータベース情報:');
        this.showFileInfo();
        this.showTableInfo();
    }

    /**
     * ファイル情報を表示
     */
    private showFileInfo(): void {
        const stats = fs.statSync(DB_PATH);
        console.log(`ファイルサイズ: ${stats.size} バイト`);
    }

    /**
     * テーブル情報を表示
     */
    private showTableInfo(): void {
        console.log('\nテーブル一覧:');
        const tables = this.sqliteService.execute(
            "SELECT name FROM sqlite_master WHERE type='table';",
        );
        
        if (!tables || tables.trim() === '') {
            console.log('テーブルがありません');
            return;
        }

        console.log(tables);
        this.showTableSchemas(tables);
    }

    /**
     * 各テーブルのスキーマを表示
     * @param tables - テーブル名の一覧
     */
    private showTableSchemas(tables: string): void {
        console.log('\n各テーブルのスキーマ:');
        const tableNames = tables.split('\n');
        
        for (const tableName of tableNames) {
            if (tableName.trim()) {
                console.log(`\nテーブル: ${tableName}`);
                const schema = this.sqliteService.execute(
                    `PRAGMA table_info(${tableName});`,
                );
                console.log(schema ?? 'スキーマ情報がありません');
            }
        }
    }
}

/**
 * CSV import結果を表す型
 */
interface CsvImportResult {
    success: boolean;
    insertCount: number;
    errorCount: number;
}

/**
 * CSVデータインポートサービス
 * Clean Architecture: Use Case層の責務
 */
class CsvImportService {
    constructor(private readonly sqliteService: SqliteCommandService) {}

    /**
     * NARの場所データCSVをインポート
     * @param csvPath - CSVファイルのパス（省略時はデフォルトパス使用）
     * @returns インポート結果
     */
    public importNarPlaceData(csvPath?: string): CsvImportResult {
        const targetPath = csvPath ?? NAR_PLACE_CSV_PATH;
        console.log(`CSVファイル ${targetPath} からデータを読み込みます...`);

        if (!this.validateCsvFile(targetPath)) {
            return { success: false, insertCount: 0, errorCount: 0 };
        }

        try {
            const lines = this.readCsvFile(targetPath);
            if (lines.length < 2) {
                console.error('CSVファイルにデータがありません。');
                return { success: false, insertCount: 0, errorCount: 0 };
            }

            this.setupNarTable();
            return this.processNarCsvData(lines);
        } catch (error) {
            console.error('CSVファイルの読み込みエラー:', error);
            return { success: false, insertCount: 0, errorCount: 0 };
        }
    }

    /**
     * JRAの場所データCSVをインポート
     * @returns インポート結果
     */
    public importJraPlaceData(): CsvImportResult {
        const targetPath = JRA_PLACE_CSV_PATH;
        console.log(`CSVファイル ${targetPath} からデータを読み込みます...`);

        if (!this.validateCsvFile(targetPath)) {
            return { success: false, insertCount: 0, errorCount: 0 };
        }

        try {
            const lines = this.readCsvFile(targetPath);
            if (lines.length < 2) {
                console.error('CSVファイルにデータがありません。');
                return { success: false, insertCount: 0, errorCount: 0 };
            }

            this.setupJraTable();
            return this.processJraCsvData(lines);
        } catch (error) {
            console.error('CSVファイルの読み込みエラー:', error);
            return { success: false, insertCount: 0, errorCount: 0 };
        }
    }

    /**
     * CSVファイルの存在確認
     * @param filePath - ファイルパス
     * @returns ファイルが存在する場合はtrue
     */
    private validateCsvFile(filePath: string): boolean {
        if (!fs.existsSync(filePath)) {
            console.error(`CSVファイル ${filePath} が見つかりません。`);
            return false;
        }
        return true;
    }

    /**
     * CSVファイルを読み込み
     * @param filePath - ファイルパス
     * @returns CSVの行の配列
     */
    private readCsvFile(filePath: string): string[] {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return fileContent.split('\n');
    }

    /**
     * NARデータ用テーブルのセットアップ
     */
    private setupNarTable(): void {
        this.sqliteService.execute(`
            CREATE TABLE IF NOT EXISTS place_data (
                id TEXT PRIMARY KEY,
                race_type TEXT NOT NULL,
                datetime TEXT NOT NULL,
                location TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
                updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
            );
        `);

        this.sqliteService.execute(`
            DROP TRIGGER IF EXISTS update_place_timestamp;
            CREATE TRIGGER update_place_timestamp AFTER UPDATE ON place_data
            BEGIN
                UPDATE place_data SET updated_at = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
            END;
        `);

        this.sqliteService.execute('DELETE FROM place_data;');
        console.log('NARテーブルとトリガーを作成し、既存データを削除しました');
    }

    /**
     * JRAデータ用テーブルのセットアップ
     */
    private setupJraTable(): void {
        this.sqliteService.execute(`
            CREATE TABLE IF NOT EXISTS place_held_data (
                id TEXT PRIMARY KEY,
                race_type TEXT NOT NULL,
                held_times INTEGER NOT NULL,
                held_day_times INTEGER NOT NULL,
                created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
                updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
            );
        `);

        this.sqliteService.execute(`
            DROP TRIGGER IF EXISTS update_place_held_timestamp;
            CREATE TRIGGER update_place_held_timestamp AFTER UPDATE ON place_held_data
            BEGIN
                UPDATE place_held_data SET updated_at = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
            END;
        `);

        console.log('JRAテーブルとトリガーを作成しました');
    }

    /**
     * NARのCSVデータを処理
     * @param lines - CSVの行データ
     * @returns インポート結果
     */
    private processNarCsvData(lines: string[]): CsvImportResult {
        const headerLine = lines[0].trim();
        const headers = parseCSVLine(headerLine);
        console.log('CSVヘッダー:', headers);

        let insertCount = 0;
        let errorCount = 0;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            try {
                const fields = parseCSVLine(line);
                if (fields.length < 4) {
                    console.warn(`行 ${i + 1}: 不正なフィールド数です。スキップします。`);
                    continue;
                }

                const [id, dateTime, location] = fields;
                const parsedDateTime = parseJSDateString(dateTime);

                if (!parsedDateTime) {
                    console.warn(`行 ${i + 1}: 日付の解析に失敗しました。スキップします。`);
                    errorCount++;
                    continue;
                }

                const escapedLocation = location.replace(/'/g, "''");
                const insertResult = this.sqliteService.execute(`
                    INSERT INTO place_data (id, race_type, datetime, location)
                    VALUES ('${id}', 'nar', '${parsedDateTime.toISOString()}', '${escapedLocation}');
                `);

                if (insertResult === undefined) {
                    errorCount++;
                } else {
                    insertCount++;
                }
            } catch (error) {
                console.error(`行 ${i + 1} の処理中にエラーが発生しました:`, error);
                errorCount++;
            }
        }

        this.showImportResults('NAR', insertCount, errorCount);
        return { success: errorCount === 0, insertCount, errorCount };
    }

    /**
     * JRAのCSVデータを処理
     * @param lines - CSVの行データ
     * @returns インポート結果
     */
    private processJraCsvData(lines: string[]): CsvImportResult {
        const headerLine = lines[0].trim();
        const headers = parseCSVLine(headerLine);
        console.log('CSVヘッダー:', headers);

        let insertCount = 0;
        let errorCount = 0;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            try {
                const fields = parseCSVLine(line);
                if (fields.length < 6) {
                    console.warn(`行 ${i + 1}: 不正なフィールド数です。スキップします。`);
                    continue;
                }

                const [id, dateTime, location, heldTimes, heldDayTimes] = fields;
                const parsedDateTime = parseJSDateString(dateTime);

                if (!parsedDateTime) {
                    console.warn(`行 ${i + 1}: 日付の解析に失敗しました。スキップします。`);
                    errorCount++;
                    continue;
                }

                const escapedLocation = location.replace(/'/g, "''");
                
                // place_dataテーブルに挿入
                const insertResult1 = this.sqliteService.execute(`
                    INSERT INTO place_data (id, race_type, datetime, location)
                    VALUES ('${id}', 'jra', '${parsedDateTime.toISOString()}', '${escapedLocation}');
                `);

                // place_held_dataテーブルに挿入
                const insertResult2 = this.sqliteService.execute(`
                    INSERT INTO place_held_data (id, race_type, held_times, held_day_times)
                    VALUES ('${id}', 'jra', ${Number.parseInt(heldTimes, 10)}, ${Number.parseInt(heldDayTimes, 10)});
                `);

                if (insertResult1 === undefined && insertResult2 === undefined) {
                    errorCount++;
                } else {
                    insertCount++;
                }
            } catch (error) {
                console.error(`行 ${i + 1} の処理中にエラーが発生しました:`, error);
                errorCount++;
            }
        }

        this.showImportResults('JRA', insertCount, errorCount);
        return { success: errorCount === 0, insertCount, errorCount };
    }

    /**
     * インポート結果を表示
     * @param dataType - データ種別
     * @param insertCount - 挿入件数
     * @param errorCount - エラー件数
     */
    private showImportResults(dataType: string, insertCount: number, errorCount: number): void {
        console.log(`CSVファイルから ${insertCount} 件の${dataType}データを登録しました。`);
        if (errorCount > 0) {
            console.warn(`${errorCount} 件のエラーが発生しました。`);
        }

        console.log(`\nCSVから登録した${dataType}場所データ（先頭10件）:`);
        const importedData = this.sqliteService.execute('SELECT * FROM place_data LIMIT 10;');
        console.log(importedData ?? 'データがありません');

        const totalCount = this.sqliteService.execute('SELECT COUNT(*) FROM place_data;');
        console.log(`\n登録データの総件数: ${totalCount ?? 0}`);
    }
}

/**
 * サンプルデータ作成サービス
 * Clean Architecture: Use Case層の責務
 */
class SampleDataService {
    constructor(private readonly sqliteService: SqliteCommandService) {}

    /**
     * サンプルテーブルとデータを作成
     * @returns 作成成功時はtrue
     */
    public createSampleData(): boolean {
        console.log('サンプルテーブルを作成します...');

        if (!this.createTable()) {
            return false;
        }

        if (!this.createTrigger()) {
            return false;
        }

        this.showDataCount();
        return true;
    }

    /**
     * テーブルを作成
     * @returns 作成成功時はtrue
     */
    private createTable(): boolean {
        const result = this.sqliteService.execute(`
            CREATE TABLE IF NOT EXISTS place_data (
                id TEXT PRIMARY KEY,
                race_type TEXT NOT NULL,
                datetime TEXT NOT NULL,
                location TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
                updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
            );
        `);
        return result !== undefined;
    }

    /**
     * トリガーを作成
     * @returns 作成成功時はtrue
     */
    private createTrigger(): boolean {
        const result = this.sqliteService.execute(`
            DROP TRIGGER IF EXISTS update_place_timestamp;
            CREATE TRIGGER update_place_timestamp AFTER UPDATE ON place_data
            BEGIN
                UPDATE place_data SET updated_at = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
            END;
        `);
        
        if (result !== undefined) {
            console.log('テーブルとトリガーを作成しました');
            return true;
        }
        return false;
    }

    /**
     * データ件数を表示
     */
    private showDataCount(): void {
        const countResult = this.sqliteService.execute('SELECT COUNT(*) FROM place_data;');
        const count = Number.parseInt(countResult ?? '0', 10);
        console.log(`NAR場所データの件数: ${count}`);
    }
}

/**
 * コマンドライン引数処理サービス
 * Clean Architecture: Interface Adapter層の責務
 */
class CommandLineProcessor {
    constructor(
        private readonly csvImportService: CsvImportService,
        private readonly sampleDataService: SampleDataService,
        private readonly dbInfoService: DatabaseInfoService,
    ) {}

    /**
     * コマンドライン引数を処理して適切なアクションを実行
     */
    public processArguments(): void {
        const args = new Set(process.argv.slice(2));

        if (args.has('--import-csv') || args.has('-i')) {
            this.handleCsvImport();
        } else {
            this.handleSampleData();
        }
    }

    /**
     * CSVインポート処理
     */
    private handleCsvImport(): void {
        const narResult = this.csvImportService.importNarPlaceData();
        if (narResult.success) {
            console.log('NARのCSVデータのインポートが完了しました。');
        } else {
            console.error('NARのCSVデータのインポートに失敗しました。');
        }

        const jraResult = this.csvImportService.importJraPlaceData();
        if (jraResult.success) {
            console.log('JRAのCSVデータのインポートが完了しました。');
        } else {
            console.error('JRAのCSVデータのインポートに失敗しました。');
        }
    }

    /**
     * サンプルデータ作成処理
     */
    private handleSampleData(): void {
        if (this.sampleDataService.createSampleData()) {
            this.dbInfoService.showDatabaseInfo();
        }
    }
}

/**
 * アプリケーションファサード
 * Clean Architecture: Interface Adapter層の責務
 */
class DatabaseSetupApplication {
    private readonly dbConfigManager: DatabaseConfigManager;
    private readonly sqliteService: SqliteCommandService;
    private readonly csvImportService: CsvImportService;
    private readonly sampleDataService: SampleDataService;
    private readonly dbInfoService: DatabaseInfoService;
    private readonly commandProcessor: CommandLineProcessor;

    constructor() {
        // 依存関係の注入（手動DI）
        this.dbConfigManager = new DatabaseConfigManager();
        this.sqliteService = new SqliteCommandService();
        this.csvImportService = new CsvImportService(this.sqliteService);
        this.sampleDataService = new SampleDataService(this.sqliteService);
        this.dbInfoService = new DatabaseInfoService(this.sqliteService);
        this.commandProcessor = new CommandLineProcessor(
            this.csvImportService,
            this.sampleDataService,
            this.dbInfoService,
        );
    }

    /**
     * アプリケーションを実行
     */
    public run(): void {
        console.log('SQLiteサンドボックスを開始します...');

        if (!this.dbConfigManager.setupDatabase()) {
            console.error('データベースのセットアップに失敗しました。');
            return;
        }

        if (this.dbConfigManager.checkSqliteCommand()) {
            this.commandProcessor.processArguments();
        } else {
            console.log(
                'データベースファイルは作成されましたが、SQLiteコマンドがないため操作できません。',
            );
        }

        console.log('\nSQLiteサンドボックスが完了しました。');
    }
}

// レガシー関数のエクスポート（既存のコードとの互換性維持）
export function runSqliteCommand(command: string): string | undefined {
    const service = new SqliteCommandService();
    return service.execute(command);
}

// スクリプトを実行
const app = new DatabaseSetupApplication();
app.run();
