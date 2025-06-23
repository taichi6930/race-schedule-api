import type { Database } from 'better-sqlite3';

import { MigrationRunner } from '../src/utility/sqlite/migrations/index';
import { setupDatabase } from '../src/utility/sqlite/settings/dbConfig';

/**
 * SQLiteデータベースの初期化を実行する
 */
const initializeDatabase = (): void => {
    let db: Database | undefined = undefined;

    try {
        console.log('データベースのセットアップを開始します...');

        db = setupDatabase();
        const migrationRunner = new MigrationRunner(db);
        migrationRunner.run();

        console.log('データベースのセットアップが完了しました。');
    } catch (error: unknown) {
        throw error instanceof Error
            ? error
            : new Error('データベースの初期化に失敗しました');
    } finally {
        db?.close();
    }
};

initializeDatabase();
