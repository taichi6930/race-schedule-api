import 'reflect-metadata';

import { isRaceType, RaceType } from '../../utility/raceType';
interface PlaceRow {
    id: string;
    race_type: string;
    date_time: string;
    location: string;
    update_date?: string;
}

import { inject, injectable } from 'tsyringe';

import { ISQLiteGateway } from '../../gateway/interface/ISQLiteGateway';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import { PlaceId } from '../../utility/data/common/placeId';
import { Logger } from '../../utility/logger';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

@injectable()
export class PlaceRepository implements IPlaceRepository {
    public constructor(
        @inject('SQLiteGateway')
        private readonly gateway: ISQLiteGateway,
    ) {}

    @Logger
    public upsert(place: PlaceRecord): void {
        const query = `
            INSERT INTO places (id, raceType, dateTime, location)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                raceType=excluded.raceType,
                dateTime=excluded.dateTime,
                location=excluded.location`;
        this.gateway.run(query, [
            place.id,
            place.raceType,
            place.dateTime,
            place.location,
        ]);
    }

    @Logger
    public findById(id: PlaceId): PlaceRecord | undefined {
        const query = 'SELECT * FROM places WHERE id = ?';
        return this.gateway.get<PlaceRecord>(query, [id]);
    }

    @Logger
    public async findByRaceType(raceType: RaceType): Promise<PlaceRecord[]> {
        const query = 'SELECT * FROM places WHERE race_type = ?';
        const result = await this.gateway.all<PlaceRow>(query, [raceType]);
        if (!Array.isArray(result)) return [];
        return result
            .map((row: PlaceRow) => {
                const updateDate: Date =
                    typeof row.update_date === 'string' &&
                    row.update_date.trim() !== ''
                        ? new Date(row.update_date)
                        : new Date(0);
                if (!isRaceType(row.race_type)) {
                    return 'none';
                }
                return PlaceRecord.create(
                    row.id,
                    row.race_type,
                    new Date(row.date_time),
                    row.location,
                    updateDate,
                );
            })
            .filter((record): record is PlaceRecord => record !== 'none');
    }

    @Logger
    public async findBySearchFilter(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<PlaceRecord[]> {
        const query =
            `
            SELECT * FROM places
            WHERE date_time BETWEEN ? AND ?` +
            (searchFilter.raceTypeList && searchFilter.raceTypeList.length > 0
                ? ` AND race_type IN (${searchFilter.raceTypeList.map(() => '?').join(',')})`
                : '');
        const params = [
            searchFilter.startDate.toString(),
            searchFilter.finishDate.toString(),
            ...(searchFilter.raceTypeList ?? []),
        ];
        const result = await this.gateway.all<PlaceRow>(query, params);
        if (!Array.isArray(result)) return [];
        return result
            .map((row: PlaceRow) => {
                const updateDate: Date =
                    typeof row.update_date === 'string' &&
                    row.update_date.trim() !== ''
                        ? new Date(row.update_date)
                        : new Date(0);
                if (!isRaceType(row.race_type)) {
                    return 'none';
                }
                return PlaceRecord.create(
                    row.id,
                    row.race_type,
                    new Date(row.date_time),
                    row.location,
                    updateDate,
                );
            })
            .filter((record): record is PlaceRecord => record !== 'none');
    }

    /**
     * 全ての開催場所情報を取得します。
     * @returns 開催場所情報のリスト
     */
    @Logger
    public async findAll(): Promise<PlaceRecord[]> {
        const query = 'SELECT * FROM places';
        const result = await this.gateway.all<PlaceRow>(query);
        if (!Array.isArray(result)) return [];
        return result
            .map((row: PlaceRow) => {
                const updateDate: Date =
                    typeof row.update_date === 'string' &&
                    row.update_date.trim() !== ''
                        ? new Date(row.update_date)
                        : new Date(0);
                if (!isRaceType(row.race_type)) {
                    return 'none';
                }
                return PlaceRecord.create(
                    row.id,
                    row.race_type,
                    new Date(row.date_time),
                    row.location,
                    updateDate,
                );
            })
            .filter((record): record is PlaceRecord => record !== 'none');
    }

    @Logger
    public deleteById(id: string): void {
        const query = 'DELETE FROM places WHERE id = ?';
        this.gateway.run(query, [id]);
    }
}
