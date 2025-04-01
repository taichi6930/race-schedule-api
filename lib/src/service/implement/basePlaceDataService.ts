import { IPlaceEntity } from '../../repository/entity/iPlaceEntity';
import { SearchPlaceFilterEntity } from '../../repository/entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IPlaceDataService } from '../interface/IPlaceDataService';

/**
 * BasePlaceDataService
 */
export abstract class BasePlaceDataService<P extends IPlaceEntity<P>>
    implements IPlaceDataService<P>
{
    protected abstract placeRepositoryFromStorage: IPlaceRepository<P>;
    protected abstract placeRepositoryFromHtml: IPlaceRepository<P>;

    /**
     * 開催場データを取得する
     * @param startDate
     * @param finishDate
     * @param type
     */
    @Logger
    public async fetchPlaceEntityList(
        startDate: Date,
        finishDate: Date,
        type: DataLocationType,
    ): Promise<P[]> {
        try {
            const searchFilter = new SearchPlaceFilterEntity(
                startDate,
                finishDate,
            );
            const repository = this.getPlaceRepository(type);

            const placeEntityList =
                await repository.fetchPlaceEntityList(searchFilter);
            return placeEntityList;
        } catch (error) {
            console.error('開催場データの取得に失敗しました', error);
            return [];
        }
    }

    /**
     * 開催場データを更新する
     * @param placeEntityList
     */
    @Logger
    public async updatePlaceEntityList(placeEntityList: P[]): Promise<void> {
        try {
            if (placeEntityList.length === 0) return;

            await this.placeRepositoryFromStorage.registerPlaceEntityList(
                placeEntityList,
            );
        } catch (error) {
            console.error('開催場データの更新に失敗しました', error);
        }
    }

    /**
     * リポジトリを取得する
     * @param type
     */
    private getPlaceRepository(type: DataLocationType): IPlaceRepository<P> {
        switch (type) {
            case DataLocation.Storage: {
                return this.placeRepositoryFromStorage;
            }
            case DataLocation.Web: {
                return this.placeRepositoryFromHtml;
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
