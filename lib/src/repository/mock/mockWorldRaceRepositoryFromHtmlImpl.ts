import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import { RaceCourseType } from '../../utility/data/common/raceCourseType';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { WorldPlaceEntity } from '../entity/worldPlaceEntity';
import { WorldRaceEntity } from '../entity/worldRaceEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

// WorldRaceRepositoryFromHtmlImplのモックを作成
export class MockWorldRaceRepositoryFromHtmlImpl
    implements IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
{
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<WorldPlaceEntity>,
    ): Promise<WorldRaceEntity[]> {
        const raceEntityList: WorldRaceEntity[] = [];
        const currentDate = new Date(searchFilter.startDate);
        while (currentDate.getMonth() === searchFilter.startDate.getMonth()) {
            // 1から12までのレースを作成
            for (let i = 1; i <= 12; i++) {
                raceEntityList.push(
                    WorldRaceEntity.createWithoutId(
                        RaceData.create(
                            RaceType.WORLD,
                            `第${i.toString()}R`,
                            new Date(
                                currentDate.getFullYear(),
                                currentDate.getMonth(),
                                currentDate.getDate(),
                                i + 9,
                            ),
                            'ロンシャン',
                            'GⅠ',
                            i,
                        ),
                        HorseRaceConditionData.create(
                            RaceCourseType.TURF,
                            2400,
                        ),
                        getJSTDate(new Date()),
                    ),
                );
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        return raceEntityList;
    }

    @Logger
    public async registerRaceEntityList(
        raceEntityList: WorldRaceEntity[],
    ): Promise<void> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
