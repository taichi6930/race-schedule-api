import '../../utility/format';

import type { Database } from 'better-sqlite3';
import { injectable } from 'tsyringe';
import { z } from 'zod';

import { NarPlaceData } from '../../domain/narPlaceData';
import { Logger } from '../../utility/logger';
import { withDatabase } from '../../utility/sqlite';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

// Zodスキーマの定義
const NarPlaceRecordSchema = z.object({
    id: z.string(),
    dateTime: z.string(),
    location: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});

@injectable()
export class NarPlaceRepositoryFromSqliteImpl
    implements IPlaceRepository<NarPlaceEntity>
{
    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<NarPlaceEntity[]> {
        const result = await Promise.resolve(
            withDatabase((db: Database) => {
                const sql = `
                    SELECT id, dateTime, location, created_at, updated_at
                    FROM places 
                    WHERE dateTime BETWEEN ? AND ?
                `;

                const stmt = db.prepare(sql);
                const rows = stmt.all({
                    1: searchFilter.startDate.toISOString(),
                    2: searchFilter.finishDate.toISOString(),
                });

                // 型安全な変換
                const validRows = z.array(NarPlaceRecordSchema).parse(rows);

                return validRows.map((row) => {
                    const placeData = NarPlaceData.create(
                        new Date(row.dateTime),
                        row.location,
                    );
                    return NarPlaceEntity.create(
                        row.id,
                        placeData,
                        new Date(row.updated_at),
                    );
                });
            }),
        );

        return result;
    }

    /**
     * 開催データを登録する
     * @param placeEntityList
     */
    @Logger
    public async registerPlaceEntityList(
        placeEntityList: NarPlaceEntity[],
    ): Promise<void> {
        const dbOperation = (db: Database): void => {
            const insertSql = `
                INSERT OR REPLACE INTO places (
                    id,
                    dateTime,
                    location,
                    updated_at
                ) VALUES (
                    @id,
                    @dateTime,
                    @location,
                    @updated_at
                )
            `;

            const stmt = db.prepare(insertSql);

            const insertPlace = db.transaction((entities: NarPlaceEntity[]) => {
                for (const entity of entities) {
                    const params = {
                        id: entity.id,
                        dateTime: entity.placeData.dateTime.toISOString(),
                        location: entity.placeData.location,
                        updated_at: entity.updateDate.toISOString(),
                    };
                    stmt.run(params);
                }
            });

            insertPlace(placeEntityList);
        };

        await new Promise<void>((resolve) => {
            withDatabase((db) => {
                dbOperation(db);
                resolve();
            });
        });
    }
}
