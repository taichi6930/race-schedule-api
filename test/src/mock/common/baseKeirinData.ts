import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { KeirinPlaceData } from '../../../../lib/src/domain/keirinPlaceData';
import { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import { KeirinRacePlayerData } from '../../../../lib/src/domain/keirinRacePlayerData';
import { KeirinPlaceRecord } from '../../../../lib/src/gateway/record/keirinPlaceRecord';
import { KeirinRaceRecord } from '../../../../lib/src/gateway/record/keirinRaceRecord';
import { RacePlayerRecord } from '../../../../lib/src/gateway/record/racePlayerRecord';
import { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { KeirinGradeType } from '../../../../lib/src/utility/data/common/gradeType';
import type { KeirinRaceCourse } from '../../../../lib/src/utility/data/common/raceCourse';
import type { KeirinRaceStage } from '../../../../lib/src/utility/data/keirin/keirinRaceStage';
import { getJSTDate } from '../../../../lib/src/utility/date';
import {
    generateKeirinPlaceId,
    generateKeirinRaceId,
    generateKeirinRacePlayerId,
} from '../../../../lib/src/utility/raceId';
import { RaceType } from '../../../../lib/src/utility/raceType';

const baseKeirinPlaceCourse: KeirinRaceCourse = '平塚';
const baseKeirinPlaceDateTime = new Date('2025-12-30');
const baseKeirinPlaceGrade: KeirinGradeType = 'GP';
const baseKeirinPlaceId = generateKeirinPlaceId(
    baseKeirinPlaceDateTime,
    baseKeirinPlaceCourse,
);

const baseKeirinRaceName = 'KEIRINグランプリ';
const baseRaceDateTime = new Date('2025-12-30 16:30');
const baseKeirinRaceNumber = 11;
const baseKeirinRaceStage: KeirinRaceStage = 'S級グランプリ';
const baseKeirinRaceUpdateDate = getJSTDate(new Date('2025-10-01 16:30'));

export const baseKeirinPlaceData = KeirinPlaceData.create(
    baseKeirinPlaceDateTime,
    baseKeirinPlaceCourse,
    baseKeirinPlaceGrade,
);

export const baseKeirinRaceData = KeirinRaceData.create(
    baseKeirinRaceName,
    baseKeirinRaceStage,
    baseRaceDateTime,
    baseKeirinPlaceCourse,
    baseKeirinPlaceGrade,
    baseKeirinRaceNumber,
);

export const baseKeirinPlaceRecord = KeirinPlaceRecord.create(
    baseKeirinPlaceId,
    baseKeirinPlaceDateTime,
    baseKeirinPlaceCourse,
    baseKeirinPlaceGrade,
    baseKeirinRaceUpdateDate,
);

export const baseKeirinRaceRecord = KeirinRaceRecord.create(
    generateKeirinRaceId(
        baseKeirinPlaceDateTime,
        baseKeirinPlaceCourse,
        baseKeirinRaceNumber,
    ),
    baseKeirinRaceName,
    baseKeirinRaceStage,
    baseRaceDateTime,
    baseKeirinPlaceCourse,
    baseKeirinPlaceGrade,
    baseKeirinRaceNumber,
    baseKeirinRaceUpdateDate,
);

export const baseKeirinPlaceEntity = KeirinPlaceEntity.createWithoutId(
    baseKeirinPlaceData,
    baseKeirinRaceUpdateDate,
);

export const baseKeirinRacePlayerDataList = Array.from(
    { length: 9 },
    (_, i) => {
        return KeirinRacePlayerData.create(i + 1, i + 1);
    },
);

export const baseKeirinRaceEntity = KeirinRaceEntity.createWithoutId(
    baseKeirinRaceData,
    baseKeirinRacePlayerDataList,
    baseKeirinRaceUpdateDate,
);

export const baseKeirinRaceEntityList: KeirinRaceEntity[] = [
    { location: '平塚', grade: 'GP' },
    { location: '立川', grade: 'GⅠ' },
    { location: '函館', grade: 'GⅡ' },
    { location: '小倉', grade: 'GⅢ' },
    { location: '久留米', grade: 'FⅠ' },
    { location: '名古屋', grade: 'FⅡ' },
].flatMap((value) => {
    const { location, grade } = value;
    return [
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級特別優秀',
        'S級決勝',
    ].map((stage, index) => {
        const raceData = KeirinRaceData.create(
            `テスト${location}${grade}${stage}${(index + 1).toString()}レース`,
            stage,
            new Date(2025, 12 - 1, 30, 7 + index, 0),
            location,
            grade,
            index + 1,
        );
        const racePlayerDataList = Array.from({ length: 9 }, (_, i) => {
            return KeirinRacePlayerData.create(i + 1, i + 1);
        });
        return KeirinRaceEntity.createWithoutId(
            raceData,
            racePlayerDataList,
            baseKeirinRaceUpdateDate,
        );
    });
});

export const baseKeirinRacePlayerRecord = RacePlayerRecord.create(
    generateKeirinRacePlayerId(
        baseKeirinPlaceDateTime,
        baseKeirinPlaceCourse,
        baseKeirinRaceNumber,
        1,
    ),
    RaceType.KEIRIN,
    generateKeirinRaceId(
        baseRaceDateTime,
        baseKeirinPlaceCourse,
        baseKeirinRaceNumber,
    ),
    1,
    10000,
    baseKeirinRaceUpdateDate,
);

export const baseKeirinRacePlayerData = KeirinRacePlayerData.create(1, 10000);

export const baseKeirinRaceDataList = baseKeirinRaceEntityList.map(
    (raceEntity) => raceEntity.raceData,
);

export const baseKeirinCalendarData = CalendarData.create(
    'test202512303511',
    RaceType.KEIRIN,
    'S級グランプリ KEIRINグランプリ',
    '2024-12-31T16:30:00Z',
    '2024-12-31T16:40:00Z',
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
