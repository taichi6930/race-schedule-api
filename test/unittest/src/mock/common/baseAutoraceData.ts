import { RaceData } from '../../../../../lib/src/domain/raceData';
import { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseRaceUpdateDate } from './baseCommonData';

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
