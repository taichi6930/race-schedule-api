import type { IPlaceEntity } from '../entity/iPlaceEntity';
import type { IRaceEntity } from '../entity/iRaceEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';

/**
 * レースデータリポジトリ
 * @param <R> レースデータ
 * @param <P> 開催データ
 */
export interface IRaceRepository<
    R extends IRaceEntity<R>,
    P extends IPlaceEntity<P>,
> {
    /**
     * 開催データを取得する
     * @param searchFilter
     * @returns レースデータ
     */
    fetchRaceEntityList: (
        searchFilter: SearchRaceFilterEntity<P>,
    ) => Promise<R[]>;
    /**
     * レースデータを登録する
     * @param raceEntityList
     */
    registerRaceEntityList: (raceEntityList: R[]) => Promise<void>;
}
