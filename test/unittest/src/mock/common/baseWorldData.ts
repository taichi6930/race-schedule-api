import { CalendarData } from '../../../../../lib/src/domain/calendarData';
import { HorseRaceConditionData } from '../../../../../lib/src/domain/houseRaceConditionData';
import { PlaceData } from '../../../../../lib/src/domain/placeData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import { HorseRacingRaceRecord } from '../../../../../lib/src/gateway/record/horseRacingRaceRecord';
import { HorseRacingPlaceEntity } from '../../../../../lib/src/repository/entity/horseRacingPlaceEntity';
import { HorseRacingRaceEntity } from '../../../../../lib/src/repository/entity/horseRacingRaceEntity';
import type { GradeType } from '../../../../../lib/src/utility/data/common/gradeType';
import type { RaceCourse } from '../../../../../lib/src/utility/data/common/raceCourse';
import { generateRaceId } from '../../../../../lib/src/utility/data/common/raceId';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseRaceNumber } from './baseCommonData';

const raceType: RaceType = RaceType.OVERSEAS;

const baseWorldPlaceCourse: RaceCourse = 'パリロンシャン';
const baseWorldPlaceDateTime = new Date('2024-10-01');

const baseWorldRaceName = '凱旋門賞';
const baseRaceDateTime = new Date('2024-10-01 16:30');
const baseWorldRaceSurfaceType = '芝';
const baseRaceDistance = 2400;
const baseWorldRaceGrade: GradeType = 'GⅠ';
const baseWorldRaceUpdateDate = getJSTDate(new Date('2024-10-01 16:30'));

export const baseWorldPlaceData = PlaceData.create(
    raceType,
    baseWorldPlaceDateTime,
    baseWorldPlaceCourse,
);

export const baseWorldRaceData = RaceData.create(
    raceType,
    baseWorldRaceName,
    baseRaceDateTime,
    baseWorldPlaceCourse,
    baseWorldRaceGrade,
    baseRaceNumber,
);

const baseWorldConditionData = HorseRaceConditionData.create(
    baseWorldRaceSurfaceType,
    baseRaceDistance,
);

export const baseWorldRaceRecord = HorseRacingRaceRecord.create(
    generateRaceId(
        raceType,
        baseWorldPlaceDateTime,
        baseWorldPlaceCourse,
        baseRaceNumber,
    ),
    raceType,
    baseWorldRaceName,
    baseRaceDateTime,
    baseWorldPlaceCourse,
    baseWorldRaceSurfaceType,
    baseRaceDistance,
    baseWorldRaceGrade,
    baseRaceNumber,
    baseWorldRaceUpdateDate,
);

export const baseWorldPlaceEntity = HorseRacingPlaceEntity.createWithoutId(
    baseWorldPlaceData,
    baseWorldRaceUpdateDate,
);

export const baseWorldRaceEntity = HorseRacingRaceEntity.createWithoutId(
    baseWorldRaceData,
    baseWorldConditionData,
    baseWorldRaceUpdateDate,
);

export const baseWorldRaceEntityList: HorseRacingRaceEntity[] = [
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
        return HorseRacingRaceEntity.createWithoutId(
            RaceData.create(
                raceType,
                `テスト${location}${grade}${(index + 1).toString()}レース`,
                new Date(2024, 10 - 1, 1, 7 + index, 0),
                location,
                grade,
                index + 1,
            ),
            HorseRaceConditionData.create('芝', 2400),
            getJSTDate(baseWorldRaceUpdateDate),
        );
    });
});

export const baseWorldCalendarData = CalendarData.create(
    'test202410010101',
    raceType,
    baseWorldRaceName,
    '2024-10-01T16:30:00Z',
    '2024-10-01T16:40:00Z',
    `${baseWorldPlaceCourse}競馬場`,
    'テスト',
);

export const baseWorldCalendarDataFromGoogleCalendar = {
    id: 'test202410010101',
    summary: baseWorldRaceName,
    start: {
        dateTime: '2024-10-01T16:30:00Z',
    },
    end: {
        dateTime: '2024-10-01T16:40:00Z',
    },
    location: `${baseWorldPlaceCourse}競馬場`,
    description: 'テスト',
};
