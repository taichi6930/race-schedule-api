import type { calendar_v3 } from 'googleapis';

import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { PlaceData } from '../../../../lib/src/domain/placeData';
import { RaceData } from '../../../../lib/src/domain/raceData';
import { NarPlaceRecord } from '../../../../lib/src/gateway/record/narPlaceRecord';
import { NarRaceRecord } from '../../../../lib/src/gateway/record/narRaceRecord';
import { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { GradeType } from '../../../../lib/src/utility/data/common/gradeType';
import type { RaceCourse } from '../../../../lib/src/utility/data/common/raceCourse';
import {
    generatePlaceId,
    generateRaceId,
} from '../../../../lib/src/utility/raceId';
import { RaceType } from '../../../../lib/src/utility/raceType';

const baseNarPlaceCourse: RaceCourse = '大井';
const baseNarPlaceDateTime = new Date('2024-12-29');

const baseNarRaceName = '東京大賞典';
const baseRaceDateTime = new Date('2024-12-29 15:40');
const baseNarRaceNumber = 11;
const baseNarRaceSurfaceType = 'ダート';
const baseNarRaceDistance = 2000;
const baseNarRaceGrade: GradeType = 'GⅠ';
const baseNarRaceUpdateDate = new Date('2024-12-01 00:00');

export const baseNarPlaceData = PlaceData.create(
    RaceType.NAR,
    baseNarPlaceDateTime,
    baseNarPlaceCourse,
);

export const baseNarRaceData = RaceData.create(
    RaceType.NAR,
    baseNarRaceName,
    baseRaceDateTime,
    baseNarPlaceCourse,
    baseNarRaceSurfaceType,
    baseNarRaceDistance,
    baseNarRaceGrade,
    baseNarRaceNumber,
);

export const baseNarPlaceRecord = NarPlaceRecord.create(
    generatePlaceId(RaceType.NAR, baseNarPlaceDateTime, baseNarPlaceCourse),
    baseNarPlaceDateTime,
    baseNarPlaceCourse,
    baseNarRaceUpdateDate,
);

export const baseNarRaceRecord = NarRaceRecord.create(
    generateRaceId(
        RaceType.NAR,
        baseNarPlaceDateTime,
        baseNarPlaceCourse,
        baseNarRaceNumber,
    ),
    baseNarRaceName,
    baseRaceDateTime,
    baseNarPlaceCourse,
    baseNarRaceSurfaceType,
    baseNarRaceDistance,
    baseNarRaceGrade,
    baseNarRaceNumber,
    baseNarRaceUpdateDate,
);

export const baseNarPlaceEntity = NarPlaceEntity.createWithoutId(
    baseNarPlaceData,
    baseNarRaceUpdateDate,
);

export const baseNarRaceEntity = NarRaceEntity.createWithoutId(
    baseNarRaceData,
    baseNarRaceUpdateDate,
);

export const baseNarGoogleCalendarData: calendar_v3.Schema$Event = {
    id: generateRaceId(
        RaceType.NAR,
        baseNarPlaceDateTime,
        baseNarPlaceCourse,
        baseNarRaceNumber,
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
<a href="https://www2.keiba.go.jp/KeibaWeb/TodayRaceInfo/DebaTable?k_RaceDateTime=2024%2f12%2f29&k_raceNo=11&k_babaCode=20">レース情報（NAR）</a>
更新日時: 2025/01/01 21:00:00
`,
    extendedProperties: {
        private: {
            dateTime: baseRaceDateTime.toISOString(),
            distance: baseNarRaceDistance.toString(),
            grade: baseNarRaceGrade,
            location: baseNarPlaceCourse,
            name: baseNarRaceName,
            number: baseNarRaceNumber.toString(),
            raceId: generateRaceId(
                RaceType.NAR,
                baseNarPlaceDateTime,
                baseNarPlaceCourse,
                baseNarRaceNumber,
            ),
            surfaceType: baseNarRaceSurfaceType,
            updateDate: baseNarRaceUpdateDate.toISOString(),
        },
    },
};

export const baseNarRaceEntityList: NarRaceEntity[] = ['大井', '高知'].flatMap(
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
            return NarRaceEntity.createWithoutId(
                RaceData.create(
                    RaceType.NAR,
                    `テスト${location}${grade}${(index + 1).toString()}レース`,
                    new Date(2024, 6 - 1, 1, 7 + index, 0),
                    location,
                    'ダート',
                    1600,
                    grade,
                    index + 1,
                ),
                baseNarRaceUpdateDate,
            );
        });
    },
);

export const baseNarRaceDataList = baseNarRaceEntityList.map(
    (raceEntity) => raceEntity.raceData,
);

export const baseNarCalendarData = CalendarData.create(
    'test202412292011',
    RaceType.NAR,
    '東京大賞典',
    '2024-12-29T15:40:00Z',
    '2024-12-29T15:50:00Z',
    '大井競馬場',
    'テスト',
);

export const baseNarCalendarDataFromGoogleCalendar = {
    id: 'test202412292011',
    summary: '東京大賞典',
    start: {
        dateTime: '2024-12-29T15:40:00Z',
    },
    end: {
        dateTime: '2024-12-29T15:50:00Z',
    },
    location: '大井競馬場',
    description: 'テスト',
};
