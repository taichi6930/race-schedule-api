import { PlaceData } from '../../domain/placeData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { PlaceEntity } from '../entity/autoracePlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

// AutoraceRaceRepositoryFromHtmlImplのモックを作成
export class MockAutoracePlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<PlaceEntity>
{
    /**
     * オートレース場データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        // request.startDateからrequest.finishDateまでのオートレース場データを取得する
        const placeEntityList = [];
        const currentDate = new Date(searchFilter.startDate);

        while (currentDate <= searchFilter.finishDate) {
            const datetime = new Date(currentDate);
            const place = '伊勢崎';
            // オートレース場データを作成
            const autoracePlaceEntity = PlaceEntity.createWithoutId(
                PlaceData.create(datetime, place, 'SG'),
                getJSTDate(new Date()),
            );
            placeEntityList.push(autoracePlaceEntity);
            // 日付を1日進める
            currentDate.setDate(currentDate.getDate() + 1);
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        return placeEntityList;
    }

    /**
     * 開催データを登録する
     * HTMLにはデータを登録しない
     * @param placeEntityList
     */
    @Logger
    public async registerPlaceEntityList(
        placeEntityList: PlaceEntity[],
    ): Promise<void> {
        console.debug(placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
