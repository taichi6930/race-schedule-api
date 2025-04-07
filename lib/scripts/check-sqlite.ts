import fs from 'node:fs';

import { RaceType, SQLiteManager } from '../src/utility/sqlite';

function createNarPlaceDatabase(): {
    id: string;
    dateTime: string;
    location: string;
    type: RaceType;
}[] {
    const testData = [];
    const narPlaceCsvFilePath =
        'lib/src/gateway/mockData/csv/nar/placeList.csv';
    const csvData = fs.readFileSync(narPlaceCsvFilePath, 'utf8');
    const csvRows = csvData.split('\n').map((row) => row.split(','));
    const [header, ...dataRows] = csvRows;
    const narPlaceCsvDataObjects = dataRows.map((row) => {
        const obj: Record<string, string> = {};
        for (const [index, field] of header.entries()) {
            obj[field.trim()] = row[index]?.trim() ?? '';
        }
        return obj;
    });

    // CSVデータをテストデータに変換
    for (const row of narPlaceCsvDataObjects) {
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
                console.warn(`不正な日付形式をスキップします: ${rawDateTime}`);
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
    return testData;
}

function createNarRaceDatabase(): {
    id: string;
    number: number;
    dateTime: string;
    name: string;
}[] {
    const testData = [];
    const narRaceCsvFilePath = 'lib/src/gateway/mockData/csv/nar/raceList.csv';
    const csvData = fs.readFileSync(narRaceCsvFilePath, 'utf8');
    const csvRows = csvData.split('\n').map((row) => row.split(','));
    const [header, ...dataRows] = csvRows;
    const narPlaceCsvDataObjects = dataRows.map((row) => {
        const obj: Record<string, string> = {};
        for (const [index, field] of header.entries()) {
            obj[field.trim()] = row[index]?.trim() ?? '';
        }
        return obj;
    });

    // CSVデータをテストデータに変換
    for (const row of narPlaceCsvDataObjects) {
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
                console.warn(`不正な日付形式をスキップします: ${rawDateTime}`);
                continue;
            }

            const dateTime = parsedDate.toISOString();
            const location = row.location.trim();
            const id = row.id.trim();
            const number = Number.parseInt(row.number.trim(), 10);
            const name = row.name.trim();

            if (!location || !id) {
                console.warn(
                    `必要なデータが不足している行をスキップします: ${JSON.stringify(row)}`,
                );
                continue;
            }
            testData.push({
                id,
                number,
                dateTime,
                name,
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
    return testData;
}

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
        db.exec(
            `DELETE FROM races WHERE id LIKE 'jra%' OR id LIKE 'nar%' OR id LIKE 'keirin%' OR id LIKE 'world%'`,
        );

        const placesData = createNarPlaceDatabase();

        const racesData = createNarRaceDatabase();

        console.log(`${placesData.length}件のデータを登録します...`);

        // テストデータの挿入
        console.log('テストデータを挿入中...');
        const placesInsert = db.prepare(`
            INSERT INTO places (id, dateTime, location, type)
            VALUES (@id, @dateTime, @location, @type)
            ON CONFLICT(id) DO NOTHING
        `);
        try {
            for (const data of placesData) {
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
                placesInsert.run(data);
            }
        } catch (error) {
            console.error('データの挿入中にエラーが発生しました:', error);
            throw error;
        }

        console.log(`${racesData.length}件のデータを登録します...`);

        // テストデータの挿入
        console.log('テストデータを挿入中...');
        const racesInsert = db.prepare(`
            INSERT INTO races (id, number, dateTime, name)
            VALUES (@id, @number, @dateTime, @name)
            ON CONFLICT(id, number) DO NOTHING
        `);
        try {
            for (const data of racesData) {
                //         // 必須フィールドの型チェック
                const isValid =
                    typeof data.dateTime === 'string' &&
                    typeof data.name === 'string' &&
                    typeof data.id === 'string' &&
                    typeof data.number === 'number' &&
                    data.number > 0;
                if (!isValid) {
                    console.warn('不正なデータをスキップします:', data);
                    continue;
                }
                racesInsert.run(data);
            }
        } catch (error) {
            console.error('データの挿入中にエラーが発生しました:', error);
            throw error;
        }

        // データの取得テスト
        console.log('挿入したデータを確認中...');
        const placeResults = db
            .prepare('SELECT * FROM places ORDER BY dateTime')
            .all();
        console.log('取得した開催場データ件数:', placeResults.length);
        // for (const row of placeResults) {
        //     console.log(row);
        // }

        const raceResults = db
            .prepare('SELECT * FROM races ORDER BY dateTime')
            .all();
        console.log('取得したレースデータ件数:', raceResults.length);
        // for (const row of raceResults) {
        //     console.log(row);
        // }

        console.log('データベーステストが正常に完了しました。');
        sqliteManager.close();
    } catch (error) {
        console.error('データベーステストでエラーが発生しました:', error);
        throw error;
    }
}

// テストの実行
checkDatabase();
