import type { RaceEntity } from '@race-schedule/shared/src/entity/raceEntity';

import type { SearchRaceFilterParams } from '../../types/searchRaceFilter';
import type { UpsertResult } from './../../../../shared/src/utilities/upsertResult';

/**
 * レース開催ユースケースのインターフェース
 */
export interface IRaceUsecase {
    /**
     * レース開催のEntity配列を取得する
     * @param searchRaceFilterParams - レース情報フィルター情報
     */
    fetch: (
        searchRaceFilterParams: SearchRaceFilterParams,
    ) => Promise<RaceEntity[]>;

    /**
     * レース開催のEntity配列の更新を行う
     * @param entityList - レースエンティティ配列
     */
    upsert: (entityList: RaceEntity[]) => Promise<UpsertResult>;
}
