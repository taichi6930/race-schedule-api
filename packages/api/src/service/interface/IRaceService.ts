import type { RaceEntity } from '@race-schedule/shared/src/entity/raceEntity';
import type { UpsertResult } from '@race-schedule/shared/src/utilities/upsertResult';

import type { SearchRaceFilterParams } from '../../types/searchRaceFilter';

export interface IRaceService {
    /**
     * レース情報のEntity配列を取得する
     * @param searchRaceFilterParams - レース情報フィルター情報
     */
    fetch: (
        searchRaceFilterParams: SearchRaceFilterParams,
    ) => Promise<RaceEntity[]>;

    /**
     * 開催場のEntity配列をupsertする
     * @param entityList - upsert対象のEntity配列
     */
    upsert: (entityList: RaceEntity[]) => Promise<UpsertResult>;
}
