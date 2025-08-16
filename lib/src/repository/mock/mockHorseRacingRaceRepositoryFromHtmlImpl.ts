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
        const { raceType, startDate } = searchFilter;
        if (placeEntityList && raceType === RaceType.NAR) {
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
        } else if (raceType === RaceType.OVERSEAS) {
            const currentDate = new Date(startDate);
            while (currentDate.getMonth() === startDate.getMonth()) {
                // 1から12までのレースを作成
                for (let i = 1; i <= 12; i++) {
                    raceEntityList.push(
                        HorseRacingRaceEntity.createWithoutId(
                            RaceData.create(
                                raceType,
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
                            HorseRaceConditionData.create('芝', 2400),
                            getJSTDate(new Date()),
                        ),
                    );
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        return raceEntityList;
    }

    @Logger
    public async registerRaceEntityList(
        raceType: RaceType,
        raceEntityList: HorseRacingRaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: HorseRacingRaceEntity[];
        failureData: HorseRacingRaceEntity[];
    }> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
