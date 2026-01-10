import type { UpsertResult } from '../../../packages/shared/src/utilities/upsertResult';
import type { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import type { RaceEntity } from '../../repository/entity/raceEntity';

export interface IOldRaceUseCase {
    /**
     * 開催レースのEntity配列を取得する
     * @param searchRaceFilter - レースフィルター情報
     */
    fetchRaceEntityList: (
        searchRaceFilter: SearchRaceFilterEntity,
    ) => Promise<RaceEntity[]>;

    /**
     * 開催レースのEntity配列の更新を行う
     * @param searchRaceFilter - レースフィルター情報
     */
    upsertRaceEntityList: (
        searchRaceFilter: SearchRaceFilterEntity,
    ) => Promise<UpsertResult>;
}
