import { CalendarData } from '../../../../../lib/src/domain/calendarData';
import { HorseRaceConditionData } from '../../../../../lib/src/domain/houseRaceConditionData';
import { PlaceData } from '../../../../../lib/src/domain/placeData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import { WorldRaceRecord } from '../../../../../lib/src/gateway/record/worldRaceRecord';
import { WorldPlaceEntity } from '../../../../../lib/src/repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../../../../lib/src/repository/entity/worldRaceEntity';
import type { GradeType } from '../../../../../lib/src/utility/data/common/gradeType';
import type { RaceCourse } from '../../../../../lib/src/utility/data/common/raceCourse';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { generateRaceId } from '../../../../../lib/src/utility/raceId';
import { RaceType } from '../../../../../lib/src/utility/raceType';

const baseWorldPlaceCourse: RaceCourse = 'パリロンシャン';
const baseWorldPlaceDateTime = new Date('2024-10-01');

const baseWorldRaceName = '凱旋門賞';
const baseRaceDateTime = new Date('2024-10-01 16:30');
const baseWorldRaceNumber = 11;
const baseWorldRaceSurfaceType = '芝';
const baseRaceDistance = 2400;
const baseWorldRaceGrade: GradeType = 'GⅠ';
const baseWorldRaceUpdateDate = getJSTDate(new Date('2024-10-01 16:30'));

export const baseWorldPlaceData = PlaceData.create(
    RaceType.WORLD,
    baseWorldPlaceDateTime,
    baseWorldPlaceCourse,
);

export const baseWorldRaceData = RaceData.create(
    RaceType.WORLD,
    baseWorldRaceName,
    baseRaceDateTime,
    baseWorldPlaceCourse,
    baseWorldRaceGrade,
    baseWorldRaceNumber,
);

const baseWorldConditionData = HorseRaceConditionData.create(
    baseWorldRaceSurfaceType,
    baseRaceDistance,
);

export const baseWorldRaceRecord = WorldRaceRecord.create(
    generateRaceId(
        RaceType.WORLD,
        baseWorldPlaceDateTime,
        baseWorldPlaceCourse,
        baseWorldRaceNumber,
    ),
    RaceType.WORLD,
    baseWorldRaceName,
    baseRaceDateTime,
    baseWorldPlaceCourse,
    baseWorldRaceSurfaceType,
    baseRaceDistance,
    baseWorldRaceGrade,
    baseWorldRaceNumber,
    baseWorldRaceUpdateDate,
);

export const baseWorldPlaceEntity =
    WorldPlaceEntity.createWithoutId(baseWorldPlaceData);

export const baseWorldRaceEntity = WorldRaceEntity.createWithoutId(
    baseWorldRaceData,
    baseWorldConditionData,
    baseWorldRaceUpdateDate,
);

export const baseWorldRaceEntityList: WorldRaceEntity[] = [
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
        return WorldRaceEntity.createWithoutId(
            RaceData.create(
                RaceType.WORLD,
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
    'test20241001longchamp01',
    RaceType.WORLD,
    '凱旋門賞',
    '2024-10-01T16:30:00Z',
    '2024-10-01T16:40:00Z',
    'パリロンシャン競馬場',
    'テスト',
);

export const baseWorldCalendarDataFromGoogleCalendar = {
    id: 'test20241001longchamp01',
    summary: '凱旋門賞',
    start: {
        dateTime: '2024-10-01T16:30:00Z',
    },
    end: {
        dateTime: '2024-10-01T16:40:00Z',
    },
    location: 'パリロンシャン競馬場',
    description: 'テスト',
};
