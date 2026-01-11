import type { RaceEntity } from '@race-schedule/shared/src/entity/raceEntity';

import type { SearchRaceFilterParams } from '../../types/searchRaceFilter';

export interface IRaceService {
    /**
     * レース情報のEntity配列を取得する
     * @param searchRaceFilterParams - レース情報フィルター情報
     */
    fetch: (
        searchRaceFilterParams: SearchRaceFilterParams,
    ) => Promise<RaceEntity[]>;
}
