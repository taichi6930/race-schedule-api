import { PlaceData } from '../../domain/placeData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { HorseRacingPlaceEntity } from '../entity/horseRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

// NarRaceRepositoryFromHtmlImplのモックを作成
export class MockNarPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<HorseRacingPlaceEntity>
{
    /**
     * 地方競馬場データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<HorseRacingPlaceEntity[]> {
        // request.startDateからrequest.finishDateまでの地方競馬場データを取得する
        const placeEntityList = [];
        const currentDate = new Date(searchFilter.startDate);

        while (currentDate <= searchFilter.finishDate) {
            const placeEntity = HorseRacingPlaceEntity.createWithoutId(
                searchFilter.raceType,
                PlaceData.create(
                    searchFilter.raceType,
                    new Date(currentDate),
                    '大井',
                ),
                getJSTDate(new Date()),
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
        placeEntityList: HorseRacingPlaceEntity[],
    ): Promise<void> {
        console.debug(placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
