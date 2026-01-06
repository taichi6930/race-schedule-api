import { inject, injectable } from 'tsyringe';

import { PlaceMasterEntity } from '../../domain/entity/placeMasterEntity';
import { IDBGateway } from '../../gateway/interface/IDBGateway';
import { IPlaceMasterRepository } from '../interface/IPlaceMasterRepository';
import { PlaceMasterMapper } from '../mapper/placeMasterMapper';

@injectable()
export class PlaceMasterRepositoryFromStorage implements IPlaceMasterRepository {
    public constructor(
        @inject('DBGateway')
        private readonly dbGateway: IDBGateway,
    ) {}

    public async fetchAll(): Promise<PlaceMasterEntity[]> {
        const sql = 'SELECT * FROM place_master';
        const { results } = await this.dbGateway.queryAll(sql, []);
        return results.map((result) => PlaceMasterMapper.toEntity(result));
    }

    public async upsert(entity: PlaceMasterEntity): Promise<void> {
        const sql = `
      INSERT INTO place_master (
        race_type, course_code_type, place_name, place_code, created_at, updated_at
      ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(race_type, course_code_type, place_name) DO UPDATE SET
        place_code = excluded.place_code,
        updated_at = CURRENT_TIMESTAMP
    `;
        await this.dbGateway.run(sql, [
            entity.raceType,
            entity.courseCodeType,
            entity.placeName,
            entity.placeCode,
        ]);
    }
}
