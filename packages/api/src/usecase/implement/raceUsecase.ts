import { RaceEntity } from '@race-schedule/shared/src/entity/raceEntity';
import { inject, injectable } from 'tsyringe';

import { IRaceService } from '../../service/interface/IRaceService';
import { SearchRaceFilterParams } from '../../types/searchRaceFilter';
import { IRaceUsecase } from '../interface/IRaceUsecase';

/**
 * レース情報取得ユースケース実装
 */
@injectable()
export class RaceUsecase implements IRaceUsecase {
    public constructor(
        @inject('RaceService')
        private readonly raceService: IRaceService,
    ) {}

    public async fetch(
        searchRaceFilterParams: SearchRaceFilterParams,
    ): Promise<RaceEntity[]> {
        return this.raceService.fetch(searchRaceFilterParams);
    }
}
