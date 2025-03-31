import { IPlaceEntity } from '../../repository/entity/iPlaceEntity';
import { IRaceEntity } from '../../repository/entity/iRaceEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { DataLocation, type DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import type { IRaceDataService } from '../interface/IRaceDataService';

/**
 * BaseRaceDataService
 */
export abstract class BaseRaceDataService<
    R extends IRaceEntity<R>,
    P extends IPlaceEntity<P>,
> implements IRaceDataService<R, P>
{
    protected abstract raceRepositoryFromStorage: IRaceRepository<R, P>;
    protected abstract raceRepositoryFromHtml: IRaceRepository<R, P>;

    /**
     * レース開催データを取得する
     * @param startDate
     * @param finishDate
     * @param type
     * @param placeEntityList
     */
    @Logger
    public async fetchRaceEntityList(
        startDate: Date,
        finishDate: Date,
        type: DataLocationType,
        placeEntityList?: P[],
    ): Promise<R[]> {
        try {
            const fetchRaceListRequest = new SearchRaceFilterEntity<P>(
                startDate,
                finishDate,
                placeEntityList,
            );
            const repository = this.getRaceRepository(type);

            const raceEntityList: R[] =
                await repository.fetchRaceEntityList(fetchRaceListRequest);

            return raceEntityList;
        } catch (error) {
            console.error('レース開催データの取得に失敗しました', error);
            return [];
        }
    }

    /**
     * レース開催データを更新する
     * @param raceEntityList
     */
    @Logger
    public async updateRaceEntityList(raceEntityList: R[]): Promise<void> {
        try {
            if (raceEntityList.length === 0) return;
            await this.raceRepositoryFromStorage.registerRaceEntityList(
                raceEntityList,
            );
        } catch (error) {
            console.error('レース開催データの更新に失敗しました', error);
        }
    }

    /**
     * リポジトリを取得する
     * @param type
     */
    private getRaceRepository(type: DataLocationType): IRaceRepository<R, P> {
        switch (type) {
            case DataLocation.Storage: {
                return this.raceRepositoryFromStorage;
            }
            case DataLocation.Web: {
                return this.raceRepositoryFromHtml;
            }
            default: {
                const exhaustiveCheck: never = type;
                throw new Error(
                    `Unsupported DataLocationType: ${String(exhaustiveCheck)}`,
                );
            }
        }
    }
}
