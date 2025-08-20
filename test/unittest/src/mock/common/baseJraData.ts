import type { calendar_v3 } from 'googleapis';

import { CalendarData } from '../../../../../lib/src/domain/calendarData';
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

export const baseJraGoogleCalendarData: calendar_v3.Schema$Event = {
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
    description: `距離: 芝2500m
発走: 15:40
<a href="https://netkeiba.page.link/?link=https%3A%2F%2Frace.sp.netkeiba.com%2Frace%2Fshutuba.html%3Frace_id%3D202406050811">レース情報</a>
<a href="https://netkeiba.page.link/?link=https%3A%2F%2Frace.sp.netkeiba.com%2F%3Fpid%3Drace_movie%26race_id%3D202406050811">レース動画</a>
更新日時: 2025/01/01 21:00:00
`,
    extendedProperties: {
        private: {
            dateTime: baseRaceDateTime.toISOString(),
            distance: defaultRaceDistance[raceType].toString(),
            grade: defaultRaceGrade[raceType],
            heldDayTimes: defaultHeldDayData[raceType].heldDayTimes.toString(),
            heldTimes: defaultHeldDayData[raceType].heldTimes.toString(),
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

export const baseJraCalendarData = CalendarData.create(
    'test202412220611',
    raceType,
    defaultRaceName[raceType],
    '2024-12-22T15:40:00Z',
    '2024-12-22T15:50:00Z',
    `${defaultLocation[raceType]}競馬場`,
    'テスト',
);

export const baseJraCalendarDataFromGoogleCalendar = {
    id: 'test202412220611',
    summary: defaultRaceName[raceType],
    start: {
        dateTime: '2024-12-22T15:40:00Z',
    },
    end: {
        dateTime: '2024-12-22T15:50:00Z',
    },
    location: `${defaultLocation[raceType]}競馬場`,
    description: 'テスト',
};
