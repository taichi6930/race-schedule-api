import fs from 'node:fs';

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

        // クリーンアップ
        console.log('\nテストデータを削除中...');
        db.exec(
            `DELETE FROM places WHERE id LIKE 'jra%' OR id LIKE 'nar%' OR id LIKE 'keirin%' OR id LIKE 'world%'`,
        );

        // lib/src/gateway/mockData/csv/nar/placeList.csvのデータを取得
        const narCsvFilePath = 'lib/src/gateway/mockData/csv/nar/placeList.csv';
        const csvData = fs.readFileSync(narCsvFilePath, 'utf8');
        const csvRows = csvData.split('\n').map((row) => row.split(','));
        const [header, ...dataRows] = csvRows;
        const narCsvDataObjects = dataRows.map((row) => {
            const obj: Record<string, string> = {};
            for (const [index, field] of header.entries()) {
                obj[field.trim()] = row[index]?.trim() ?? '';
            }
            return obj;
        });

        // テストデータの準備
        const testData = [
            {
                id: 'jra2025040705',
                dateTime: '2025-04-07T00:00:00',
                location: '東京',
                type: RaceType.JRA,
            },
            {
                id: 'keirin2025040928',
                dateTime: '2025-04-09T00:00:00',
                location: '立川',
                type: RaceType.KEIRIN,
            },
            {
                id: 'world20250410longchamp',
                dateTime: '2025-04-10T00:00:00',
                location: 'ロンシャン',
                type: RaceType.WORLD,
            },
        ];

        // CSVデータをテストデータに変換
        for (const row of narCsvDataObjects) {
            try {
                // 日付文字列をISO形式に変換
                const rawDateTime = row.dateTime;
                if (!rawDateTime) {
                    console.warn(
                        `日付がない行をスキップします: ${JSON.stringify(row)}`,
                    );
                    continue;
                }

                const parsedDate = new Date(rawDateTime);
                if (Number.isNaN(parsedDate.getTime())) {
                    console.warn(
                        `不正な日付形式をスキップします: ${rawDateTime}`,
                    );
                    continue;
                }

                const dateTime = parsedDate.toISOString();
                const location = row.location.trim();
                const id = row.id.trim();

                if (!location || !id) {
                    console.warn(
                        `必要なデータが不足している行をスキップします: ${JSON.stringify(row)}`,
                    );
                    continue;
                }

                testData.push({
                    id,
                    dateTime,
                    location,
                    type: RaceType.NAR,
                });
            } catch (error) {
                console.warn(
                    `データの変換でエラーが発生した行をスキップします:`,
                    row,
                    error,
                );
                continue;
            }
        }

        console.log(`${testData.length}件のデータを登録します...`);

        // テストデータの挿入
        console.log('テストデータを挿入中...');
        const insert = db.prepare(`
            INSERT INTO places (id, dateTime, location, type)
            VALUES (@id, @dateTime, @location, @type)
            ON CONFLICT(id) DO NOTHING
        `);
        try {
            for (const data of testData) {
                // 必須フィールドの型チェック
                const isValid =
                    typeof data.dateTime === 'string' &&
                    typeof data.location === 'string' &&
                    typeof data.id === 'string' &&
                    Object.values(RaceType).includes(data.type);

                if (!isValid) {
                    console.warn('不正なデータをスキップします:', data);
                    continue;
                }
                insert.run(data);
            }
        } catch (error) {
            console.error('データの挿入中にエラーが発生しました:', error);
            throw error;
        }

        // データの取得テスト
        console.log('挿入したデータを確認中...');
        const results = db
            .prepare('SELECT * FROM places ORDER BY dateTime')
            .all();
        console.log('取得したデータ:');
        for (const row of results) {
            console.log(row);
        }

        console.log('データベーステストが正常に完了しました。');
        sqliteManager.close();
    } catch (error) {
        console.error('データベーステストでエラーが発生しました:', error);
        throw error;
    }
}

// テストの実行
checkDatabase();
