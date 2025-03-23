import z from 'zod';

/**
 * WorldRaceCourseTypeのzod型定義
 */
const WorldRaceCourseTypeSchema = z.string().refine((value) => {
    return WorldRaceCourseTypeList.has(value);
}, '海外競馬の馬場種別ではありません');

/**
 * WorldRaceCourseTypeの型定義
 */
export type WorldRaceCourseType = z.infer<typeof WorldRaceCourseTypeSchema>;

/**
 * 海外競馬の馬場種別 リスト
 */
const WorldRaceCourseTypeList = new Set<string>(['芝', 'ダート', '障害', 'AW']);

/**
 * 海外競馬の馬場種別のバリデーション
 * @param type - 海外競馬の馬場種別
 * @returns - バリデーション済みの海外競馬の馬場種別
 */
export const validateWorldRaceCourseType = (
    type: string,
): WorldRaceCourseType => WorldRaceCourseTypeSchema.parse(type);
