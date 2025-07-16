import { SQLiteManager } from '../src/utility/sqlite';

/**
 * SQLiteデータベースの初期化を実行する
 */
const initializeDatabase = (): void => {
    try {
        console.log('データベースのセットアップを開始します...');
        // race-setting.db を作成・初期化
        SQLiteManager.getInstanceForSetting();

        console.log('データベースのセットアップが完了しました。');
    } catch (error: unknown) {
        throw error instanceof Error
            ? error
            : new Error('データベースの初期化に失敗しました');
    }
};

initializeDatabase();

console.log('DB作成・初期化完了');
