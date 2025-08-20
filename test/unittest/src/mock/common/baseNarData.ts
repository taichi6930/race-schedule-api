import type { calendar_v3 } from 'googleapis';

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
    defaultLocation,
    defaultRaceDistance,
    defaultRaceGrade,
    defaultRaceName,
    defaultRaceSurfaceType,
} from './baseCommonData';

const raceType: RaceType = RaceType.NAR;

export const baseNarRaceData = RaceData.create(
    raceType,
    defaultRaceName[raceType],
    baseRaceDateTime,
    defaultLocation[raceType],
    defaultRaceGrade[raceType],
    baseRaceNumber,
);

export const baseNarGoogleCalendarData: calendar_v3.Schema$Event = {
    id: generateRaceId(
        raceType,
        basePlaceDateTime,
        defaultLocation[raceType],
        baseRaceNumber,
    ),
    summary: defaultRaceName[raceType],
    start: {
        dateTime: baseRaceDateTime.toISOString().replace('Z', '+09:00'),
        timeZone: 'Asia/Tokyo',
    },
    end: {
        dateTime: new Date(baseRaceDateTime.getTime() + 10 * 60 * 1000)
            .toISOString()
            .replace('Z', '+09:00'),
        timeZone: 'Asia/Tokyo',
    },
    location: `${defaultLocation[raceType]}競馬場`,
    colorId: '9',
    description: `距離: ダート2000m
発走: 15:40
<a href="https://www.youtube.com/@tckkeiba/stream">レース映像（YouTube）</a>
<a href="https://netkeiba.page.link/?link=https%3A%2F%2Fnar.sp.netkeiba.com%2Frace%2Fshutuba.html%3Frace_id%3D202444122911">レース情報（netkeiba）</a>
更新日時: 2025/01/01 21:00:00
`,
    extendedProperties: {
        private: {
            dateTime: baseRaceDateTime.toISOString(),
            distance: defaultRaceDistance[raceType].toString(),
            grade: defaultRaceGrade[raceType],
            location: defaultLocation[raceType],
            name: defaultRaceName[raceType],
            number: baseRaceNumber.toString(),
            raceId: generateRaceId(
                raceType,
                basePlaceDateTime,
                defaultLocation[raceType],
                baseRaceNumber,
            ),
            surfaceType: defaultRaceSurfaceType[raceType],
            updateDate: baseRaceUpdateDate.toISOString(),
        },
    },
};

export const baseNarRaceEntityList: RaceEntity[] = ['大井', '高知'].flatMap(
    (location) => {
        return [
            '一般',
            '一般',
            '一般',
            'オープン特別',
            'Listed',
            'JpnⅢ',
            'JpnⅡ',
            'JpnⅠ',
            'GⅢ',
            'GⅡ',
            'GⅠ',
            '地方重賞',
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
                undefined, // horseRaceConditionData は未指定
                HorseRaceConditionData.create('ダート', 1600),
                undefined, // stage は未指定
                undefined, // racePlayerDataList は未指定
                baseRaceUpdateDate,
            );
        });
    },
);
