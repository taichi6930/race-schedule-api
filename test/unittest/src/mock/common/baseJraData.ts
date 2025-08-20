import type { calendar_v3 } from 'googleapis';

import { HeldDayData } from '../../../../../lib/src/domain/heldDayData';
import { HorseRaceConditionData } from '../../../../../lib/src/domain/houseRaceConditionData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import { generateRaceId } from '../../../../../lib/src/utility/data/common/raceId';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import {
    basePlaceDateTime,
    baseRaceDateTime,
    baseRaceNumber,
    baseRaceUpdateDate,
    defaultHeldDayData,
    defaultLocation,
    defaultRaceDistance,
    defaultRaceGrade,
    defaultRaceName,
    defaultRaceSurfaceType,
} from './baseCommonData';

const raceType: RaceType = RaceType.JRA;

export const baseJraRaceEntityList: RaceEntity[] = ['東京', '京都'].flatMap(
    (location) => {
        return [
            '新馬',
            '未勝利',
            '未勝利',
            '1勝クラス',
            '2勝クラス',
            '3勝クラス',
            'オープン特別',
            'Listed',
            'GⅢ',
            'GⅡ',
            'GⅠ',
            '2勝クラス',
        ].map((grade, index) => {
            return RaceEntity.createWithoutId(
                RaceData.create(
                    raceType,
                    `テスト${location}${grade}${(index + 1).toString()}レース`,
                    new Date(2024, 6 - 1, 1, 7 + index, 0),
                    location,
                    grade,
                    index + 1,
                ),
                HeldDayData.create(1, 1),
                HorseRaceConditionData.create('芝', 1600),
                undefined, // stage は未指定
                undefined, // racePlayerDataList は未指定
                baseRaceUpdateDate,
            );
        });
    },
);
