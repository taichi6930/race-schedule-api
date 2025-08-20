import { CalendarData } from '../../../../../lib/src/domain/calendarData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import {
    baseRaceUpdateDate,
    defaultLocation,
    defaultRaceName,
    defaultStage,
} from './baseCommonData';

const raceType: RaceType = RaceType.AUTORACE;

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
            baseRaceUpdateDate,
        );
    });
});

export const baseAutoraceCalendarData = CalendarData.create(
    'autorace202412310511',
    raceType,
    `${defaultStage[raceType]} ${defaultRaceName[raceType]}`,
    '2024-12-31T16:30:00Z',
    '2024-12-31T16:40:00Z',
    `${defaultLocation[raceType]}オートレース場`,
    'テスト',
);

export const baseAutoraceCalendarDataFromGoogleCalendar = {
    id: 'autorace202412310511',
    summary: `${defaultStage[raceType]} ${defaultRaceName[raceType]}`,
    start: {
        dateTime: '2024-12-31T16:30:00Z',
    },
    end: {
        dateTime: '2024-12-31T16:40:00Z',
    },
    location: `${defaultLocation[raceType]}オートレース場`,
    description: 'テスト',
};
