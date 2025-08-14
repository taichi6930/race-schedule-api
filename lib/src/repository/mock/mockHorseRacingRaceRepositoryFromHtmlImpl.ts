import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { HorseRacingPlaceEntity } from '../entity/horseRacingPlaceEntity';
import { HorseRacingRaceEntity } from '../entity/horseRacingRaceEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

export class MockHorseRacingRaceRepositoryFromHtmlImpl
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
                for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                    const raceDate = new Date(dateTime);
                    raceDate.setHours(raceNumber + 9, 0, 0, 0);
                    raceEntityList.push(
                        HorseRacingRaceEntity.createWithoutId(
                            RaceData.create(
                                raceType,
                                `${location}第${raceNumber.toString()}R`,
                                raceDate,
                                location,
                                'GⅠ',
                                raceNumber,
                            ),
                            HorseRaceConditionData.create('ダート', 2000),
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
