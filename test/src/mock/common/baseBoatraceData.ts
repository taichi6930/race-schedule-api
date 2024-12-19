import { BoatracePlaceData } from '../../../../lib/src/domain/boatracePlaceData';
import { BoatraceRaceData } from '../../../../lib/src/domain/boatraceRaceData';
import { BoatraceRacePlayerData } from '../../../../lib/src/domain/boatraceRacePlayerData';
import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { BoatracePlaceRecord } from '../../../../lib/src/gateway/record/boatracePlaceRecord';
import { BoatraceRacePlayerRecord } from '../../../../lib/src/gateway/record/boatraceRacePlayerRecord';
import { BoatraceRaceRecord } from '../../../../lib/src/gateway/record/boatraceRaceRecord';
import { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type {
    BoatraceGradeType,
    BoatraceRaceCourse,
    BoatraceRaceStage,
} from '../../../../lib/src/utility/data/boatrace';
import { getJSTDate } from '../../../../lib/src/utility/date';
import {
    generateBoatracePlaceId,
    generateBoatraceRaceId,
    generateBoatraceRacePlayerId,
} from '../../../../lib/src/utility/raceId';

const baseBoatracePlaceCourse: BoatraceRaceCourse = '平和島';
const baseBoatracePlaceDateTime = new Date('2024-12-31');
const baseBoatracePlaceGrade: BoatraceGradeType = 'SG';

const baseBoatraceRaceName = 'グランプリ';
const baseBoatraceRaceDateTime = new Date('2024-12-31 16:30');
const baseBoatraceRaceNumber = 11;
const baseBoatraceRaceStage: BoatraceRaceStage = '優勝戦';
const baseBoatraceRaceUpdateDate = getJSTDate(new Date('2024-10-01 16:30'));

export const baseBoatracePlaceData = new BoatracePlaceData(
    baseBoatracePlaceDateTime,
    baseBoatracePlaceCourse,
    baseBoatracePlaceGrade,
);

export const baseBoatraceRaceData = new BoatraceRaceData(
    baseBoatraceRaceName,
    baseBoatraceRaceStage,
    baseBoatraceRaceDateTime,
    baseBoatracePlaceCourse,
    baseBoatracePlaceGrade,
    baseBoatraceRaceNumber,
);

export const baseBoatracePlaceRecord = new BoatracePlaceRecord(
    generateBoatracePlaceId(baseBoatracePlaceDateTime, baseBoatracePlaceCourse),
    baseBoatracePlaceDateTime,
    baseBoatracePlaceCourse,
    baseBoatracePlaceGrade,
    baseBoatraceRaceUpdateDate,
);

export const baseBoatraceRaceRecord = new BoatraceRaceRecord(
    generateBoatraceRaceId(
        baseBoatracePlaceDateTime,
        baseBoatracePlaceCourse,
        baseBoatraceRaceNumber,
    ),
    baseBoatraceRaceName,
    baseBoatraceRaceStage,
    baseBoatraceRaceDateTime,
    baseBoatracePlaceCourse,
    baseBoatracePlaceGrade,
    baseBoatraceRaceNumber,
    baseBoatraceRaceUpdateDate,
);

export const baseBoatracePlaceEntity = new BoatracePlaceEntity(
    null,
    baseBoatracePlaceData,
    baseBoatraceRaceUpdateDate,
);

export const baseBoatraceRacePlayerData = new BoatraceRacePlayerData(1, 10000);

export const baseBoatraceRacePlayerDataList = Array.from(
    { length: 6 },
    (_, i) => {
        return new BoatraceRacePlayerData(i + 1, i + 1);
    },
);

export const baseBoatraceRaceEntity = new BoatraceRaceEntity(
    null,
    baseBoatraceRaceData,
    baseBoatraceRacePlayerDataList,
    baseBoatraceRaceUpdateDate,
);

export const baseBoatraceRacePlayerRecord = new BoatraceRacePlayerRecord(
    generateBoatraceRacePlayerId(
        baseBoatracePlaceDateTime,
        baseBoatracePlaceCourse,
        baseBoatraceRaceNumber,
        1,
    ),
    generateBoatraceRaceId(
        baseBoatraceRaceDateTime,
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
        const raceData = new BoatraceRaceData(
            `テスト${location}${grade}${stage}${(index + 1).toString()}レース`,
            stage as BoatraceRaceStage,
            new Date(2025, 12 - 1, 30, 7 + index, 0),
            location as BoatraceRaceCourse,
            grade as BoatraceGradeType,
            index + 1,
        );
        const racePlayerDataList = Array.from({ length: 6 }, (_, i) => {
            return new BoatraceRacePlayerData(i + 1, i + 1);
        });
        return new BoatraceRaceEntity(
            null,
            raceData,
            racePlayerDataList,
            baseBoatraceRaceUpdateDate,
        );
    });
});

export const baseBoatraceRaceDataList = baseBoatraceRaceEntityList.map(
    (raceEntity) => raceEntity.raceData,
);

export const baseBoatraceCalendarData = new CalendarData(
    'test202412310511',
    '優勝戦 グランプリ',
    new Date('2024-12-31T16:30:00Z'),
    new Date('2024-12-31T16:40:00Z'),
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
