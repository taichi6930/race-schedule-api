import { RaceEntity } from '@race-schedule/shared/src/entity/raceEntity';
import { UpsertResult } from '@race-schedule/shared/src/utilities/upsertResult';
import { inject, injectable } from 'tsyringe';

import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { SearchRaceFilterParams } from '../../types/searchRaceFilter';
import { IRaceService } from '../interface/IRaceService';

/**
 * レース情報取得サービス実装
 */
@injectable()
export class RaceService implements IRaceService {
    public constructor(
        @inject('RaceRepository')
        private readonly raceRepository: IRaceRepository,
    ) {}

    public async fetch(
        searchRaceFilterParams: SearchRaceFilterParams,
    ): Promise<RaceEntity[]> {
        return this.raceRepository.fetch(searchRaceFilterParams);
    }

    public async upsert(entityList: RaceEntity[]): Promise<UpsertResult> {
        return this.raceRepository.upsert(entityList);
    }
}
