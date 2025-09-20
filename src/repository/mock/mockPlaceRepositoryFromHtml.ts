import {
    defaultHeldDayData,
    defaultLocation,
} from '../../../test/unittest/src/mock/common/baseCommonData';
import { PlaceData } from '../../domain/placeData';
import type { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import type { SearchPlaceFilterEntity } from '../entity/filter/searchPlaceFilterEntity';
import { PlaceEntity } from '../entity/placeEntity';
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
                    this.defaultGrade[raceType],
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
        placeEntityList: PlaceEntity[],
    ): Promise<void> {
        console.log(commonParameter, placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('Method not implemented.');
    }

    private readonly defaultGrade = {
        [RaceType.JRA]: undefined,
        [RaceType.NAR]: undefined,
        [RaceType.OVERSEAS]: undefined,
        [RaceType.KEIRIN]: 'GⅠ',
        [RaceType.AUTORACE]: 'SG',
        [RaceType.BOATRACE]: 'SG',
    };
}
