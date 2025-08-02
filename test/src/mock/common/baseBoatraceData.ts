import { BoatracePlaceData } from '../../../../lib/src/domain/boatracePlaceData';
import { BoatraceRaceData } from '../../../../lib/src/domain/boatraceRaceData';
import { BoatraceRacePlayerData } from '../../../../lib/src/domain/boatraceRacePlayerData';
import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { BoatracePlaceRecord } from '../../../../lib/src/gateway/record/boatracePlaceRecord';
import { BoatraceRacePlayerRecord } from '../../../../lib/src/gateway/record/boatraceRacePlayerRecord';
import { BoatraceRaceRecord } from '../../../../lib/src/gateway/record/boatraceRaceRecord';
import { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { BoatraceRaceStage } from '../../../../lib/src/utility/data/boatrace/boatraceRaceStage';
import type { BoatraceGradeType } from '../../../../lib/src/utility/data/common/gradeType';
import type { BoatraceRaceCourse } from '../../../../lib/src/utility/data/common/raceCourse';
import { getJSTDate } from '../../../../lib/src/utility/date';
import {
    generateBoatracePlaceId,
    generateBoatraceRaceId,
    generateBoatraceRacePlayerId,
} from '../../../../lib/src/utility/raceId';
import { RaceType } from '../../../../lib/src/utility/raceType';

const baseBoatracePlaceCourse: BoatraceRaceCourse = '平和島';
const baseBoatracePlaceDateTime = new Date('2024-12-31');
const baseBoatracePlaceGrade: BoatraceGradeType = 'SG';
const baseBoatracePlaceId = generateBoatracePlaceId(
    baseBoatracePlaceDateTime,
    baseBoatracePlaceCourse,
);

const baseBoatraceRaceName = 'グランプリ';
const baseRaceDateTime = new Date('2024-12-31 16:30');
const baseBoatraceRaceNumber = 11;
const baseBoatraceRaceStage: BoatraceRaceStage = '優勝戦';
const baseBoatraceRaceUpdateDate = getJSTDate(new Date('2024-10-01 16:30'));

export const baseBoatracePlaceData = BoatracePlaceData.create(
    baseBoatracePlaceDateTime,
    baseBoatracePlaceCourse,
    baseBoatracePlaceGrade,
);

export const baseBoatraceRaceData = BoatraceRaceData.create(
    baseBoatraceRaceName,
    baseBoatraceRaceStage,
    baseRaceDateTime,
    baseBoatracePlaceCourse,
    baseBoatracePlaceGrade,
    baseBoatraceRaceNumber,
);

export const baseBoatracePlaceRecord = BoatracePlaceRecord.create(
    baseBoatracePlaceId,
    baseBoatracePlaceDateTime,
    baseBoatracePlaceCourse,
    baseBoatracePlaceGrade,
    baseBoatraceRaceUpdateDate,
);

export const baseBoatraceRaceRecord = BoatraceRaceRecord.create(
    generateBoatraceRaceId(
        baseBoatracePlaceDateTime,
        baseBoatracePlaceCourse,
        baseBoatraceRaceNumber,
    ),
    baseBoatraceRaceName,
    baseBoatraceRaceStage,
    baseRaceDateTime,
    baseBoatracePlaceCourse,
    baseBoatracePlaceGrade,
    baseBoatraceRaceNumber,
    baseBoatraceRaceUpdateDate,
);

export const baseBoatracePlaceEntity = BoatracePlaceEntity.createWithoutId(
    baseBoatracePlaceData,
    baseBoatraceRaceUpdateDate,
);

export const baseBoatraceRacePlayerData = BoatraceRacePlayerData.create(
    1,
    10000,
);

export const baseBoatraceRacePlayerDataList = Array.from(
    { length: 6 },
    (_, i) => {
        return BoatraceRacePlayerData.create(i + 1, i + 1);
    },
);

export const baseBoatraceRaceEntity = BoatraceRaceEntity.createWithoutId(
    baseBoatraceRaceData,
    baseBoatraceRacePlayerDataList,
    baseBoatraceRaceUpdateDate,
);

export const baseBoatraceRacePlayerRecord = BoatraceRacePlayerRecord.create(
    generateBoatraceRacePlayerId(
        baseBoatracePlaceDateTime,
        baseBoatracePlaceCourse,
        baseBoatraceRaceNumber,
        1,
    ),
    generateBoatraceRaceId(
        baseRaceDateTime,
        baseBoatracePlaceCourse,
        baseBoatraceRaceNumber,
    ),
    1,
    10000,
    baseBoatraceRaceUpdateDate,
);

export const baseBoatraceRaceEntityList: BoatraceRaceEntity[] = [
    { location: '平和島', grade: 'SG' },
    { location: '戸田', grade: 'GⅠ' },
    { location: '江戸川', grade: 'GⅡ' },
    { location: '桐生', grade: 'GⅢ' },
    { location: '多摩川', grade: '一般' },
].flatMap((value) => {
    const { location, grade } = value;
    return [
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '優勝戦',
    ].map((stage, index) => {
        const raceData = BoatraceRaceData.create(
            `テスト${location}${grade}${stage}${(index + 1).toString()}レース`,
            stage,
            new Date(2025, 12 - 1, 30, 7 + index, 0),
            location,
            grade,
            index + 1,
        );
        const racePlayerDataList = Array.from({ length: 6 }, (_, i) => {
            return BoatraceRacePlayerData.create(i + 1, i + 1);
        });
        return BoatraceRaceEntity.createWithoutId(
            raceData,
            racePlayerDataList,
            baseBoatraceRaceUpdateDate,
        );
    });
});

export const baseBoatraceRaceDataList = baseBoatraceRaceEntityList.map(
    (raceEntity) => raceEntity.raceData,
);

export const baseBoatraceCalendarData = CalendarData.create(
    'test202412310511',
    RaceType.BOATRACE,
    '優勝戦 グランプリ',
    '2024-12-31T16:30:00Z',
    '2024-12-31T16:40:00Z',
    '平和島ボートレース場',
    'テスト',
);

export const baseBoatraceCalendarDataFromGoogleCalendar = {
    id: 'test202412310511',
    summary: '優勝戦 グランプリ',
    start: {
        dateTime: '2024-12-31T16:30:00Z',
    },
    end: {
        dateTime: '2024-12-31T16:40:00Z',
    },
    location: '平和島ボートレース場',
    description: 'テスト',
};
