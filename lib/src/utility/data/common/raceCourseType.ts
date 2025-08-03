import { z } from 'zod';
/**
 * RaceCourseTypeのzod型定義
 */
export const RaceCourseTypeList = new Set(['芝', 'ダート', '障害', 'AW']);

/**
 * RaceCourseTypeの型定義
 */
export const RaceCourseTypeSchema = z.string().refine((value) => {
    return RaceCourseTypeList.has(value);
}, '有効な競馬場種別ではありません');

/**
 * RaceCourseTypeの型定義
 */
export type RaceCourseType = z.infer<typeof RaceCourseTypeSchema>;

/**
 * 競馬場種別のバリデーション
 * @param type - 競馬場種別
 * @returns - バリデーション済みの競馬場種別
 */
export const validateRaceCourseType = (type: string): RaceCourseType => {
    return RaceCourseTypeSchema.parse(type);
};
