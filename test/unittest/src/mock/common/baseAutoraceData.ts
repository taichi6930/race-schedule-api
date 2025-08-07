import { CalendarData } from '../../../../../lib/src/domain/calendarData';
import { PlaceData } from '../../../../../lib/src/domain/placeData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import { RacePlayerData } from '../../../../../lib/src/domain/racePlayerData';
import { MechanicalRacingPlaceRecord } from '../../../../../lib/src/gateway/record/mechanicalRacingPlaceRecord';
import { RacePlayerRecord } from '../../../../../lib/src/gateway/record/racePlayerRecord';
import { RaceRecord } from '../../../../../lib/src/gateway/record/raceRecord';
import { AutoraceRaceEntity } from '../../../../../lib/src/repository/entity/autoraceRaceEntity';
import { MechanicalRacingPlaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import type { GradeType } from '../../../../../lib/src/utility/data/common/gradeType';
import type { RaceCourse } from '../../../../../lib/src/utility/data/common/raceCourse';
import type { RaceStage } from '../../../../../lib/src/utility/data/common/raceStage';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import {
    generatePlaceId,
    generateRaceId,
    generateRacePlayerId,
} from '../../../../../lib/src/utility/raceId';
import { RaceType } from '../../../../../lib/src/utility/raceType';

const baseAutoracePlaceCourse: RaceCourse = '飯塚';
const baseAutoracePlaceDateTime = new Date('2024-12-31');
const baseAutoracePlaceGrade: GradeType = 'SG';
const baseAutoracePlaceId = generatePlaceId(
    RaceType.AUTORACE,
    baseAutoracePlaceDateTime,
    baseAutoracePlaceCourse,
);

const baseAutoraceRaceName = 'スーパースター王座決定戦';
const baseRaceDateTime = new Date('2024-12-31 16:30');
const baseAutoraceRaceNumber = 11;
const baseAutoraceRaceStage: RaceStage = '優勝戦';
const baseAutoraceRaceUpdateDate = getJSTDate(new Date('2024-10-01 16:30'));

export const baseAutoracePlaceData = PlaceData.create(
    RaceType.AUTORACE,
    baseAutoracePlaceDateTime,
    baseAutoracePlaceCourse,
);

export const baseAutoraceRaceData = RaceData.create(
    RaceType.AUTORACE,
    baseAutoraceRaceName,
    baseRaceDateTime,
    baseAutoracePlaceCourse,
    baseAutoracePlaceGrade,
    baseAutoraceRaceNumber,
);

export const baseAutoracePlaceRecord = MechanicalRacingPlaceRecord.create(
    baseAutoracePlaceId,
    RaceType.AUTORACE,
    baseAutoracePlaceDateTime,
    baseAutoracePlaceCourse,
    baseAutoracePlaceGrade,
    baseAutoraceRaceUpdateDate,
);

export const baseAutoraceRaceRecord = RaceRecord.create(
    generateRaceId(
        RaceType.AUTORACE,
        baseAutoracePlaceDateTime,
        baseAutoracePlaceCourse,
        baseAutoraceRaceNumber,
    ),
    RaceType.AUTORACE,
    baseAutoraceRaceName,
    baseAutoraceRaceStage,
    baseRaceDateTime,
    baseAutoracePlaceCourse,
    baseAutoracePlaceGrade,
    baseAutoraceRaceNumber,
    baseAutoraceRaceUpdateDate,
);

export const baseAutoracePlaceEntity =
    MechanicalRacingPlaceEntity.createWithoutId(
        RaceType.AUTORACE,
        baseAutoracePlaceData,
        baseAutoracePlaceGrade,
        baseAutoraceRaceUpdateDate,
    );

export const baseAutoraceRacePlayerDataList = Array.from(
    { length: 8 },
    (_, i) => {
        return RacePlayerData.create(RaceType.AUTORACE, i + 1, i + 1);
    },
);

export const baseAutoraceRaceEntity = AutoraceRaceEntity.createWithoutId(
    baseAutoraceRaceData,
    baseAutoraceRaceStage,
    baseAutoraceRacePlayerDataList,
    baseAutoraceRaceUpdateDate,
);

export const baseAutoraceRacePlayerRecord = RacePlayerRecord.create(
    generateRacePlayerId(
        RaceType.AUTORACE,
        baseAutoracePlaceDateTime,
        baseAutoracePlaceCourse,
        baseAutoraceRaceNumber,
        1,
    ),
    RaceType.AUTORACE,
    generateRaceId(
        RaceType.AUTORACE,
        baseRaceDateTime,
        baseAutoracePlaceCourse,
        baseAutoraceRaceNumber,
    ),
    1,
    10000,
    baseAutoraceRaceUpdateDate,
);

export const baseAutoraceRacePlayerData = RacePlayerData.create(
    RaceType.AUTORACE,
    1,
    10000,
);

export const baseAutoraceRaceEntityList: AutoraceRaceEntity[] = [
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
        return AutoraceRaceEntity.createWithoutId(
            RaceData.create(
                RaceType.AUTORACE,
                `テスト${location}${grade}${stage}${(index + 1).toString()}レース`,
                new Date(2025, 12 - 1, 31, 7 + index, 0),
                location,
                grade,
                index + 1,
            ),
            stage,
            [],
            baseAutoraceRaceUpdateDate,
        );
    });
});

export const baseAutoraceRaceDataList = baseAutoraceRaceEntityList.map(
    (raceEntity) => raceEntity.raceData,
);

export const baseAutoraceCalendarData = CalendarData.create(
    'autorace202412310511',
    RaceType.AUTORACE,
    '優勝戦 スーパースター王座決定戦',
    '2024-12-31T16:30:00Z',
    '2024-12-31T16:40:00Z',
    '飯塚オートレース場',
    'テスト',
);

export const baseAutoraceCalendarDataFromGoogleCalendar = {
    id: 'autorace202412310511',
    summary: '優勝戦 スーパースター王座決定戦',
    start: {
        dateTime: '2024-12-31T16:30:00Z',
    },
    end: {
        dateTime: '2024-12-31T16:40:00Z',
    },
    location: '飯塚オートレース場',
    description: 'テスト',
};
