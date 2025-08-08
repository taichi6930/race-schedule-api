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
