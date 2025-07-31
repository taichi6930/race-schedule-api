import { WorldPlaceData } from '../../domain/worldPlaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { WorldPlaceEntity } from '../entity/worldPlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

// WorldRaceRepositoryFromHtmlImplのモックを作成
export class MockWorldPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<WorldPlaceEntity>
{
    /**
     * 地方競馬場データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<WorldPlaceEntity[]> {
        // request.startDateからrequest.finishDateまでの地方競馬場データを取得する
        const placeEntityList = [];
        const currentDate = new Date(searchFilter.startDate);

        while (currentDate <= searchFilter.finishDate) {
            // 地方競馬場データを作成
            const worldPlaceEntity = WorldPlaceEntity.createWithoutId(
                WorldPlaceData.create(new Date(currentDate), 'ロンシャン'),
                getJSTDate(new Date()),
            );
            placeEntityList.push(worldPlaceEntity);
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
        placeEntityList: WorldPlaceEntity[],
    ): Promise<void> {
        console.debug(placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
