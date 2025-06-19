import { injectable } from 'tsyringe';

import { runSqliteCommand } from '../../../scripts/sqliteSetting';
import { JraPlaceData } from '../../domain/jraPlaceData';
import { Logger } from '../../utility/logger';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

interface JraPlaceRow {
    id: string;
    raceType: string;
    datetime: string;
    location: string;
    updatedAt: string;
}

@injectable()
export class JraPlaceRepositoryFromSqliteImpl
    implements IPlaceRepository<JraPlaceEntity>
{
    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter - 検索条件を指定するフィルターエンティティ
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<JraPlaceEntity[]> {
        // select k.id, k.datetime, k.location, h.held_times, h.held_day_times from place_data as k LEFT JOIN place_held_data as h ON k.id = h.id;
        const query = `
            SELECT id, race_type, datetime, location, updated_at
            FROM place_data
            WHERE datetime >= '${searchFilter.startDate.toISOString()}'
                AND datetime <= '${searchFilter.finishDate.toISOString()}'
                AND race_type = 'jra'
            ORDER BY datetime, location;
        `;

        const result = await Promise.resolve(runSqliteCommand(query));
        if (result === undefined || result.trim().length === 0) {
            return [];
        }

        const rows = result
            .split('\n')
            .filter((line) => line.trim().length > 0)
            .map((line) => {
                const [id, raceType, datetime, location, updatedAt] = line
                    .split('|')
                    .map((s) => s.trim());
                return {
                    id,
                    raceType,
                    datetime,
                    location,
                    updatedAt,
                } as JraPlaceRow;
            });

        return rows.map((row) =>
            JraPlaceEntity.create(
                row.id,
                JraPlaceData.create(new Date(row.datetime), row.location),
                new Date(row.updatedAt),
            ),
        );
    }

    /**
     * 開催場所データを一括で登録/更新します
     * @param placeEntityList - 登録/更新する開催場所エンティティの配列
     */
    @Logger
    public async registerPlaceEntityList(
        placeEntityList: JraPlaceEntity[],
    ): Promise<void> {
        const transaction = placeEntityList
            .map((place) => {
                const query = `
                INSERT INTO place_data (id, race_type, datetime, location, updated_at)
                VALUES (
                    '${place.id}',
                    'jra',
                    '${place.placeData.dateTime.toISOString()}',
                    '${place.placeData.location}',
                    '${place.updateDate.toISOString()}'
                )
                ON CONFLICT(id) DO UPDATE SET
                    datetime = excluded.datetime,
                    location = excluded.location,
                    updated_at = excluded.updated_at;
            `;
                return query;
            })
            .join('\n');

        const result = await Promise.resolve(runSqliteCommand(transaction));
        if (result === undefined) {
            throw new Error('Failed to insert/update records');
        }
    }
}
