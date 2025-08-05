import { NarPlaceData } from '../../domain/narPlaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IOldPlaceRepository } from '../interface/IPlaceRepository';

// NarRaceRepositoryFromHtmlImplのモックを作成
export class MockNarPlaceRepositoryFromHtmlImpl
    implements IOldPlaceRepository<NarPlaceEntity>
{
    /**
     * 地方競馬場データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<NarPlaceEntity[]> {
        // request.startDateからrequest.finishDateまでの地方競馬場データを取得する
        const placeEntityList = [];
        const currentDate = new Date(searchFilter.startDate);

        while (currentDate <= searchFilter.finishDate) {
            // 地方競馬場データを作成
            const narPlaceEntity = NarPlaceEntity.createWithoutId(
                NarPlaceData.create(new Date(currentDate), '大井'),
                getJSTDate(new Date()),
            );
            placeEntityList.push(narPlaceEntity);
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
        placeEntityList: NarPlaceEntity[],
    ): Promise<void> {
        console.debug(placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
