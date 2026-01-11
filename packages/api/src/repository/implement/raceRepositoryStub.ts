import { RaceEntity } from '@race-schedule/shared/src/entity/raceEntity';
import { injectable } from 'tsyringe';

import { SearchRaceFilterParams } from '../../types/searchRaceFilter';
import { IRaceRepository } from '../interface/IRaceRepository';

/**
 * RaceRepositoryのStub（テスト用ダミー実装）
 */
@injectable()
export class RaceRepositoryStub implements IRaceRepository {
    public async fetch(
        _searchRaceFilterParams: SearchRaceFilterParams,
    ): Promise<RaceEntity[]> {
        // ダミーデータ返却
        return [
            {
                raceId: 'JRA202601010101',
                placeId: 'JRA2026010101',
                raceType: _searchRaceFilterParams.raceTypeList[0],
                datetime: new Date('2026-01-01'),
                locationCode: '01',
                placeName: '札幌',
                raceNumber: 1,
                placeHeldDays: {
                    heldTimes: 1,
                    heldDayTimes: 1,
                },
            },
        ];
    }
}
