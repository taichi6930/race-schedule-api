import { HorseRaceConditionData } from '../../../../../lib/src/domain/houseRaceConditionData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseRaceUpdateDate } from './baseCommonData';

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
