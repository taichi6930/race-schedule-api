import { injectable } from 'tsyringe';

import { runSqliteCommand } from '../../../scripts/sqliteSetting';
import { NarPlaceData } from '../../domain/narPlaceData';
import { Logger } from '../../utility/logger';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

interface NarPlaceRow {
    id: string;
    datetime: string;
    location: string;
    updatedAt: string;
}

@injectable()
export class NarPlaceRepositoryFromSqliteImpl
    implements IPlaceRepository<NarPlaceEntity>
{
    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter - 検索条件を指定するフィルターエンティティ
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<NarPlaceEntity[]> {
        const query = `
            SELECT id, datetime, location, updated_at
            FROM nar_place_data
            WHERE datetime >= '${searchFilter.startDate.toISOString()}'
                AND datetime <= '${searchFilter.finishDate.toISOString()}'
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
                const [id, datetime, location, updatedAt] = line
                    .split('|')
                    .map((s) => s.trim());
                return { id, datetime, location, updatedAt } as NarPlaceRow;
            });

        return rows.map((row) =>
            NarPlaceEntity.create(
                row.id,
                NarPlaceData.create(new Date(row.datetime), row.location),
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
        placeEntityList: NarPlaceEntity[],
    ): Promise<void> {
        const transaction = placeEntityList
            .map((place) => {
                const query = `
                INSERT INTO nar_place_data (id, datetime, location, updated_at)
                VALUES (
                    '${place.id}',
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
