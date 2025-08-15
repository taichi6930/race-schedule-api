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
import { baseRaceNumber, baseRacePlayerDataList } from './baseCommonData';

const raceType: RaceType = RaceType.BOATRACE;

const baseBoatracePlaceCourse: RaceCourse = '平和島';
const baseBoatracePlaceDateTime = new Date('2024-12-31');
const baseBoatracePlaceGrade: GradeType = 'SG';
const baseBoatracePlaceId = generatePlaceId(
    raceType,
    baseBoatracePlaceDateTime,
    baseBoatracePlaceCourse,
);

const baseBoatraceRaceName = 'グランプリ';
const baseRaceDateTime = new Date('2024-12-31 16:30');
const baseBoatraceRaceStage = '優勝戦';
const baseBoatraceRaceUpdateDate = getJSTDate(new Date('2024-10-01 16:30'));

export const baseBoatracePlaceData = PlaceData.create(
    raceType,
    baseBoatracePlaceDateTime,
    baseBoatracePlaceCourse,
);

export const baseBoatraceRaceData = RaceData.create(
    raceType,
    baseBoatraceRaceName,
    baseRaceDateTime,
    baseBoatracePlaceCourse,
    baseBoatracePlaceGrade,
    baseRaceNumber,
);

export const baseBoatracePlaceRecord = MechanicalRacingPlaceRecord.create(
    baseBoatracePlaceId,
    raceType,
    baseBoatracePlaceDateTime,
    baseBoatracePlaceCourse,
    baseBoatracePlaceGrade,
    baseBoatraceRaceUpdateDate,
);

export const baseBoatraceRaceRecord = MechanicalRacingRaceRecord.create(
    generateRaceId(
        raceType,
        baseBoatracePlaceDateTime,
        baseBoatracePlaceCourse,
        baseRaceNumber,
    ),
    raceType,
    baseBoatraceRaceName,
    baseBoatraceRaceStage,
    baseRaceDateTime,
    baseBoatracePlaceCourse,
    baseBoatracePlaceGrade,
    baseRaceNumber,
    baseBoatraceRaceUpdateDate,
);

export const baseBoatracePlaceEntity =
    MechanicalRacingPlaceEntity.createWithoutId(
        baseBoatracePlaceData,
        baseBoatracePlaceGrade,
        baseBoatraceRaceUpdateDate,
    );

export const baseBoatraceRacePlayerDataList = baseRacePlayerDataList(raceType);

export const baseBoatraceRaceEntity =
    MechanicalRacingRaceEntity.createWithoutId(
        baseBoatraceRaceData,
        baseBoatraceRaceStage,
        baseBoatraceRacePlayerDataList,
        baseBoatraceRaceUpdateDate,
    );

export const baseBoatraceRacePlayerRecord = RacePlayerRecord.create(
    generateRacePlayerId(
        raceType,
        baseBoatracePlaceDateTime,
        baseBoatracePlaceCourse,
        baseRaceNumber,
        1,
    ),
    raceType,
    generateRaceId(
        raceType,
        baseRaceDateTime,
        baseBoatracePlaceCourse,
        baseRaceNumber,
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
            raceType,
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
    raceType,
    `${baseBoatraceRaceStage} ${baseBoatraceRaceName}`,
    '2024-12-31T16:30:00Z',
    '2024-12-31T16:40:00Z',
    `${baseBoatracePlaceCourse}ボートレース場`,
    'テスト',
);

export const baseBoatraceCalendarDataFromGoogleCalendar = {
    id: 'test202412310511',
    summary: `${baseBoatraceRaceStage} ${baseBoatraceRaceName}`,
    start: {
        dateTime: '2024-12-31T16:30:00Z',
    },
    end: {
        dateTime: '2024-12-31T16:40:00Z',
    },
    location: `${baseBoatracePlaceCourse}ボートレース場`,
    description: 'テスト',
};
