import { RaceData } from '../../../../../lib/src/domain/raceData';
import { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseRacePlayerDataList, baseRaceUpdateDate } from './baseCommonData';

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
