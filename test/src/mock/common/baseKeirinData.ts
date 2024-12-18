import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { KeirinPlaceData } from '../../../../lib/src/domain/keirinPlaceData';
import { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import { KeirinRacePlayerData } from '../../../../lib/src/domain/keirinRacePlayerData';
import { KeirinPlaceRecord } from '../../../../lib/src/gateway/record/keirinPlaceRecord';
import { KeirinRacePlayerRecord } from '../../../../lib/src/gateway/record/keirinRacePlayerRecord';
import { KeirinRaceRecord } from '../../../../lib/src/gateway/record/keirinRaceRecord';
import { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type {
    KeirinGradeType,
    KeirinRaceCourse,
    KeirinRaceStage,
} from '../../../../lib/src/utility/data/keirin';
import { getJSTDate } from '../../../../lib/src/utility/date';
import {
    generateKeirinPlaceId,
    generateKeirinRaceId,
    generateKeirinRacePlayerId,
} from '../../../../lib/src/utility/raceId';

const baseKeirinPlaceCourse: KeirinRaceCourse = '平塚';
const baseKeirinPlaceDateTime = new Date('2025-12-30');
const baseKeirinPlaceGrade: KeirinGradeType = 'GP';

const baseKeirinRaceName = 'KEIRINグランプリ';
const baseKeirinRaceDateTime = new Date('2025-12-30 16:30');
const baseKeirinRaceNumber = 11;
const baseKeirinRaceStage: KeirinRaceStage = 'S級グランプリ';
const baseKeirinRaceUpdateDate = getJSTDate(new Date('2025-10-01 16:30'));

export const baseKeirinPlaceData = new KeirinPlaceData(
    baseKeirinPlaceDateTime,
    baseKeirinPlaceCourse,
    baseKeirinPlaceGrade,
);

export const baseKeirinRaceData = new KeirinRaceData(
    baseKeirinRaceName,
    baseKeirinRaceStage,
    baseKeirinRaceDateTime,
    baseKeirinPlaceCourse,
    baseKeirinPlaceGrade,
    baseKeirinRaceNumber,
);

export const baseKeirinPlaceRecord = new KeirinPlaceRecord(
    generateKeirinPlaceId(baseKeirinPlaceDateTime, baseKeirinPlaceCourse),
    baseKeirinPlaceDateTime,
    baseKeirinPlaceCourse,
    baseKeirinPlaceGrade,
    baseKeirinRaceUpdateDate,
);

export const baseKeirinRaceRecord = new KeirinRaceRecord(
    generateKeirinRaceId(
        baseKeirinPlaceDateTime,
        baseKeirinPlaceCourse,
        baseKeirinRaceNumber,
    ),
    baseKeirinRaceName,
    baseKeirinRaceStage,
    baseKeirinRaceDateTime,
    baseKeirinPlaceCourse,
    baseKeirinPlaceGrade,
    baseKeirinRaceNumber,
    baseKeirinRaceUpdateDate,
);

export const baseKeirinPlaceEntity = new KeirinPlaceEntity(
    null,
    baseKeirinPlaceData,
    baseKeirinRaceUpdateDate,
);

export const baseKeirinRacePlayerDataList = Array.from(
    { length: 9 },
    (_, i) => {
        return new KeirinRacePlayerData(i + 1, i + 1);
    },
);

export const baseKeirinRaceEntity = new KeirinRaceEntity(
    null,
    baseKeirinRaceData,
    baseKeirinRacePlayerDataList,
    baseKeirinRaceUpdateDate,
);

export const baseKeirinRaceEntityList: KeirinRaceEntity[] = [
    { location: '平塚', grade: 'GP' },
    { location: '立川', grade: 'GⅠ' },
    { location: '函館', grade: 'GⅡ' },
    { location: '小倉', grade: 'GⅢ' },
    { location: '浜松', grade: 'FⅠ' },
    { location: '名古屋', grade: 'FⅡ' },
].flatMap((value) => {
    const { location, grade } = value;
    return [
        '一般',
        '一般',
        '一般',
        '一般',
        '一般',
        '一般',
        '一般',
        '一般',
        '一般',
        '一般',
        '特別優秀',
        '決勝',
    ].map((stage, index) => {
        const raceData = new KeirinRaceData(
            `テスト${location}${grade}${stage}${(index + 1).toString()}レース`,
            stage as KeirinRaceStage,
            new Date(2025, 12 - 1, 30, 7 + index, 0),
            location as KeirinRaceCourse,
            grade as KeirinGradeType,
            index + 1,
        );
        const racePlayerDataList = Array.from({ length: 9 }, (_, i) => {
            return new KeirinRacePlayerData(i + 1, i + 1);
        });
        return new KeirinRaceEntity(
            null,
            raceData,
            racePlayerDataList,
            baseKeirinRaceUpdateDate,
        );
    });
});

export const baseKeirinRacePlayerRecord = new KeirinRacePlayerRecord(
    generateKeirinRacePlayerId(
        baseKeirinPlaceDateTime,
        baseKeirinPlaceCourse,
        baseKeirinRaceNumber,
        1,
    ),
    generateKeirinRaceId(
        baseKeirinRaceDateTime,
        baseKeirinPlaceCourse,
        baseKeirinRaceNumber,
    ),
    1,
    10000,
    baseKeirinRaceUpdateDate,
);

export const baseKeirinRacePlayerData = new KeirinRacePlayerData(1, 10000);

export const baseKeirinRaceDataList = baseKeirinRaceEntityList.map(
    (raceEntity) => raceEntity.raceData,
);

export const baseKeirinCalendarData = new CalendarData(
    'test202512303511',
    'S級グランプリ KEIRINグランプリ',
    new Date('2024-12-31T16:30:00Z'),
    new Date('2024-12-31T16:40:00Z'),
    '平塚競輪場',
    'テスト',
);

export const baseKeirinCalendarDataFromGoogleCalendar = {
    id: 'test202512303511',
    summary: 'S級グランプリ KEIRINグランプリ',
    start: {
        dateTime: '2024-12-31T16:30:00Z',
    },
    end: {
        dateTime: '2024-12-31T16:40:00Z',
    },
    location: '平塚競輪場',
    description: 'テスト',
};
