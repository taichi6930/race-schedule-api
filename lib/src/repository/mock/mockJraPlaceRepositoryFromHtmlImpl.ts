import { JraPlaceData } from '../../domain/jraPlaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

// JraRaceRepositoryFromHtmlImplのモックを作成
export class MockJraPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<JraPlaceEntity>
{
    /**
     * 中央競馬場データを取得する
     * @param searchFilter
     */
    @Logger
    async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<JraPlaceEntity[]> {
        // request.startDateからrequest.finishDateまでの中央競馬場データを取得する
        const placeEntityList = [];
        const currentDate = new Date(searchFilter.startDate);

        while (currentDate <= searchFilter.finishDate) {
            // 中央競馬場データを作成
            const jraPlaceEntity = JraPlaceEntity.createWithoutId(
                JraPlaceData.create(new Date(currentDate), '東京', 1, 1),
                getJSTDate(new Date()),
            );
            placeEntityList.push(jraPlaceEntity);
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
    async registerPlaceEntityList(
        placeEntityList: JraPlaceEntity[],
    ): Promise<void> {
        console.debug(placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
