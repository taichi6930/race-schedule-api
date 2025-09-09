/**
 * レースタイプの列挙型
 */
export const RaceType = {
    JRA: 'JRA',
    NAR: 'NAR',
    KEIRIN: 'KEIRIN',
    OVERSEAS: 'OVERSEAS',
    AUTORACE: 'AUTORACE',
    BOATRACE: 'BOATRACE',
} as const;

export const RACE_TYPE_LIST_ALL_FOR_AWS: RaceType[] = [
    RaceType.JRA,
    RaceType.NAR,
    RaceType.OVERSEAS,
    RaceType.KEIRIN,
    RaceType.AUTORACE,
    RaceType.BOATRACE,
];

export const RACE_TYPE_LIST_ALL: RaceType[] = [RaceType.NAR, RaceType.OVERSEAS];

export const RACE_TYPE_LIST_WITHOUT_OVERSEAS_FOR_AWS =
    RACE_TYPE_LIST_ALL_FOR_AWS.filter(
        (raceType) => raceType !== RaceType.OVERSEAS,
    );

export const RACE_TYPE_LIST_WITHOUT_OVERSEAS = RACE_TYPE_LIST_ALL.filter(
    (raceType) => raceType !== RaceType.OVERSEAS,
);

export const RACE_TYPE_LIST_MECHANICAL_RACING_FOR_AWS = [
    RaceType.KEIRIN,
    RaceType.AUTORACE,
    RaceType.BOATRACE,
];

export const RACE_TYPE_LIST_MECHANICAL_RACING = [];

export const RACE_TYPE_LIST_HORSE_RACING_FOR_AWS = [
    RaceType.JRA,
    RaceType.NAR,
    RaceType.OVERSEAS,
];

export const RACE_TYPE_LIST_HORSE_RACING = [RaceType.OVERSEAS];

export type RaceType = (typeof RaceType)[keyof typeof RaceType];

export function isRaceType(value: string | null): value is RaceType {
    // 大文字と小文字を区別しないために、すべて大文字に変換して比較
    if (value === null) return false;
    return (Object.values(RaceType) as string[]).includes(value);
}

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
