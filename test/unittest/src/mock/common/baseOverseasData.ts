import { CalendarData } from '../../../../../lib/src/domain/calendarData';
import { HorseRaceConditionData } from '../../../../../lib/src/domain/houseRaceConditionData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import {
    baseRaceUpdateDate,
    defaultLocation,
    defaultRaceName,
} from './baseCommonData';

const raceType: RaceType = RaceType.OVERSEAS;

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
            undefined, // stage は未指定
            undefined, // racePlayerDataList は未指定
            getJSTDate(baseRaceUpdateDate),
        );
    });
});

export const baseOverseasCalendarData = CalendarData.create(
    'test202410010101',
    raceType,
    defaultRaceName[raceType],
    '2024-10-01T16:30:00Z',
    '2024-10-01T16:40:00Z',
    `${defaultLocation[raceType]}競馬場`,
    'テスト',
);

export const baseOverseasCalendarDataFromGoogleCalendar = {
    id: 'test202410010101',
    summary: defaultRaceName[raceType],
    start: {
        dateTime: '2024-10-01T16:30:00Z',
    },
    end: {
        dateTime: '2024-10-01T16:40:00Z',
    },
    location: `${defaultLocation[raceType]}競馬場`,
    description: 'テスト',
};
