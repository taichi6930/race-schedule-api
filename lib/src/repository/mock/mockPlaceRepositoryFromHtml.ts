import { PlaceEntity } from '../../../../src/repository/entity/placeEntity';
import { RaceType } from '../../../../src/utility/raceType';
import {
    defaultHeldDayData,
    defaultLocation,
} from '../../../../test/old/unittest/src/mock/common/baseCommonData';
import { PlaceData } from '../../domain/placeData';
import { Logger } from '../../utility/logger';
import { SearchPlaceFilterEntityForAWS } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepositoryForAWS } from '../interface/IPlaceRepository';

export class MockPlaceRepositoryFromHtml implements IPlaceRepositoryForAWS {
    /**
     * 場データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntityForAWS,
    ): Promise<PlaceEntity[]> {
        const placeEntityList = [];
        const currentDate = new Date(searchFilter.startDate);

        while (currentDate <= searchFilter.finishDate) {
            const placeEntity = PlaceEntity.createWithoutId(
                PlaceData.create(
                    searchFilter.raceType,
                    new Date(currentDate),
                    defaultLocation[searchFilter.raceType],
                ),
                defaultHeldDayData[searchFilter.raceType],
                this.defaultGrade[searchFilter.raceType],
            );
            placeEntityList.push(placeEntity);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        return placeEntityList;
    }

    /**
     * 開催データを登録する
     * HTMLにはデータを登録しない
     * @param raceType - レース種別
     * @param placeEntityList
     */
    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: PlaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: PlaceEntity[];
        failureData: PlaceEntity[];
    }> {
        console.debug(raceType, placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
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
