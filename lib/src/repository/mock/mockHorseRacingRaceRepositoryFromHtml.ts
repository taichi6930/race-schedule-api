import { RaceType } from '../../../../src/utility/raceType';
import {
    baseConditionData,
    defaultHeldDayData,
} from '../../../../test/old/unittest/src/mock/common/baseCommonData';
import { RaceData } from '../../domain/raceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceEntityForAWS } from '../entity/raceEntity';
import type { SearchRaceFilterEntityForAWS } from '../entity/searchRaceFilterEntity';
import { IRaceRepositoryForAWS } from '../interface/IRaceRepositoryForAWS';

export class MockHorseRacingRaceRepositoryFromHtml
    implements IRaceRepositoryForAWS
{
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntityForAWS,
    ): Promise<RaceEntityForAWS[]> {
        const { placeEntityList } = searchFilter;
        const raceEntityList: RaceEntityForAWS[] = [];
        const { raceType, startDate } = searchFilter;
        if (raceType === RaceType.NAR || raceType === RaceType.JRA) {
            for (const placeEntity of placeEntityList) {
                const { location, dateTime } = placeEntity.placeData;
                // 1から12までのレースを作成
                for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                    const raceDate = new Date(dateTime);
                    raceDate.setHours(raceNumber + 9, 0, 0, 0);
                    raceEntityList.push(
                        RaceEntityForAWS.createWithoutId(
                            RaceData.create(
                                raceType,
                                `${location}第${raceNumber.toString()}R`,
                                raceDate,
                                location,
                                'GⅠ',
                                raceNumber,
                            ),
                            defaultHeldDayData[raceType],
                            baseConditionData(raceType),
                            undefined, // stage は未指定
                            undefined, // racePlayerDataList は未指定
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
                        RaceEntityForAWS.createWithoutId(
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
                            defaultHeldDayData[raceType],
                            baseConditionData(raceType),
                            undefined, // stage は未指定
                            undefined, // racePlayerDataList は未指定
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
        raceEntityList: RaceEntityForAWS[],
    ): Promise<{
        code: number;
        message: string;
        successData: RaceEntityForAWS[];
        failureData: RaceEntityForAWS[];
    }> {
        console.debug(raceType, raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
