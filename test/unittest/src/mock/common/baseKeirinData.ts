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

const raceType: RaceType = RaceType.KEIRIN;

export const baseKeirinRaceEntityList: RaceEntity[] = [
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

export const baseKeirinCalendarData = CalendarData.create(
    'test202512303511',
    raceType,
    `${defaultStage[raceType]} ${defaultRaceName[raceType]}`,
    '2024-12-31T16:30:00Z',
    '2024-12-31T16:40:00Z',
    `${defaultLocation[raceType]}競輪場`,
    'テスト',
);

export const baseKeirinCalendarDataFromGoogleCalendar = {
    id: 'test202512303511',
    summary: `${defaultStage[raceType]} ${defaultRaceName[raceType]}`,
    start: {
        dateTime: '2024-12-31T16:30:00Z',
    },
    end: {
        dateTime: '2024-12-31T16:40:00Z',
    },
    location: `${defaultLocation[raceType]}競輪場`,
    description: 'テスト',
};
