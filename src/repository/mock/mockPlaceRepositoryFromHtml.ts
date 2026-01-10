import { Logger } from '../../../packages/shared/src/utilities/logger';
import { UpsertResult } from '../../../packages/shared/src/utilities/upsertResult';
import {
    defaultHeldDayData,
    defaultLocation,
    defaultPlaceGrade,
} from '../../../test/unittest/src/mock/common/baseCommonData';
import { PlaceData } from '../../domain/placeData';
import type { OldSearchPlaceFilterEntity } from '../entity/filter/oldSearchPlaceFilterEntity';
import { PlaceEntity } from '../entity/placeEntity';
import type { IPlaceRepository } from '../interface/IPlaceRepository';

export class MockPlaceRepositoryFromHtml implements IPlaceRepository {
    /**
     * 場データを取得する
     * @param searchFilter
     */
    public async fetchPlaceEntityList(
        searchFilter: OldSearchPlaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        const placeEntityList = [];
        const { raceTypeList, startDate, finishDate } = searchFilter;
        const currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
            for (const raceType of raceTypeList) {
                const placeEntity = PlaceEntity.createWithoutId(
                    PlaceData.create(
                        raceType,
                        new Date(currentDate),
                        defaultLocation[raceType],
                    ),
                    defaultHeldDayData[raceType],
                    defaultPlaceGrade[raceType],
                );
                placeEntityList.push(placeEntity);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return placeEntityList;
    }

    /**
     * 開催データを登録する
     * HTMLにはデータを登録しない
     * @param raceType - レース種別
     * @param placeEntityList
     */
    @Logger
    public async upsertPlaceEntityList(
        _placeEntityList: PlaceEntity[],
    ): Promise<UpsertResult> {
        void _placeEntityList;
        return {
            successCount: 0,
            failureCount: 0,
            failures: [],
        };
    }
}
