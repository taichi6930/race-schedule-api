import type Database from 'better-sqlite3';

import { SQLiteManager } from '../src/utility/sqlite';
import { TestPlayerList } from './testData/playerTestData';

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

function createPlayerDatabase(): PlayerDetail[] {
    return TestPlayerList.map((player) => ({
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
    `);
}

function insertPlayerData(db: Database.Database): void {
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

function checkPlayerData(db: Database.Database): void {
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

function checkDatabase(): void {
    try {
        console.log('SQLiteデータベースの接続テストを開始します...');

        const sqliteManager = SQLiteManager.getInstance();
        const db = sqliteManager.getDatabase();

        // データベースの初期化
        initializeDatabase(db);

        // データの投入
        insertPlayerData(db);

        // データの確認
        checkPlayerData(db);

        console.log('データベーステストが正常に完了しました。');
        sqliteManager.close();
    } catch (error) {
        console.error('データベーステストでエラーが発生しました:', error);
        throw error;
    }
}

// メイン処理の実行
checkDatabase();
