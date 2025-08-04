/**
 * レースタイプの列挙型
 */
export enum RaceType {
    JRA = 'JRA',
    NAR = 'NAR',
    KEIRIN = 'KEIRIN',
    WORLD = 'WORLD',
    AUTORACE = 'AUTORACE',
    BOATRACE = 'BOATRACE',
}

export function isRaceType(value: string): value is RaceType {
    // 大文字と小文字を区別しないために、すべて大文字に変換して比較
    value = value.toUpperCase();
    return (Object.values(RaceType) as string[]).includes(value);
}

export const raceTypeListValid = (raceTypeList: string[]): RaceType[] =>
    raceTypeList
        .map((type) => {
            switch (type) {
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
                case 'boatrace': {
                    return RaceType.BOATRACE;
                }
                case 'autorace': {
                    return RaceType.AUTORACE;
                }
                default: {
                    return 'none';
                }
            }
        })
        .filter((type) => type !== 'none');
