import { RaceType } from '../../packages/shared/src/types/raceType';

export const RACE_TYPE_LIST_ALL: RaceType[] = [
    RaceType.JRA,
    RaceType.NAR,
    RaceType.OVERSEAS,
    RaceType.KEIRIN,
    RaceType.AUTORACE,
];

export const RACE_TYPE_LIST_MECHANICAL_RACING = [
    RaceType.KEIRIN,
    RaceType.AUTORACE,
];

export const RACE_TYPE_LIST_HORSE_RACING = [
    RaceType.JRA,
    RaceType.NAR,
    RaceType.OVERSEAS,
];

const isRaceType = (value: string | null): value is RaceType => {
    // 大文字と小文字を区別しないために、すべて大文字に変換して比較
    if (value === null) return false;
    return (Object.values(RaceType) as string[]).includes(value);
};

export const validateRaceType = (value: string | null): RaceType => {
    if (value) {
        const upperValue = value.toUpperCase();
        if (isRaceType(upperValue)) {
            return upperValue;
        }
    }
    throw new Error(`Invalid race type: ${value}`);
};

export const convertRaceTypeList = (
    raceTypeList: string[] | undefined,
): RaceType[] => {
    if (raceTypeList == undefined) return [];
    // レースタイプの文字列をRaceTypeに変換
    return raceTypeList
        .map((type) => {
            // RaceTypeに変更
            switch (type.toLowerCase()) {
                case 'jra': {
                    return RaceType.JRA;
                }
                case 'nar': {
                    return RaceType.NAR;
                }
                case 'overseas': {
                    return RaceType.OVERSEAS;
                }
                case 'keirin': {
                    return RaceType.KEIRIN;
                }
                case 'autorace': {
                    return RaceType.AUTORACE;
                }
                case 'boatrace': {
                    return RaceType.BOATRACE;
                }
                default: {
                    return 'undefined'; // 未知のレースタイプは除外
                }
            }
        })
        .filter((type): type is RaceType => type !== 'undefined');
};

// raceTypeが配列に含まれているか判定するユーティリティ関数
export const isIncludedRaceType = (
    raceType: RaceType,
    raceTypeList: RaceType[],
): boolean => {
    return raceTypeList.includes(raceType);
};
