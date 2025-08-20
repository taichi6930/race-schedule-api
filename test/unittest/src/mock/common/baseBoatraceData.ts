import { CalendarData } from '../../../../../lib/src/domain/calendarData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import {
    baseRacePlayerDataList,
    baseRaceUpdateDate,
    defaultLocation,
    defaultRaceName,
    defaultStage,
} from './baseCommonData';

const raceType: RaceType = RaceType.BOATRACE;

export const baseBoatraceRaceEntityList: RaceEntity[] = [
    { location: '平和島', grade: 'SG' },
    { location: '戸田', grade: 'GⅠ' },
    { location: '江戸川', grade: 'GⅡ' },
    { location: '桐生', grade: 'GⅢ' },
    { location: '多摩川', grade: '一般' },
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
        const raceData = RaceData.create(
            raceType,
            `テスト${location}${grade}${stage}${(index + 1).toString()}レース`,
            new Date(2025, 12 - 1, 30, 7 + index, 0),
            location,
            grade,
            index + 1,
        );
        const racePlayerDataList = baseRacePlayerDataList(raceType);
        return RaceEntity.createWithoutId(
            raceData,
            undefined, // heldDayDataは未設定
            undefined, // conditionDataは未設定
            stage,
            racePlayerDataList,
            baseRaceUpdateDate,
        );
    });
});

export const baseBoatraceCalendarData = CalendarData.create(
    'test202412310511',
    raceType,
    `${defaultStage[raceType]} ${defaultRaceName[raceType]}`,
    '2024-12-31T16:30:00Z',
    '2024-12-31T16:40:00Z',
    `${defaultLocation[raceType]}ボートレース場`,
    'テスト',
);

export const baseBoatraceCalendarDataFromGoogleCalendar = {
    id: 'test202412310511',
    summary: `${defaultStage[raceType]} ${defaultRaceName[raceType]}`,
    start: {
        dateTime: '2024-12-31T16:30:00Z',
    },
    end: {
        dateTime: '2024-12-31T16:40:00Z',
    },
    location: `${defaultLocation[raceType]}ボートレース場`,
    description: 'テスト',
};
