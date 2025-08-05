import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { ISQLiteGateway } from '../../gateway/interface/ISQLiteGateway';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import { PlaceId } from '../../utility/data/common/placeId';
import { Logger } from '../../utility/logger';
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
    public async findAll(): Promise<PlaceRecord[]> {
        const query = 'SELECT * FROM places';
        const result = await this.gateway.all<PlaceRecord>(query);
        return Array.isArray(result)
            ? Promise.resolve(result)
            : Promise.resolve([]);
    }

    @Logger
    public deleteById(id: string): void {
        const query = 'DELETE FROM places WHERE id = ?';
        this.gateway.run(query, [id]);
    }
}
