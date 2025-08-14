import { CalendarData } from '../../../../../lib/src/domain/calendarData';
import { PlaceData } from '../../../../../lib/src/domain/placeData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import { MechanicalRacingPlaceRecord } from '../../../../../lib/src/gateway/record/mechanicalRacingPlaceRecord';
import { MechanicalRacingRaceRecord } from '../../../../../lib/src/gateway/record/mechanicalRacingRaceRecord';
import { RacePlayerRecord } from '../../../../../lib/src/gateway/record/racePlayerRecord';
import { MechanicalRacingPlaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import { MechanicalRacingRaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingRaceEntity';
import type { GradeType } from '../../../../../lib/src/utility/data/common/gradeType';
import { generatePlaceId } from '../../../../../lib/src/utility/data/common/placeId';
import type { RaceCourse } from '../../../../../lib/src/utility/data/common/raceCourse';
import { generateRaceId } from '../../../../../lib/src/utility/data/common/raceId';
import { generateRacePlayerId } from '../../../../../lib/src/utility/data/common/racePlayerId';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseRacePlayerDataList } from './baseCommonData';

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
);

export const baseBoatraceRaceData = RaceData.create(
    RaceType.BOATRACE,
    baseBoatraceRaceName,
    baseRaceDateTime,
    baseBoatracePlaceCourse,
    baseBoatracePlaceGrade,
    baseBoatraceRaceNumber,
);

export const baseBoatracePlaceRecord = MechanicalRacingPlaceRecord.create(
    baseBoatracePlaceId,
    RaceType.BOATRACE,
    baseBoatracePlaceDateTime,
    baseBoatracePlaceCourse,
    baseBoatracePlaceGrade,
    baseBoatraceRaceUpdateDate,
);

export const baseBoatraceRaceRecord = MechanicalRacingRaceRecord.create(
    generateRaceId(
        RaceType.BOATRACE,
        baseBoatracePlaceDateTime,
        baseBoatracePlaceCourse,
        baseBoatraceRaceNumber,
    ),
    RaceType.BOATRACE,
    baseBoatraceRaceName,
    baseBoatraceRaceStage,
    baseRaceDateTime,
    baseBoatracePlaceCourse,
    baseBoatracePlaceGrade,
    baseBoatraceRaceNumber,
    baseBoatraceRaceUpdateDate,
);

export const baseBoatracePlaceEntity =
    MechanicalRacingPlaceEntity.createWithoutId(
        baseBoatracePlaceData,
        baseBoatracePlaceGrade,
        baseBoatraceRaceUpdateDate,
    );

export const baseBoatraceRacePlayerDataList = baseRacePlayerDataList(
    RaceType.BOATRACE,
);

export const baseBoatraceRaceEntity =
    MechanicalRacingRaceEntity.createWithoutId(
        baseBoatraceRaceData,
        baseBoatraceRaceStage,
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

export const baseBoatraceRaceEntityList: MechanicalRacingRaceEntity[] = [
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
        const raceData = RaceData.create(
            RaceType.BOATRACE,
            `テスト${location}${grade}${stage}${(index + 1).toString()}レース`,
            new Date(2025, 12 - 1, 30, 7 + index, 0),
            location,
            grade,
            index + 1,
        );
        const racePlayerDataList = baseBoatraceRacePlayerDataList;
        return MechanicalRacingRaceEntity.createWithoutId(
            raceData,
            stage,
            racePlayerDataList,
            baseBoatraceRaceUpdateDate,
        );
    });
});

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
