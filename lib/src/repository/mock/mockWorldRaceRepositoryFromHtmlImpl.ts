import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { HorseRacingPlaceEntity } from '../entity/horseRacingPlaceEntity';
import { HorseRacingRaceEntity } from '../entity/horseRacingRaceEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

// WorldRaceRepositoryFromHtmlImplのモックを作成
export class MockWorldRaceRepositoryFromHtmlImpl
    implements IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
{
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<HorseRacingPlaceEntity>,
    ): Promise<HorseRacingRaceEntity[]> {
        const { placeEntityList } = searchFilter;
        const raceEntityList: HorseRacingRaceEntity[] = [];
        if (placeEntityList) {
            const { raceType } = searchFilter;
            for (const placeEntity of placeEntityList) {
                const { location, dateTime } = placeEntity.placeData;
                // 1から12までのレースを作成
                for (let i = 1; i <= 12; i++) {
                    raceEntityList.push(
                        HorseRacingRaceEntity.createWithoutId(
                            RaceData.create(
                                raceType,
                                `${location}第${i.toString()}R`,
                                new Date(
                                    dateTime.getFullYear(),
                                    dateTime.getMonth(),
                                    dateTime.getDate(),
                                    i + 9,
                                ),
                                location,
                                'GⅠ',
                                i,
                            ),
                            HorseRaceConditionData.create('芝', 2400),
                            getJSTDate(new Date()),
                        ),
                    );
                }
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        return raceEntityList;
    }

    @Logger
    public async registerRaceEntityList(
        raceType: RaceType,
        raceEntityList: HorseRacingRaceEntity[],
    ): Promise<void> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
