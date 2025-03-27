import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { BoatracePlaceEntity } from '../entity/boatracePlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

// BoatraceRaceRepositoryFromHtmlImplのモックを作成
export class MockBoatracePlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<BoatracePlaceEntity>
{
    /**
     * ボートレース場データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<BoatracePlaceEntity[]> {
        // request.startDateからrequest.finishDateまでのボートレース場データを取得する
        const placeEntityList = [];
        const currentDate = new Date(searchFilter.startDate);

        while (currentDate <= searchFilter.finishDate) {
            // ボートレース場データを作成
            const boatracePlaceEntity = BoatracePlaceEntity.createWithoutId(
                BoatracePlaceData.create(new Date(currentDate), '平和島', 'SG'),
                getJSTDate(new Date()),
            );
            placeEntityList.push(boatracePlaceEntity);
            // 日付を1日進める
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return await Promise.resolve(placeEntityList);
    }

    /**
     * 開催データを登録する
     * HTMLにはデータを登録しない
     * @param placeEntityList
     */
    @Logger
    public async registerPlaceEntityList(
        placeEntityList: BoatracePlaceEntity[],
    ): Promise<void> {
        console.debug(placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
