/**
 * レース種別を管理するモジュール
 *
 * 競馬（JRA/NAR/海外）、競輪、オートレース、競艇などの
 * レース種別の定義と変換機能を提供します
 */

/**
 * レース種別の列挙型
 */
export const RaceType = {
    /** 日本中央競馬会（JRA）のレース */
    JRA: 'JRA',
    /** 地方競馬（NAR）のレース */
    NAR: 'NAR',
    /** 競輪のレース */
    KEIRIN: 'KEIRIN',
    /** 海外競馬のレース */
    OVERSEAS: 'OVERSEAS',
    /** オートレースのレース */
    AUTORACE: 'AUTORACE',
    /** 競艇のレース */
    BOATRACE: 'BOATRACE',
} as const;

/**
 * すべてのレース種別のリスト（競艇を除く）
 */
export const RACE_TYPE_LIST_ALL: RaceType[] = [
    RaceType.JRA,
    RaceType.NAR,
    RaceType.OVERSEAS,
    RaceType.KEIRIN,
    RaceType.AUTORACE,
];

/**
 * 機械レース（競輪・オートレース）のリスト
 */
export const RACE_TYPE_LIST_MECHANICAL_RACING = [
    RaceType.KEIRIN,
    RaceType.AUTORACE,
];

/**
 * 競馬（中央・地方・海外）のリスト
 */
export const RACE_TYPE_LIST_HORSE_RACING = [
    RaceType.JRA,
    RaceType.NAR,
    RaceType.OVERSEAS,
];

/**
 * レース種別の型
 */
export type RaceType = (typeof RaceType)[keyof typeof RaceType];

/**
 * 文字列がRaceTypeかどうかを判定する型ガード
 *
 * @param value - 判定対象の文字列
 * @returns RaceTypeの場合true
 */
const isRaceType = (value: string | null): value is RaceType => {
    // 大文字と小文字を区別しないために、すべて大文字に変換して比較
    if (value === null) return false;
    return (Object.values(RaceType) as string[]).includes(value);
};

/**
 * 文字列をRaceTypeに変換し、検証する
 *
 * @param value - 変換対象の文字列
 * @returns 検証済みのRaceType
 * @throws Error - 無効なレース種別の場合
 */
export const validateRaceType = (value: string | null): RaceType => {
    if (value) {
        const upperValue = value.toUpperCase();
        if (isRaceType(upperValue)) {
            return upperValue;
        }
    }
    throw new Error(`Invalid race type: ${value}`);
};

/**
 * 文字列配列をRaceType配列に変換する
 *
 * 無効なレース種別は除外されます
 *
 * @param raceTypeList - 変換対象の文字列配列
 * @returns RaceTypeの配列
 */
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

/**
 * 指定したレース種別が配列に含まれているか判定する
 *
 * @param raceType - 判定対象のレース種別
 * @param raceTypeList - レース種別の配列
 * @returns 含まれている場合true
 */
export const isIncludedRaceType = (
    raceType: RaceType,
    raceTypeList: RaceType[],
): boolean => {
    return raceTypeList.includes(raceType);
};
