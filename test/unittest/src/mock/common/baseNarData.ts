import type { calendar_v3 } from 'googleapis';

import { CalendarData } from '../../../../../lib/src/domain/calendarData';
import { HorseRaceConditionData } from '../../../../../lib/src/domain/houseRaceConditionData';
import { PlaceData } from '../../../../../lib/src/domain/placeData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import { HorseRacingRaceRecord } from '../../../../../lib/src/gateway/record/horseRacingRaceRecord';
import { PlaceRecord } from '../../../../../lib/src/gateway/record/placeRecord';
import { HorseRacingPlaceEntity } from '../../../../../lib/src/repository/entity/horseRacingPlaceEntity';
import { HorseRacingRaceEntity } from '../../../../../lib/src/repository/entity/horseRacingRaceEntity';
import type { GradeType } from '../../../../../lib/src/utility/data/common/gradeType';
import { generatePlaceId } from '../../../../../lib/src/utility/data/common/placeId';
import type { RaceCourse } from '../../../../../lib/src/utility/data/common/raceCourse';
import { generateRaceId } from '../../../../../lib/src/utility/data/common/raceId';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseRaceNumber } from './baseCommonData';

const raceType: RaceType = RaceType.NAR;

const baseNarPlaceCourse: RaceCourse = '大井';
const baseNarPlaceDateTime = new Date('2024-12-29');

const baseNarRaceName = '東京大賞典';
const baseRaceDateTime = new Date('2024-12-29 15:40');
const baseNarRaceSurfaceType = 'ダート';
const baseNarRaceDistance = 2000;
const baseNarRaceGrade: GradeType = 'GⅠ';
const baseNarRaceUpdateDate = new Date('2024-12-01 00:00');

export const baseNarPlaceData = PlaceData.create(
    raceType,
    baseNarPlaceDateTime,
    baseNarPlaceCourse,
);

export const baseNarRaceData = RaceData.create(
    raceType,
    baseNarRaceName,
    baseRaceDateTime,
    baseNarPlaceCourse,
    baseNarRaceGrade,
    baseRaceNumber,
);

const baseNarConditionData = HorseRaceConditionData.create(
    baseNarRaceSurfaceType,
    baseNarRaceDistance,
);

export const baseNarPlaceRecord = PlaceRecord.create(
    generatePlaceId(raceType, baseNarPlaceDateTime, baseNarPlaceCourse),
    raceType,
    baseNarPlaceDateTime,
    baseNarPlaceCourse,
    baseNarRaceUpdateDate,
);

export const baseNarRaceRecord = HorseRacingRaceRecord.create(
    generateRaceId(
        raceType,
        baseNarPlaceDateTime,
        baseNarPlaceCourse,
        baseRaceNumber,
    ),
    raceType,
    baseNarRaceName,
    baseRaceDateTime,
    baseNarPlaceCourse,
    baseNarRaceSurfaceType,
    baseNarRaceDistance,
    baseNarRaceGrade,
    baseRaceNumber,
    baseNarRaceUpdateDate,
);

export const baseNarPlaceEntity = HorseRacingPlaceEntity.createWithoutId(
    baseNarPlaceData,
    baseNarRaceUpdateDate,
);

export const baseNarRaceEntity = HorseRacingRaceEntity.createWithoutId(
    baseNarRaceData,
    baseNarConditionData,
    baseNarRaceUpdateDate,
);

export const baseNarGoogleCalendarData: calendar_v3.Schema$Event = {
    id: generateRaceId(
        raceType,
        baseNarPlaceDateTime,
        baseNarPlaceCourse,
        baseRaceNumber,
    ),
    summary: baseNarRaceName,
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
    location: `${baseNarPlaceCourse}競馬場`,
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
            distance: baseNarRaceDistance.toString(),
            grade: baseNarRaceGrade,
            location: baseNarPlaceCourse,
            name: baseNarRaceName,
            number: baseRaceNumber.toString(),
            raceId: generateRaceId(
                raceType,
                baseNarPlaceDateTime,
                baseNarPlaceCourse,
                baseRaceNumber,
            ),
            surfaceType: baseNarRaceSurfaceType,
            updateDate: baseNarRaceUpdateDate.toISOString(),
        },
    },
};

export const baseNarRaceEntityList: HorseRacingRaceEntity[] = [
    '大井',
    '高知',
].flatMap((location) => {
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
        return HorseRacingRaceEntity.createWithoutId(
            RaceData.create(
                raceType,
                `テスト${location}${grade}${(index + 1).toString()}レース`,
                new Date(2024, 6 - 1, 1, 7 + index, 0),
                location,
                grade,
                index + 1,
            ),
            HorseRaceConditionData.create('ダート', 1600),
            baseNarRaceUpdateDate,
        );
    });
});

export const baseNarCalendarData = CalendarData.create(
    'test202412292011',
    raceType,
    baseNarRaceName,
    '2024-12-29T15:40:00Z',
    '2024-12-29T15:50:00Z',
    `${baseNarPlaceCourse}競馬場`,
    'テスト',
);

export const baseNarCalendarDataFromGoogleCalendar = {
    id: 'test202412292011',
    summary: baseNarRaceName,
    start: {
        dateTime: '2024-12-29T15:40:00Z',
    },
    end: {
        dateTime: '2024-12-29T15:50:00Z',
    },
    location: `${baseNarPlaceCourse}競馬場`,
    description: 'テスト',
};
