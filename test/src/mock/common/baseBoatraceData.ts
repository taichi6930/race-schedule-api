import { BoatraceRaceData } from '../../../../lib/src/domain/boatraceRaceData';
import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { PlaceData } from '../../../../lib/src/domain/placeData';
import { RacePlayerData } from '../../../../lib/src/domain/racePlayerData';
import { BoatracePlaceRecord } from '../../../../lib/src/gateway/record/boatracePlaceRecord';
import { BoatraceRaceRecord } from '../../../../lib/src/gateway/record/boatraceRaceRecord';
import { RacePlayerRecord } from '../../../../lib/src/gateway/record/racePlayerRecord';
import { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import { PlaceEntity } from '../../../../lib/src/repository/entity/placeEntity';
import type { GradeType } from '../../../../lib/src/utility/data/common/gradeType';
import type { RaceCourse } from '../../../../lib/src/utility/data/common/raceCourse';
import { getJSTDate } from '../../../../lib/src/utility/date';
import {
    generatePlaceId,
    generateRaceId,
    generateRacePlayerId,
} from '../../../../lib/src/utility/raceId';
import { RaceType } from '../../../../lib/src/utility/raceType';

const baseBoatracePlaceCourse: RaceCourse = '平和島';
const baseBoatracePlaceDateTime = new Date('2024-12-31');
const baseBoatracePlaceGrade: GradeType = 'SG';
const baseBoatracePlaceId = generatePlaceId(
    RaceType.BOATRACE,
    baseBoatracePlaceDateTime,
    baseBoatracePlaceCourse,
);

const baseBoatraceRaceName = 'グランプリ';
const baseRaceDateTime = new Date('2024-12-31 16:30');
const baseBoatraceRaceNumber = 11;
const baseBoatraceRaceStage = '優勝戦';
const baseBoatraceRaceUpdateDate = getJSTDate(new Date('2024-10-01 16:30'));

export const baseBoatracePlaceData = PlaceData.create(
    RaceType.BOATRACE,
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
    generateRaceId(
        RaceType.BOATRACE,
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

export const baseBoatracePlaceEntity = PlaceEntity.createWithoutId(
    RaceType.BOATRACE,
    baseBoatracePlaceData,
    baseBoatraceRaceUpdateDate,
);

export const baseBoatraceRacePlayerData = RacePlayerData.create(
    RaceType.BOATRACE,
    1,
    10000,
);

export const baseBoatraceRacePlayerDataList = Array.from(
    { length: 6 },
    (_, i) => {
        return RacePlayerData.create(RaceType.BOATRACE, i + 1, i + 1);
    },
);

export const baseBoatraceRaceEntity = BoatraceRaceEntity.createWithoutId(
    baseBoatraceRaceData,
    baseBoatraceRacePlayerDataList,
    baseBoatraceRaceUpdateDate,
);

export const baseBoatraceRacePlayerRecord = RacePlayerRecord.create(
    generateRacePlayerId(
        RaceType.BOATRACE,
        baseBoatracePlaceDateTime,
        baseBoatracePlaceCourse,
        baseBoatraceRaceNumber,
        1,
    ),
    RaceType.BOATRACE,
    generateRaceId(
        RaceType.BOATRACE,
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
            return RacePlayerData.create(RaceType.BOATRACE, i + 1, i + 1);
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
