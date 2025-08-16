import { CalendarData } from '../../../../../lib/src/domain/calendarData';
import { PlaceData } from '../../../../../lib/src/domain/placeData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import { MechanicalRacingRaceRecord } from '../../../../../lib/src/gateway/record/mechanicalRacingRaceRecord';
import { PlaceRecord } from '../../../../../lib/src/gateway/record/placeRecord';
import { RacePlayerRecord } from '../../../../../lib/src/gateway/record/racePlayerRecord';
import { MechanicalRacingPlaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import { MechanicalRacingRaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingRaceEntity';
import type { GradeType } from '../../../../../lib/src/utility/data/common/gradeType';
import { generatePlaceId } from '../../../../../lib/src/utility/data/common/placeId';
import type { RaceCourse } from '../../../../../lib/src/utility/data/common/raceCourse';
import { generateRaceId } from '../../../../../lib/src/utility/data/common/raceId';
import { generateRacePlayerId } from '../../../../../lib/src/utility/data/common/racePlayerId';
import type { RaceStage } from '../../../../../lib/src/utility/data/common/raceStage';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseRaceNumber, baseRacePlayerDataList } from './baseCommonData';

const raceType: RaceType = RaceType.KEIRIN;

const baseKeirinPlaceCourse: RaceCourse = '平塚';
const baseKeirinPlaceDateTime = new Date('2025-12-30');
const baseKeirinPlaceGrade: GradeType = 'GP';
const baseKeirinPlaceId = generatePlaceId(
    raceType,
    baseKeirinPlaceDateTime,
    baseKeirinPlaceCourse,
);

const baseKeirinRaceName = 'KEIRINグランプリ';
const baseRaceDateTime = new Date('2025-12-30 16:30');
const baseKeirinRaceStage: RaceStage = 'S級グランプリ';
const baseKeirinRaceUpdateDate = getJSTDate(new Date('2025-10-01 16:30'));

export const baseKeirinPlaceData = PlaceData.create(
    raceType,
    baseKeirinPlaceDateTime,
    baseKeirinPlaceCourse,
);

export const baseKeirinRaceData = RaceData.create(
    raceType,
    baseKeirinRaceName,
    baseRaceDateTime,
    baseKeirinPlaceCourse,
    baseKeirinPlaceGrade,
    baseRaceNumber,
);

export const baseKeirinPlaceRecord = PlaceRecord.create(
    baseKeirinPlaceId,
    raceType,
    baseKeirinPlaceDateTime,
    baseKeirinPlaceCourse,
    baseKeirinRaceUpdateDate,
);

export const baseKeirinRaceRecord = MechanicalRacingRaceRecord.create(
    generateRaceId(
        raceType,
        baseKeirinPlaceDateTime,
        baseKeirinPlaceCourse,
        baseRaceNumber,
    ),
    raceType,
    baseKeirinRaceName,
    baseKeirinRaceStage,
    baseRaceDateTime,
    baseKeirinPlaceCourse,
    baseKeirinPlaceGrade,
    baseRaceNumber,
    baseKeirinRaceUpdateDate,
);

export const baseKeirinPlaceEntity =
    MechanicalRacingPlaceEntity.createWithoutId(
        baseKeirinPlaceData,
        baseKeirinPlaceGrade,
        baseKeirinRaceUpdateDate,
    );

export const baseKeirinRacePlayerDataList = baseRacePlayerDataList(raceType);

export const baseKeirinRaceEntity = MechanicalRacingRaceEntity.createWithoutId(
    baseKeirinRaceData,
    baseKeirinRaceStage,
    baseKeirinRacePlayerDataList,
    baseKeirinRaceUpdateDate,
);

export const baseKeirinRaceEntityList: MechanicalRacingRaceEntity[] = [
    { location: '平塚', grade: 'GP' },
    { location: '立川', grade: 'GⅠ' },
    { location: '函館', grade: 'GⅡ' },
    { location: '小倉', grade: 'GⅢ' },
    { location: '久留米', grade: 'FⅠ' },
    { location: '名古屋', grade: 'FⅡ' },
].flatMap((value) => {
    const { location, grade } = value;
    return [
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級特別優秀',
        'S級決勝',
    ].map((stage, index) => {
        const raceData = RaceData.create(
            raceType,
            `テスト${location}${grade}${stage}${(index + 1).toString()}レース`,
            new Date(2025, 12 - 1, 30, 7 + index, 0),
            location,
            grade,
            index + 1,
        );
        const racePlayerDataList = baseKeirinRacePlayerDataList;
        return MechanicalRacingRaceEntity.createWithoutId(
            raceData,
            stage,
            racePlayerDataList,
            baseKeirinRaceUpdateDate,
        );
    });
});

export const baseKeirinRacePlayerRecord = RacePlayerRecord.create(
    generateRacePlayerId(
        raceType,
        baseKeirinPlaceDateTime,
        baseKeirinPlaceCourse,
        baseRaceNumber,
        1,
    ),
    raceType,
    generateRaceId(
        raceType,
        baseRaceDateTime,
        baseKeirinPlaceCourse,
        baseRaceNumber,
    ),
    1,
    10000,
    baseKeirinRaceUpdateDate,
);

export const baseKeirinCalendarData = CalendarData.create(
    'test202512303511',
    raceType,
    `${baseKeirinRaceStage} ${baseKeirinRaceName}`,
    '2024-12-31T16:30:00Z',
    '2024-12-31T16:40:00Z',
    `${baseKeirinPlaceCourse}競輪場`,
    'テスト',
);

export const baseKeirinCalendarDataFromGoogleCalendar = {
    id: 'test202512303511',
    summary: `${baseKeirinRaceStage} ${baseKeirinRaceName}`,
    start: {
        dateTime: '2024-12-31T16:30:00Z',
    },
    end: {
        dateTime: '2024-12-31T16:40:00Z',
    },
    location: `${baseKeirinPlaceCourse}競輪場`,
    description: 'テスト',
};
