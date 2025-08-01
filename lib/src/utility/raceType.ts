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
