export const RaceCourseType = {
    TURF: '芝',
    DIRT: 'ダート',
    JUMP: '障害',
    AW: 'AW',
} as const;

/**
 * RaceCourseTypeの型定義
 */
export type RaceCourseType =
    (typeof RaceCourseType)[keyof typeof RaceCourseType];

/**
 * 競馬場種別のバリデーション
 * @param type - 競馬場種別
 * @returns - バリデーション済みの競馬場種別
 */
export function validateRaceCourseType(type: unknown): RaceCourseType {
    const values: readonly string[] = Object.values(RaceCourseType);
    if (typeof type === 'string' && values.includes(type)) {
        return type as RaceCourseType;
    }
    throw new Error(`Invalid RaceCourseType: ${String(type)}`);
}
