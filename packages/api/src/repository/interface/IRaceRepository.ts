import type { RaceEntity } from '@race-schedule/shared/src/entity/raceEntity';
import type { UpsertResult } from '@race-schedule/shared/src/utilities/upsertResult';

import type { SearchRaceFilterParams } from '../../types/searchRaceFilter';

/**
 * レース情報取得リポジトリのインターフェース
 */
export interface IRaceRepository {
    /**
     * レース情報のEntity配列を取得する
     * @param searchRaceFilterParams - レース情報フィルター情報
     */
    fetch: (
        searchRaceFilterParams: SearchRaceFilterParams,
    ) => Promise<RaceEntity[]>;

    /**
     * レース情報Entity配列をupsertする
     * @param entityList - upsert対象のEntity配列
     */
    upsert: (entityList: RaceEntity[]) => Promise<UpsertResult>;
}
