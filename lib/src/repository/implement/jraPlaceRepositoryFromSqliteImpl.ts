import Database from 'better-sqlite3';
import { injectable } from 'tsyringe';

import { JraPlaceData } from '../../domain/jraPlaceData';
import { Logger } from '../../utility/logger';
import { SQLiteManager } from '../../utility/sqlite';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

interface JraPlaceRow {
    id: string;
    race_type: string;
    datetime: string;
    location: string;
    updated_at: string;
    created_at: string;
    held_times: number;
    held_day_times: number;
}

@injectable()
export class JraPlaceRepositoryFromSqliteImpl
    implements IPlaceRepository<JraPlaceEntity>
{
    private readonly db: Database.Database;

    public constructor() {
        this.db = SQLiteManager.getInstanceForSchedule().getDatabase();
    }

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter - 検索条件を指定するフィルターエンティティ
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<JraPlaceEntity[]> {
        try {
            const stmt = this.db.prepare(`
            SELECT place_data.id, place_data.race_type, place_data.datetime, place_data.location, place_data.created_at, place_data.updated_at, place_held_data.held_times, place_held_data.held_day_times
            FROM place_data
            LEFT JOIN place_held_data ON place_data.id = place_held_data.id
            WHERE place_data.datetime >= @startDate
                AND place_data.datetime <= @finishDate
                AND place_data.race_type = 'jra'
            ORDER BY place_data.datetime, place_data.location;
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
            const isJraPlaceRow = (row: unknown): row is JraPlaceRow => {
                if (
                    typeof row !== 'object' ||
                    row === null ||
                    !('id' in row) ||
                    !('race_type' in row) ||
                    !('datetime' in row) ||
                    !('location' in row) ||
                    !('created_at' in row) ||
                    !('updated_at' in row) ||
                    !('held_times' in row) ||
                    !('held_day_times' in row)
                ) {
                    return false;
                }

                // held_timesとheld_day_timesが数値型であることを確認
                const typedRow = row as Record<string, unknown>;
                const heldTimes = Number(typedRow.held_times);
                const heldDayTimes = Number(typedRow.held_day_times);

                if (Number.isNaN(heldTimes) || Number.isNaN(heldDayTimes)) {
                    // NaNの場合はデフォルト値として0を設定
                    typedRow.held_times = 0;
                    typedRow.held_day_times = 0;
                }

                return true;
            };

            // 各行を検証してから変換
            const validatedRows: JraPlaceRow[] = [];
            for (const row of rows) {
                if (isJraPlaceRow(row)) {
                    validatedRows.push(row);
                } else {
                    console.warn('Invalid row structure detected:', row);
                }
            }

            const entities = validatedRows.map((row) =>
                JraPlaceEntity.create(
                    row.id,
                    JraPlaceData.create(
                        new Date(row.datetime),
                        row.location,
                        row.held_times,
                        row.held_day_times,
                    ),
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
        placeEntityList: JraPlaceEntity[],
    ): Promise<void> {
        try {
            const transaction = this.db.transaction(
                (entities: JraPlaceEntity[]) => {
                    for (const entity of entities) {
                        const stmt = this.db.prepare(`
                        INSERT INTO place_data (id, race_type, datetime, location, updated_at)
                        VALUES (@id, 'jra', @dateTime, @location, @updateDate)
                        ON CONFLICT(id) DO UPDATE SET
                            datetime = excluded.datetime,
                            location = excluded.location,
                            updated_at = excluded.updated_at;
                    `);

                        stmt.run({
                            id: entity.id,
                            dateTime: entity.placeData.dateTime.toISOString(),
                            location: entity.placeData.location,
                            updateDate: entity.updateDate.toISOString(),
                        });

                        const heldStmt = this.db.prepare(`
                        INSERT INTO place_held_data (id, held_times, held_day_times)
                        VALUES (@id, @heldTimes, @heldDayTimes)
                        ON CONFLICT(id) DO UPDATE SET
                            held_times = excluded.held_times,
                            held_day_times = excluded.held_day_times;
                    `);

                        heldStmt.run({
                            id: entity.id,
                            heldTimes: entity.placeData.heldTimes,
                            heldDayTimes: entity.placeData.heldDayTimes,
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
