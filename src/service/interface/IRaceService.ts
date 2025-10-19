import type { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import type { PlaceEntity } from '../../repository/entity/placeEntity';
import type { RaceEntity } from '../../repository/entity/raceEntity';
import type { DataLocationType } from '../../utility/dataType';
import type { UpsertResult } from '../../utility/upsertResult';

export interface IRaceService {
    /**
     * 開催レースのEntity配列を取得する
     * @param searchRaceFilter - レースフィルター情報
     * @param dataLocation - データ取得場所
     * @param placeEntityList - 場所エンティティ配列
     */
    fetchRaceEntityList: (
        searchRaceFilter: SearchRaceFilterEntity,
        dataLocation: DataLocationType,
        placeEntityList?: PlaceEntity[],
    ) => Promise<RaceEntity[]>;

    /**
     * 開催レースのEntity配列の更新を行う
     * @param entityList - レースエンティティ配列
     */
    upsertRaceEntityList: (entityList: RaceEntity[]) => Promise<UpsertResult>;
}
