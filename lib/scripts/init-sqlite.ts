import 'reflect-metadata';
import '../container/repository';

import type { Database } from 'better-sqlite3';
import { container } from 'tsyringe';

import { NarPlaceData } from '../src/domain/narPlaceData';
import { NarPlaceEntity } from '../src/repository/entity/narPlaceEntity';
import type { NarPlaceRepositoryFromSqliteImpl } from '../src/repository/implement/narPlaceRepositoryFromSqliteImpl';
import { withDatabase } from '../src/utility/sqlite';

/**
 * データベースの初期化
 */
const initDatabase = async (): Promise<void> => {
    console.log('データベースの初期化を開始します...');

    withDatabase((db: Database) => {
        // テーブルの作成
        db.exec(`
            DROP TABLE IF EXISTS places;
            CREATE TABLE places (
                id TEXT PRIMARY KEY,
                dateTime TEXT NOT NULL,
                location TEXT NOT NULL,
                type TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
        `);

        console.log('テーブルを作成しました');
    });

    // サンプルデータの投入
    const repository =
        container.resolve<NarPlaceRepositoryFromSqliteImpl>(
            'NarPlaceRepository',
        );
    const sampleData = [
        {
            dateTime: new Date('2025-04-04T10:00:00.000Z'),
            location: '園田',
        },
        {
            dateTime: new Date('2025-04-05T10:00:00.000Z'),
            location: '姫路',
        },
        {
            dateTime: new Date('2025-04-06T10:00:00.000Z'),
            location: '高知',
        },
    ];

    const entities = sampleData.map((data) =>
        NarPlaceEntity.createWithoutId(
            NarPlaceData.create(data.dateTime, data.location),
            new Date(),
        ),
    );

    await repository.registerPlaceEntityList(entities);
    console.log('サンプルデータを登録しました');
    console.log('初期化が完了しました');
};

/**
 * メインの実行関数
 */
const main = async (): Promise<void> => {
    try {
        await initDatabase();
    } catch (error: unknown) {
        console.error('データベースの初期化に失敗しました:', error);
    }
};

// スクリプトの実行
void main();
