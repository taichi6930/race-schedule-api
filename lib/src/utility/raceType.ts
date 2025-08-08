/**
 * レースタイプの列挙型
 */
export const RaceType = {
    JRA: 'JRA',
    NAR: 'NAR',
    KEIRIN: 'KEIRIN',
    WORLD: 'WORLD',
    AUTORACE: 'AUTORACE',
    BOATRACE: 'BOATRACE',
} as const;

export type RaceType = (typeof RaceType)[keyof typeof RaceType];

export function isRaceType(value: string): value is RaceType {
    // 大文字と小文字を区別しないために、すべて大文字に変換して比較
    value = value.toUpperCase();
    return (Object.values(RaceType) as string[]).includes(value);
}

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
                case 'world': {
                    return RaceType.WORLD;
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
