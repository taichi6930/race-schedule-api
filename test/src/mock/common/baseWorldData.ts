import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { WorldPlaceData } from '../../../../lib/src/domain/worldPlaceData';
import { WorldRaceData } from '../../../../lib/src/domain/worldRaceData';
import { WorldRaceRecord } from '../../../../lib/src/gateway/record/worldRaceRecord';
import { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { WorldGradeType } from '../../../../lib/src/utility/data/world/worldGradeType';
import type { WorldRaceCourse } from '../../../../lib/src/utility/data/world/worldRaceCourse';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { generateWorldRaceId } from '../../../../lib/src/utility/raceId';

const baseWorldPlaceCourse: WorldRaceCourse = 'パリロンシャン';
const baseWorldPlaceDateTime = new Date('2024-10-01');

const baseWorldRaceName = '凱旋門賞';
const baseWorldRaceDateTime = new Date('2024-10-01 16:30');
const baseWorldRaceNumber = 11;
const baseWorldRaceSurfaceType = '芝';
const baseWorldRaceDistance = 2400;
const baseWorldRaceGrade: WorldGradeType = 'GⅠ';
const baseWorldRaceUpdateDate = getJSTDate(new Date('2024-10-01 16:30'));

export const baseWorldPlaceData = WorldPlaceData.create(
    baseWorldPlaceDateTime,
    baseWorldPlaceCourse,
);

export const baseWorldRaceData = WorldRaceData.create(
    baseWorldRaceName,
    baseWorldRaceDateTime,
    baseWorldPlaceCourse,
    baseWorldRaceSurfaceType,
    baseWorldRaceDistance,
    baseWorldRaceGrade,
    baseWorldRaceNumber,
);

export const baseWorldRaceRecord = new WorldRaceRecord(
    generateWorldRaceId(
        baseWorldPlaceDateTime,
        baseWorldPlaceCourse,
        baseWorldRaceNumber,
    ),
    baseWorldRaceName,
    baseWorldRaceDateTime,
    baseWorldPlaceCourse,
    baseWorldRaceSurfaceType,
    baseWorldRaceDistance,
    baseWorldRaceGrade,
    baseWorldRaceNumber,
    baseWorldRaceUpdateDate,
);

export const baseWorldPlaceEntity = new WorldPlaceEntity(
    null,
    baseWorldPlaceData,
);

export const baseWorldRaceEntity = new WorldRaceEntity(
    null,
    baseWorldRaceData,
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
        return new WorldRaceEntity(
            null,
            WorldRaceData.create(
                `テスト${location}${grade}${(index + 1).toString()}レース`,
                new Date(2024, 10 - 1, 1, 7 + index, 0),
                location,
                '芝',
                1600,
                grade,
                index + 1,
            ),
            getJSTDate(baseWorldRaceUpdateDate),
        );
    });
});

export const baseWorldRaceDataList = baseWorldRaceEntityList.map(
    (raceEntity) => raceEntity.raceData,
);

export const baseWorldCalendarData = new CalendarData(
    'test20241001longchamp01',
    '凱旋門賞',
    new Date('2024-10-01T16:30:00Z'),
    new Date('2024-10-01T16:40:00Z'),
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
