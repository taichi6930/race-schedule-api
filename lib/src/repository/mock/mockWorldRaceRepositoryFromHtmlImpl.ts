import { WorldRaceData } from '../../domain/worldRaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { WorldPlaceEntity } from '../entity/worldPlaceEntity';
import { WorldRaceEntity } from '../entity/worldRaceEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

// WorldRaceRepositoryFromHtmlImplのモックを作成
export class MockWorldRaceRepositoryFromHtmlImpl
    implements IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
{
    @Logger
    async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<WorldPlaceEntity>,
    ): Promise<WorldRaceEntity[]> {
        const raceEntityList: WorldRaceEntity[] = [];
        const currentDate = new Date(searchFilter.startDate);
        while (currentDate.getMonth() === searchFilter.startDate.getMonth()) {
            // 1から12までのレースを作成
            for (let i = 1; i <= 12; i++) {
                raceEntityList.push(
                    WorldRaceEntity.createWithoutId(
                        WorldRaceData.create(
                            `第${i.toString()}R`,
                            new Date(
                                currentDate.getFullYear(),
                                currentDate.getMonth(),
                                currentDate.getDate(),
                                i + 9,
                            ),
                            'ロンシャン',
                            '芝',
                            2400,
                            'GⅠ',
                            i,
                        ),
                        getJSTDate(new Date()),
                    ),
                );
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return await Promise.resolve(raceEntityList);
    }

    @Logger
    async registerRaceEntityList(
        raceEntityList: WorldRaceEntity[],
    ): Promise<void> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
