import type { calendar_v3 } from 'googleapis';

import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import { NarPlaceRecord } from '../../../../lib/src/gateway/record/narPlaceRecord';
import { NarRaceRecord } from '../../../../lib/src/gateway/record/narRaceRecord';
import { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { NarGradeType } from '../../../../lib/src/utility/data/nar/narGradeType';
import type { NarRaceCourse } from '../../../../lib/src/utility/data/nar/narRaceCourse';
import {
    generateNarPlaceId,
    generateNarRaceId,
} from '../../../../lib/src/utility/raceId';

const baseNarPlaceCourse: NarRaceCourse = '大井';
const baseNarPlaceDateTime = new Date('2024-12-29');

const baseNarRaceName = '東京大賞典';
const baseNarRaceDateTime = new Date('2024-12-29 15:40');
const baseNarRaceNumber = 11;
const baseNarRaceSurfaceType = 'ダート';
const baseNarRaceDistance = 2000;
const baseNarRaceGrade: NarGradeType = 'GⅠ';
const baseNarRaceUpdateDate = new Date('2024-12-01 00:00');

export const baseNarPlaceData = NarPlaceData.create(
    baseNarPlaceDateTime,
    baseNarPlaceCourse,
);

export const baseNarRaceData = NarRaceData.create(
    baseNarRaceName,
    baseNarRaceDateTime,
    baseNarPlaceCourse,
    baseNarRaceSurfaceType,
    baseNarRaceDistance,
    baseNarRaceGrade,
    baseNarRaceNumber,
);

export const baseNarPlaceRecord = NarPlaceRecord.create(
    generateNarPlaceId(baseNarPlaceDateTime, baseNarPlaceCourse),
    baseNarPlaceDateTime,
    baseNarPlaceCourse,
    baseNarRaceUpdateDate,
);

export const baseNarRaceRecord = NarRaceRecord.create(
    generateNarRaceId(
        baseNarPlaceDateTime,
        baseNarPlaceCourse,
        baseNarRaceNumber,
    ),
    baseNarRaceName,
    baseNarRaceDateTime,
    baseNarPlaceCourse,
    baseNarRaceSurfaceType,
    baseNarRaceDistance,
    baseNarRaceGrade,
    baseNarRaceNumber,
    baseNarRaceUpdateDate,
);

export const baseNarPlaceEntity = new NarPlaceEntity(
    null,
    baseNarPlaceData,
    baseNarRaceUpdateDate,
);

export const baseNarRaceEntity = new NarRaceEntity(
    null,
    baseNarRaceData,
    baseNarRaceUpdateDate,
);

export const baseNarGoogleCalendarData: calendar_v3.Schema$Event = {
    id: generateNarRaceId(
        baseNarPlaceDateTime,
        baseNarPlaceCourse,
        baseNarRaceNumber,
    ),
    summary: baseNarRaceName,
    start: {
        dateTime: baseNarRaceDateTime.toISOString().replace('Z', '+09:00'),
        timeZone: 'Asia/Tokyo',
    },
    end: {
        dateTime: new Date(baseNarRaceDateTime.getTime() + 10 * 60 * 1000)
            .toISOString()
            .replace('Z', '+09:00'),
        timeZone: 'Asia/Tokyo',
    },
    location: `${baseNarPlaceCourse}競馬場`,
    colorId: '9',
    description: `距離: ダート2000m
発走: 15:40
<a href="http://keiba-lv-st.jp/">レース映像（地方競馬LIVE）</a>
<a href="https://www.youtube.com/@tckkeiba/stream">レース映像（YouTube）</a>
<a href="https://netkeiba.page.link/?link=https%3A%2F%2Fnar.sp.netkeiba.com%2Frace%2Fshutuba.html%3Frace_id%3D202444122911">レース情報（netkeiba）</a>
<a href="https://www2.keiba.go.jp/KeibaWeb/TodayRaceInfo/DebaTable?k_raceDate=2024%2f12%2f29&k_raceNo=11&k_babaCode=20">レース情報（NAR）</a>
更新日時: 2025/01/01 21:00:00
`,
    extendedProperties: {
        private: {
            dateTime: baseNarRaceDateTime.toISOString(),
            distance: baseNarRaceDistance.toString(),
            grade: baseNarRaceGrade,
            location: baseNarPlaceCourse,
            name: baseNarRaceName,
            number: baseNarRaceNumber.toString(),
            raceId: generateNarRaceId(
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
            return new NarRaceEntity(
                null,
                NarRaceData.create(
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
    '東京大賞典',
    new Date('2024-12-29T15:40:00Z'),
    new Date('2024-12-29T15:50:00Z'),
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
