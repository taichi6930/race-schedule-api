import '../../utility/format';

import Database from 'better-sqlite3';
import { injectable } from 'tsyringe';

import { NarPlaceData } from '../../domain/narPlaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType, SQLiteManager } from '../../utility/sqlite';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

interface RaceRow {
    id: string;
    dateTime: string;
    location: string;
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
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<NarPlaceEntity[]> {
        const query = this.db.prepare(`
            SELECT id, dateTime, location
            FROM places
            WHERE type = @type AND dateTime BETWEEN @startDate AND @endDate
            ORDER BY dateTime DESC
        `);

        console.log(query);

        const params = {
            type: RaceType.NAR,
            startDate: searchFilter.startDate.toISOString(),
            endDate: searchFilter.finishDate.toISOString(),
        };

        const results = await new Promise<unknown[]>((resolve) => {
            resolve(query.all(params));
        });
        const raceRows = results.filter((row): row is RaceRow => {
            if (typeof row !== 'object' || row === null) {
                return false;
            }
            const hasRequiredProperties =
                'id' in row && 'dateTime' in row && 'location' in row;
            if (!hasRequiredProperties) {
                return false;
            }
            return (
                typeof (row as { id: unknown }).id === 'string' &&
                typeof (row as { dateTime: unknown }).dateTime === 'string' &&
                typeof (row as { location: unknown }).location === 'string'
            );
        });

        const entities = raceRows.map((row) => {
            const placeData = NarPlaceData.create(
                new Date(row.dateTime),
                row.location,
            );
            return NarPlaceEntity.create(
                row.id,
                placeData,
                getJSTDate(new Date()),
            );
        });

        return Promise.all(entities);
    }

    @Logger
    public async registerPlaceEntityList(
        placeEntityList: NarPlaceEntity[],
    ): Promise<void> {
        const insertOrUpdate = this.db.prepare(`
            INSERT INTO places (id, dateTime, location, type)
            VALUES (@id, @dateTime, @location, @type)
            ON CONFLICT(id) DO UPDATE SET
                dateTime = @dateTime,
                location = @location,
                updated_at = CURRENT_TIMESTAMP
        `);

        await new Promise<void>((resolve) => {
            const transaction = this.db.transaction(
                (places: NarPlaceEntity[]) => {
                    for (const place of places) {
                        insertOrUpdate.run({
                            id: place.id,
                            dateTime: place.placeData.dateTime.toISOString(),
                            location: place.placeData.location,
                            type: RaceType.NAR,
                        });
                    }
                },
            );

            transaction(placeEntityList);
            resolve();
        });
    }
}
