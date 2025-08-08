export const RaceCourseType = {
    TURF: '芝',
    DIRT: 'ダート',
    JUMP: '障害',
    ALLWEATHER: 'AW',
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
export const validateRaceCourseType = (type: string): RaceCourseType => {
    if ((Object.values(RaceCourseType) as string[]).includes(type)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        return type as RaceCourseType;
    }
    throw new Error('無効な競馬場種別です');
};
