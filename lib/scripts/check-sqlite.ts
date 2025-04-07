import { RaceType, SQLiteManager } from '../src/utility/sqlite';

/**
 * SQLiteデータベースの接続テスト
 */
function checkDatabase(): void {
    try {
        console.log('SQLiteデータベースの接続テストを開始します...');

        // データベースマネージャーのインスタンスを取得
        const sqliteManager = SQLiteManager.getInstance();
        const db = sqliteManager.getDatabase();

        // テストデータの準備
        const testData = [
            {
                id: 'jra-20250407-tokyo-1',
                dateTime: '2025-04-07T00:00:00+09:00',
                location: '東京',
                type: RaceType.JRA,
            },
            {
                id: 'nar-20250408-funabashi-1',
                dateTime: '2025-04-08T00:00:00+09:00',
                location: '船橋',
                type: RaceType.NAR,
            },
            {
                id: 'keirin-20250409-tachikawa-1',
                dateTime: '2025-04-09T00:00:00+09:00',
                location: '立川',
                type: RaceType.KEIRIN,
            },
            {
                id: 'world-20250410-longchamp-1',
                dateTime: '2025-04-10T00:00:00+09:00',
                location: 'ロンシャン',
                type: RaceType.WORLD,
            },
        ];

        // テストデータの挿入
        console.log('テストデータを挿入中...');
        const insert = db.prepare(`
            INSERT INTO races (id, dateTime, location, type)
            VALUES (@id, @dateTime, @location, @type)
            ON CONFLICT(id) DO NOTHING
        `);

        for (const data of testData) {
            insert.run(data);
        }

        // データの取得テスト
        console.log('挿入したデータを確認中...');
        const results = db
            .prepare('SELECT * FROM races ORDER BY dateTime')
            .all();
        console.log('取得したデータ:');
        for (const row of results) {
            console.log(row);
        }

        // クリーンアップ
        console.log('\nテストデータを削除中...');
        db.exec(
            `DELETE FROM races WHERE id LIKE 'jra-%' OR id LIKE 'nar-%' OR id LIKE 'keirin-%' OR id LIKE 'world-%'`,
        );

        console.log('データベーステストが正常に完了しました。');
        sqliteManager.close();
    } catch (error) {
        console.error('データベーステストでエラーが発生しました:', error);
        throw error;
    }
}

// テストの実行
checkDatabase();
