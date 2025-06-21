import Database from 'better-sqlite3';
import { injectable } from 'tsyringe';

import { NarPlaceData } from '../../domain/narPlaceData';
import { Logger } from '../../utility/logger';
import { SQLiteManager } from '../../utility/sqlite';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

interface NarPlaceRow {
    id: string;
    race_type: string;
    datetime: string;
    location: string;
    created_at: string;
    updated_at: string;
}

@injectable()
export class NarPlaceRepositoryFromSqliteImpl
    implements IPlaceRepository<NarPlaceEntity>
{
    private readonly db: Database.Database;

    public constructor() {
        this.db = SQLiteManager.getInstance().getDatabase();
    }

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter - 検索条件を指定するフィルターエンティティ
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<NarPlaceEntity[]> {
        try {
            const stmt = this.db.prepare(`
                SELECT id, race_type, datetime, location, created_at, updated_at
                FROM place_data
                WHERE datetime >= @startDate
                    AND datetime <= @finishDate
                    AND race_type = 'nar'
                ORDER BY datetime, location;
            `);

            const rows = stmt.all({
                startDate: searchFilter.startDate.toISOString(),
                finishDate: searchFilter.finishDate.toISOString(),
            });

            // 型ガードを使用して安全に型を確認
            if (!Array.isArray(rows)) {
                throw new TypeError('Unexpected result format from database');
            }

            // 各行のデータ構造を検証する関数
            const isNarPlaceRow = (row: unknown): row is NarPlaceRow => {
                return (
                    typeof row === 'object' &&
                    row !== null &&
                    'id' in row &&
                    'race_type' in row &&
                    'datetime' in row &&
                    'location' in row &&
                    'created_at' in row &&
                    'updated_at' in row
                );
            };

            // 各行を検証してから変換
            const validatedRows: NarPlaceRow[] = [];
            for (const row of rows) {
                if (isNarPlaceRow(row)) {
                    validatedRows.push(row);
                } else {
                    console.warn('Invalid row structure detected:', row);
                }
            }

            const entities = validatedRows.map((row) =>
                NarPlaceEntity.create(
                    row.id,
                    NarPlaceData.create(new Date(row.datetime), row.location),
                    new Date(row.updated_at),
                ),
            );

            return await Promise.resolve(entities);
        } catch (error) {
            console.error('Error fetching place entity list:', error);
            throw error;
        }
    }

    /**
     * 開催場所データを一括で登録/更新します
     * @param placeEntityList - 登録/更新する開催場所エンティティの配列
     */
    @Logger
    public async registerPlaceEntityList(
        placeEntityList: NarPlaceEntity[],
    ): Promise<void> {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO place_data (id, race_type, datetime, location, updated_at)
                VALUES (@id, 'nar', @dateTime, @location, @updateDate)
                ON CONFLICT(id) DO UPDATE SET
                    datetime = excluded.datetime,
                    location = excluded.location,
                    updated_at = excluded.updated_at;
            `);

            const transaction = this.db.transaction(
                (places: NarPlaceEntity[]) => {
                    for (const place of places) {
                        stmt.run({
                            id: place.id,
                            dateTime: place.placeData.dateTime.toISOString(),
                            location: place.placeData.location,
                            updateDate: place.updateDate.toISOString(),
                        });
                    }
                },
            );

            transaction(placeEntityList);
            await Promise.resolve();
        } catch (error) {
            console.error('Error registering place entity list:', error);
            throw error;
        }
    }
}
