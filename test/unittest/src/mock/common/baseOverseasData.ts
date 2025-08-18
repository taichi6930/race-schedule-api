import { CalendarData } from '../../../../../lib/src/domain/calendarData';
import { HorseRaceConditionData } from '../../../../../lib/src/domain/houseRaceConditionData';
import { PlaceData } from '../../../../../lib/src/domain/placeData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import { HorseRacingRaceRecord } from '../../../../../lib/src/gateway/record/horseRacingRaceRecord';
import { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import type { GradeType } from '../../../../../lib/src/utility/data/common/gradeType';
import type { RaceCourse } from '../../../../../lib/src/utility/data/common/raceCourse';
import { generateRaceId } from '../../../../../lib/src/utility/data/common/raceId';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseRaceNumber } from './baseCommonData';

const raceType: RaceType = RaceType.OVERSEAS;

const baseOverseasPlaceCourse: RaceCourse = 'パリロンシャン';
const baseOverseasPlaceDateTime = new Date('2024-10-01');

const baseOverseasRaceName = '凱旋門賞';
const baseRaceDateTime = new Date('2024-10-01 16:30');
const baseOverseasRaceSurfaceType = '芝';
const baseRaceDistance = 2400;
const baseOverseasRaceGrade: GradeType = 'GⅠ';
const baseOverseasRaceUpdateDate = getJSTDate(new Date('2024-10-01 16:30'));

export const baseOverseasPlaceData = PlaceData.create(
    raceType,
    baseOverseasPlaceDateTime,
    baseOverseasPlaceCourse,
);

export const baseOverseasRaceData = RaceData.create(
    raceType,
    baseOverseasRaceName,
    baseRaceDateTime,
    baseOverseasPlaceCourse,
    baseOverseasRaceGrade,
    baseRaceNumber,
);

const baseOverseasConditionData = HorseRaceConditionData.create(
    baseOverseasRaceSurfaceType,
    baseRaceDistance,
);

export const baseOverseasRaceRecord = HorseRacingRaceRecord.create(
    generateRaceId(
        raceType,
        baseOverseasPlaceDateTime,
        baseOverseasPlaceCourse,
        baseRaceNumber,
    ),
    raceType,
    baseOverseasRaceName,
    baseRaceDateTime,
    baseOverseasPlaceCourse,
    baseOverseasRaceSurfaceType,
    baseRaceDistance,
    baseOverseasRaceGrade,
    baseRaceNumber,
    baseOverseasRaceUpdateDate,
);

export const baseOverseasPlaceEntity = PlaceEntity.createWithoutId(
    baseOverseasPlaceData,
    undefined, // heldDayData は海外競馬では不要
    undefined, // grade は未指定
    baseOverseasRaceUpdateDate,
);

export const baseOverseasRaceEntity = RaceEntity.createWithoutId(
    baseOverseasRaceData,
    undefined, // horseRaceConditionData は未指定
    baseOverseasConditionData,
    baseOverseasRaceUpdateDate,
);

export const baseOverseasRaceEntityList: RaceEntity[] = [
    'パリロンシャン',
    'シャティン',
].flatMap((location) => {
    return [
        '格付けなし',
        '格付けなし',
        '格付けなし',
        '格付けなし',
        '格付けなし',
        '格付けなし',
        '格付けなし',
        'Listed',
        'GⅢ',
        'GⅡ',
        'GⅠ',
        '格付けなし',
    ].map((grade, index) => {
        return RaceEntity.createWithoutId(
            RaceData.create(
                raceType,
                `テスト${location}${grade}${(index + 1).toString()}レース`,
                new Date(2024, 10 - 1, 1, 7 + index, 0),
                location,
                grade,
                index + 1,
            ),
            undefined, // horseRaceConditionData は未指定
            HorseRaceConditionData.create('芝', 2400),
            getJSTDate(baseOverseasRaceUpdateDate),
        );
    });
});

export const baseOverseasCalendarData = CalendarData.create(
    'test202410010101',
    raceType,
    baseOverseasRaceName,
    '2024-10-01T16:30:00Z',
    '2024-10-01T16:40:00Z',
    `${baseOverseasPlaceCourse}競馬場`,
    'テスト',
);

export const baseOverseasCalendarDataFromGoogleCalendar = {
    id: 'test202410010101',
    summary: baseOverseasRaceName,
    start: {
        dateTime: '2024-10-01T16:30:00Z',
    },
    end: {
        dateTime: '2024-10-01T16:40:00Z',
    },
    location: `${baseOverseasPlaceCourse}競馬場`,
    description: 'テスト',
};
