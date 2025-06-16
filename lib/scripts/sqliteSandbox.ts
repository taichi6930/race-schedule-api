import * as child_process from 'node:child_process';
import * as fs from 'node:fs';
import path from 'node:path';

// データベースファイルのパスを設定
const DB_PATH = path.join(process.cwd(), 'volume/data/race-schedule.db');
const DB_FOLDER = path.dirname(DB_PATH);

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
function runSqliteCommand(command: string): string | undefined {
    try {
        const result = child_process.execSync(
            `sqlite3 "${DB_PATH}" "${command}"`,
            { encoding: 'utf8' },
        );
        return result.trim();
    } catch (error) {
        console.error('SQLiteコマンド実行エラー:', error);
        return undefined;
    }
}

// サンプルテーブルとデータを作成
function createSampleData(): boolean {
    console.log('サンプルテーブルを作成します...');

    // テーブル作成
    const createTableResult = runSqliteCommand(`
        CREATE TABLE IF NOT EXISTS samples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            value TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    if (createTableResult !== undefined) {
        console.log('サンプルテーブルを作成しました');

        // 既存のデータをチェック
        const countResult = runSqliteCommand('SELECT COUNT(*) FROM samples;');
        const count = Number.parseInt(countResult ?? '0', 10);

        if (count > 0) {
            console.log(
                `既存のデータが${count}件見つかりました。サンプルデータの挿入をスキップします。`,
            );
        } else {
            // サンプルデータを挿入
            console.log('サンプルデータを挿入します...');
            runSqliteCommand(`
                BEGIN TRANSACTION;
                INSERT INTO samples (name, value) VALUES ('サンプル1', 'テストデータ1');
                INSERT INTO samples (name, value) VALUES ('サンプル2', 'テストデータ2');
                INSERT INTO samples (name, value) VALUES ('サンプル3', 'テストデータ3');
                COMMIT;
            `);
            console.log('サンプルデータを挿入しました');
        }

        // データを表示
        console.log('現在のデータ:');
        const data = runSqliteCommand('SELECT * FROM samples;');
        console.log(data ?? 'データがありません');

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
        // サンプルデータの作成
        if (createSampleData()) {
            // データベース情報の表示
            showDatabaseInfo();
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
