import type { calendar_v3 } from 'googleapis';

import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { JraPlaceData } from '../../../../lib/src/domain/jraPlaceData';
import { JraRaceData } from '../../../../lib/src/domain/jraRaceData';
import { JraPlaceRecord } from '../../../../lib/src/gateway/record/jraPlaceRecord';
import { JraRaceRecord } from '../../../../lib/src/gateway/record/jraRaceRecord';
import { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { JraGradeType } from '../../../../lib/src/utility/data/jra/jraGradeType';
import type { JraRaceCourse } from '../../../../lib/src/utility/data/jra/jraRaceCourse';
import {
    generateJraPlaceId,
    generateJraRaceId,
} from '../../../../lib/src/utility/raceId';

const baseJraPlaceCourse: JraRaceCourse = '中山';
const baseJraPlaceDateTime = new Date('2024-12-22');
const baseJraPlaceId = generateJraPlaceId(
    baseJraPlaceDateTime,
    baseJraPlaceCourse,
);

const baseJraRaceName = '有馬記念';
const baseJraRaceDateTime = new Date('2024-12-22 15:40');
const baseJraRaceNumber = 11;
const baseJraRaceSurfaceType = '芝';
const baseJraRaceDistance = 2500;
const baseJraRaceGrade: JraGradeType = 'GⅠ';
const baseJraRaceHeldTimes = 5;
const baseJraRaceHeldDayTimes = 8;
const baseJraRaceUpdateDate = new Date('2024-12-01 00:00');

export const baseJraPlaceData = JraPlaceData.create(
    baseJraPlaceDateTime,
    baseJraPlaceCourse,
    1,
    1,
);

export const baseJraRaceData = JraRaceData.create(
    baseJraRaceName,
    baseJraRaceDateTime,
    baseJraPlaceCourse,
    baseJraRaceSurfaceType,
    baseJraRaceDistance,
    baseJraRaceGrade,
    baseJraRaceNumber,
    baseJraRaceHeldTimes,
    baseJraRaceHeldDayTimes,
);

export const baseJraPlaceRecord = JraPlaceRecord.create(
    baseJraPlaceId,
    baseJraPlaceDateTime,
    baseJraPlaceCourse,
    baseJraRaceHeldTimes,
    baseJraRaceHeldDayTimes,
    baseJraRaceUpdateDate,
);

export const baseJraRaceRecord = JraRaceRecord.create(
    generateJraRaceId(
        baseJraPlaceDateTime,
        baseJraPlaceCourse,
        baseJraRaceNumber,
    ),
    baseJraRaceName,
    baseJraRaceDateTime,
    baseJraPlaceCourse,
    baseJraRaceSurfaceType,
    baseJraRaceDistance,
    baseJraRaceGrade,
    baseJraRaceNumber,
    baseJraRaceHeldTimes,
    baseJraRaceHeldDayTimes,
    baseJraRaceUpdateDate,
);

export const baseJraPlaceEntity = JraPlaceEntity.createWithoutId(
    baseJraPlaceData,
    baseJraRaceUpdateDate,
);

export const baseJraRaceEntity = JraRaceEntity.createWithoutId(
    baseJraRaceData,
    baseJraRaceUpdateDate,
);

export const baseJraGoogleCalendarData: calendar_v3.Schema$Event = {
    id: generateJraRaceId(
        baseJraPlaceDateTime,
        baseJraPlaceCourse,
        baseJraRaceNumber,
    ),
    summary: baseJraRaceName,
    start: {
        dateTime: baseJraRaceDateTime.toISOString().replace('Z', '+09:00'),
        timeZone: 'Asia/Tokyo',
    },
    end: {
        dateTime: new Date(baseJraRaceDateTime.getTime() + 10 * 60 * 1000)
            .toISOString()
            .replace('Z', '+09:00'),
        timeZone: 'Asia/Tokyo',
    },
    location: `${baseJraPlaceCourse}競馬場`,
    colorId: '9',
    description: `距離: 芝2500m
発走: 15:40
<a href="https://netkeiba.page.link/?link=https%3A%2F%2Frace.sp.netkeiba.com%2Frace%2Fshutuba.html%3Frace_id%3D202406050811">レース情報</a>
<a href="https://netkeiba.page.link/?link=https%3A%2F%2Frace.sp.netkeiba.com%3Fpid%3Drace_movie%26race_id%3D202406050811">レース動画</a>
更新日時: 2025/01/01 21:00:00
`,
    extendedProperties: {
        private: {
            dateTime: baseJraRaceDateTime.toISOString(),
            distance: baseJraRaceDistance.toString(),
            grade: baseJraRaceGrade,
            heldDayTimes: baseJraRaceHeldDayTimes.toString(),
            heldTimes: baseJraRaceHeldTimes.toString(),
            location: baseJraPlaceCourse,
            name: baseJraRaceName,
            number: baseJraRaceNumber.toString(),
            raceId: generateJraRaceId(
                baseJraPlaceDateTime,
                baseJraPlaceCourse,
                baseJraRaceNumber,
            ),
            surfaceType: baseJraRaceSurfaceType,
            updateDate: baseJraRaceUpdateDate.toISOString(),
        },
    },
};

export const baseJraRaceEntityList: JraRaceEntity[] = ['東京', '京都'].flatMap(
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
            return JraRaceEntity.createWithoutId(
                JraRaceData.create(
                    `テスト${location}${grade}${(index + 1).toString()}レース`,
                    new Date(2024, 6 - 1, 1, 7 + index, 0),
                    location,
                    '芝',
                    1600,
                    grade,
                    index + 1,
                    1,
                    1,
                ),
                baseJraRaceUpdateDate,
            );
        });
    },
);

export const baseJraRaceDataList = baseJraRaceEntityList.map(
    (raceEntity) => raceEntity.raceData,
);

export const baseJraCalendarData = CalendarData.create(
    'test202412220611',
    '有馬記念',
    '2024-12-22T15:40:00Z',
    '2024-12-22T15:50:00Z',
    '中山競馬場',
    'テスト',
);

export const baseJraCalendarDataFromGoogleCalendar = {
    id: 'test202412220611',
    summary: '有馬記念',
    start: {
        dateTime: '2024-12-22T15:40:00Z',
    },
    end: {
        dateTime: '2024-12-22T15:50:00Z',
    },
    location: '中山競馬場',
    description: 'テスト',
};
