import { CalendarData } from '../../../../../lib/src/domain/calendarData';
import { PlaceData } from '../../../../../lib/src/domain/placeData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import { MechanicalRacingRaceRecord } from '../../../../../lib/src/gateway/record/mechanicalRacingRaceRecord';
import { PlaceRecord } from '../../../../../lib/src/gateway/record/placeRecord';
import { RacePlayerRecord } from '../../../../../lib/src/gateway/record/racePlayerRecord';
import { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import type { GradeType } from '../../../../../lib/src/utility/data/common/gradeType';
import { generatePlaceId } from '../../../../../lib/src/utility/data/common/placeId';
import type { RaceCourse } from '../../../../../lib/src/utility/data/common/raceCourse';
import { generateRaceId } from '../../../../../lib/src/utility/data/common/raceId';
import { generateRacePlayerId } from '../../../../../lib/src/utility/data/common/racePlayerId';
import type { RaceStage } from '../../../../../lib/src/utility/data/common/raceStage';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseRaceNumber, baseRacePlayerDataList } from './baseCommonData';

const raceType: RaceType = RaceType.AUTORACE;

const baseAutoracePlaceCourse: RaceCourse = '飯塚';
const baseAutoracePlaceDateTime = new Date('2024-12-31');
export const baseAutoracePlaceGrade: GradeType = 'SG';
export const baseAutoracePlaceId = generatePlaceId(
    raceType,
    baseAutoracePlaceDateTime,
    baseAutoracePlaceCourse,
);

const baseAutoraceRaceName = 'スーパースター王座決定戦';
const baseRaceDateTime = new Date('2024-12-31 16:30');
export const baseAutoraceRaceStage: RaceStage = '優勝戦';
export const baseAutoraceRaceUpdateDate = getJSTDate(
    new Date('2024-10-01 16:30'),
);

export const baseAutoraceRaceId = generateRaceId(
    raceType,
    baseAutoracePlaceDateTime,
    baseAutoracePlaceCourse,
    baseRaceNumber,
);

export const baseAutoracePlaceData = PlaceData.create(
    raceType,
    baseAutoracePlaceDateTime,
    baseAutoracePlaceCourse,
);

export const baseAutoraceRaceData = RaceData.create(
    raceType,
    baseAutoraceRaceName,
    baseRaceDateTime,
    baseAutoracePlaceCourse,
    baseAutoracePlaceGrade,
    baseRaceNumber,
);

export const baseAutoracePlaceRecord = PlaceRecord.create(
    baseAutoracePlaceId,
    raceType,
    baseAutoracePlaceDateTime,
    baseAutoracePlaceCourse,
    baseAutoraceRaceUpdateDate,
);

export const baseAutoraceRaceRecord = MechanicalRacingRaceRecord.create(
    generateRaceId(
        raceType,
        baseAutoracePlaceDateTime,
        baseAutoracePlaceCourse,
        baseRaceNumber,
    ),
    raceType,
    baseAutoraceRaceName,
    baseAutoraceRaceStage,
    baseRaceDateTime,
    baseAutoracePlaceCourse,
    baseAutoracePlaceGrade,
    baseRaceNumber,
    baseAutoraceRaceUpdateDate,
);

export const baseAutoracePlaceEntity = PlaceEntity.createWithoutId(
    baseAutoracePlaceData,
    undefined,
    baseAutoracePlaceGrade,
    baseAutoraceRaceUpdateDate,
);

export const baseAutoraceRacePlayerDataList = baseRacePlayerDataList(raceType);

export const baseAutoraceRaceEntity = RaceEntity.createWithoutId(
    baseAutoraceRaceData,
    undefined, // heldDayDataは未設定
    undefined, // conditionDataは未設定
    baseAutoraceRaceStage,
    baseAutoraceRacePlayerDataList,
    baseAutoraceRaceUpdateDate,
);

export const baseAutoraceRacePlayerRecord = RacePlayerRecord.create(
    generateRacePlayerId(
        raceType,
        baseAutoracePlaceDateTime,
        baseAutoracePlaceCourse,
        baseRaceNumber,
        1,
    ),
    raceType,
    generateRaceId(
        raceType,
        baseRaceDateTime,
        baseAutoracePlaceCourse,
        baseRaceNumber,
    ),
    1,
    10000,
    baseAutoraceRaceUpdateDate,
);

export const baseAutoraceRaceEntityList: RaceEntity[] = [
    { location: '飯塚', grade: 'SG' },
    { location: '川口', grade: 'GⅠ' },
    { location: '山陽', grade: '特GⅠ' },
    { location: '伊勢崎', grade: 'GⅡ' },
    { location: '浜松', grade: '開催' },
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
        return RaceEntity.createWithoutId(
            RaceData.create(
                raceType,
                `テスト${location}${grade}${stage}${(index + 1).toString()}レース`,
                new Date(2025, 12 - 1, 31, 7 + index, 0),
                location,
                grade,
                index + 1,
            ),
            undefined, // heldDayDataは未設定
            undefined, // conditionDataは未設定
            stage,
            [],
            baseAutoraceRaceUpdateDate,
        );
    });
});

export const baseAutoraceCalendarData = CalendarData.create(
    'autorace202412310511',
    raceType,
    `${baseAutoraceRaceStage} ${baseAutoraceRaceName}`,
    '2024-12-31T16:30:00Z',
    '2024-12-31T16:40:00Z',
    `${baseAutoracePlaceCourse}オートレース場`,
    'テスト',
);

export const baseAutoraceCalendarDataFromGoogleCalendar = {
    id: 'autorace202412310511',
    summary: `${baseAutoraceRaceStage} ${baseAutoraceRaceName}`,
    start: {
        dateTime: '2024-12-31T16:30:00Z',
    },
    end: {
        dateTime: '2024-12-31T16:40:00Z',
    },
    location: `${baseAutoracePlaceCourse}オートレース場`,
    description: 'テスト',
};
