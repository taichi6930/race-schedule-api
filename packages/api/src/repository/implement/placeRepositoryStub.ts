import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import { injectable } from 'tsyringe';

import type { SearchPlaceFilterParams } from '../../types/searchPlaceFilter';
import type { IPlaceRepository } from '../interface/IPlaceRepository';

/**
 * PlaceRepositoryのStub（テスト用ダミー実装）
 */
@injectable()
export class PlaceRepositoryStub implements IPlaceRepository {
    public async fetch(
        _searchPlaceFilterParams: SearchPlaceFilterParams,
    ): Promise<PlaceEntity[]> {
        // ダミーデータ返却
        return [
            {
                placeId: 'JRA2026010101',
                raceType: _searchPlaceFilterParams.raceTypeList[0],
                datetime: new Date('2026-01-01'),
                locationCode: '01',
                placeName: '札幌',
                placeHeldDays: {
                    heldTimes: 1,
                    heldDayTimes: 1,
                },
            },
        ];
    }
}
