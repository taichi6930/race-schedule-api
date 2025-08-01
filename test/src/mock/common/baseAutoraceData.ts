import { AutoracePlaceData } from '../../../../lib/src/domain/autoracePlaceData';
import { AutoraceRaceData } from '../../../../lib/src/domain/autoraceRaceData';
import { AutoraceRacePlayerData } from '../../../../lib/src/domain/autoraceRacePlayerData';
import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { AutoracePlaceRecord } from '../../../../lib/src/gateway/record/autoracePlaceRecord';
import { AutoraceRacePlayerRecord } from '../../../../lib/src/gateway/record/autoraceRacePlayerRecord';
import { AutoraceRaceRecord } from '../../../../lib/src/gateway/record/autoraceRaceRecord';
import { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { AutoraceGradeType } from '../../../../lib/src/utility/data/autorace/autoraceGradeType';
import type { AutoracePlaceId } from '../../../../lib/src/utility/data/autorace/autoracePlaceId';
import type { AutoraceRaceStage } from '../../../../lib/src/utility/data/autorace/autoraceRaceStage';
import type { AutoraceRaceCourse } from '../../../../lib/src/utility/data/common/raceCourse';
import { getJSTDate } from '../../../../lib/src/utility/date';
import {
    generateAutoracePlaceId,
    generateAutoraceRaceId,
    generateAutoraceRacePlayerId,
} from '../../../../lib/src/utility/raceId';
import { RaceType } from '../../../../lib/src/utility/raceType';

const baseAutoracePlaceCourse: AutoraceRaceCourse = '飯塚';
const baseAutoracePlaceDateTime = new Date('2024-12-31');
const baseAutoracePlaceGrade: AutoraceGradeType = 'SG';
const baseAutoracePlaceId: AutoracePlaceId = generateAutoracePlaceId(
    baseAutoracePlaceDateTime,
    baseAutoracePlaceCourse,
);

const baseAutoraceRaceName = 'スーパースター王座決定戦';
const baseRaceDateTime = new Date('2024-12-31 16:30');
const baseAutoraceRaceNumber = 11;
const baseAutoraceRaceStage: AutoraceRaceStage = '優勝戦';
const baseAutoraceRaceUpdateDate = getJSTDate(new Date('2024-10-01 16:30'));

export const baseAutoracePlaceData = AutoracePlaceData.create(
    baseAutoracePlaceDateTime,
    baseAutoracePlaceCourse,
    baseAutoracePlaceGrade,
);

export const baseAutoraceRaceData = AutoraceRaceData.create(
    baseAutoraceRaceName,
    baseAutoraceRaceStage,
    baseRaceDateTime,
    baseAutoracePlaceCourse,
    baseAutoracePlaceGrade,
    baseAutoraceRaceNumber,
);

export const baseAutoracePlaceRecord = AutoracePlaceRecord.create(
    baseAutoracePlaceId,
    baseAutoracePlaceDateTime,
    baseAutoracePlaceCourse,
    baseAutoracePlaceGrade,
    baseAutoraceRaceUpdateDate,
);

export const baseAutoraceRaceRecord = AutoraceRaceRecord.create(
    generateAutoraceRaceId(
        baseAutoracePlaceDateTime,
        baseAutoracePlaceCourse,
        baseAutoraceRaceNumber,
    ),
    baseAutoraceRaceName,
    baseAutoraceRaceStage,
    baseRaceDateTime,
    baseAutoracePlaceCourse,
    baseAutoracePlaceGrade,
    baseAutoraceRaceNumber,
    baseAutoraceRaceUpdateDate,
);

export const baseAutoracePlaceEntity = AutoracePlaceEntity.createWithoutId(
    baseAutoracePlaceData,
    baseAutoraceRaceUpdateDate,
);

export const baseAutoraceRacePlayerDataList = Array.from(
    { length: 8 },
    (_, i) => {
        return AutoraceRacePlayerData.create(i + 1, i + 1);
    },
);

export const baseAutoraceRaceEntity = AutoraceRaceEntity.createWithoutId(
    baseAutoraceRaceData,
    baseAutoraceRacePlayerDataList,
    baseAutoraceRaceUpdateDate,
);

export const baseAutoraceRacePlayerRecord = AutoraceRacePlayerRecord.create(
    generateAutoraceRacePlayerId(
        baseAutoracePlaceDateTime,
        baseAutoracePlaceCourse,
        baseAutoraceRaceNumber,
        1,
    ),
    generateAutoraceRaceId(
        baseRaceDateTime,
        baseAutoracePlaceCourse,
        baseAutoraceRaceNumber,
    ),
    1,
    10000,
    baseAutoraceRaceUpdateDate,
);

export const baseAutoraceRacePlayerData = AutoraceRacePlayerData.create(
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
            AutoraceRaceData.create(
                `テスト${location}${grade}${stage}${(index + 1).toString()}レース`,
                stage,
                new Date(2025, 12 - 1, 31, 7 + index, 0),
                location,
                grade,
                index + 1,
            ),
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
