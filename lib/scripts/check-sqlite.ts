    import type Database from 'better-sqlite3';
import fs from 'node:fs';

import { PlayerList } from '../src/service/implement/playerDataService';
import { RaceType, SQLiteManager } from '../src/utility/sqlite';

interface PlayerDetail {
    id: number;
    raceType: string;
    playerNumber: string;
    name: string;
    priority: number;
}

interface PlayerCount {
    raceType: string;
    count: number;
}

interface PlayerPriorityCount extends PlayerCount {
    priority: number;
}

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

function createPlayerDatabase(): PlayerDetail[] {
    return PlayerList.map((player) => ({
        id: 0, // SQLiteで自動採番
        raceType: player.raceType,
        playerNumber: player.playerNumber,
        name: player.name,
        priority: player.priority,
    }));
}

function initializeDatabase(db: Database.Database): void {
    console.log('\nテストデータを削除中...');
    db.exec(`
        -- playerテーブルの作成
        DROP TABLE IF EXISTS player;
        CREATE TABLE player (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            raceType TEXT NOT NULL,
            playerNumber TEXT NOT NULL,
            name TEXT NOT NULL,
            priority INTEGER NOT NULL,
            UNIQUE(raceType, playerNumber)
        );

        -- 既存のテーブルのクリーンアップ
        DELETE FROM places WHERE id LIKE 'jra%' OR id LIKE 'nar%' OR id LIKE 'keirin%' OR id LIKE 'world%';
        DELETE FROM races WHERE id LIKE 'jra%' OR id LIKE 'nar%' OR id LIKE 'keirin%' OR id LIKE 'world%';
    `);
}

async function insertPlayerData(db: Database.Database): Promise<void> {
    await Promise.resolve(); // async/await要件を満たすためのダミープロミス
    console.log('\nplayerテーブルにデータを投入します...');
    const playerInsert = db.prepare(`
        INSERT INTO player (raceType, playerNumber, name, priority)
        VALUES (@raceType, @playerNumber, @name, @priority)
        ON CONFLICT(raceType, playerNumber) DO UPDATE SET
            name = excluded.name,
            priority = excluded.priority
    `);

    try {
        const playerData = createPlayerDatabase();
        for (const data of playerData) {
            const isValid =
                typeof data.raceType === 'string' &&
                typeof data.playerNumber === 'string' &&
                typeof data.name === 'string' &&
                typeof data.priority === 'number';

            if (!isValid) {
                console.warn('不正なデータをスキップします:', data);
                continue;
            }
            playerInsert.run(data);
        }
        console.log(`${playerData.length}件のプレイヤーデータを登録しました`);
    } catch (error) {
        console.error('プレイヤーデータの挿入中にエラーが発生しました:', error);
        throw error;
    }
}

async function insertNarPlaceData(db: Database.Database): Promise<void> {
    await Promise.resolve(); // async/await要件を満たすためのダミープロミス
    const placesData = createNarPlaceDatabase();
    console.log(`\n${placesData.length}件の開催データを登録します...`);
    console.log('テストデータを挿入中...');

    const placesInsert = db.prepare(`
        INSERT INTO places (id, dateTime, location, type)
        VALUES (@id, @dateTime, @location, @type)
        ON CONFLICT(id) DO NOTHING
    `);

    try {
        for (const data of placesData) {
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
}

async function insertNarRaceData(db: Database.Database): Promise<void> {
    await Promise.resolve(); // async/await要件を満たすためのダミープロミス
    const racesData = createNarRaceDatabase();
    console.log(`\n${racesData.length}件のレースデータを登録します...`);
    console.log('テストデータを挿入中...');

    const racesInsert = db.prepare(`
        INSERT INTO races (id, number, dateTime, name)
        VALUES (@id, @number, @dateTime, @name)
        ON CONFLICT(id, number) DO NOTHING
    `);

    try {
        for (const data of racesData) {
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
}

async function checkPlayerData(db: Database.Database): Promise<void> {
    await Promise.resolve(); // async/await要件を満たすためのダミープロミス
    console.log('\nplayerテーブルの確認中...');

    console.log('\n種目別の選手数:');
    const raceTypeResults = db
        .prepare(
            'SELECT raceType, COUNT(*) as count FROM player GROUP BY raceType',
        )
        .all();
    const countByRaceType = raceTypeResults.filter(
        (row): row is PlayerCount => {
            if (typeof row !== 'object' || row === null) return false;
            return (
                'raceType' in row &&
                'count' in row &&
                typeof row.raceType === 'string' &&
                typeof row.count === 'number'
            );
        },
    );
    for (const row of countByRaceType) {
        console.log(`${row.raceType}: ${row.count}名`);
    }

    console.log('\n優先度別の選手数:');
    const priorityResults = db
        .prepare(
            'SELECT raceType, priority, COUNT(*) as count FROM player GROUP BY raceType, priority ORDER BY raceType, priority DESC',
        )
        .all();
    const countByPriority = priorityResults.filter(
        (row): row is PlayerPriorityCount => {
            if (typeof row !== 'object' || row === null) return false;
            return (
                'raceType' in row &&
                'priority' in row &&
                'count' in row &&
                typeof row.raceType === 'string' &&
                typeof row.priority === 'number' &&
                typeof row.count === 'number'
            );
        },
    );
    for (const row of countByPriority) {
        console.log(`${row.raceType} - 優先度${row.priority}: ${row.count}名`);
    }

    console.log('\n選手データ詳細:');
    const detailResults = db
        .prepare(
            'SELECT * FROM player ORDER BY raceType, priority DESC, playerNumber',
        )
        .all();
    const playerResults = detailResults.filter((row): row is PlayerDetail => {
        if (typeof row !== 'object' || row === null) return false;
        return (
            'id' in row &&
            'raceType' in row &&
            'playerNumber' in row &&
            'name' in row &&
            'priority' in row &&
            typeof row.id === 'number' &&
            typeof row.raceType === 'string' &&
            typeof row.playerNumber === 'string' &&
            typeof row.name === 'string' &&
            typeof row.priority === 'number'
        );
    });
    console.log('取得したデータ:');
    for (const row of playerResults) {
        console.log(
            `[${row.raceType}] ${row.name}(${row.playerNumber}) - 優先度:${row.priority}`,
        );
    }
}

async function checkPlaceData(db: Database.Database): Promise<void> {
    await Promise.resolve(); // async/await要件を満たすためのダミープロミス
    console.log('\nplacesテーブルの確認...');
    const placeResults = db
        .prepare('SELECT * FROM places ORDER BY dateTime')
        .all();
    console.log('取得したデータ:');
    for (const row of placeResults) {
        console.log(row);
    }
}

async function checkRaceData(db: Database.Database): Promise<void> {
    await Promise.resolve(); // async/await要件を満たすためのダミープロミス
    console.log('\nracesテーブルの確認...');
    const raceResults = db
        .prepare('SELECT * FROM races ORDER BY dateTime')
        .all();
    console.log('取得したデータ:');
    for (const row of raceResults) {
        console.log(row);
    }
}

async function checkDatabase(): Promise<void> {
    try {
        console.log('SQLiteデータベースの接続テストを開始します...');

        const sqliteManager = SQLiteManager.getInstance();
        const db = sqliteManager.getDatabase();

        // データベースの初期化
        initializeDatabase(db);

        // データの投入
        await insertPlayerData(db);
        await insertNarPlaceData(db);
        await insertNarRaceData(db);

        // データの確認
        await checkPlayerData(db);
        await checkPlaceData(db);
        await checkRaceData(db);

        console.log('データベーステストが正常に完了しました。');
        sqliteManager.close();
    } catch (error) {
        console.error('データベーステストでエラーが発生しました:', error);
        throw error;
    }
}

// メイン処理の実行
checkDatabase()
    .then(() => {
        process.exitCode = 0;
    })
    .catch((error: unknown) => {
        console.error(
            'エラーが発生しました:',
            error instanceof Error ? error.message : String(error),
        );
        process.exitCode = 1;
    });
