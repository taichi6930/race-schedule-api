import {
    defaultHeldDayData,
    defaultLocation,
    defaultPlaceGrade,
} from '../../../test/unittest/src/mock/common/baseCommonData';
import { PlaceData } from '../../domain/placeData';
import type { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import type { SearchPlaceFilterEntity } from '../entity/filter/searchPlaceFilterEntity';
import { OldPlaceEntity } from '../entity/placeEntity';
import type { IPlaceRepository } from '../interface/IPlaceRepository';

export class MockPlaceRepositoryFromHtml implements IPlaceRepository {
    /**
     * 場データを取得する
     * @param commonParameter
     * @param searchFilter
     */
    public async fetchPlaceEntityList(
        commonParameter: CommonParameter,
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<OldPlaceEntity[]> {
        const placeEntityList = [];
        const { raceTypeList, startDate, finishDate } = searchFilter;
        const currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
            for (const raceType of raceTypeList) {
                const placeEntity = OldPlaceEntity.createWithoutId(
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
        await new Promise((resolve) => setTimeout(resolve, 0));
        return placeEntityList;
    }

    /**
     * 開催データを登録する
     * HTMLにはデータを登録しない
     * @param raceType - レース種別
     * @param commonParameter
     * @param placeEntityList
     */
    @Logger
    public async upsertPlaceEntityList(
        commonParameter: CommonParameter,
        placeEntityList: OldPlaceEntity[],
    ): Promise<void> {
        console.log(commonParameter, placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('Method not implemented.');
    }
}
